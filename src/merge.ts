/**
 * This allows you to work with object hierarchies with operations
 * that modify the data to return partial copies of the structure.
 * The portions of the structure that did not change will
 * === their previous values.
 *
 * Lifted from icepick
 */

'use strict';

// we only care about objects or arrays for now
export function weCareAbout(val: any): boolean {
    return val !== null &&
        (Array.isArray(val) ||
            // This will skip objects created with `new Foo()`
            // and objects created with `Object.create(proto)`
            // The benefit is ignoring DOM elements and event emitters,
            // which are often circular.
            isObjectLike(val));
}

function isObjectLike(val: any): boolean {
    return typeof val === 'object' &&
        val.constructor === Object &&
        Object.getPrototypeOf(val) === Object.prototype;
}

function cloneObj<T extends {[key:string]: any}>(obj: T): T {
    const newObj = {} as T;
    const keys = Object.keys(obj);
    let idx = keys.length;
    let key;
    while (idx--) {
        key = keys[idx];
        newObj[key] = obj[key];
    }
    return newObj;
}

function clone<T extends object|[any]>(coll: T): T {
    if (Array.isArray(coll)) {
        return coll.slice() as T;
    } else {
        return cloneObj(coll);
    }
}

/**
 * set a value on an object or array
 * @param  {Object|Array}  coll
 * @param  {String|Number} key   Key or index
 * @param  {Object}        value
 * @return {Object|Array}        new object hierarchy with modifications
 */
export function assoc<T extends object|[any], V>(coll: T, key: string|number, value: V): T {
    if ((coll as any)[key] === value) {
        return coll;
    }

    const newObj = clone(coll);

    (newObj as any)[key] = value;

    return newObj;
}

export function merge<T, S1>(target: T, source: S1): (T & S1) {
    if (target == null || source == null) {
        return target as any;
    }
    return Object.keys(source).reduce((obj, key) => {
        const sourceVal = (source as any)[key];
        const targetVal = (obj as any)[key];

        if (weCareAbout(sourceVal) && weCareAbout(targetVal)) {
            // if they are reference equal, assume they are deep equal
            if (sourceVal === targetVal) {
                return obj;
            }
            if (Array.isArray(sourceVal)) {
                return assoc(obj as {[key:string]: any}, key, sourceVal) as any;
            }
            // recursively merge pairs of objects
            return assocIfDifferent(obj, key, merge(targetVal, sourceVal));
        }

        // primitive values, stuff with prototypes
        return assocIfDifferent(obj, key, sourceVal);
    }, target);
}

function assocIfDifferent<T extends {[key:string]: any}>(target: T, key: string, value: any): T {
    if (target[key] === value) {
        return target;
    }
    return assoc(target, key, value);
}
