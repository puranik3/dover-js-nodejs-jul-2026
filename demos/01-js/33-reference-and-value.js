// TAKEAWAYS
// 1. Primitive variables are copied by value
// 2. Non-primitives are copied by reference
function foo( x, p ) {
    ++x; // ++foo::x
    ++p.age; // ???

    console.log( `foo x = ${x}` ); // printing foo::x
    console.log( `foo p.age = ${p.age}` ); // ???
}

let x = 1; // primitive
const person = { // non-primitives (objects, arrays, functiion etc.)
    name: 'John',
    age: 32,
};

console.log( `BEFORE calling foo() x = ${x}` );
console.log( `BEFORE person.age = ${person.age}` );

foo( x, person ); // foo::x = global::x

console.log( `AFTER calling foo() x = ${x}` );
console.log( `AFTER person.age = ${person.age}` );

/**
 * BEFORE calling foo() x = 1
 * BEFORE calling foo() person.age = 32
 * foo x = 2
 * foo person.age = 33
 * AFTER calling foo() x = 1
 * AFTER person.age = 33
 */

// EXPLORE: For a full copy of an object (deep copy) we can use structuredClone, JSON.stringify + JSON.parse / lodash cloneDeep etc.