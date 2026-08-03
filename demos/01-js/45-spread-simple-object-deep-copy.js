const darshan = {
    name: 'Darshan', // string -> primitive
    age: 21, // number -> primitive
    emails: [ // array -> non-primitive
        'darshan@gmail.com',
        'darshan@outlook.com',
    ]
};

const darshanEmployment = {
    company: 'Dover',
    project: 'Portal 2.0',
    emails: [
        'darshan@dover.com'
    ]
};

// different copy of name, age, company, project
// emails is copied by reference, i.e. it is shared between darshan and darshanMasterDetails
const darshanMasterDetails = {
    ...darshan,
    ...darshanEmployment
};

console.log( 'darshanMasterDetails = ', darshanMasterDetails ); // email from darshanCompany object

const darshanMasterDetails = {
    ...darshan,
    ...darshanEmployment,
    emails: [
        ...darshan.emails,
        ...darshanEmployment.emails
    ]
};

++darshanMasterDetails.age; // DOES not affect darshan

// darshanMasterDetails.emails SAME AS darshan.emails
darshanMasterDetails.emails[0] = 'darshan123@gmail.com'; // affects darshan

console.log( 'darshanMasterDetails = ', darshanMasterDetails );

console.log( 'darshan = ', darshan ); // age -> SAME, i.e. 21, emails[0] -> CHANGED