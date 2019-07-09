const sum = (a, b) => {
    return a + b
};

test('Check the sum function + ', () => {
    expect(sum(2, 3)).toBe(5);
});

test('Check the object type', () => {
    let peopleA = {
        name: 'Chris'
    };
    peopleA.gender = 'male';
    expect(peopleA.name).toBe('Chris');
    expect(peopleA).toEqual({name: 'Chris', gender: 'male'})
});


test('Special value', () => {
    expect(true).toBeTruthy();

    expect(false).toBeFalsy();

    expect(null).toBeNull();

    expect(undefined).toBeUndefined();

    expect(null).toBeDefined()
});


test('Use not', () => {
    let peopleA = {
        name: 'Chris'
    };
    expect(peopleA.name).not.toBe('');
    peopleA.name = '';
    expect(peopleA.name).toBe('')
});

describe('test sum function', () => {
    it('two plus two is four', () => {
        expect(2 + 2).toBe(4);
    });

    test('Check the sum function + ', () => {
        expect(sum(2, 3)).toBe(5)
    })
});

let func = require('./dublin_bus/static/js/sample.js');
test('test compare', () => {
    expect(func.compare(10)).toBe(10);
    expect(func.compare(10, 20)).toBe(20);
    expect(func.compare(20, 10)).toBe(20);
});