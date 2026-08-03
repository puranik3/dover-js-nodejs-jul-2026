const persons = [
    {
        name: 'John',
        age: 32
    },
    {
        name: 'Jane',
        age: 28
    },
    {
        name: 'Mark',
        age: 40
    }
];

// TAKEAWAY: Non-primitive items within the array are copied by reference - called "SHALLOW COPY" - In employees_copy2, the array is new BUT objects are same old ones
const employees_copy1 = persons; // No new array
const employees_copy2 = [ ...persons ]; // new array

employees_copy1[0] = {
    name: 'Jonathan',
    age: 33
};

employees_copy2[1] = {
    name: 'Janette',
    age: 29
};

employees_copy2[2].name = 'Mark Smith';
++employees_copy2[2].age;

// changed or same?
console.log( persons );

// EXPLORE: How to create a "DEEP COPY" of an array of objects - that is even the copied objects are new objects