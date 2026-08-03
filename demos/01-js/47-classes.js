// Useful when we want to create objects with same structure and shared set of methods
class Person {
    // data member can be defined at the top / or can be left undefined and initialized in constructor
    // name;
    // age;

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

const john = new Person( 'John', 32 );
const jane = new Person( 'Jane', 28 );

john.celebrateBirthday(); // this -> john
jane.celebrateBirthday(); // this -> jane

john.addEmail( 'john@example.com' );

console.log( john, jane );
console.log( Person.nationality ); // accessed using the class name, not the object