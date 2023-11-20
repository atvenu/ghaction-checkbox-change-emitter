const core = require('@actions/core');
const github = require('@actions/github');
const { extractCheckmarks, generateChangeList } = require('./src/functions.js');

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
