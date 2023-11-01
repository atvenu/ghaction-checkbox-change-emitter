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
    const body = JSON.stringify(github.context.payload.body, undefined, 2)
    const changes = JSON.stringify(github.context.payload.changes, undefined, 2)
    console.log(`The event payload: ${body}`);
    console.log(`The event payload: ${changes}`);
} catch (error) {
    core.setFailed(error.message);
}
