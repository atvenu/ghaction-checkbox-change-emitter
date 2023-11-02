# Issue Checkbox Change Extractor for Github Actions

This action is to be used with the _issue_ `edited` event to extract modifications to the check box state in an issue.  

## Outputs

```yaml
outputs:
  formatted-string: 
    description: 'Formatted string version of the original line.'
  checkbox-changes:
    description: 'json object of the changes of the form {checked: <true | false>, text: "<the text next to the checkbox>"}'
```
## Example usage

```yaml
name: Comment when checkbox is toggled
on:
    issues:
        types: [edited]
  
jobs:
    hello:
        runs-on: ubuntu-latest
        steps:
            - name: generate the list of changed checkboxes
              id: checkbox
              uses: "atvenu/ghaction-checkbox-to-comment@main"
              
            - name: list changes debugging
              run: |
                  echo "changed=${{ steps.checkbox.outputs.formatted-string }}"

            - name: create comment on issue
              if: ${{ steps.checkbox.outputs.formatted-string}} != ""
              uses: peter-evans/create-or-update-comment@v3
              with:
                  issue-number: ${{ github.event.issue.number }}
                  body: |
                      ${{ steps.checkbox.outputs.formatted-string }}
                      checkbox updated by: ${{ github.event.sender.login }}
```

## Development

`docker compose build` or `docker build . -t node-dev`

Helpful continuous test runner available with `docker run -v .:/app -it node-dev npm continuous` or something similar.

### Building

To build the `dist/index.js` version for checkin and release run `docker run -v .:/app -it node-dev npm run build`