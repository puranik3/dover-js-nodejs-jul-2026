const darshan = {
    name: 'Darshan', // string -> primitive
    age: 21, // number -> primitive
    emails: [ // array -> non-primitive
        'darshan@gmail.com',
        'darshan@outlook.com'
    ]
};

const darshanEmployment = {
    company: 'Dover',
    project: 'Portal 2.0'
};

const darshanMasterDetails = {
    ...darshan,
    ...darshanEmployment
};

++darshanMasterDetails.age;
darshanMasterDetails.emails[0] = 'darshan123@gmail.com';

console.log( 'darshanMasterDetails = ', darshanMasterDetails );

console.log( 'darshan = ', darshan ); // age?, emails[0]?