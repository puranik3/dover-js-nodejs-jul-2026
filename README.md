# JavaScript

## Overview
- Brief history of ECMAScript (JS language specification)
- Features introduced in various versions
- Where and how JavaScript is used
- Is JavaScript interpreted or compiled?

## Before Getting Started
- Inclusion and execution in an HTML context
  - Inline JavaScript
  - `<script>` tag in the document
  - External script files
- What happens in case of errors?
- Strict Mode execution
- Comments
  - Single-line
  - Multi-line
- Case sensitivity
- Automatic semicolon insertion

## Identifiers, Variables, and Data Types
- Rules for identifiers (variables, function names, etc.)
- Variable declaration
- Primitive data types
  - Number
  - Boolean
  - String
- Special primitive values
  - `null`
  - `undefined`
- Arrays
- Multi-dimensional arrays
- Array-like objects

## Operators, Expressions, and Control Flow
- Operators
  - Arithmetic
  - Relational
  - Logical
- How `===` differs from `==`
- Copy by value vs. copy by reference
- Expressions and operator precedence
- Miscellaneous operators
  - Conditional (`?:`)
  - `typeof` (including `null` check)
- Control flow
  - `if...else`
  - `for`
  - `while`
  - `switch...case`

## Introduction to Functions
- Function declaration syntax
- Function invocation
- Anonymous functions and function expressions
- Working with function references
- Immediately Invoked Function Expressions (IIFE)
- The `arguments` object
- Handling variable number of arguments
- Function context (`this`)
- `call()` vs. `apply()`
- Inner functions
- Callbacks
- Returning functions
- Higher-order functions
- Functional programming paradigm
- Scope of variables
  - Global scope
  - Function scope
- Scope chain
- Closures

## Introduction to Objects
- Object declaration using literal syntax
- Valid property names
- Accessing properties and methods
  - Dot notation
  - Bracket notation (`[]`)
- Adding and deleting properties
  - Compile time
  - Runtime

## Built-in Classes and Singletons
- `Date`
- Primitive type wrappers
  - `Number`
  - `Boolean`
  - `String`
- Basic array methods
- Array iteration methods
- Functional programming revisited
- JSON
  - `JSON.parse()`
  - `JSON.stringify()`

## Features of ES2015+
- Block-level scoping with `let` and `const`
- Strings and template literals
- Default function arguments
- Object and array destructuring
- Arrow functions
  - Syntax
  - Semantics
  - `this` binding
- Rest operator
  - Functions
  - Array destructuring
  - Object destructuring
- Spread operator
  - Arrays
  - Objects
- Object literal enhancements
- Classes
  - Definition
  - Properties
  - Methods
  - Creating objects
- Class inheritance
- Modules
  - `import`
  - `export`
  - Default exports
- Promises
  - `then()`
  - `catch()`
  - Chaining asynchronous tasks
- Promises vs. callbacks
- `async` / `await`

---

# Node.js

## Getting Started
- About Node.js
- Downloading and installing Node.js
- Creating a simple web server
- Introduction to Node.js and the Node CLI

## Packages and npm
- Node packages
- Semantic Versioning (SemVer)
- npm registry
- Introduction to `package.json`
- Creating a Node project with npm
- npmjs.com registry
- Searching, installing, updating, and uninstalling packages
- Using third-party modules
- Global installations
- Configuring npm

## Setting Up Development Workflows
- npm scripts
- Using `nodemon`

## Modules and the Module System
- Overview of built-in modules
- Using built-in modules
- Creating your own modules
  - `exports`
  - `module.exports`
  - `require`
- The global object
- Module resolution process
- Caching of module exports

## How Node.js Works
- Single-threaded JavaScript execution
- Node modules
- Native C++ modules
- `libuv`
- Asynchronous I/O
- Thread pools
- Blocking vs. non-blocking I/O
- Event loop
- `setTimeout()`
- `setImmediate()`
- `process.nextTick()`

## Handling Asynchronous Code
- Error-first callbacks
- Drawbacks of callbacks
- Introduction to Promises

## Events and Streams
- Events and `EventEmitter`
- Creating custom `EventEmitter` classes
- Readable streams
- Writable streams
- Pipes

## Working with the Local System
- `__filename`
- `__dirname`
- The `process` object
- Environment variables
  - `process.env`
  - `NODE_ENV`
- File and folder paths (`path` module)
- File operations (`fs` module)
- Binary data (`Buffer`)
- OS module

## Using Node.js to Build Web Applications
- Making HTTP requests (`ClientRequest`)
- Building a web server
- HTTPS servers
- Core server objects
  - `Server`
  - `IncomingMessage`
  - `ServerResponse`
- `url` module
- `querystring` module

## Using Express to Build Web Applications
- Introduction to Express.js
- Why use Express?
- Building web applications with Express
- Project structure with Express Generator
- The Application object
- Routing
  - Application object
  - Router object
- Sending responses
  - Text
  - Files
  - JSON
- Redirects
- Controllers
- Organizing application files
- Middleware
  - What it is
  - How it works
- Using middleware
- Error-handling middleware
- Cross-cutting concerns
- Static file serving
- Body parser middleware
- Query parameters
- Path parameters
- EJS templating
- EJS partials

## Database Integration (MySQL/PostgreSQL)
- Using MySQL (`mysql`)
- Using PostgreSQL (`node-postgres`)
- Using Sequelize
- Relationships between tables
- Data validation
- CRUD operations
- Building REST APIs
  - GET
  - POST
  - PUT
  - DELETE

### OR

## Database Integration (MongoDB)
- Introduction to MongoDB
- Using the MongoDB driver
- Using Mongoose
- Mongoose schemas
- Validations
- Model and document methods
- CRUD operations
- Building REST APIs
  - GET
  - POST
  - PUT
  - DELETE

## Using Popular Third-party Modules
- JWT authentication (`jsonwebtoken`)
- Logging
  - Chalk
  - Morgan
  - Winston
- Environment-based configuration (`dotenv`)