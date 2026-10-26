define("SamCodeEditor", ["SamCodeEditorResources"], function (resources) {

    var _strings = resources.localizableStrings;
    var _textarea = null;
    var _highlightDiv = null;
    var _lineNumbers = null;
    var _resultContainer = null;
    var _resultToolbar = null;
    var _initialized = false;
    var _timerInterval = null;
    var _timerStart = null;
    var _timerEl = null;
    var _rowLimit = 10;
    var _limitSelect = null;
    var _lastResult = null;
    var _lastElapsed = null;
    var _searchFilter = "";
    var _sortColIndex = -1;
    var _sortAsc = true;

    // ─── SQL syntax highlighting ─────────────────────────────────────────────────

    var _SQL_KEYWORDS = new Set([
        'SELECT','FROM','WHERE','JOIN','INNER','OUTER','LEFT','RIGHT','FULL','CROSS',
        'ON','AS','AND','OR','NOT','IN','EXISTS','BETWEEN','LIKE','IS','NULL',
        'ORDER','BY','GROUP','HAVING','UNION','ALL','DISTINCT','TOP','LIMIT','OFFSET','ASC','DESC',
        'WITH','INTO','VALUES','SET','INSERT','UPDATE','DELETE','MERGE','TRUNCATE',
        'EXEC','EXECUTE','USE','GO','NOLOCK','APPLY',
        'CREATE','ALTER','DROP','TABLE','VIEW','INDEX','DATABASE','SCHEMA',
        'PROCEDURE','PROC','FUNCTION','TRIGGER','CONSTRAINT','PRIMARY','FOREIGN',
        'KEY','REFERENCES','DEFAULT','CHECK','UNIQUE','IDENTITY',
        'BEGIN','END','IF','ELSE','WHILE','CASE','WHEN','THEN','DECLARE',
        'RETURN','GOTO','BREAK','CONTINUE','PRINT','RAISERROR','THROW',
        'TRY','CATCH','ROLLBACK','COMMIT','TRANSACTION','NOCOUNT',
        'COUNT','SUM','AVG','MIN','MAX','CAST','CONVERT','COALESCE','ISNULL',
        'NULLIF','LEN','SUBSTRING','CHARINDEX','REPLACE','UPPER','LOWER',
        'LTRIM','RTRIM','TRIM','GETDATE','GETUTCDATE','DATEADD','DATEDIFF',
        'YEAR','MONTH','DAY','ROW_NUMBER','RANK','DENSE_RANK','NTILE',
        'LEAD','LAG','PARTITION','OVER','PIVOT','UNPIVOT',
        'INT','BIGINT','SMALLINT','TINYINT','BIT','DECIMAL','NUMERIC',
        'FLOAT','REAL','MONEY','VARCHAR','NVARCHAR','CHAR','NCHAR',
        'TEXT','NTEXT','DATETIME','DATETIME2','DATE','TIME','UNIQUEIDENTIFIER',
        'VARBINARY','IMAGE','TRUE','FALSE'
    ]);

    var _escHtml = function (str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    var _highlightSql = function (text) {
        var result = '';
        var i = 0;
        var len = text.length;
        while (i < len) {
            // Single-line comment --
            if (text[i] === '-' && i + 1 < len && text[i + 1] === '-') {
                var end = text.indexOf('\n', i);
                if (end === -1) { end = len; }
                result += '<span style="color:#008000;">' + _escHtml(text.slice(i, end)) + '</span>';
                i = end;
            }
            // Multi-line comment /* */
            else if (text[i] === '/' && i + 1 < len && text[i + 1] === '*') {
                var end = text.indexOf('*/', i + 2);
                if (end === -1) { end = len; } else { end += 2; }
                result += '<span style="color:#008000;">' + _escHtml(text.slice(i, end)) + '</span>';
                i = end;
            }
            // String literal 'xxx'
            else if (text[i] === "'") {
                var j = i + 1;
                while (j < len) {
                    if (text[j] === "'" && j + 1 < len && text[j + 1] === "'") { j += 2; continue; }
                    if (text[j] === "'") { j++; break; }
                    j++;
                }
                result += '<span style="color:#a31515;">' + _escHtml(text.slice(i, j)) + '</span>';
                i = j;
            }
            // Bracketed identifier [xxx]
            else if (text[i] === '[') {
                var j = text.indexOf(']', i);
                if (j === -1) { j = len; } else { j++; }
                result += '<span style="color:#cc0000;">' + _escHtml(text.slice(i, j)) + '</span>';
                i = j;
            }
            // Numbers
            else if (/[0-9]/.test(text[i])) {
                var j = i;
                while (j < len && /[0-9.]/.test(text[j])) { j++; }
                result += '<span style="color:#098658;">' + _escHtml(text.slice(i, j)) + '</span>';
                i = j;
            }
            // Identifiers / keywords
            else if (/[a-zA-Z_@#]/.test(text[i])) {
                var j = i;
                while (j < len && /[a-zA-Z0-9_]/.test(text[j])) { j++; }
                var word = text.slice(i, j);
                if (_SQL_KEYWORDS.has(word.toUpperCase())) {
                    result += '<span style="color:#0066cc;font-weight:bold;">' + _escHtml(word) + '</span>';
                } else {
                    result += _escHtml(word);
                }
                i = j;
            }
            else {
                result += _escHtml(text[i]);
                i++;
            }
        }
        return result;
    };

    // ─── helpers ────────────────────────────────────────────────────────────────

    var _format = function (template) {
        var args = arguments;
        return template.replace(/\{(\d+)\}/g, function (match, index) {
            return args[+index + 1];
        });
    };

    /**
     * Рекурсивно ищет элемент по CSS-селектору, проходя через Shadow DOM.
     */
    var _deepQuery = function (selector, root, depth) {
        root = root || document;
        depth = depth || 0;
        var found = root.querySelector(selector);
        if (found) {
            console.log("[SamConsole] _deepQuery: found at depth=" + depth, found);
            return found;
        }
        var all = root.querySelectorAll("*");
        for (var i = 0; i < all.length; i++) {
            var sr = all[i].shadowRoot;
            if (sr) {
                found = _deepQuery(selector, sr, depth + 1);
                if (found) return found;
            }
        }
        return null;
    };

    var _updateLineNumbers = function () {
        if (!_textarea || !_lineNumbers) return;
        var lines = _textarea.value.split("\n").length;
        var nums = "";
        for (var i = 1; i <= lines; i++) { nums += i + "\n"; }
        _lineNumbers.textContent = nums;
        _lineNumbers.scrollTop = _textarea.scrollTop;
    };

    var _updateHighlight = function () {
        if (!_highlightDiv || !_textarea) return;
        _highlightDiv.innerHTML = _highlightSql(_textarea.value) + '\n';
        _highlightDiv.scrollTop = _textarea.scrollTop;
        _highlightDiv.scrollLeft = _textarea.scrollLeft;
    };

    // ─── init ───────────────────────────────────────────────────────────────────

    /**
     * Инициализирует редактор внутри Freedom UI компонента.
     * @param {String} componentName  – name компонента в viewConfigDiff
     * @param {Object} [options]      – fontSize, fontFamily, editorHeight, onExecute, onClear
     * @returns {Boolean} true если успешно, false если элемент не найден
     */
    var init = function (componentName, options) {
        if (_initialized) return true;

        console.log("[SamConsole] init: searching for component:", componentName);
        var sel1 = "crt-flex[element-name=\"" + componentName + "\"]";
        var sel2 = "[id=\"" + componentName + "\"]";

        var hostEl = _deepQuery(sel1);
        console.log("[SamConsole] selector1:", hostEl);
        if (!hostEl) {
            hostEl = _deepQuery(sel2);
            console.log("[SamConsole] selector2:", hostEl);
        }
        if (!hostEl) {
            console.warn("[SamConsole] host element not found yet");
            return false;
        }

        console.log("[SamConsole] host found:", hostEl.tagName,
            hostEl.outerHTML.substring(0, 200));
        console.log("[SamConsole] host shadowRoot:", hostEl.shadowRoot);

        options = options || {};
        var fontSize = options.fontSize || "14px";
        var fontFamily = options.fontFamily || "'Consolas','Monaco','Courier New',monospace";
        var editorHeight = options.editorHeight || "300px";
        var lineHeight = "1.5";

        // ── editor wrapper ──
        var wrapper = document.createElement("div");
        wrapper.style.cssText =
            "display:flex;" +
            "width:100%;" +
            "height:" + editorHeight + ";" +
            "box-sizing:border-box;" +
            "background:#fff;" +
            "border:1px solid #d6d6d6;" +
            "border-radius:4px;" +
            "overflow:hidden;";

        // line numbers
        _lineNumbers = document.createElement("div");
        _lineNumbers.style.cssText =
            "width:44px;min-width:44px;" +
            "background:#f5f5f5;" +
            "border-right:1px solid #e0e0e0;" +
            "color:#aaa;" +
            "font-family:" + fontFamily + ";" +
            "font-size:" + fontSize + ";" +
            "line-height:" + lineHeight + ";" +
            "padding:8px 6px 8px 0;" +
            "text-align:right;" +
            "overflow:hidden;" +
            "white-space:pre;" +
            "user-select:none;" +
            "-webkit-user-select:none;" +
            "box-sizing:border-box;" +
            "flex-shrink:0;";

        // highlight overlay
        _highlightDiv = document.createElement("div");
        _highlightDiv.style.cssText =
            "position:absolute;" +
            "top:0;left:0;right:0;bottom:0;" +
            "padding:8px;" +
            "font-family:" + fontFamily + ";" +
            "font-size:" + fontSize + ";" +
            "line-height:" + lineHeight + ";" +
            "white-space:pre;" +
            "word-wrap:normal;" +
            "overflow-wrap:normal;" +
            "tab-size:4;" +
            "pointer-events:none;" +
            "overflow:hidden;" +
            "box-sizing:border-box;" +
            "color:#222;" +
            "z-index:0;";
        // запас снизу, чтобы последние строки можно было прокрутить из-под плавающих кнопок
        var editorPadding = options.onExecute ? "8px 8px 48px 8px" : "8px";
        _highlightDiv.style.padding = editorPadding;

        // textarea
        _textarea = document.createElement("textarea");
        _textarea.style.cssText =
            "position:absolute;" +
            "top:0;left:0;right:0;bottom:0;" +
            "resize:none;" +
            "border:none;" +
            "outline:none;" +
            "font-family:" + fontFamily + ";" +
            "font-size:" + fontSize + ";" +
            "line-height:" + lineHeight + ";" +
            "padding:8px;" +
            "box-sizing:border-box;" +
            "background:transparent;" +
            "color:transparent;" +
            "caret-color:#222;" +
            "overflow:auto;" +
            "white-space:pre;" +
            "word-wrap:normal;" +
            "overflow-wrap:normal;" +
            "tab-size:4;" +
            "z-index:1;";
        _textarea.style.padding = editorPadding;
        _textarea.setAttribute("spellcheck", "false");
        _textarea.setAttribute("autocomplete", "off");
        _textarea.setAttribute("autocorrect", "off");
        _textarea.setAttribute("autocapitalize", "off");
        _textarea.setAttribute("placeholder", _strings.SqlPlaceholder);

        var editorInner = document.createElement("div");
        editorInner.style.cssText =
            "position:relative;" +
            "flex:1;" +
            "overflow:hidden;";
        editorInner.appendChild(_highlightDiv);
        editorInner.appendChild(_textarea);

        // ── floating action buttons (Execute / Clear) ──
        if (options.onExecute) {
            var actions = document.createElement("div");
            actions.style.cssText =
                "position:absolute;" +
                "right:20px;" +
                "bottom:12px;" +
                "display:flex;" +
                "align-items:center;" +
                "gap:8px;" +
                "z-index:2;";

            var floatBtnStyle =
                "height:32px;" +
                "border-radius:4px;" +
                "font-family:inherit;" +
                "font-size:14px;" +
                "font-weight:600;" +
                "cursor:pointer;" +
                "box-shadow:0 1px 4px rgba(0,0,0,0.15);";

            if (options.onClear) {
                var btnClear = document.createElement("button");
                btnClear.type = "button";
                btnClear.textContent = "🗑";
                btnClear.title = _strings.ClearButtonHint;
                btnClear.style.cssText = floatBtnStyle +
                    "width:32px;" +
                    "padding:0;" +
                    "border:1px solid #d6d6d6;" +
                    "background:#fff;" +
                    "color:#555;";
                btnClear.addEventListener("click", function () {
                    options.onClear();
                });
                actions.appendChild(btnClear);
            }

            var btnExecute = document.createElement("button");
            btnExecute.type = "button";
            btnExecute.textContent = "▶ " + _strings.ExecuteButtonCaption;
            btnExecute.style.cssText = floatBtnStyle +
                "padding:0 16px;" +
                "border:none;" +
                "background:#1f8f3a;" +
                "color:#fff;";
            btnExecute.addEventListener("mouseenter", function () { btnExecute.style.background = "#187331"; });
            btnExecute.addEventListener("mouseleave", function () { btnExecute.style.background = "#1f8f3a"; });
            btnExecute.addEventListener("click", function () {
                options.onExecute();
            });
            actions.appendChild(btnExecute);

            editorInner.appendChild(actions);
        }

        wrapper.appendChild(_lineNumbers);
        wrapper.appendChild(editorInner);

        // ── resize splitter ──
        var splitter = document.createElement("div");
        splitter.style.cssText =
            "width:100%;" +
            "height:6px;" +
            "cursor:row-resize;" +
            "background:#e0e0e0;" +
            "border-radius:0 0 4px 4px;" +
            "display:flex;" +
            "align-items:center;" +
            "justify-content:center;" +
            "flex-shrink:0;";
        splitter.title = _strings.EditorResizeHint;

        var grip = document.createElement("div");
        grip.style.cssText =
            "width:30px;" +
            "height:2px;" +
            "background:#aaa;" +
            "border-radius:1px;";
        splitter.appendChild(grip);

        (function () {
            var startY = 0;
            var startH = 0;
            var onMouseMove = function (e) {
                var newH = startH + (e.clientY - startY);
                if (newH < 100) newH = 100;
                wrapper.style.height = newH + "px";
            };
            var onMouseUp = function () {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
                document.body.style.userSelect = "";
                document.body.style.cursor = "";
            };
            splitter.addEventListener("mousedown", function (e) {
                e.preventDefault();
                startY = e.clientY;
                startH = wrapper.offsetHeight;
                document.body.style.userSelect = "none";
                document.body.style.cursor = "row-resize";
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            });
        })();

        // ── toolbar (search, row limit, export) ──
        var toolbar = document.createElement("div");
        toolbar.style.cssText =
            "display:none;" +
            "align-items:center;" +
            "justify-content:flex-end;" +
            "flex-wrap:wrap;" +
            "gap:8px;" +
            "margin-top:8px;" +
            "font-family:" + fontFamily + ";" +
            "font-size:13px;" +
            "color:#555;";
        _resultToolbar = toolbar;

        var searchInput = document.createElement("input");
        searchInput.type = "search";
        searchInput.placeholder = _strings.SearchPlaceholder;
        searchInput.style.cssText =
            "padding:4px 8px;" +
            "border:1px solid #d6d6d6;" +
            "border-radius:4px;" +
            "font-family:" + fontFamily + ";" +
            "font-size:13px;" +
            "background:#fff;" +
            "color:#222;" +
            "width:250px;" +
            "height:28px;" +
            "box-sizing:border-box;";
        searchInput.addEventListener("input", function () {
            _searchFilter = searchInput.value.toLowerCase();
            if (_lastResult) {
                _renderResult();
            }
        });
        toolbar.appendChild(searchInput);

        var limitLabel = document.createElement("span");
        limitLabel.textContent = _strings.RowLimitLabel;
        toolbar.appendChild(limitLabel);

        _limitSelect = document.createElement("select");
        _limitSelect.style.cssText =
            "padding:4px 8px;" +
            "border:1px solid #d6d6d6;" +
            "border-radius:4px;" +
            "font-family:" + fontFamily + ";" +
            "font-size:13px;" +
            "background:#fff;" +
            "color:#222;" +
            "cursor:pointer;";
        [10, 20, 50, 100].forEach(function (n) {
            var opt = document.createElement("option");
            opt.value = n;
            opt.textContent = n;
            if (n === _rowLimit) opt.selected = true;
            _limitSelect.appendChild(opt);
        });
        _limitSelect.addEventListener("change", function () {
            _rowLimit = parseInt(_limitSelect.value, 10);
            if (_lastResult) {
                _renderResult();
            }
        });
        toolbar.appendChild(_limitSelect);

        var btnStyle =
            "padding:4px 12px;" +
            "border:1px solid #d6d6d6;" +
            "border-radius:4px;" +
            "font-family:" + fontFamily + ";" +
            "font-size:13px;" +
            "background:#fff;" +
            "color:#222;" +
            "cursor:pointer;";

        var btnJson = document.createElement("button");
        btnJson.textContent = "JSON";
        btnJson.style.cssText = btnStyle;
        btnJson.addEventListener("click", function () {
            _exportJson();
        });
        toolbar.appendChild(btnJson);

        var btnCsv = document.createElement("button");
        btnCsv.textContent = "CSV";
        btnCsv.style.cssText = btnStyle;
        btnCsv.addEventListener("click", function () {
            _exportCsv();
        });
        toolbar.appendChild(btnCsv);

        // ── result container ──
        _resultContainer = document.createElement("div");
        _resultContainer.style.cssText =
            "width:100%;" +
            "margin-top:8px;" +
            "overflow:auto;" +
            "box-sizing:border-box;" +
            "font-family:" + fontFamily + ";" +
            "font-size:13px;";

        // mount into host
        hostEl.appendChild(wrapper);
        hostEl.appendChild(splitter);
        hostEl.appendChild(toolbar);
        hostEl.appendChild(_resultContainer);

        console.log("[SamConsole] wrapper appended to host");
        console.log("[SamConsole] host childNodes:", hostEl.childNodes.length);
        console.log("[SamConsole] wrapper offsetHeight:", wrapper.offsetHeight,
            "offsetWidth:", wrapper.offsetWidth);

        // ── events ──
        _textarea.addEventListener("input", function () {
            _updateLineNumbers();
            _updateHighlight();
        });
        _textarea.addEventListener("scroll", function () {
            _lineNumbers.scrollTop = _textarea.scrollTop;
            _highlightDiv.scrollTop = _textarea.scrollTop;
            _highlightDiv.scrollLeft = _textarea.scrollLeft;
        });
        _textarea.addEventListener("keydown", function (e) {
            if (e.key === "Tab") {
                e.preventDefault();
                var s = _textarea.selectionStart;
                var e2 = _textarea.selectionEnd;
                _textarea.value =
                    _textarea.value.substring(0, s) + "    " +
                    _textarea.value.substring(e2);
                _textarea.selectionStart = _textarea.selectionEnd = s + 4;
                _updateLineNumbers();
            }
        });

        _updateLineNumbers();
        _updateHighlight();
        _initialized = true;
        return true;
    };

    // ─── result rendering ────────────────────────────────────────────────────────

    /**
     * Отображает результат выполнения SQL из SamSqlConsoleService.ExecuteSqlScript.
     * @param {Object} result – { Success, SecurityError, ErrorMessage, RowsAffected, QueryResults }
     */
    var _updateToolbarVisibility = function () {
        if (!_resultToolbar) return;
        var hasTable = !!(_lastResult && _lastResult.Success &&
            _lastResult.QueryResults && _lastResult.QueryResults.length > 0);
        _resultToolbar.style.display = hasTable ? "flex" : "none";
    };

    var _renderResult = function () {
        if (!_resultContainer || !_lastResult) return;
        var result = _lastResult;

        _updateToolbarVisibility();
        _resultContainer.innerHTML = "";

        if (_lastElapsed !== null) {
            _resultContainer.appendChild(
                _makeMessage("⏱ " + _format(_strings.ExecutionTimeMessage, _lastElapsed), "#555", "#f0f0f0")
            );
        }

        // ── security error ──
        if (result.SecurityError) {
            _resultContainer.appendChild(
                _makeMessage("⛔ " + _strings.AccessDeniedMessage, "#c0392b", "#fff5f5")
            );
            return;
        }

        // ── general error ──
        if (!result.Success) {
            _resultContainer.appendChild(
                _makeMessage("❌ " + (result.ErrorMessage || _strings.UnknownErrorMessage), "#c0392b", "#fff5f5")
            );
            return;
        }

        // ── DML (INSERT / UPDATE / DELETE) ──
        if (!result.QueryResults || result.QueryResults.length === 0) {
            _resultContainer.appendChild(
                _makeMessage("✔ " + _format(_strings.RowsAffectedMessage, result.RowsAffected || 0), "#1a7f37", "#f0fff4")
            );
            return;
        }

        // ── SELECT results ──
        result.QueryResults.forEach(function (qr, idx) {
            if (result.QueryResults.length > 1) {
                var label = document.createElement("div");
                label.style.cssText = "font-weight:bold;padding:4px 0;color:#555;";
                label.textContent = _format(_strings.ResultCaption, idx + 1);
                _resultContainer.appendChild(label);
            }

            var table = document.createElement("table");
            table.style.cssText =
                "width:100%;" +
                "border-collapse:collapse;" +
                "font-size:13px;";

            // header
            var thead = document.createElement("thead");
            var hRow = document.createElement("tr");
            (qr.Columns || []).forEach(function (col, colIdx) {
                var th = document.createElement("th");
                th.style.cssText =
                    "border:1px solid #e0e0e0;" +
                    "padding:5px 8px;" +
                    "background:#f5f5f5;" +
                    "text-align:left;" +
                    "white-space:nowrap;" +
                    "color:#333;" +
                    "cursor:pointer;" +
                    "user-select:none;";
                var label = document.createElement("span");
                label.textContent = col;
                th.appendChild(label);
                if (_sortColIndex === colIdx) {
                    var arrow = document.createElement("span");
                    arrow.style.marginLeft = "4px";
                    arrow.textContent = _sortAsc ? " \u25B2" : " \u25BC";
                    th.appendChild(arrow);
                }
                th.addEventListener("click", function () {
                    if (_sortColIndex === colIdx) {
                        _sortAsc = !_sortAsc;
                    } else {
                        _sortColIndex = colIdx;
                        _sortAsc = true;
                    }
                    _renderResult();
                });
                hRow.appendChild(th);
            });
            thead.appendChild(hRow);
            table.appendChild(thead);

            // rows
            var tbody = document.createElement("tbody");
            var allRows = (qr.Rows || []).slice();
            if (_sortColIndex >= 0 && _sortColIndex < (qr.Columns || []).length) {
                var ci = _sortColIndex;
                var isDate = allRows.length > 0 && allRows.some(function (row) {
                    var v = row[ci];
                    if (!v || v === "NULL") return false;
                    return !isNaN(Date.parse(v));
                });
                allRows.sort(function (a, b) {
                    var va = (a[ci] === null || a[ci] === undefined || a[ci] === "NULL") ? "" : String(a[ci]);
                    var vb = (b[ci] === null || b[ci] === undefined || b[ci] === "NULL") ? "" : String(b[ci]);
                    var cmp;
                    if (isDate) {
                        var da = va ? new Date(va).getTime() : 0;
                        var db = vb ? new Date(vb).getTime() : 0;
                        cmp = da - db;
                    } else {
                        cmp = va.localeCompare(vb);
                    }
                    return _sortAsc ? cmp : -cmp;
                });
            }
            if (_searchFilter) {
                allRows = allRows.filter(function (row) {
                    return row.some(function (cell) {
                        var val = (cell === null || cell === undefined) ? "" : String(cell);
                        return val.toLowerCase().indexOf(_searchFilter) !== -1;
                    });
                });
            }
            var filteredTotal = allRows.length;
            var visibleRows = allRows.slice(0, _rowLimit);
            visibleRows.forEach(function (row, ri) {
                var tr = document.createElement("tr");
                tr.style.background = ri % 2 === 0 ? "#fff" : "#fafafa";
                row.forEach(function (cell) {
                    var td = document.createElement("td");
                    td.style.cssText =
                        "border:1px solid #e0e0e0;" +
                        "padding:4px 8px;" +
                        "white-space:pre-wrap;" +
                        "word-break:break-word;" +
                        "color:#222;";
                    td.textContent = (cell === null || cell === undefined) ? "NULL" : cell;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);

            // row count hint
            var hint = document.createElement("div");
            hint.style.cssText = "padding:3px 0 6px;color:#888;font-size:12px;";
            var originalTotal = (qr.Rows || []).length;
            var shownRows = visibleRows.length;
            var parts = [];
            parts.push(_format(_strings.RowsShownHint, shownRows));
            if (_searchFilter) {
                parts.push(_format(_strings.RowsFoundHint, filteredTotal));
            }
            parts.push(_format(_strings.RowsTotalHint, originalTotal));
            hint.textContent = parts.join(" | ");

            _resultContainer.appendChild(table);
            _resultContainer.appendChild(hint);
        });
    };

    var setResult = function (result) {
        if (!_resultContainer) return;

        _lastElapsed = _timerStart ? ((Date.now() - _timerStart) / 1000).toFixed(2) : null;
        _stopTimer();

        if (!result) {
            _lastResult = null;
            _updateToolbarVisibility();
            _resultContainer.innerHTML = "";
            return;
        }
        if (result.ExecuteSqlScriptResult) {
            result = result.ExecuteSqlScriptResult;
        }
        _lastResult = result;
        _sortColIndex = -1;
        _sortAsc = true;
        _renderResult();
    };

    var _stopTimer = function () {
        if (_timerInterval) {
            clearInterval(_timerInterval);
            _timerInterval = null;
        }
    };

    var _startTimer = function () {
        _stopTimer();
        _timerStart = Date.now();
        _timerEl = document.createElement("div");
        _timerEl.style.cssText =
            "padding:8px 12px;" +
            "border-radius:4px;" +
            "color:#555;" +
            "background:#f9f9f9;" +
            "border:1px solid #55555533;" +
            "font-size:13px;";
        _timerEl.textContent = "⏳ " + _format(_strings.ExecutingMessage, 0);
        _resultContainer.innerHTML = "";
        _resultContainer.appendChild(_timerEl);
        _timerInterval = setInterval(function () {
            var elapsed = ((Date.now() - _timerStart) / 1000).toFixed(1);
            _timerEl.textContent = "⏳ " + _format(_strings.ExecutingMessage, elapsed);
        }, 100);
    };

    /** Показывает/скрывает индикатор загрузки в зоне результатов. */
    var setLoading = function (isLoading) {
        if (!_resultContainer) return;
        if (isLoading) {
            _startTimer();
        }
    };

    /** Вспомогательная функция: создаёт блок-сообщение. */
    var _makeMessage = function (text, color, bg) {
        var div = document.createElement("div");
        div.style.cssText =
            "padding:8px 12px;" +
            "border-radius:4px;" +
            "color:" + color + ";" +
            "background:" + bg + ";" +
            "border:1px solid " + color + "33;" +
            "font-size:13px;";
        div.textContent = text;
        return div;
    };

    var _downloadFile = function (filename, content, mimeType) {
        var blob = new Blob([content], { type: mimeType });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    var _exportJson = function () {
        if (!_lastResult || !_lastResult.QueryResults || _lastResult.QueryResults.length === 0) return;
        var output = [];
        _lastResult.QueryResults.forEach(function (qr) {
            var cols = qr.Columns || [];
            (qr.Rows || []).forEach(function (row) {
                var obj = {};
                cols.forEach(function (col, i) {
                    obj[col] = row[i];
                });
                output.push(obj);
            });
        });
        var json = JSON.stringify(output, null, 2);
        _downloadFile("export.json", json, "application/json;charset=utf-8");
    };

    var _exportCsv = function () {
        if (!_lastResult || !_lastResult.QueryResults || _lastResult.QueryResults.length === 0) return;
        var bom = "\uFEFF";
        var lines = [];
        _lastResult.QueryResults.forEach(function (qr) {
            var cols = qr.Columns || [];
            if (lines.length === 0) {
                lines.push(cols.map(function (c) { return _csvEscape(c); }).join(";"));
            }
            (qr.Rows || []).forEach(function (row) {
                lines.push(row.map(function (cell) {
                    return _csvEscape(cell === null || cell === undefined ? "" : cell);
                }).join(";"));
            });
        });
        _downloadFile("export.csv", bom + lines.join("\r\n"), "text/csv;charset=utf-8");
    };

    var _csvEscape = function (val) {
        var s = String(val);
        s = s.replace(/\\/g, "\\\\")
             .replace(/\n/g, "\\n")
             .replace(/\r/g, "\\r")
             .replace(/\t/g, "\\t");
        if (s.indexOf(";") !== -1 || s.indexOf('"') !== -1) {
            return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
    };

    // ─── public API ──────────────────────────────────────────────────────────────

    var isInitialized = function () { return _initialized; };

    var getValue = function () { return _textarea ? _textarea.value : ""; };

    var setValue = function (value) {
        if (_textarea) {
            _textarea.value = value || "";
            _updateLineNumbers();
            _updateHighlight();
        }
    };

    var insertText = function (text) {
        if (!_textarea || !text) return;
        var value = _textarea.value;
        var start = _textarea.selectionStart;
        var before = value.substring(0, start);
        var after = value.substring(_textarea.selectionEnd);
        // шаблон начинается с новой строки, чтобы не склеиться с текстом перед курсором
        var prefix = before && before.charAt(before.length - 1) !== "\n" ? "\n" : "";
        _textarea.value = before + prefix + text + after;
        var caret = start + prefix.length + text.length;
        _textarea.setSelectionRange(caret, caret);
        _updateLineNumbers();
        _updateHighlight();
        _textarea.focus();
    };

    var clear = function () {
        if (_textarea) {
            _textarea.value = "";
            _updateLineNumbers();
            _updateHighlight();
            _textarea.focus();
        }
        _lastResult = null;
        _lastElapsed = null;
        _updateToolbarVisibility();
        if (_resultContainer) { _resultContainer.innerHTML = ""; }
    };

    var focus = function () {
        if (_textarea) _textarea.focus();
    };

    var _splitterInitialized = false;

    var initSplitter = function (leftName, rightName) {
        if (_splitterInitialized) return true;

        var leftEl = _deepQuery('crt-flex[element-name="' + leftName + '"]');
        var rightEl = _deepQuery('crt-flex[element-name="' + rightName + '"]');
        if (!leftEl || !rightEl) {
            console.warn("[SamConsole] splitter: panels not found", leftName, rightName);
            return false;
        }

        var parent = leftEl.parentElement;
        if (!parent) return false;

        parent.style.display = "flex";
        parent.style.flexDirection = "row";
        parent.style.overflow = "hidden";
        parent.style.width = "100%";
        parent.style.maxWidth = "100%";

        leftEl.style.flex = "4 1 0%";
        leftEl.style.minWidth = "0";
        leftEl.style.overflow = "hidden";

        rightEl.style.flex = "1 1 0%";
        // ширина колонок списка команд (кнопка + Name + тип БД), иначе текст уезжает в горизонтальный скролл
        rightEl.style.minWidth = "360px";
        rightEl.style.overflow = "hidden";

        var splitter = document.createElement("div");
        splitter.style.cssText =
            "width:6px;" +
            "min-width:6px;" +
            "cursor:col-resize;" +
            "background:#e0e0e0;" +
            "display:flex;" +
            "align-items:center;" +
            "justify-content:center;" +
            "flex-shrink:0;" +
            "user-select:none;" +
            "-webkit-user-select:none;";
        splitter.title = _strings.PanelsResizeHint;

        var grip = document.createElement("div");
        grip.style.cssText =
            "width:2px;" +
            "height:30px;" +
            "background:#aaa;" +
            "border-radius:1px;";
        splitter.appendChild(grip);

        parent.insertBefore(splitter, rightEl);

        (function () {
            var startX = 0;
            var totalW = 0;
            var startLeftPct = 0;
            var onMouseMove = function (e) {
                var delta = e.clientX - startX;
                var leftPct = startLeftPct + (delta / totalW * 100);
                if (leftPct < 20) leftPct = 20;
                if (leftPct > 90) leftPct = 90;
                var rightPct = 100 - leftPct;
                leftEl.style.flex = "0 0 calc(" + leftPct + "% - 3px)";
                rightEl.style.flex = "0 0 calc(" + rightPct + "% - 3px)";
            };
            var onMouseUp = function () {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
                document.body.style.userSelect = "";
                document.body.style.cursor = "";
            };
            splitter.addEventListener("mousedown", function (e) {
                e.preventDefault();
                startX = e.clientX;
                totalW = parent.offsetWidth - 6;
                startLeftPct = (leftEl.offsetWidth / totalW) * 100;
                document.body.style.userSelect = "none";
                document.body.style.cursor = "col-resize";
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            });
        })();

        _splitterInitialized = true;
        console.log("[SamConsole] horizontal splitter initialized");
        return true;
    };

    return {
        init: init,
        initSplitter: initSplitter,
        isInitialized: isInitialized,
        getValue: getValue,
        setValue: setValue,
        insertText: insertText,
        clear: clear,
        focus: focus,
        setResult: setResult,
        setLoading: setLoading
    };
});
