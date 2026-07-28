// Keys / properties are 'strings'
const john = {
    name: 'John', // 'name': 'John'
    age: 32, // 'age': 32
    '6SigmaTrained': false,
    address: {
        city: 'Bengaluru',
        state: 'Karnataka'
    },
    children: [
        'Jack',
        'Jill'
    ],
    projects: [
        {
            name: 'RMT',
            started: 'Feb 9, 2026'
        },
        {
            name: 'SMT',
            started: 'Jul 29, 2026'
        }
    ],
    // addChild: function( child ) {

    // },
    addChild( child ) {
        this.children.push( child );
    },

    // IMPORTANT: WE SHOULD NOT use arrow function for methods in objects
    // "this" will not wor fine for arrow functions
    addProject( name, started ) {
        console.log( 'this = ', this ); // global object AND NOT john

        this.projects.push(
            // {
            //     name: name,
            //     started: started
            // }
            {
                name,
                started
            }
        )
    }

    // Add a method that takes in the name and start date of a project, and add it to the list of projects
    // YOUR CODE...
};

john.addChild( 'James' );
console.log( john.children );

john.addProject( 'CMT', 'Aug 16, 2026' );
console.log( john.projects );