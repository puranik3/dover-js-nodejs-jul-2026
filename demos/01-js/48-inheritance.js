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

class Employee extends Person {
    constructor( name, age, empId, role ) {
        super( name, age );

        this.empId = empId;
        this.role = role;
    }

    promote( newRole) {
        this.role = newRole;
    }

    celebrateBirthday() {
        console.log( `Happy Birthday, ${this.name}!` );
        // How can we call the Person class celebrateBirthday()?
        super.celebrateBirthday(); // this will call the Employee class celebrateBirthday() again, leading to infinite recursion
    }
}

const john = new Employee( 'John', 32, 1234, 'Developer' );
const jane = new Employee( 'Jane', 28, 5678, 'Designer' );

// We can call the methods on the base class
john.celebrateBirthday(); // this -> john
jane.celebrateBirthday(); // this -> jane

john.addEmail( 'john@example.com' );
jane.promote( 'Senior Designer' );

console.log( john, jane );
console.log( Employee.nationality ); // accessed using the class name, not the object