import {assoc, merge, weCareAbout} from '../merge';

describe('assoc', () => {
    it('should work with objects', () => {
        const o = ({a: 1, b: 2, c: 3});
        let result = assoc(o, 'b', 4);

        expect(result).toEqual({a: 1, b: 4, c: 3});

        result = assoc(o, 'd', 4);
        expect(result).toEqual({a: 1, b: 2, c: 3, d: 4});
    });

    it('should work with arrays', () => {
        const a = ([1, 2, 3]);
        let result = assoc(a, 1, 4);

        expect(result).toEqual([1, 4, 3]);

        result = assoc(a, '1', 4);
        expect(result).toEqual([1, 4, 3]);

        result = assoc(a, 3, 4);
        expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should not modify child objects', () => {
        const o = ({a: 1, b: 2, c: {a: 4}});
        const result = assoc(o, 'b', 4);

        expect(result.c).toBe(o.c);
    });

    it('should keep references the same if nothing changes', () => {
        const o = ({a: 1});
        const result = assoc(o, 'a', 1);
        expect(result).toBe(o);
    });
});

describe('merge', () => {
    it('should merge nested objects', () => {
        const o1 = ({a: 1, b: {c: 1, d: 1}});
        const o2 = ({a: 1, b: {c: 2}, e: 2});

        const result = merge(o1, o2);
        expect(result).toEqual({a: 1, b: {c: 2, d: 1}, e: 2});
    });

    it('should replace arrays', () => {
        const o1 = ({a: 1, b: {c: [1, 1]}, d: 1});
        const o2 = ({a: 2, b: {c: [2]}});

        const result = merge(o1, o2);
        expect(result).toEqual({a: 2, b: {c: [2]}, d: 1});
    });

    it('should overwrite with nulls', () => {
        const o1 = ({a: 1, b: {c: [1, 1]}});
        const o2 = ({a: 2, b: {c: null as any}});

        const result = merge(o1, o2);
        expect(result).toEqual({a: 2, b: {c: null}});
    });

    it('should overwrite primitives with objects', () => {
        const o1 = ({a: 1, b: 1});
        const o2 = ({a: 2, b: {c: 2}});

        const result = merge(o1, o2);
        expect(result).toEqual({a: 2, b: {c: 2}});
    });

    it('should overwrite objects with primitives', () => {
        const o1 = ({a: 1, b: {c: 2}});
        const o2 = ({a: 1, b: 2});

        const result = merge(o1, o2);
        expect(result).toEqual({a: 1, b: 2});
    });

    it('should keep references the same if nothing changes', () => {
        const o1 = ({a: 1, b: {c: 1, d: 1, e: [1]}});
        const o2 = ({a: 1, b: {c: 1, d: 1, e: o1.b.e}});
        const result = merge(o1, o2);
        expect(result).toBe(o1);
        expect(result.b).toBe(o1.b);
    });

    it('should handle undefined parameters', () => {
        expect(merge({}, undefined)).toEqual({});
        expect(merge(undefined, {})).toEqual(undefined);
    });
});

describe('weCareAbout [internals]', () => {
    function Foo () { return; }
    class Bar {}

    it('should care about objects', () => {
        expect(weCareAbout({})).toBe(true);
    });
    it('should care about arrays', () => {
        expect(weCareAbout([])).toBe(true);
    });
    it('should not care about dates', () => {
        expect(weCareAbout(new Date())).toBe(false);
    });
    it('should not care about null', () => {
        expect(weCareAbout(null)).toBe(false);
    });
    it('should not care about undefined', () => {
        expect(weCareAbout(undefined)).toBe(false);
    });
    it('should not care about class instances', () => {
        expect(weCareAbout(new (Foo as any)())).toBe(false);
    });
    it('should not care about class instances (2)', () => {
        expect(weCareAbout(new Bar())).toBe(false);
    });
    it('should not care about objects created with Object.create()', () => {
        expect(weCareAbout(Object.create(Foo.prototype))).toBe(false);
    });
    it('should not care about objects created with Object.create({})', () => {
        expect(weCareAbout(Object.create({
            foo: function () { return; }
        }))).toBe(false);
    });
});
