// The "this" is available everywhere in JS
console.log( this ); // "this" in global scope refers to "global object" in browser (called "window" object)

// 1. function in an object (i.e. a method of the object)
const john = {
    name: 'John',
    age: 32,
    celebrateBirthday() {
        console.log( 'celebrateBirthday this =', this );
        ++this.age;
    }
};

// 2. general function
function foo() {
    console.log( 'foo this =', this );
}

john.celebrateBirthday(); // this -> john
console.log( john.age ); // 32 -> 33
foo(); // this -> global object

const cb = john.celebrateBirthday;
cb(); // this -> global object, and does this method work or throw an error?
console.log( john.age ); // still 33

// HOW IS "this" set? It depends on how we CALL the method

// Is there a way to set the function context ("this")?
// call() / apply() can help with it
cb.call( john );
console.log( john.age ); // 33 -> 34

// EXPLOYE: apply() -> similar to call(). If you are interested you can explore bind() as well