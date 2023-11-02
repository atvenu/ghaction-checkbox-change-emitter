const regex = /^-\s*\[([xX ]*)\]\s*(.*)$/gm;
const MARKDOWN_STRIKETHROUGH = "~";

/**
 * Generates a list/array of maps/objects representing lines with checkboxes.
 *
 * @param     {string} bodyString     the entire contents of the issue description as a string
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
 * @param     {Array} current     array of representations of checkbox containing lines for the current state of the issue
 * @param     {Array} previous    array of representations of checkbox containing lines for the previous state of the issue
 * @param     {Array} [result]    optional array to push changes into
 * @returns   {Array}   array of maps of the form {checked: <true | false>, text: "<the text next to the checkbox>"} that have changed
 */
const generateChangeList = (current, previous, result=[]) => {
    current.forEach((checkboxLine) => {
        const aMatch = previous.find((entry) => {
            return entry.text.replaceAll(MARKDOWN_STRIKETHROUGH, "") === checkboxLine.text.replaceAll(MARKDOWN_STRIKETHROUGH, ""); // check from strike
        })
        if (aMatch !== null) {
            if (aMatch.text !== checkboxLine.text || aMatch.checked !== checkboxLine.checked) {
                result.push(checkboxLine);
            }
        }
    });
    return result;
};

module.exports ={
    extractCheckmarks,
    generateChangeList
};