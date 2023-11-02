const { extractCheckmarks, generateChangeList } = require('./functions.js');

test('finds checkmarks in string', ()=>{
    const result=[]
    extractCheckmarks("-[ ] hi there", result)
    expect(result.length).toBe(1)
})

test('finds the unchecked state of the checkbox', () => {
    const result=[]
    extractCheckmarks("-[ ] hi there", result)
    expect(result[0].checked).toBe(false)
    expect(result[0].text).toBe("hi there")
});

test('finds the checked state of the checkbox', () => {
    const result=[]
    extractCheckmarks("-[x] hi there", result)
    expect(result[0].checked).toBe(true)
    expect(result[0].text).toBe("hi there")
});

test('finds both of the checkboxes', () => {
    const result=[]
    const otherResult=extractCheckmarks("something at the start\n-[x] hi there\nsomething in the middle\n-[ ] was here\nsomething at the end", result)
    expect(result.length).toBe(2)
    expect(result[0].checked).toBe(true)
    expect(result[0].text).toBe("hi there")
    expect(result[1].checked).toBe(false)
    expect(result[1].text).toBe("was here")
    expect(otherResult.length).toBe(2)
    expect(otherResult[0].checked).toBe(true)
    expect(otherResult[0].text).toBe("hi there")
    expect(otherResult[1].checked).toBe(false)
    expect(otherResult[1].text).toBe("was here")
});

const current = [];
const previous = [];
const added = [];

beforeAll(() => {
    extractCheckmarks("something at the start\n-[x] hi there\nsomething in the middle\n-[ ] was here  \nsomething at the end", current);
    extractCheckmarks("something at the start\n-[x] hi there\nsomething in the middle\n-[x] was here\nsomething at the end", previous);
    extractCheckmarks("something at the start\n-[x] hi there\nsomething in the middle\n-[x] was here\n- [ ] new task\nsomething at the end", added);
});

describe('calculating changes between the bodies', () => {
    test('finds no changes between the edits (degenerate case)', ()=>{
        expect(generateChangeList(current, current)).toStrictEqual([]);
    })
    test('finds a change between the edits', ()=>{
        expect(generateChangeList(current, previous)).toStrictEqual([{checked: false, text: "was here"}]);
    })
    test('handles additional task', ()=>{
        expect(generateChangeList(added, previous)).toStrictEqual([{checked: false, text: "[added] new task"}]);
    })
    test('handles removed task', ()=>{
        const removed = extractCheckmarks("something at the start\n-[x] hi there\nsomething in the middle\n-[x] was here\nsomething at the end");
        expect(generateChangeList(removed, added)).toStrictEqual([{checked: false, text: "[removed] new task"}]);
    })
    test('handles several additional task', ()=>{
        const added = extractCheckmarks("something at the start\n-[ ] hi there\nsomething in the middle\n-[x] was here\n- [x] vfa\n-[x] eatmore");
        expect(generateChangeList(added, previous)).toStrictEqual([{checked: false, text: "hi there"},{checked: true, text: "[added] vfa"}, {checked: true, text: "[added] eatmore"}]);
    })

});
