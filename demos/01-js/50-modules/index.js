import { Employee } from './Employee.js';

const john = new Employee( 'John', 32, 1234, 'Developer' );
const jane = new Employee( 'Jane', 28, 5678, 'Designer' );

// We can call the methods on the base class
john.celebrateBirthday(); // this -> john
jane.celebrateBirthday(); // this -> jane

john.addEmail( 'john@example.com' );
jane.promote( 'Senior Designer' );

console.log( john, jane );
console.log( Employee.nationality ); // accessed using the class name, not the object