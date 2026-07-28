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
    ]
};

console.log( john.name );

// An object is a "dynamic" bag of key value pairs
console.log( 'BEFORE : ', john );

john.company = 'Dover'; // Add company
delete john.age; // Remove age

console.log( 'AFTER : ', john );

// Accessing a key with a special characters (not valid identifier)
console.log( john['6SigmaTrained'] );
console.log( john['name'] ); // john.name will also do

// edits
john.name = 'Jonathan';
console.log( john );

console.log( john.address.city );
console.log( john.children[1] );

console.log( john.projects[1].started );

