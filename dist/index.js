/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 31:
/***/ ((module) => {

const regex = /^-\s*\[([xX ]*)\]\s*(.*)$/gm;
const MARKDOWN_STRIKETHROUGH = "~";

/**
 * Generates a list/array of maps/objects representing lines with checkboxes.
 *
 * @param     {string} bodyString     the entire contents of the issue or PR description as a string
 * @param     {Array} [result]    optional array to push changes into
 * @returns   {Array}   array of maps of the form {checked: <true | false>, text: "<the text next to the checkbox>"}
 */
const extractCheckmarks = (bodyString, result=[])=>{
    let match;
    while ((match = regex.exec(bodyString)) !== null) {
        const checkbox = match[1].trim();
        const text = match[2].trim();
        result.push({"checked": (checkbox === 'x' || checkbox === 'X'), "text": text});
    }
    return result;
};

/**
 * Calculates a list/array of maps/objects containing changes lines that had a change in checkbox state.
 *
 * @param     {Array} current     array of representations of checkbox containing lines for the current state of the issue or PR
 * @param     {Array} previous    array of representations of checkbox containing lines for the previous state of the issue or PR
 * @param     {Array} [result]    optional array to push changes into
 * @returns   {Array}   array of maps of the form {checked: <true | false>, text: "<the text next to the checkbox>"} that have changed
 */
const generateChangeList = (current, previous, result=[]) => {
    current.forEach((checkboxLine) => {
        const aMatch = previous.find((entry) => {
            return entry.text.replaceAll(MARKDOWN_STRIKETHROUGH, "") === checkboxLine.text.replaceAll(MARKDOWN_STRIKETHROUGH, ""); // check from strike
        })
        if (aMatch !== undefined) {
            if (aMatch.text !== checkboxLine.text || aMatch.checked !== checkboxLine.checked) {
                result.push(checkboxLine);
            }
        } else {
            result.push({checked: checkboxLine.checked,  text: `[added] ${checkboxLine.text}`});
        }
    });
    // check for removed
    previous.forEach((checkboxLine) => {
        const aMatch = current.find((entry) => {
            return entry.text.replaceAll(MARKDOWN_STRIKETHROUGH, "") === checkboxLine.text.replaceAll(MARKDOWN_STRIKETHROUGH, ""); // check from strike
        });
        if (aMatch === undefined) {
            result.push({checked: checkboxLine.checked,  text: `[removed] ${checkboxLine.text}`});
        }
    });
    console.log('>>>', JSON.stringify(result));
    return result;
};

module.exports ={
    extractCheckmarks,
    generateChangeList
};

/***/ }),

/***/ 431:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 715:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const core = __nccwpck_require__(431);
const github = __nccwpck_require__(715);
const { extractCheckmarks, generateChangeList } = __nccwpck_require__(31);

const BODY_KEY = "body";
try {
    const payload = github.context.payload
    const changes = payload.changes;
    const body = payload?.issue?.body || payload?.pull_request?.body;

    core.debug(`The body payload: ${JSON.stringify(body, undefined, 2)}`);
    core.debug(`The changes payload: ${JSON.stringify(changes, undefined, 2)}`);

    // if the changes payload includes the key of body then continue
    const keysThatChanged = Object.keys(changes);
    if (keysThatChanged.includes(BODY_KEY)) {
        const previous = extractCheckmarks(changes.body.from);
        const current = extractCheckmarks(body);
        const changedLines = generateChangeList(current, previous);

        const checkboxChanges = changedLines.map((line)=>{ return `${line.checked ? '✅' : '[ ]'} - ${line.text}`}).join("\n");

        core.setOutput("checkbox-changes", changedLines);
        core.setOutput("formatted-string", checkboxChanges);
        core.exportVariable("formatted-string", checkboxChanges);
    } else {
        // nothing changed
        core.setOutput("checkbox-changes", null);
        core.setOutput("formatted-string", '');
        core.exportVariable("formatted-string", '');
    }
} catch (error) {
    core.setFailed(error.message);
}

module.exports = __webpack_exports__;
/******/ })()
;