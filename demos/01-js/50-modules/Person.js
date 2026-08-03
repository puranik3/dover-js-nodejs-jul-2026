// A file can have 0 or 1 default exports
/*export default */class Person {
    static nationality = 'Indian'; // is NOT part of an object

    constructor( name, age ) {
        this.name = name;
        this.age = age;
        this.emails = [];
    }

    // methods
    celebrateBirthday() {
        ++this.age;
    }

    addEmail( email ) {
        this.emails.push( email );
    }
}

// named exports (as against default export)
export const PI = 3.14;

export function foo() {

}

// export multiple things in one go
export {
    Person as default
}