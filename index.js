const core = require('@actions/core');
const github = require('@actions/github');

try {
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    core.exportVariable("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const body = JSON.stringify(github.context.payload.issue.body, undefined, 2)
    const changes = JSON.stringify(github.context.payload.changes, undefined, 2)
    console.log(`The body payload: ${body}`);
    console.log(`The changes payload: ${changes}`);

    // if the changes payload includes the key of body then continue
    const keysThatChanged = Object.keys(changes);
    if (keysThatChanged.includes("body")) {
        // do the work of comparing and looking for the
        const changedBody = changes.body.from.split("\n")
        const originalBody = changes.body.split("\n")
        // const checksFromChanged = changedBody.filter((item)=>{ item.})
        const previous = []
        const current = []
        const regex = /^-\s*\[([xX ]*)\]\s*(.*)$/gm
        let match
        while ((match = regex.exec(ranges.body.from)) !== null) {
            const checkbox = match[1].trim()
            const text = match[2].trim()
            core.debug(`Found checkbox: ${checkbox} and text: ${text}`)
            previous.push({"checked": (checkbox === 'x' || checkbox === 'X'), "text": text})
        }
        while ((match = regex.exec(body.from)) !== null) {
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
                if (aMatch.text !== checkboxLine.text || aMatch.checked != checkboxLine.checked) {
                    // somehow look at the differences now and save them up for the comment part.
                    changedLines.push(checkboxLine);
                }
            }
        });
        console.log("changed lines", JSON.stringify(changedLines))
    } else {
        // nothing changed
        console.log('Nothing changed apparently', JSON.stringify(keysThatChanged));
    }
} catch (error) {
    core.setFailed(error.message);
}
