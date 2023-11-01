const core = require('@actions/core');
const github = require('@actions/github');

try {
    const body = github.context.payload.issue.body;
    const changes = github.context.payload.changes;
    console.log(`The body payload:`, JSON.stringify(body, undefined, 2));
    console.log(`The changes payload:`, JSON.stringify(changes, undefined, 2));

    // if the changes payload includes the key of body then continue
    const keysThatChanged = Object.keys(changes);
    if (keysThatChanged.includes("body")) {
        const previous = []
        const current = []
        const regex = /^-\s*\[([xX ]*)\]\s*(.*)$/gm
        let match
        while ((match = regex.exec(changes.body.from)) !== null) {
            const checkbox = match[1].trim()
            const text = match[2].trim()
            core.debug(`Found checkbox: ${checkbox} and text: ${text}`)
            previous.push({"checked": (checkbox === 'x' || checkbox === 'X'), "text": text})
        }
        while ((match = regex.exec(body)) !== null) {
            const checkbox = match[1].trim()
            const text = match[2].trim()
            core.debug(`Found checkbox: ${checkbox} and text: ${text}`)
            current.push({"checked": (checkbox === 'x' || checkbox === 'X'), "text": text})
        }
        // walk through the old one and look for the text in the new one.  Should check for strike through as well
        const changedLines = []
        current.forEach((checkboxLine) => {
            const aMatch = previous.find((entry) => {
                return entry.text.replaceAll("~", "") === checkboxLine.text.replaceAll("~", "")
            })
            if (aMatch !== null) {
                if (aMatch.text !== checkboxLine.text || aMatch.checked !== checkboxLine.checked) {
                    // somehow look at the differences now and save them up for the comment part.
                    changedLines.push(checkboxLine);
                }
            }
        });
        const checkboxChanges = changedLines.map((line)=>{ return `${line.checked ? '✅' : '[ ]'} - ${line.text}`}).join("\n");
        console.log("changed lines", checkboxChanges)
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
