// data interchange format -> key-value pair based text format for exchanging data
// human-readable
// number, boolean, string, array, object, null
const validJson1 = `{
    "name": "John",
    "age": 32
}`;

const validJson2 = `100`;

const validJson3 = `
[
    {
        "project": "CMT",
        "started": "2026-07-01"
    },
    {
        "project": "RMT",
        "started": "2026-07-25"
    }
]
`;

// JSON.parse() -> To convert a JSON string to a proper JS type
// This makes it easy to modify the data
const projects = JSON.parse( validJson3 );
projects[1].started = "2026-07-29";

// We have to convert this array back to a JSON string to send it over the network (eg. body in a POST request)
const jsonProjects = JSON.stringify( projects, null, 4 );
console.log( jsonProjects );