// The default export can be imported with any name (and you don't need to know the name)
import Human, { PI as pi, foo } from './Person.js';

export class Employee extends Human {
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