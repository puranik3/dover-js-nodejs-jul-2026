# Building the Workshops App API Server using Express JS
We build the API server for the Workshops App (serves only data, and not HTML views).

- __Documentation__:
    - https://nodejs.org/docs/latest/api/
    - https://expressjs.com/
- __Production database__: `mongodb+srv://admin:<db_password>@cluster0.9d7mmqx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    - Check with the instructor for `db_password`
- Completed frontend app can be run from the `demos/01-angular/workshops-app` folder
- Sample `.vscode/launch.json` for debugging. This assumes your workspace folder (the folder you opened in VS Code) is the project folder.
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Express App",
      "program": "${workspaceFolder}/dist/app.js",
      "cwd": "${workspaceFolder}",
      "runtimeArgs": ["--inspect=9230"],
      "envFile": "${workspaceFolder}/.env",
      "env": {
        "NODE_ENV": "development",
        "PORT": "3001"
      },
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "sourceMaps": true,
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

## Before getting started
You will need Node `^18.0.0` in order to install Express 5. Install a compatible version of Node if you don't have one.
```
node --version
node -v
```
- __Reference__: https://nodejs.org/en
- You also need Postman to make HTTP requests. Download it from https://www.postman.com/downloads/

## Step 1: Create the Express app and run it
- Create a project folder and a `package.json` within it
```bash
mkdir workshops-app
cd workshops-app
npm init -y
```
- Install Express, TypeScript and nodemon
```bash
npm i express
npm i -D typescript @types/node @types/express nodemon
```
- You can install the Prettier extension for VS Code and have it run on file changes. Open your VS Code `settings.json` (Cmd/Ctrl+Shift+P → Preferences: Open Settings (JSON)) and add
```json
{
  // Use Prettier as the default formatter
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // Format the file automatically on save
  "editor.formatOnSave": true
}
```
- Use a Prettier config file. To keep consistent formatting rules across your project, create a `.prettierrc` file in your project folder
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100
}
```
- Create `tsconfig.json` (or simply use the one below).
```sh
./node_modules/.bin/tsc --init
```
- A good `tsconfig.json` for Node 20+
```js
{
  "compilerOptions": {
    "target": "es2022",                     // Controls the JavaScript language version (ECMAScript features) that TypeScript will compile your code down to - we are using here modern JS output es2022 (Node 20 supports it)
    "module": "commonjs",                   // the module system for the compiled JS - easier to run with Node
    "rootDir": "./src",                     // TS source files
    "outDir": "./dist",                     // compiled JS
    "esModuleInterop": true,                // allow default imports for CJS modules
    "resolveJsonModule": true,              // allow JSON imports
    "strict": true,                         // strict type checking
    "skipLibCheck": true,                   // skip checking type declaration files
    "sourceMap": true,                      // useful for debugging
    "declaration": true                     // emit .d.ts files if you want library support
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```
- Since the compiled JS will be CommonJS, set `"type": "commonjs"` (or omit `"type"` altogether, since the default is CJS). Set the following in `package.json`
```json
{
    "main": "dist/app.js",
    "scripts": {
        "build": "tsc",
        "build:watch": "tsc --watch",
        "start": "nodemon",
    }
}
```
- Run the build in one terminal, and the app in another (start the app after you add the `src/app.ts` file in a few steps from now).
```sh
npm run build:watch
```
```sh
npm start
```

## Step 2: Set up environment variables
- You may set up an environment variable for `PORT`. Check how to create one in your shell (Windows CMD, Powershell, Linux / Mac OSX - bash, zsh etc.). Set it to something like `3000`.
- Alternatively, you can install dotenv package and store key-value pairs we shall be read into `process.env` object of Node JS. First install `dotenv` package that helps loads different environment variables for different environments (`production`, `development` etc.)
```bash
npm i dotenv
```
- Create a `.env` file for development use. Add the `PORT` variable in it.
```
PORT=3000
```

## Step 3: Create a basic Express server and start it
- Create an src folder
```bash
mkdir src
```

- In `src/app.ts` load the variables in `.env` into `process.env` object of Node JS. Create a basic Express `Application` object and start the server associated with it on the specified port.
```js
import dotenv from 'dotenv';
dotenv.config(); // this is how we read and load the variables from the .env file

import express from 'express';

const app = express();

app.get('/', ( req, res ) => {
    res.write( 'This is the workshops app. It serves details of workshops happening nearby.' );
    res.end();
});

const PORT = process.env.PORT || 3000;

app.listen( PORT, (error) => {
    if (error) {
        console.log(error.message);
        return;
    }

    console.log(`Server running on http://localhost:${PORT}`);
});
```
- Add a start script in `package.json` if not already done. Set `dist/app.js` as the main script.
```json
{
    "main": "dist/app.js",
    "scripts": {
        "start": "nodemon"
    }
}
```
- Start the build in on terminal.
```sh
npm run build:watch
```
- Start the app in another terminal. Note that it restarts automatically if you make any changes in the application (change something in `app.ts`). If you make changes to `.env` file though, you need to restart the ap manually (Ctrl+C to stop, then start it like so).
```bash
npm start
```
- Check out `http://localhost:3000` in the browser.

## Step 4: Modularizing routing using Router
- An app would have routes for various resources (`workshops`, `sessions`, `users` etc.). It is better to use the alternative way of setting up routes for every resource in a separate file. The `Router` object of Express helps do exactly this. We use one for every resource instead of setting up all routes on the `Application` object.
- First in `src/routes/index.route.ts`, add the router with the index route (home route) set up. Note the difference between `res.end()` and `res.send()`. Redirection mechanism is also shown.
```js
import express from 'express';

const router = express.Router();

router.get('/', ( req, res ) => {
    // res.send() is an Express method built on top of Node JS ServerResponse object's res.end(). It automatically sets the appropriate Content-Type header based on the data.
    res.send( 'This is the workshops app. It serves details of workshops happening nearby.' );
});

router.get( '/home', ( req, res ) => {
    // tell the browser to make request to / instead. On receiving this response, the browser makes a new request to /
    res.redirect( '/' );
});

export default router;
```
- Integrate the routing into the application by set the router as a __middleware__. We will see what a middleware is in more detail later. In `src/app.ts`
```ts
import indexRouter from './routes/index.route';
```
```ts
const app = express();

app.use( indexRouter );

const PORT = process.env.PORT || 3000;

app.listen( PORT );
```

## Step 5: Adding a workshops router
- Add a `src/data` folder. In `src/data/workshops.json` add workshops data.
```json
[
    {
        "id": 1,
        "name": "Angular JS Bootcamp",
        "category": "frontend",
        "description": "<p><strong>AngularJS</strong> (also written as <strong>Angular.js</strong>) is a JavaScript-based open-source front-end web application framework mainly maintained by Google and by a community of individuals and corporations to address many of the challenges encountered in developing single-page applications.</p><p>It aims to simplify both the development and the testing of such applications by providing a framework for client-side model–view–controller (MVC) and model–view–viewmodel (MVVM) architectures, along with components commonly used in rich Internet applications. (This flexibility has led to the acronym MVW, which stands for \"model-view-whatever\" and may also encompass model–view–presenter and model–view–adapter.)</p>",
        "startDate": "2019-01-01T04:00:00.000Z",
        "endDate": "2019-01-03T08:00:00.000Z",
        "startTime": {
            "hours": 9,
            "minutes": 30
        },
        "endTime": {
            "hours": 13,
            "minutes": 30
        },
        "speakers": [
            "John Doe",
            "Jane Doe"
        ],
        "location": {
            "address": "Tata Elxsi, Prestige Shantiniketan",
            "city": "Bangalore",
            "state": "Karnataka"
        },
        "modes": {
            "inPerson": true,
            "online": false
        },
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/AngularJS_logo.svg/2000px-AngularJS_logo.svg.png"
    },
    {
        "id": 2,
        "name": "React JS Masterclass",
        "category": "frontend",
        "description": "<p><strong>React</strong> (also known as <strong>React.js</strong> or <strong>ReactJS</strong>) is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.</p><p>React can be used as a base in the development of single-page or mobile applications. Complex React applications usually require the use of additional libraries for state management, routing, and interaction with an API.</p>",
        "startDate": "2019-01-14T04:30:00.000Z",
        "endDate": "2019-01-16T12:30:00.000Z",
        "startTime": {
            "hours": 10,
            "minutes": 0
        },
        "endTime": {
            "hours": 18,
            "minutes": 0
        },
        "speakers": [
            "John Doe",
            "Jane Doe"
        ],
        "location": {
            "address": "Tata Elxsi, IT Park",
            "city": "Trivandrum",
            "state": "Kerala"
        },
        "modes": {
            "inPerson": true,
            "online": true
        },
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png"
    },
    {
        "id": 3,
        "name": "Crash course in MongoDB",
        "category": "database",
        "description": "<p><strong>MongoDB</strong> is a cross-platform document-oriented database program. It is issued under the Server Side Public License (SSPL) version 1, which was submitted for certification to the Open Source Initiative but later withdrawn in lieu of SSPL version 2. Classified as a NoSQL database program, MongoDB uses JSON-like documents with schemata. MongoDB is developed by MongoDB Inc.</p><p>MongoDB supports field, range query, and regular expression searches. Queries can return specific fields of documents and also include user-defined JavaScript functions. Queries can also be configured to return a random sample of results of a given size.</p>",
        "startDate": "2019-01-20T07:00:00.000Z",
        "endDate": "2019-01-22T11:00:00.000Z",
        "startTime": {
            "hours": 12,
            "minutes": 30
        },
        "endTime": {
            "hours": 16,
            "minutes": 30
        },
        "speakers": [
            "Mark Smith",
            "Mary Smith"
        ],
        "location": {
            "address": "HCL, Electronic City Phase 1",
            "city": "Bangalore",
            "state": "Karnataka"
        },
        "modes": {
            "inPerson": false,
            "online": true
        },
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/32/Mongo-db-logo.png"
    },
    {
        "id": 4,
        "name": "Mastering Node JS and Express",
        "category": "backend",
        "description": "<p><strong>Node.js</strong> is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code outside of a browser. Typically, JavaScript is used primarily for client-side scripting, in which scripts written in JavaScript are embedded in a webpage's HTML and run client-side by a JavaScript engine in the user's web browser. Node.js lets developers use JavaScript to write command line tools and for server-side scripting - running scripts server-side to produce dynamic web page content before the page is sent to the user's web browser. Consequently, Node.js represents a \"JavaScript everywhere\" paradigm, unifying web application development around a single programming language, rather than different languages for server side and client side scripts.</p><p>The Node.js distributed development project, governed by the Node.js Foundation, is facilitated by the Linux Foundation's Collaborative Projects program.</p>",
        "startDate": "2019-10-20T07:00:00.000Z",
        "endDate": "2019-10-22T07:00:00.000Z",
        "startTime": {
            "hours": 9,
            "minutes": 45
        },
        "endTime": {
            "hours": 17,
            "minutes": 45
        },
        "speakers": [
            "Mark Smith",
            "Mary Smith"
        ],
        "location": {
            "address": "Harman Connected Services\nITPL, Whitefield",
            "city": "Bangalore",
            "state": "Karnataka"
        },
        "modes": {
            "inPerson": true
        },
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1024px-Node.js_logo.svg.png"
    },
    {
        "id": 5,
        "name": "HTML and CSS",
        "category": "frontend",
        "description": "HTML and CSS introduction",
        "startDate": "2019-11-05T07:00:00.000Z",
        "endDate": "2019-11-06T07:00:00.000Z",
        "startTime": {
            "hours": 9,
            "minutes": 0
        },
        "endTime": {
            "hours": 17,
            "minutes": 0
        },
        "speakers": [
            "John Doe",
            "Jane Doe"
        ],
        "location": {
            "address": "Zenmonics",
            "city": "Bangalore",
            "state": "Karnataka"
        },
        "modes": {
            "inPerson": true,
            "online": false
        },
        "imageUrl": "https://en.wikipedia.org/wiki/HTML5#/media/File:HTML5_logo_and_wordmark.svg"
    },
    {
        "id": 6,
        "name": "TypeScript",
        "category": "language",
        "description": "TypeScript language fundamentals",
        "startDate": "2019-06-24",
        "endDate": "2019-06-24",
        "startTime": {
            "hours": 9,
            "minutes": 0
        },
        "endTime": {
            "hours": 17,
            "minutes": 0
        },
        "speakers": [
            "Mark Smith",
            "Mary Smith"
        ],
        "location": {
            "address": "Zenmonics",
            "city": "Bangalore",
            "state": "Karnataka"
        },
        "modes": {
            "inPerson": true,
            "online": false
        },
        "imageUrl": "https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png"
    },
    {
        "id": 7,
        "name": "Angular",
        "category": "frontend",
        "description": "<p>Google's <strong>Angular</strong> framework, is a much sought-after skill in the industry today. It is a single-page application (SPA) framework that includes most of the features required to build SPA applications. The Angular training gets you prepared for building enterprise-grade applications using the latest version of Angular.</p>",
        "startDate": "2019-11-01T04:00:00.000Z",
        "endDate": "2019-11-03T08:00:00.000Z",
        "startTime": {
            "hours": 9,
            "minutes": 30
        },
        "endTime": {
            "hours": 13,
            "minutes": 30
        },
        "speakers": [
            "John Doe",
            "Jane Doe"
        ],
        "location": {
            "address": "Tata Elxsi, Prestige Shantiniketan",
            "city": "Bangalore",
            "state": "Karnataka"
        },
        "modes": {
            "inPerson": true,
            "online": true
        },
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/512px-Angular_full_color_logo.svg.png"
    },
    {
        "id": 8,
        "name": "Migrating from Angular JS to Angular",
        "category": "frontend",
        "description": "<p>Google's <strong>Angular</strong> framework, is a much sought-after skill in the industry today. <strong>Angular JS</strong> is the first version of this framework. Angular (the name for the framework since version 2) is a ground-up rewrite of Angular JS.</p><p>Migration from Angular JS to Angular is not a straightforward task. This training prepares you for migration of existing Angular JS to the latest version of Angular.</p>",
        "startDate": "2019-12-01T04:00:00.000Z",
        "endDate": "2019-12-03T08:00:00.000Z",
        "startTime": {
            "hours": 9,
            "minutes": 30
        },
        "endTime": {
            "hours": 13,
            "minutes": 30
        },
        "speakers": [
            "Mark Smith",
            "Mary Smith"
        ],
        "location": {
            "address": "Tata Elxsi, Prestige Shantiniketan",
            "city": "Bangalore",
            "state": "Karnataka"
        },
        "modes": {
            "inPerson": true,
            "online": true
        },
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/512px-Angular_full_color_logo.svg.png"
    },
    {
        "id": 9,
        "name": "Bootstrap Bootcamp",
        "category": "frontend",
        "description": "<p><strong>Bootstrap</strong> is a front-end web framework that provides useful styles and components for creating responsive web pages quickly. Bootstrap v4 is the latest stable version of this framework and is covered in this bootcamp.</p>",
        "startDate": "2019-12-12T04:00:00.000Z",
        "endDate": "2019-12-14T08:00:00.000Z",
        "startTime": {
            "hours": 9,
            "minutes": 0
        },
        "endTime": {
            "hours": 17,
            "minutes": 0
        },
        "speakers": [
            "Jane Doe",
            "Mark Smith"
        ],
        "location": {
            "address": "SAP Labs, Whitefield",
            "city": "Bangalore",
            "state": "Karnataka"
        },
        "modes": {
            "inPerson": true,
            "online": false
        },
        "imageUrl": "https://getbootstrap.com/docs/4.4/assets/brand/bootstrap-solid.svg"
    },
    {
        "id": 10,
        "name": "Apache Cordova",
        "category": "mobile",
        "description": "<p>Developing a mobile app requires extensive knowledge of native programming techniques for multiple platforms. <strong>Apache Cordova</strong> lets you use your existing skills in web development (HTML, CSS, and JavaScript) to build powerful mobile apps. Your apps also get the power of integration with native device features like the camera and file system.</p><p>In this bootcamp, you will learn to build apps from the Cordova CLI, how to make use of device features like the camera and accelerometer, and how to submit your apps to Google Play Store / Apple App Store.</p>",
        "startDate": "2019-12-20T04:00:00.000Z",
        "endDate": "2019-12-23T08:00:00.000Z",
        "startTime": {
            "hours": 9,
            "minutes": 30
        },
        "endTime": {
            "hours": 13,
            "minutes": 30
        },
        "speakers": [
            "John Doe",
            "Mary Smith"
        ],
        "location": {
            "address": "Nissan Digital, IT Park",
            "city": "Trivandrum",
            "state": "Kerala"
        },
        "modes": {
            "inPerson": true,
            "online": true
        },
        "imageUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Apache_Cordova_Logo.svg/494px-Apache_Cordova_Logo.svg.png"
    },
    {
        "id": 11,
        "name": "Practical Git",
        "category": "devops",
        "description": "<p><strong>Git</strong> is a distributed Version Control System (VCS) created by Linus Torvalds. It is by far the most popular VCS in use today.</p>",
        "startDate": "2019-12-28T04:00:00.000Z",
        "endDate": "2019-12-28T08:00:00.000Z",
        "startTime": {
            "hours": 9,
            "minutes": 0
        },
        "endTime": {
            "hours": 17,
            "minutes": 0
        },
        "speakers": [
            "John Doe",
            "Mark Smith"
        ],
        "location": {
            "address": "SAP Labs, Whitefield",
            "city": "Bangalore",
            "state": "Karnataka"
        },
        "modes": {
            "inPerson": true,
            "online": false
        },
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Git-logo.svg/512px-Git-logo.svg.png"
    },
    {
        "id": 12,
        "name": "JavaScript Fundamentals",
        "category": "language",
        "description": "<p><strong>JavaScript (JS)</strong> is the language for scripting web pages – to enable user interactions on a web page, communicate with the backend etc.</p><p>The latest versions of JavaScript like ES2015 (ES6) have introduced a plethora of great new features that have found adoption in modern frontend and backend frameworks. A good understanding of JS, especially ES2015 features, lays a strong foundation to get started with frameworks like React and Angular, as also Node.js and Express.</p>",
        "startDate": "2020-01-08T04:00:00.000Z",
        "endDate": "2020-01-10T08:00:00.000Z",
        "startTime": {
            "hours": 9,
            "minutes": 0
        },
        "endTime": {
            "hours": 17,
            "minutes": 0
        },
        "speakers": [
            "Jane Doe",
            "Mary Smith"
        ],
        "location": {
            "address": "SAP Labs, Whitefield",
            "city": "Bangalore",
            "state": "Karnataka"
        },
        "modes": {
            "inPerson": true,
            "online": true
        },
        "imageUrl": "https://camo.githubusercontent.com/055e8995558e293e52e92d7c93b9ec49a9ea6c78/68747470733a2f2f63646e2e7261776769742e636f6d2f7a656b652f6a6176617363726970742d79656c6c6f772f6d61737465722f6c6f676f2e737667"
    }
]
```
- In `src/routes/workshops.route.ts`. We can read JSON files in Node by simply `require`ing them like JavaScript files. The JSON is read and parsed into an object of an appropriate JavaScript type and returned. Also note the use of `res.json()` to send data in JSON format (`Content-Type` header in response is set to `application/json`)
```js
import express from 'express';
import workshops from '../data/workshops.json';

const router = express.Router();

router.get( '/workshops', ( req, res ) => {
    res.json( workshops );
});

export default router;
```
- Add the new Router in `src/app.ts`
```ts
import workshopsRouter from './routes/workshops.route';
```
```ts
app.use( indexRouter );
// add the new Routers to the application
app.use( workshopsRouter );
```
- Check `http://localhost:3000/workshops` in the browser - you should see the list of workshops being served.

## Step 6: Using Body parser middleware - Adding POST /workshops support that adds a new workshop
- In `src/routes/workshops.route.ts`, add this
```js
router.post( '/workshops', ( req, res ) => {
    res.send( 'Hello Postman' );
});
```
- To test it out, open Postman app and make an HTTP POST request to http://localhost:3000/workshops
- Middleware is a function that is used for pre-processing requests (usually, before the request is handed over to the router), and post-processing responses (before they leave the app, i.e. sent to the network).
- Middleware can be added at the __application-level__, or __router-level__
  - __Application-level middleware__ can run on each incoming HTTP request - they are added using `app.use()` where `app` is the Application object. Common use-cases of application-level middleware are for serving static assets (HTML, CSS, JS files etc.), parsing request body, cookies on the incoming request, handling errors, that occur when processing requests, in a centralized fashion etc.
  - __Router-level middleware__ is set up on a router, and can run when a route matches the router's route. A common use-case of router-level middleware is to protect API endpoints that are available for authenticated / authorized users.
- Add HTTP request body parsing capability to the app using _body parser_ __midddleware__ configured for parsing JSON formatted data. In `src/app.ts`. Note that the middleware functions execute one after the other in the order they are added when application starts up. __The body parser middleware MUST be added before the request reach the routers__. Else the request body will not be available to the router (in IncomingMessage `body` property i.e. in `req.body`)
```ts
const app = express();

// configure application to read JSON data in incoming requests and set it up on req.body
app.use( express.json() );
```
- __NOTE__: In order to be able to read form data (i.e. with `Content-Type: application/x-www-form-urlencoded`), you will need to add this as well - `app.use( express.urlencoded() );`. We do not need to handle form submission as we are building an API server, and not accepting inputs through an HTML form submission from the browser.
- Modify the `POST /workshops` route handler to add the incoming workshop with a unique id. In `src/routes/workshops.route.ts` make these changes - note the use of `res.status()` to set the status code - this is a method added by Express to the `ServerResponse` object of Node JS.
```js
let nextId = 13;
```
```js
router.post( '/workshops', ( req, res ) => {
    const newWorkshop = req.body;
    
    newWorkshop.id = nextId;
    ++nextId;
    workshops.push( newWorkshop );
    
    res.status( 201 ).send( newWorkshop );
});
```
- Make the POST request from Postman again. This time pass a new workshop data like so (choose __Body__ -> __Raw__ -> __JSON__).
```json
{
    "name": "jQuery",
    "category": "frontend",
    "description": "jQuery is a JavaScript library",
    "startDate": "2020-03-01T04:00:00.000Z",
    "endDate": "2020-03-03T08:00:00.000Z",
    "startTime": {
        "hours": 9,
        "minutes": 30
    },
    "endTime": {
        "hours": 13,
        "minutes": 30
    },
    "speakers": [
        "John Doe",
        "Jane Doe"
    ],
    "location": {
        "address": "Tata Elxsi, Prestige Shantiniketan",
        "city": "Bangalore",
        "state": "Karnataka"
    },
    "modes": {
        "inPerson": true,
        "online": false
    },
    "imageUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/JQuery_logo.svg/524px-JQuery_logo.svg.png"
}
```
- You should see the new workshop details sent back - it will have the __"id"__ as well. Check `GET http://localhost:3000` as well - the list should have the new workshop.

## Step 7: Mounting the router on a different path - Refactoring routes
- We can pass a route as the first argument to `app.use()` - just the way we can for `router.*` methods. This is used to mount the router on the path - i.e. the router will be invoked only on path that match the router passed to `app.use()`. The path passed to the router is appended to this path, and the router middleware (function(s) passed to `router.*()`) are invoked only on the appended path.
- In `src/app.ts`,
```js
app.use( indexRouter );
app.use( '/api/workshops', workshopsRouter );
```
- In `src/routes/workshops.route.ts`,
```js
router.get( '/', ( req, res ) => {
    res.json( workshops );
});

router.post( '/', ( req, res ) => {
    const newWorkshop = req.body;

    newWorkshop.id = nextId;
    ++nextId;
    workshops.push( newWorkshop );

    res.status( 201 ).send( newWorkshop );
});
```
- In fact you can set up the routing using the common route '/' using `router.route()` as well
```js
router.route('/')
  .get((req, res) => {
    res.json(workshops);
  })
  .post((req, res) => {
    const newWorkshop = req.body;

    newWorkshop.id = ++nextId;
    workshops.push(newWorkshop);

    res.status(201).json(newWorkshop);
  });
```
- Check that the GET and POST requests for workshops resource is now on `http://localhost:3000/api/workshops`

## Step 8: Validating using Joi, Adding an error response, and sending structured responses
- Let us first send responses in a more structured way. In `src/routes/workshops.route.ts`
```js
router.route('/')
  .get((req, res) => {
    res.json({
      status: 'success',
      data: workshops
    });
  })
  .post((req, res) => {
    const newWorkshop = req.body;

    newWorkshop.id = ++nextId;
    workshops.push(newWorkshop);

    res.status(201).json({
      status: 'success',
      data: newWorkshop
    });
  });
```
- Next, we validate the incoming workshop details in the POST request, and send appropriate error responses on errors. First install `joi`. Then add the following. Note that `abortEarly: false` makes Joi return all errors, not just the first. By default, Joi will perform type coercion — which means for eg. it converts numbers to strings when validating `Joi.string()` unless you explicitly tell it not to by setting `convert: false`.
```bash
npm i joi
```
- Now make the following changes
```ts
import Joi from 'joi';
```
```ts
// set up the Joi schema for validation
const timeSchema = Joi.object({
    hours: Joi.number().integer().min(0).max(23).required(),
    minutes: Joi.number().integer().min(0).max(59).required()
});

const workshopSchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string()
        .valid("frontend", "backend", "database", "devops", "language", "mobile")
        .required(),
    description: Joi.string().max(1024).required(),
    startDate: Joi.string().isoDate().required(),
    endDate: Joi.string().isoDate().required(),
    startTime: timeSchema.required(),
    endTime: timeSchema.required(),
    speakers: Joi.array().items(Joi.string()).min(1).required(),
    location: Joi.object({
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required()
    }).required(),
    modes: Joi.object({
        inPerson: Joi.boolean().required(),
        online: Joi.boolean().required()
    }).required(),
    imageUrl: Joi.string().uri().required()
});
```
```js
.post((req, res) => {
    const newWorkshop = req.body;

    // Check if body is sent and not empty
    if (!newWorkshop || Object.keys(newWorkshop).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'The request body is empty. Workshop object expected.'
      });
    }

    // Validate using Joi
    const { error, value } = workshopSchema.validate(newWorkshop, {
      abortEarly: false,
      convert: false
    });

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        details: error.details.map(err => err.message)
      });
    }

    newWorkshop.id = nextId++;
    workshops.push(newWorkshop);

    res.status(201).json({
      status: 'success',
      data: newWorkshop
    });
});
```

## Step 9: Understanding middleware, and defining and setting up custom middleware, global error-handling middleware
- Let us understand middleware better - we add a middleware to log the date and time of an incoming HTTP request, and the time taken to process the request (`time_of_sending_response` `-` `time_of_receiving_request`). This is set up as the first application-level middleware in the __middleware chain__ (series of middleware which are added using `app.use()`).
- The `next` method is called in order to pass control to the next middleware in the chain. A middleware either calls `next` to pass on control this way, or send out a response. Once a response is sent out, no middleware following it is invoked. Instead the code after the call to `next` in all preceding middleware in the chain are executed in reverse order now. This explains how the middleware below captures the time taken to process an incoming request.
- In `src/app.ts`
```ts
const app = express();

app.use(( req, res, next ) => {
    console.log( 'middleware 1 called' );
    const requestDate = new Date();
    
    next(); // now Express knows we are done processing the request
    
    console.log( 'middleware 1 after call to next' );
    const responseDate = new Date();

    console.log( 'Time for processing (in ms) = ', responseDate.getTime() - requestDate.getTime() );
});

// existing code...
app.use( express.json() );
```
- __EXERCISE__: Try setting up another middleware after the above one, and check the order of execution. See what happens if you do not call `next()`.
- Add the following middleware as the final ones in the middleware chain in `src/app.ts`. They are invoked only if none of the routers handled the requests (i.e. for routes not serving any of the app's resources). They are thus used to handle errors (resource / page not found).
```js
// resource not found middleware
app.use(( req, res, next ) => {
    const err = new Error( 'Resource not found' );
    err.status = 404;
    next( err );
});

// global error handler middleware
app.use(( err, req, res, next ) => { // a middleware with 4 arguments is an "Error handler middleware"
    const status = err.status || 500;
    res.status( status ).json({
        status: 'error',
        message: err.message
    });
    // next(); // not a good idea to call next when a response is also sent
});

const PORT = process.env.PORT || 3000;

app.listen( PORT );
```
- __NOTE__: The last middleware is a special one referred to as the __global error handler middleware__ - note that it receives 4 arguments. It is invoked directly when any error is thrown in the router middleware - we see this next.
- We can now throw errors from `app/routes/workshops.route.ts` which are caught by the global error handler. This was error responses are sent from the global error handler, ensuring uniform structure of response on errors.
```js
.post((req, res) => {
    const newWorkshop = req.body;

    // Check if body is sent and not empty
    if (!newWorkshop || Object.keys(newWorkshop).length === 0) {
      const err = new Error('The request body is empty. Workshop object expected.');
      err.status = 400;
      throw err;
    }

    // Validate using Joi
    const { error, value } = workshopSchema.validate(newWorkshop, {
      abortEarly: false,
      convert: false
    });

    if (error) {
      const err = new Error(error.details.map(d => d.message));
      err.status = 400;
      throw err;
    }

    // Add and return the new workshop
    newWorkshop.id = nextId++;
    workshops.push(newWorkshop);

    res.status(201).json({
      status: 'success',
      data: newWorkshop
    });
```
- __NOTE__: In early versions of Express, throwing errors from the router middleware was not the way to pass on control to the global error handler. Instead you needed to call `next( err );`
- Note that you can replace the call to next in the resource not found middleware as well. In `src/app.ts`
```js
// resource not found middleware
app.use(( req, res ) => {
    const err = new Error( 'Resource not found' );
    err.status = 404;
    throw err;
});
```
- For structuring the application better, let us move the middleware to `src/middleware` folder.
- In `src/middleware/logger.ts`
```ts
import { NextFunction, Request, Response } from 'express';

const logger = ( req : Request, res : Response, next : NextFunction ) => {
    console.log( 'middleware 1 called' );
    const requestDate = new Date();
    
    next(); // now Express knows we are done processing the request
    
    console.log( 'middleware 1 after call to next' );
    const responseDate = new Date();

    console.log( 'Time for processing (in ms) = ', responseDate.getTime() - requestDate.getTime() );
};

export default logger;
```
- Define a custom `ErrorWithStatus` object which adds `type` and `status` properties to the standard `Error` object. In `src/models/util.ts` add this. We also set up a `Controller` type which we shall use soon.
```ts
import { NextFunction, Request, Response } from 'express';

export type ErrorWithStatus = Error & {
    status?: number;
    code?: number;
    type?: string;
};

export type Controller = (req: Request, res: Response, next?: NextFunction) => void;
```
- In `src/middleware/errors.ts`
```ts
import { Controller, ErrorWithStatus } from '../models/utils';
```
```ts
// resource not found middleware
export const notFoundHandler: Controller = (req, res, next) => {
    const err = new Error( 'Resource not found' );
    err.status = 404;
    throw err;
};

// global error handler middleware
const errorHandler = ( err : ErrorWithStatus, req : Request, res : Response, next : NextFunction ) => { // a middleware with 4 arguments is an "Error handler middleware"
    const status = err.status || 500;
    res.status( status ).json({
        status: 'error',
        message: err.message
    });
    // next(); // not a good idea to call next when a response is also sent
};

export {
  notFoundHandler,
  errorHandler
};
```
- Import and set these up as middleware in `src/app.ts`
```ts
import logger = from './middleware/logger';
import { notFoundHandler, errorHandler } from './middleware/errors';
```
```ts
// change this...
app.use( logger );

// rest of code...
// ...

// change this...
app.use( notFoundHandler );
app.use( errorHandler );

const PORT = process.env.PORT || 3000;

app.listen( PORT );
```
- Finally we set up the popular HTTP request logging middleware - __Morgan__. Firstly, install morgan
```bash
npm i morgan
```
- Set it up as the first middleware - you may comment out our custom logger now. In `src/app.ts`
```ts
import morgan from 'morgan';
```
```ts
app.use( morgan( 'combined' ) ); // Passing 'combined' enables Apache HTTP server style request logs
// app.use( 'logger' );
```
- When requests are received, you will find logs in this format
```
::1 - - [13/Jul/2025:06:37:46 +0000] "GET / HTTP/1.1" 200 - "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"
```

## Step 10: Refactoring to create controllers
- We refactor the app such that the route files set up the routing logic only. The actual request handling is done by controllers. Create `src/controllers/index.controller.ts`
```ts
import { Controller } from '../models/utils';

const getIndex : Controller = ( req, res ) => {
    res.end( 'This is the workshops app. It serves details of workshops happening nearby.' );
};

const getHome : Controller= ( req, res ) => {
    res.redirect( '/' );
};

export {
    getIndex,
    getHome
};
```
- Now in `src/routes/index.route.ts`
```js
import express from 'express';
import * as Controller from '../controllers/index.controller';

const router = express.Router();

router.get('/', controllers.getIndex);
router.get('/home', controllers.getHome);

export default router;
```
- Similarly create `src/controllers/workshops.controller.ts`
```ts
import { Request, Response } from 'express';
import { Controller, ErrorWithStatus } from '../models/utils';

import Joi from 'joi';
import workshops from '../data/workshops.json';

const timeSchema = Joi.object({
    hours: Joi.number().integer().min(0).max(23).required(),
    minutes: Joi.number().integer().min(0).max(59).required()
});

const workshopSchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string()
        .valid("frontend", "backend", "database", "devops", "language", "mobile")
        .required(),
    description: Joi.string().max(1024).required(),
    startDate: Joi.string().isoDate().required(),
    endDate: Joi.string().isoDate().required(),
    startTime: timeSchema.required(),
    endTime: timeSchema.required(),
    speakers: Joi.array().items(Joi.string()).min(1).required(),
    location: Joi.object({
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required()
    }).required(),
    modes: Joi.object({
        inPerson: Joi.boolean().required(),
        online: Joi.boolean().required()
    }).required(),
    imageUrl: Joi.string().uri().required()
});

let nextId = 13;

const getWorkshops : Controller = (req, res) => {
    res.json({
        status: 'success',
        data: workshops
    });
};

const postWorkshop : Controller = (req, res) => {
    const newWorkshop = req.body;

    // Check if body is sent and not empty
    if (!newWorkshop || Object.keys(newWorkshop).length === 0) {
        const err = new Error('The request body is empty. Workshop object expected.') as ErrorWithStatus;
        err.status = 400;
        throw err;
    }

    // Validate using Joi
    const { error, value } = workshopSchema.validate(newWorkshop, {
        abortEarly: false,
        convert: false
    });

    if (error) {
        const err = new Error(error.details.map(d => d.message)) as ErrorWithStatus;
        err.status = 400;
        throw err;
    }

    // Add and return the new workshop
    newWorkshop.id = nextId++;
    workshops.push(newWorkshop);

    res.status(201).json({
        status: 'success',
        data: newWorkshop
    });
};

export {
    getWorkshops,
    postWorkshop
};
```
- In `src/routes/workshops.route.ts`
```js
import express from 'express';
import * as Controller from '../controllers/workshops.controller';

const router = express.Router();

router.route('/')
    .get( controllers.getWorkshops )
    .post( controllers.postWorkshop );

export default router;
```

## Step 11: Connecting to a PostgreSQL database
* Make sure __Postgres DB server__ is running, then open __pgAdmin 4__, and create a database called `workshopsdb`. Only the database is to be created manually like so. The __tables shall be created using migrations__.

* We connect to a PostgreSQL database hosted on a managed service such as **Neon**, **Supabase**, **Railway**, or any local PostgreSQL installation. To interact with PostgreSQL, we *could* use the official [`pg`](https://www.npmjs.com/package/pg) driver for Node.js, but it is low-level. Instead, we will use **Sequelize**, an ORM that simplifies model creation, schema validation, associations, and provides lifecycle hooks similar to what we previously did with Mongoose. Install Sequelize along with the PostgreSQL driver:

```bash
npm i sequelize pg
```

* Update the `.env` file with the PostgreSQL connection URL. Get the `db_password` from the instructor (for a shared cloud DB). For a local Postgres server use this connection string with `your-postgres-host` substituted with `localhost` (with `db_username` and `db_password` substituted with actual values).

```
DB_CONNECTION_STRING=postgres://db_username:db_password@your-postgres-host/workshopsdb
```

* Create an `src/data/init.ts` file. In it:

```ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let connectionStr;

if (process.env.DB_CONNECTION_STRING) {
    connectionStr = process.env.DB_CONNECTION_STRING;
} else {
    console.log('DB connection string not found in environment');
    process.exit(1);
}

// Create a Sequelize instance to manage the PostgreSQL connection
export const sequelize = new Sequelize(connectionStr, {
    logging: false, // disable SQL logging (optional)
});

const connect = async () => {
    try {
        await sequelize.authenticate();
        console.log('connected to the db');

        // Optional: sync models later when they are defined
        // await sequelize.sync();
    } catch (error: any) {
        console.log('unable to connect to the db : ' + error.message);
        process.exit(1);
    }
};

connect();
```

* Set up the DB connection by invoking this file at startup in `src/app.ts` at the very top.

```ts
import './data/init';
```

* You should get the **connected to the db** message when you restart the app.

## Step 12: Define Workshops Model

* Define interfaces related to the workshop model. These define the shape of a Workshop record in the `workshops` table that is part of the app. In `src/models/IWorkshop.ts`:

```ts
interface ITime {
    hours: number;
    minutes: number;
}

interface ILocation {
    address: string;
    city: string;
    state: string;
}

interface IModes {
    inPerson: boolean;
    online: boolean;
}

interface IWorkshop {
    id: number; // primary key in PostgreSQL
    name: string;
    category: 'frontend' | 'backend' | 'database' | 'devops' | 'language' | 'mobile';
    description: string;
    startDate: Date;
    endDate: Date;
    startTime: ITime;
    endTime: ITime;
    location: ILocation;
    modes: IModes;
    imageUrl: string;
    speakers: string[];
}

export { IWorkshop as default, ITime, ILocation, IModes };
```

* Sequelize lets you define a **model** for a resource. A model represents a table in the database, and instances of the model represent rows in that table. The model definition describes the columns, their types, validations, and constraints. Once defined, the model class is used throughout the application (for example, in the services layer) to perform queries such as finding all workshops, creating a workshop, updating a workshop, etc.

* For this application, `startTime`, `endTime`, `location`, and `modes` are structured objects that logically belong to a workshop, and there is a one-to-one relationship between a workshop and each of these objects. Instead of creating separate tables for them, we will store them as JSON in the `workshops` table using PostgreSQL’s `JSONB` type. We will still use the `ITime`, `ILocation`, and `IModes` TypeScript interfaces, but they will not correspond to separate database tables.

* In your project root, create a file named `.sequelizerc` with this content (Note that the configuration file content is JavaScript, not TypeScript - it uses Common JS module system).
```js
const path = require('path');

module.exports = {
  config: path.resolve('src/data/config', 'config.json'),
  'models-path': path.resolve('src/data/models'),
  'seeders-path': path.resolve('src/data/seeders'),
  'migrations-path': path.resolve('src/data/migrations')
};
```

- Also create `src/data/config`, `src/data/migrations`, `src/data/models` and `src/data/seeders` folders.

- This file tells `sequelize-cli` exactly **where to output**:

* models
* migrations
* seeders
* config

* Create `src/data/config/config.json`. The Sequelize CLI uses this file (NOT `.env`) for database credentials during migrations. Make sure to substitute actual values for __db_username__ and __db_password__.
```json
{
  "development": {
    "username": "db_username",
    "password": "db_password",
    "database": "workshopsdb",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```
__NOTE__: If you want, you can rewrite this to use `.env` instead — that's very common.

### Step 12.2: Create the model
- Define the model in `src/data/models/Workshop.ts`

```ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../init';
import IWorkshop, { ITime, ILocation, IModes } from '../../models/IWorkshop';
import Session from './Session';

// Describe the attributes for creation (id is auto-generated)
type WorkshopCreationAttributes = Optional<IWorkshop, 'id'>;

class Workshop
  extends Model<IWorkshop, WorkshopCreationAttributes>
  implements IWorkshop
{
  public id!: number;
  public name!: string;
  public category!: IWorkshop['category'];
  public description!: string;
  public startDate!: Date;
  public endDate!: Date;
  public startTime!: ITime;
  public endTime!: ITime;
  public location!: ILocation;
  public modes!: IModes;
  public imageUrl!: string;
  public speakers!: string[];

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * In PostgreSQL with Sequelize, we still store related information together
 * inside a single table row when it makes sense.
 * For example, we store nested objects like time, location, and modes as JSONB columns,
 * and speakers as a text array, while keeping the main Workshop in the "workshops" table.
 */

// --- Helper validators (kept in this file to avoid repetition) ---
const validateTime = (fieldName: 'startTime' | 'endTime', value: unknown) => {
  if (typeof value !== 'object' || value === null) {
    throw new Error(`${fieldName} must be an object`);
  }

  const v = value as Partial<ITime>;

  if (!Number.isInteger(v.hours) || (v.hours as number) < 0 || (v.hours as number) > 23) {
    throw new Error(`${fieldName}.hours must be an integer between 0 and 23`);
  }

  if (!Number.isInteger(v.minutes) || (v.minutes as number) < 0 || (v.minutes as number) > 59) {
    throw new Error(`${fieldName}.minutes must be an integer between 0 and 59`);
  }
};

const validateLocation = (value: unknown) => {
  if (typeof value !== 'object' || value === null) {
    throw new Error('location must be an object');
  }

  const v = value as Partial<ILocation>;

  if (typeof v.address !== 'string' || v.address.trim().length === 0) {
    throw new Error('location.address must be a non-empty string');
  }

  if (typeof v.city !== 'string' || v.city.trim().length === 0) {
    throw new Error('location.city must be a non-empty string');
  }

  if (typeof v.state !== 'string' || v.state.trim().length === 0) {
    throw new Error('location.state must be a non-empty string');
  }
};

const validateModes = (value: unknown) => {
  if (typeof value !== 'object' || value === null) {
    throw new Error('modes must be an object');
  }

  const v = value as Partial<IModes>;

  if (typeof v.inPerson !== 'boolean') {
    throw new Error('modes.inPerson must be a boolean');
  }

  if (typeof v.online !== 'boolean') {
    throw new Error('modes.online must be a boolean');
  }
};

Workshop.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isString(value: unknown) {
          if (typeof value !== 'string') {
            throw new Error('Value must be a string');
          }
        },
      },
    },
    category: {
      type: DataTypes.ENUM(
        'frontend',
        'backend',
        'database',
        'devops',
        'language',
        'mobile'
      ),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    startTime: {
      type: DataTypes.JSONB, // stores ITime as JSON
      allowNull: false,
      validate: {
        isValidTime(value: unknown) {
          validateTime('startTime', value);
        },
      },
    },

    endTime: {
      type: DataTypes.JSONB, // stores ITime as JSON
      allowNull: false,
      validate: {
        isValidTime(value: unknown) {
          validateTime('endTime', value);
        },
      },
    },

    location: {
      type: DataTypes.JSONB, // stores ILocation as JSON
      allowNull: false,
      validate: {
        isValidLocation(value: unknown) {
          validateLocation(value);
        },
      },
    },

    modes: {
      type: DataTypes.JSONB, // stores IModes as JSON
      allowNull: false,
      validate: {
        isValidModes(value: unknown) {
          validateModes(value);
        },
      },
    },

    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    speakers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'workshops',
    modelName: 'Workshop',
  }
);

export default Workshop;
```

---

* __Aside__: You can use the Sequelize CLI to generate both the Workshop model and its migration in one step. How ever Sequelize has some limitations based on the data types that can be specified in the CLI. So we shall create the model and migration files ourselves.

For an example of how to generate model and migration files using the CLI, run

```bash
npx sequelize-cli model:generate --name Workshop --attributes name:string,category:enum:{frontend,backend,database,devops,language,mobile},description:string,startDate:date,endDate:date,startTime:jsonb,endTime:jsonb,location:jsonb,modes:jsonb,imageUrl:string,speakers:array:string
```

This command does two things:

1. Creates a **model file** for `Workshop` under the models folder configured for Sequelize (for example, `src/data/models/workshop.ts`).
2. Creates a **migration file** that defines how to create (and drop) the `workshops` table in the database.

---

### Step 12.3: Generate migration for `Workshop` model (PostgreSQL + Sequelize)

* Now that the `Workshop` Sequelize model is defined with proper validations and JSONB fields, we need to create a **migration** that creates the corresponding `workshops` table in PostgreSQL.
* In Sequelize, **migrations are the source of truth for the database schema**. Models describe how the application interacts with data, while migrations describe how tables are created and modified over time.

---

### 1. Generate a migration skeleton

* Use `sequelize-cli` to generate an empty migration file.
* This gives us a correctly named migration with `up` and `down` functions.

```bash
npx sequelize-cli migration:generate --name create-workshops
```

* This command creates a new file under the migrations folder (for example):

```
src/data/migrations/20251217094500-create-workshops.js
```

---

### 2. Define the `workshops` table structure

* Open the generated migration file and update the `up` and `down` functions as shown below.
* Ensure the table name is **all lowercase** (`workshops`), as PostgreSQL treats unquoted identifiers as lowercase by default.

```js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workshops', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      category: {
        type: Sequelize.ENUM(
          'frontend',
          'backend',
          'database',
          'devops',
          'language',
          'mobile'
        ),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },

      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },

      startTime: {
        type: Sequelize.JSONB,
        allowNull: false,
      },

      endTime: {
        type: Sequelize.JSONB,
        allowNull: false,
      },

      location: {
        type: Sequelize.JSONB,
        allowNull: false,
      },

      modes: {
        type: Sequelize.JSONB,
        allowNull: false,
      },

      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      speakers: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('workshops');

    // IMPORTANT: ENUM types must be removed explicitly in PostgreSQL
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_workshops_category";'
    );
  },
};
```

---

### 3. Why we write migrations manually

* `sequelize-cli` **cannot generate migrations from models**.
* This separation is intentional:

  * Models → application-level representation
  * Migrations → database-level schema history
* Writing migrations explicitly ensures:

  * Precise control over column types (JSONB, ARRAY, ENUM)
  * Predictable schema evolution
  * Safe rollbacks

> ⚠️ Using `sequelize.sync()` instead of migrations is **not recommended** for production or training scenarios, as it hides schema changes and breaks repeatability.

---

### 4. Run the migration

* Apply the migration to create the `workshops` table:

```bash
npx sequelize-cli db:migrate
```

* You should see output similar to:

```
== create-workshops-table: migrating =======
== create-workshops-table: migrated (0.123s)
```

- Better still create a script that captures this in `package.json`. Now you don't need to remember the migration command!
```json
{
    "scripts": {
        // existing scripts...

        // add this...
        "db:migrate": "npx sequelize-cli db:migrate",
    }
}
```

---

### 5. Verify in PostgreSQL

* Using **pgAdmin** or `psql`, verify that:

  * Table name is `workshops`
  * Columns like `startTime`, `endTime`, `location`, and `modes` are of type `jsonb`
  * `speakers` is a `text[]` column
  * `category` is an ENUM with correct values

---

### Summary

* The `Workshop` model defines **runtime behavior and validation**
* The migration defines the **database schema**
* Both must stay aligned, but migrations remain the authoritative source for table creation and evolution


---

- __Note__: One team member may create a new table and push the code to the project repo. So, what should another team member do to sync up the changes in the DB? They should **pull the latest code and run migrations**.

### What the other team member does (standard workflow)

1. **Pull latest changes**

```bash
git pull
```

2. **Install deps (only if package.json changed)**

```bash
npm i
```

3. **Run migrations on their local DB**

```bash
npx sequelize-cli db:migrate
```

That’s it—Sequelize uses the `SequelizeMeta` table to track which migrations have already been applied, so it will run **only the new ones**.

### If they want to confirm what ran

```bash
npx sequelize-cli db:migrate:status
```

### Important note

Migrations can create/alter tables, **but they will not create the database itself** (`workshopsdb`). Each team member must create the database once (pgAdmin/createdb), then migrations can build the schema inside it.

---

### Step 12.5: Register the model so it is defined when the app starts

* Import the model definition so that it is registered when the app starts. In `src/data/init.ts`, add the following import after the Sequelize instance is created - you can safely add it at the end of the file.

```ts
// rest of code...
// ...

// register models
import './models/Workshop';
```

> The import ensures the `Workshop` model is registered with Sequelize and ready to be used in the services layer. The actual `Workshops` table is created when you run the migration command (`npx sequelize-cli db:migrate`), not when you import the model.

---

## Step 12.6: Seed workshops data using `npm run start:seed` (preserving Workshop IDs)
* Copy `workshops.json` from supplied files to `src/data/seed/workshops.json`
* During development, it is useful to start the app with some initial data already inserted into the database. We will add a seed script that reads a JSON file and inserts the records into the `workshops` table. In our seed data, each workshop already has an `id`. We will preserve these ids so that later when we seed sessions, the session records can refer to the correct workshop using `workshopId` as a foreign key.
* Since inserting data requires the table to exist, we will ensure migrations run before seeding.

* Create `src/data/seed/seed-workshops.ts`

```ts
import fs from 'fs';
import path from 'path';
import Workshop from '../models/Workshop';
import { sequelize } from '../init';

type WorkshopSeed = {
    id: number;
    name: string;
    category: 'frontend' | 'backend' | 'database' | 'devops' | 'language' | 'mobile';
    description: string;
    startDate: string | Date;
    endDate: string | Date;
    startTime: { hours: number; minutes: number };
    endTime: { hours: number; minutes: number };
    location: { address: string; city: string; state: string };
    modes: { inPerson: boolean; online: boolean };
    imageUrl: string;
    speakers: string[];
};

const seedWorkshops = async () => {
    try {
        await sequelize.authenticate();

        // IMPORTANT:
        // This seed script runs from dist/, so ensure workshops.json is present in dist/data as well.
        const filePath = path.join(__dirname, 'workshops.json');
        const raw = fs.readFileSync(filePath, 'utf-8');
        const workshops: WorkshopSeed[] = JSON.parse(raw);

        // Upsert each workshop using the given id (primary key).
        // This allows re-running the seed without creating duplicates.
        for (const w of workshops) {
            await Workshop.upsert({
                ...w,
                startDate: new Date(w.startDate),
                endDate: new Date(w.endDate),
            } as any);
        }

        // IMPORTANT (Postgres):
        // After inserting rows with explicit ids, the id sequence may still be at 1.
        // This can cause future inserts to fail with duplicate key errors.
        // So we move the sequence to MAX(id).
        await sequelize.query(`
            SELECT setval(
                pg_get_serial_sequence('workshops', 'id'),
                COALESCE((SELECT MAX(id) FROM workshops), 1)
            );
        `);

        console.log(`Seed completed: ${workshops.length} workshop(s) processed.`);
        process.exit(0);
    } catch (error: any) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    }
};

seedWorkshops();
```

* __NOTE__: **After inserting explicit ids**, we have made sure to update the auto-increment sequence so future inserts don’t fail with “duplicate key”.

* Install cpx as a development dependency. This is a cross-platform compatible tool to copy files - we use it to copy non-TS assets (like `workshops.json` in this case).

* Update `package.json` scripts

* Add scripts so that `npm run start:seed` first compiles TypeScript, runs migrations, then runs the workshop seed script, and finally starts the server. Also make sure to update the build script.

```json
{
  "scripts": {
    "build": "cpx \"src/data/seed/workshops.json\" dist/data/seed && tsc",
    "build:watch": "cpx \"src/data/seed/workshops.json\" dist/data/seed && tsc --watch",
    "start": "nodemon",
    "db:migrate": "npx sequelize-cli db:migrate",
    "db:seed:workshops": "node dist/data/seed/seed-workshops.js",
    "start:seed": "npm run build && npm run db:migrate && npm run db:seed:workshops && npm start"
  }
}
```

Now when you run:

```bash
npm run start:seed
```

* migrations are applied (so the `workshops` table exists),
* workshops are seeded **with the ids from JSON**,
* the Postgres sequence is aligned to `MAX(id)` so future inserts work,
* and the app starts.

* Note for the upcoming Sessions seed step

When you seed sessions later, you can safely reference:

```json
{ "workshopId": 1, ... }
```

because workshop `id=1` is guaranteed to exist and remain stable.

## Step 13: Define Workshop Service and use the PostgreSQL database

* We shall create methods to get workshops, create a new workshop etc. This logic may be used in various places repeatedly. Hence we define these in a separate *Services* layer. Services in general refer to any logic shared across the application.

* Define the following custom Error object if not already done so in `src/models/utils.ts`:

```ts
import { NextFunction, Request, Response } from 'express';

export type ErrorWithStatus = Error & {
    status?: number;
    code?: number;
    type?: string;
};

export type Controller = (req: Request, res: Response, next?: NextFunction) => void;
```

* In `src/services/workshops.service.ts`, define the methods to get all workshops and create a new workshop:

```ts
import Workshop from '../data/models/Workshop';
import IWorkshop from '../models/IWorkshop';
import { ErrorWithStatus } from '../models/utils';
import { ValidationError, UniqueConstraintError } from 'sequelize';

const getAllWorkshops = async () => {
    const workshops = await Workshop.findAll();
    return workshops;
};

const addWorkshop = async (workshop: Omit<IWorkshop, 'id'>) => {
    try {
        const insertedWorkshop = await Workshop.create(workshop);
        return insertedWorkshop;
    } catch (err) {
        const error = err as ErrorWithStatus;

        if (err instanceof UniqueConstraintError) {
            error.type = 'ValidationError';
            error.status = 400;
        }

        if (err instanceof ValidationError) {
            error.type = 'ValidationError';
            error.status = 400;
        }

        throw error;
    }
};

export {
    getAllWorkshops,
    addWorkshop,
};
```

* Modify the workshops controller to make use of the database. You don't need Joi for validation now as Sequelize does that for you based on the model definition. In `src/controllers/workshops.controller.ts`:

```ts
import { Controller, ErrorWithStatus } from '../models/utils';
import * as Service from '../services/workshops.service';

// http://localhost:3000/api/workshops
// http://localhost:3000/api/workshops?page=1&sort=name&category=frontend
// http://localhost:3000/api/workshops?sort=name&category=frontend
const getWorkshops: Controller = async (req, res) => {
    const workshops = await Service.getAllWorkshops();

    res.json({
        status: 'success',
        data: workshops,
    });
};

const postWorkshop: Controller = async (req, res) => {
    const newWorkshop = req.body;

    // Check if body is sent and not empty
    if (!newWorkshop || Object.keys(newWorkshop).length === 0) {
        const err = new Error(
            'The request body is empty. Workshop object expected.'
        ) as ErrorWithStatus;
        err.status = 400;
        throw err;
    }

    try {
        const createdWorkshop = await Service.addWorkshop(newWorkshop);
        res.status(201).json({
            status: 'success',
            data: createdWorkshop,
        });
    } catch (error) {
        const err = error as ErrorWithStatus;
        // default to 400 for validation-related errors if not already set
        if (!err.status) {
            err.status = 400;
        }
        throw err;
    }
};

export {
    getWorkshops,
    postWorkshop,
};
```

* Check if field validations defined in the Sequelize `Workshop` model are working fine (for example, required fields, maximum length for description, unique constraint on `name`, etc.). We have disabled type-casting for `name` (for example, rejecting a numeric value passed as `name` instead of silently accepting it). Check it out as well.

* Make a request to add a workshop by its id. Sample request

```
POST localhost:3000/api/workshops/1

{
    "name": "jQuery",
    "category": "frontend",
    "description": "jQuery is a JavaScript library",
    "startDate": "2020-03-01T04:00:00.000Z",
    "endDate": "2020-03-03T08:00:00.000Z",
    "startTime": {
        "hours": 9,
        "minutes": 30
    },
    "endTime": {
        "hours": 13,
        "minutes": 30
    },
    "speakers": [
        "John Doe",
        "Jane Doe"
    ],
    "location": {
        "address": "Tata Elxsi, Prestige Shantiniketan",
        "city": "Bangalore",
        "state": "Karnataka"
    },
    "modes": {
        "inPerson": true,
        "online": false
    },
    "imageUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/JQuery_logo.svg/524px-JQuery_logo.svg.png"
}
```

* Restart the app and check now – you should not be able to add `name` as a number (for example). Any such request will fail validation in Sequelize, and the error will be handled and propagated by the service and controller as shown above.

## Step 14: Set up centralized error handling

* Instead of duplicating error checks in the services, we can have the errors thrown by the services fall through the controller and be passed on to the error handler middleware. The error handler middleware can handle the errors and set appropriate error type and status code for the response. This way we can keep the error handling logic DRY, and remove the need for writing error-specific logic in the services and the controllers.

* Remove error handling from the service `src/services/workshops.service.ts`:

```ts
import Workshop from '../data/models/workshop';
import IWorkshop from '../models/IWorkshop';

const getAllWorkshops = async () => {
    const workshops = await Workshop.findAll();
    return workshops;
};

const addWorkshop = async (workshop: Omit<IWorkshop, 'id'>) => {
    const insertedWorkshop = await Workshop.create(workshop);
    return insertedWorkshop;
};

export {
    getAllWorkshops,
    addWorkshop,
};
```

* Remove the error-handling for error thrown by the service in the controller `src/controllers/workshops.controller.ts`:

```ts
import { Controller, ErrorWithStatus } from '../models/utils';
import * as Service from '../services/workshops.service';

// http://localhost:3000/api/workshops
// http://localhost:3000/api/workshops?page=1&sort=name&category=frontend
// http://localhost:3000/api/workshops?sort=name&category=frontend
const getWorkshops: Controller = async (req, res) => {
    const workshops = await Service.getAllWorkshops();

    res.json({
        status: 'success',
        data: workshops,
    });
};

const postWorkshop: Controller = async (req, res) => {
    const newWorkshop = req.body;

    // Check if body is sent and not empty
    if (!newWorkshop || Object.keys(newWorkshop).length === 0) {
        const err = new Error(
            'The request body is empty. Workshop object expected.'
        ) as ErrorWithStatus;
        err.status = 400;
        throw err;
    }

    // Remove the try..catch block here...
    const createdWorkshop = await Service.addWorkshop(newWorkshop);
    res.status(201).json({
        status: 'success',
        data: createdWorkshop,
    });
};

export {
    getWorkshops,
    postWorkshop,
};
```

* Add centralized error handling in `src/middleware/errors.ts`. The `enrichResponseError` checks for errors thrown by Sequelize and adds an appropriate `type` and `status` to the errors. The error handler middleware calls `enrichResponseError` to enrich the error with these properties.

```ts
import { NextFunction, Request, Response } from 'express';
import { ErrorWithStatus } from '../models/utils';

import {
    ValidationError,
    UniqueConstraintError,
    DatabaseError,
    ForeignKeyConstraintError,
} from 'sequelize';

// Utility to enrich error with type and status code
export const enrichResponseError = (error: ErrorWithStatus) => {
    // Unique constraint violation (e.g. unique index on name)
    if (error instanceof UniqueConstraintError) {
        error.type = 'DuplicateKeyError';
        error.status = 400;
    }

    // Sequelize ValidationError (model-level validation)
    if (error instanceof ValidationError) {
        error.type = 'ValidationError';
        error.status = 400;
    }

    // Foreign key constraint errors (for related tables, if any)
    if (error instanceof ForeignKeyConstraintError) {
        error.type = 'ForeignKeyConstraintError';
        error.status = 409; // conflict
    }

    // Low-level database errors (syntax errors, connectivity, etc.)
    if (error instanceof DatabaseError) {
        error.type = 'DatabaseError';
        error.status = 500;
    }

    // Fallback — unknown error
    error.type = error.type || 'InternalServerError';
    error.status = error.status || 500;

    return error;
};

export const resourceNotFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const err: ErrorWithStatus = new Error('Resource not found');
    err.status = 404;
    err.type = 'NotFound';

    // pass an error object to transfer control directly to the error handler middleware
    // (error handler middleware need not be the next one in the middleware chain)
    // next(err);

    throw err;
};

export const errorHandler = (
    err: ErrorWithStatus,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err = enrichResponseError(err);

    res.status(err.status || 500).json({
        status: 'error',
        type: err.type,
        message: err.message,
    });
};
```

* Since we are extending the standard `Error` type with additional properties (`status` and `type`), we already capture those in the `ErrorWithStatus` type defined earlier. Wherever we create an error manually, we can cast it using `as ErrorWithStatus`, and inside the error middleware we treat all errors as `ErrorWithStatus`.

* Add a Sequelize Error Type Augmentation File `src/types/sequelize/error.d.ts`. This makes TypeScript treat these error classes as having optional status and type fields, so your error handler can assign them without complaints.
```ts
import 'sequelize';

declare module 'sequelize' {
    interface ValidationError {
        status?: number;
        type?: string;
    }

    interface UniqueConstraintError {
        status?: number;
        type?: string;
    }

    interface DatabaseError {
        status?: number;
        type?: string;
    }

    interface ForeignKeyConstraintError {
        status?: number;
        type?: string;
    }
}
```

* Add this to `tsconfig.json` if needed. This ensures your types directory is included in `"compilerOptions"`.
```json
"types": ["node", "express"],
"typeRoots": ["./src/types", "./node_modules/@types"]
```

* Now the error-handling logic need not be repeated across the service or in the controller when calling service methods, resulting in DRY code: the service simply throws, the controller forwards (by not catching), and the centralized error middleware classifies the error and formats the HTTP response.

## Step 15: Adding sorting and pagination support

* We now support serving the list of workshops sorted by a user-supplied field, and also 10 records at a time. Additionally, the list API does not need to serve all fields to the client – hence we omit `description`, reducing the API response size. In Sequelize, we pass a **filter object** and other options (like sorting, pagination, and selected attributes) to the `findAndCountAll()` method, which returns both the filtered rows and the total count in a single call. In the service `src/services/workshops.service.ts`:

```ts
import { WhereOptions, OrderItem } from 'sequelize';
import Workshop from '../data/models/Workshop';
import IWorkshop from '../models/IWorkshop';

const getAllWorkshops = async (page: number, sortField: string = '', category = '') => {
    const limit = 10;
    const offset = limit * (page - 1);

    const where: WhereOptions = {};

    if (category) {
        where.category = category;
    }

    // Build the ORDER BY clause if sortField is provided
    let order: OrderItem[] | undefined = undefined;
    if (sortField) {
        order = [[sortField, 'ASC']];
    }

    const { rows: workshops, count } = await Workshop.findAndCountAll({
        where,
        // We can either blacklist or whitelist fields. Here we blacklist (i.e. omit certain fields)
        attributes: {
            exclude: ['description'],
        },
        limit,
        offset,
        order,
    });

    return {
        workshops,
        count,
    };
};
```

* In the controller `src/controllers/workshops.controller.ts` we add support for `page` and `sort` query string parameters.

```ts
// http://localhost:3000/api/workshops
// http://localhost:3000/api/workshops?page=1&sort=name&category=frontend
interface GetWorkshopsQuery {
    page?: string | number; // query strings are always string or undefined. But we shall type cast this property to a number.
    sort?: string;
    category?: string;
}

const getWorkshops: Controller = async (req, res) => {
    let { page, sort: sortField, category } = req.query as GetWorkshopsQuery;

    if (page) {
        page = +page;
    } else {
        page = 1;
    }

    const workshopsWithCount = await Service.getAllWorkshops(page, sortField || '', category || '');

    // send(), redirect(), json(), sendFile(), render() are other methods on response `res` object
    res.json({
        status: 'success',
        data: workshopsWithCount,
    });
};
```

* Some sample requests

```text
http://localhost:3000/api/workshops
http://localhost:3000/api/workshops?page=1&sort=name&category=frontend
```

* **NOTE**: Instead of asserting the type of `req.query` you can also set the generic type parameters of the Express `Request` object (`Request<ParamsDictionary = {}, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>`). Find out how – an example of this (although for request params, and not request query) is illustrated in the next step!

## Step 16: Support getting a single workshop by its id
* Define a ne error type in `src/models/utils.ts`
```ts
export class NotFoundError extends Error {
    status : number = 404;
    code: number = 404;
    type: string = 'NotFound';

    // This is the default constructor, and need not be provided if no other constructor exists
    constructor( message : string ) {
        super( message );
    }
}
```

* Sequelize provides the method `findByPk()` to retrieve a record by its primary key (here `id`). We use it to set up a service method to get a workshop by its `id` in `src/services/workshops.service.ts`
```ts
import { ErrorWithStatus, NotFoundError } from '../models/utils';
```
```ts
import { ErrorWithStatus } from '../models/utils';
import Workshop from '../data/models/Workshop';

const getWorkshopById = async (id: number) => {
    const workshop = await Workshop.findByPk(id);

    if (workshop === null) {
        throw new NotFoundError('No such workshop');
    }

    return workshop;
};
```

```ts
export {
    getAllWorkshops,
    getWorkshopById,
    addWorkshop,
};
```

* Now in `src/controllers/workshops.controller.ts`, we support `GET /api/workshops/:id`. Note how a dynamic path parameter is configured in the Express router - the `:` indicates a dynamic path parameter, and `id` shall be the property within `req.params` which shall be set to the actual value.
```ts
import { Request, Response } from 'express';
```
```ts
interface WorkshopIdParams {
    id: string;
}

// http://localhost:3000/api/workshops/:id
const getWorkshopById = async (req: Request<WorkshopIdParams>, res: Response) => {
    const { id } = req.params;

    const workshopId = +id;

    if (isNaN(workshopId)) {
        const err = new Error('Workshop id should be a number') as ErrorWithStatus;
        err.status = 400;
        err.type = 'ValidationError';
        throw err;
    }

    const workshop = await Service.getWorkshopById(workshopId);

    res.json({
        status: 'success',
        data: workshop,
    });
};
```

```ts
export {
    getWorkshops,
    getWorkshopById,
    postWorkshop
};
```

* Add the route in `src/routes.workshops.route.ts`. Note that since there is an extra dynamic path fragment, we need to configure the route separately.

```ts
import express from 'express';
import * as Controllers from '../controllers/workshops.controller';

const router = express.Router();

router.route('/').get(Controllers.getWorkshops).post(Controllers.postWorkshop);

// Add this...
router.route('/:id').get(Controllers.getWorkshopById);

export default router;
```
- __Note__: We do not need to change `src/middleware/errors.ts` as the error object generated already has `type` and `status`.

* A sample request (surely, a workshop with the given `id` should exist in the database)

```
http://localhost:3000/api/workshops/1
```

* By default methods like `findByPk()`, that find a record by its primary key return `null` when no matching record is found. So you need to handle this case and throw a not found error. We throw an error when `findByPk()` returns `null` (as done in the service).
* The error handler middleware is still able to send a 404 response when a workshop is not found!

## Step 17: Supporting update of workshop

* Sequelize provides the method `update()` to update records. We use it to set up a service method to partially update a workshop matching the given `id` (primary key) in `src/services/workshops.service.ts`

```ts
import Workshop from '../data/models/Workshop';
import IWorkshop from '../models/IWorkshop';
import { ErrorWithStatus } from '../models/utils';

const updateWorkshop = async (id: number, workshop: Partial<IWorkshop>) => {
    // NOTES
    // ---
    // 1. In Sequelize, we pass the fields to update as a plain object.
    //    Only the provided fields are updated (similar to PATCH semantics).
    // 2. Sequelize runs validations on update by default based on the model definitions.
    // 3. update() returns the number of affected rows. To return the updated record, we fetch it again.
    const [ affectedCount ] = await Workshop.update(workshop, {
        where: { id },
    });

    if (affectedCount === 0) {
        const error: ErrorWithStatus = new Error('No such workshop');
        error.type = 'NotFound';
        throw error;
    }

    const updatedWorkshop = await Workshop.findByPk(id);

    return updatedWorkshop;
};
```

```ts
export {
    getAllWorkshops,
    getWorkshopById,
    addWorkshop,
    updateWorkshop
};
```

* In the controller `src/controllers/workshops.controller.ts`

```ts
import { Request, Response } from 'express';
import { ErrorWithStatus } from '../models/utils';
import * as Service from '../services/workshops.service';
import IWorkshop from '../models/IWorkshop';

interface WorkshopIdParams {
    id: string;
}

const patchWorkshop = async (
    req: Request<WorkshopIdParams, {}, Partial<IWorkshop>>,
    res: Response
) => {
    const { id } = req.params;

    const workshopId = +id;

    if (isNaN(workshopId)) {
        const err = new Error('Workshop id should be a number') as ErrorWithStatus;
        err.status = 400;
        err.type = 'ValidationError';
        throw err;
    }

    const workshop = req.body;

    // if workshop = req.body -> {}
    if (Object.keys(workshop).length === 0) {
        const err = new Error(
            'The request body is empty. A partial Workshop object expected.'
        ) as ErrorWithStatus;
        err.status = 400;
        throw err;
    }

    const updatedWorkshop = await Service.updateWorkshop(workshopId, workshop);
    res.json({
        status: 'success',
        data: updatedWorkshop,
    });
};
```

```ts
export {
    getWorkshops,
    getWorkshopById,
    postWorkshop,
    patchWorkshop
};
```

* In the route file `src/routes/workshops.route.ts`

```ts
import express from 'express';
import * as Controllers from '../controllers/workshops.controller';

const router = express.Router();

router.route('/')
    .get(Controllers.getWorkshops)
    .post(Controllers.postWorkshop);

router.route('/:id')
    .get(Controllers.getWorkshopById)
    .patch(Controllers.patchWorkshop);

export default router;
```

* Make a request to update a workshop by its id. Sample request

```
localhost:3000/api/workshops/1

{
    "name": "Angular JS v1",
    "startTime": {
        "hours": 9,
        "minutes": 45
    },
    "endTime": {
        "hours": 13,
        "minutes": 45
    }
}
```

## Step 18: Supporting deletion of workshop

* Sequelize provides the method `destroy()` to delete records. We use it to set up a service method to delete a workshop matching the given `id` (primary key) in `src/services/workshops.service.ts`

```ts
import Workshop from '../data/models/Workshop';
import { ErrorWithStatus } from '../models/utils';

const deleteWorkshop = async (id: number) => {
    const deletedCount = await Workshop.destroy({
        where: { id }
    });

    if (deletedCount === 0) {
        const error: ErrorWithStatus = new Error('No such workshop');
        error.type = 'NotFound';
        throw error;
    }

    return;
};
```

```ts
export {
    getAllWorkshops,
    getWorkshopById,
    addWorkshop,
    updateWorkshop,
    deleteWorkshop
};
```

* In `src/controllers/workshops.controller.ts`

```ts
import { Request, Response } from 'express';
import { ErrorWithStatus } from '../models/utils';
import * as Service from '../services/workshops.service';

interface WorkshopIdParams {
    id: string;
}

const deleteWorkshop = async (req: Request<WorkshopIdParams>, res: Response) => {
    const { id } = req.params;

    const workshopId = +id;

    if (isNaN(workshopId)) {
        const err = new Error('Workshop id should be a number') as ErrorWithStatus;
        err.status = 400;
        err.type = 'ValidationError';
        throw err;
    }

    await Service.deleteWorkshop(workshopId);

    // 204 -> use this status code for successful operation but you do not want to send any data in response
    // res.status(204).end();

    res.json({
        status: 'success',
    });
};
```

```ts
export {
    getWorkshops,
    getWorkshopById,
    postWorkshop,
    patchWorkshop,
    deleteWorkshop
};
```

* In `src/routes/workshops.route.ts`

```ts
import express from 'express';
import * as Controllers from '../controllers/workshops.controller';

const router = express.Router();

router.route('/')
    .get(Controllers.getWorkshops)
    .post(Controllers.postWorkshop);

router.route('/:id')
    .get(Controllers.getWorkshopById)
    .patch(Controllers.patchWorkshop)
    .delete(Controllers.deleteWorkshop);

export default router;
```

* Sample request

```
DELETE http://localhost:3000/api/workshops/1
```

## Step 19: Adding speakers

* In PostgreSQL, we store `speakers` as a `text[]` column. To add new speakers without replacing the existing array, we first fetch the current speakers, merge in the new names (ensuring uniqueness), and then update the record.
* In `src/services/workshops.service.ts`

```ts
import Workshop from '../data/models/Workshop';
import { ErrorWithStatus } from '../models/utils';

const addSpeakers = async (id: number, speakers: string[]) => {
    const workshop = await Workshop.findByPk(id);

    if (workshop === null) {
        const error: ErrorWithStatus = new Error('No such workshop');
        error.type = 'NotFound';
        throw error;
    }

    // Merge existing and new speakers, ensuring uniqueness (like $addToSet)
    const existing = workshop.getDataValue('speakers') || [];
    const merged = Array.from(new Set([ ...existing, ...speakers ]));

    workshop.set('speakers', merged);
    await workshop.save();

    return workshop;
};
```

```ts
export {
    getAllWorkshops,
    getWorkshopById,
    addWorkshop,
    updateWorkshop,
    deleteWorkshop,
    addSpeakers
};
```

* In `src/controllers/workshops.controller.ts`

```ts
import { Request, Response } from 'express';
import { ErrorWithStatus } from '../models/utils';
import * as Service from '../services/workshops.service';

interface WorkshopIdParams {
    id: string;
}

// http://localhost:3000/api/workshops/:id/speakers
// body -> [
//     "john.doe@example.com",
//     "jane.doe@example.com"
// ]
const addSpeakers = async (
    req: Request<WorkshopIdParams, {}, string[]>,
    res: Response
) => {
    const { id } = req.params;
    const workshopId = +id;

    if (isNaN(workshopId)) {
        const err = new Error('Workshop id should be a number') as ErrorWithStatus;
        err.status = 400;
        err.type = 'ValidationError';
        throw err;
    }

    const speakers = req.body;

    if (!(speakers instanceof Array) || speakers.length === 0) {
        const error: ErrorWithStatus = new Error(
            'Speakers must be a non-empty array. Data is missing or formed incorrectly'
        );
        error.status = 400;
        error.type = 'ValidationError';
        throw error;
    }

    const updatedWorkshop = await Service.addSpeakers(workshopId, speakers);
    res.json({
        status: 'success',
        data: updatedWorkshop,
    });
};
```

```ts
export {
    getWorkshops,
    getWorkshopById,
    postWorkshop,
    patchWorkshop,
    deleteWorkshop,
    addSpeakers
};
```

* In `src/routes/workshops.route.ts`

```ts
import express from 'express';
import * as Controllers from '../controllers/workshops.controller';

const router = express.Router();

router.route('/')
    .get(Controllers.getWorkshops)
    .post(Controllers.postWorkshop);

router.route('/:id')
    .get(Controllers.getWorkshopById)
    .patch(Controllers.patchWorkshop)
    .delete(Controllers.deleteWorkshop);

router.route('/:id/speakers')
    .patch(Controllers.addSpeakers);

export default router;
```

* Sample request

```
PATCH localhost:3000/api/workshops/1/speakers

[
    "Diana Taylor",
    "David Taylor"
]
```

## Step 20: Adding topics for workshops – The Session Model

* We shall add topics (called sessions in the application) for a workshop. In a relational database, sessions are stored in a separate table and linked to workshops using a **foreign key relationship**.
* Begin by defining a `Session` interface in `src/models/ISession.ts`

```ts
type Level = 'Basic' | 'Intermediate' | 'Advanced';

interface ISession {
    id: number;
    workshopId: number;   // foreign key reference to Workshop.id
    sequenceId: number;
    name: string;
    speaker: string;
    duration: number;
    level: Level;
    abstract: string;
    upvoteCount: number;
}

export { ISession as default, Level };
```

* Now define the Sequelize model `Session` in `src/data/models/Session.ts`.
  Unlike MongoDB, PostgreSQL does not embed related documents. Each session is stored as a row in the `sessions` table, with `workshopId` acting as a foreign key.

```ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../init';
import ISession, { Level } from '../../models/ISession';

// Describe attributes required during creation (id is auto-generated)
type SessionCreationAttributes = Optional<ISession, 'id' | 'upvoteCount'>;

class Session
  extends Model<ISession, SessionCreationAttributes>
  implements ISession
{
  declare id: number;
  declare workshopId: number;
  declare sequenceId: number;
  declare name: string;
  declare speaker: string;
  declare duration: number;
  declare level: Level;
  declare abstract: string;
  declare upvoteCount: number;

  // timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    workshopId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // foreign key constraint will be added via migration
    },

    sequenceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    speaker: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    duration: {
      type: DataTypes.FLOAT,
      allowNull: false, // assuming duration is in hours
      validate: {
        min: 0.25, // optional: 15 minutes as minimum
      },
    },

    level: {
      type: DataTypes.ENUM('Basic', 'Intermediate', 'Advanced'),
      allowNull: false,
    },

    abstract: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    upvoteCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'sessions',
    modelName: 'Session',
  }
);

export default Session;
```

* Import the new model file in `src/data/init.ts` so the `Session` model is registered at app startup.

```ts
import './models/Workshop';
import './models/Session';
```

* Next, we will create a **migration** to generate the `sessions` table and define the **foreign key constraint** between `sessions.workshopId` and `workshops.id`.

## Step 20.2: Create `sessions` table using migration (and link it to `workshops`)

* We now create the `sessions` table using a Sequelize migration. In PostgreSQL, a session belongs to a workshop, and we represent this using a **foreign key** from `sessions.workshopId` to `workshops.id`.
* Generate a migration file.

```bash
npx sequelize-cli migration:generate --name create-sessions
```

* Open the newly generated migration file in `src/data/migrations` and update it as shown below.

```js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      workshopId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workshops',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      sequenceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      speaker: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      duration: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      level: {
        type: Sequelize.ENUM('Basic', 'Intermediate', 'Advanced'),
        allowNull: false,
      },

      abstract: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      upvoteCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sessions');

    // Postgres keeps ENUM types around unless we drop them explicitly
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_sessions_level";'
    );
  },
};
```
* __NOTE__
- `onDelete: 'CASCADE'` ensures that when a workshop is deleted, all its sessions are automatically deleted as well, preventing orphan records.
- `onUpdate: 'CASCADE'` ensures that if a workshop’s primary key ever changes, all related sessions are updated automatically.
- These rules enforce referential integrity at the database level, not just in application code.

* Run the migrations to create the table.

```bash
npx sequelize-cli db:migrate
```

* Verify in pgAdmin that the table has been created, and that `workshopId` is set up as a foreign key.
* Now that the `sessions` table exists, we can add APIs to list sessions for a workshop, add a session, etc.

## Step 21: API to add a topic (session)

* Create `src/services/sessions.service.ts`

```ts
import Session from '../data/models/Session';
import Workshop from '../data/models/Workshop';
import ISession from '../models/ISession';
import { ErrorWithStatus } from '../models/utils';

const addSession = async (session: Omit<ISession, 'id'>) => {
    // Ensure the workshop exists (foreign key should point to a valid workshop)
    const workshop = await Workshop.findByPk(session.workshopId);

    if (!workshop) {
        const error: ErrorWithStatus = new Error(`Workshop not found`);
        error.type = 'ValidationError';
        error.status = 400;
        throw error;
    }

    const insertedSession = await Session.create({
        ...session,
        upvoteCount: session.upvoteCount ?? 0
    });

    return insertedSession;
};

export { addSession };
```

* In `src/controllers/sessions.controller.ts`

```ts
import { Request, Response } from 'express';

import * as Service from '../services/sessions.service';
import ISession from '../models/ISession';

const postSession = async (req: Request<{}, {}, ISession>, res: Response) => {
    const session = req.body;

    const newSession = await Service.addSession(session);

    res.status(201).json({
        status: 'success',
        data: newSession,
    });
};

export {
    postSession,
};
```

* In `src/routes/sessions.route.ts`

```ts
import express from 'express';
import * as Controller from '../controllers/sessions.controller';

const router = express.Router();

router.route('/')
    .post(Controller.postSession);

export default router;
```

* Add the new router as a middleware in `src/app.ts`

```ts
import sessionsRouter from './routes/sessions.route';
```

```ts
app.use('/api/sessions', sessionsRouter);
```

* Sample request

```
POST /api/sessions

{
    "workshopId": 1,
    "sequenceId": 1,
    "name": "Introduction to Express JS",
    "speaker": "John Doe",
    "duration": 1,
    "level": "Basic",
    "abstract": "In this session you will learn about the basics of Express JS"
}
```

## Step 22: Add a topic through workshops route

* With REST APIs, related resources can often be accesed in multiple ways. For example, we shall support accessing sessions both standalone (`/api/sessions`), and through the resource workshop resource (`/api/workshops/:id/sessions`). We now make changes to support access via the second route.
* In `src/controllers/workshops.controller.ts`

```ts
import * as SessionsService from '../services/sessions.service';
import ISession from '../models/ISession';
import { ErrorWithStatus } from '../models/utils';
```

```ts
const postSession = async (
    req: Request<WorkshopIdParams, {}, Omit<ISession, 'id' | 'workshopId'>>,
    res: Response
) => {
    const { id } = req.params;

    const workshopId = +id;

    if (isNaN(workshopId)) {
        const err = new Error('Workshop id should be a number') as ErrorWithStatus;
        err.status = 400;
        err.type = 'ValidationError';
        throw err;
    }

    const session = {
        workshopId,
        ...req.body,
    };

    const newSession = await SessionsService.addSession(session);

    res.status(201).json({
        status: 'success',
        data: newSession,
    });
};
```

```ts
export {
    // existing exports...
    // ...,

    postSession
};
```

* In `src/routes/workshops.route.ts` add this

```ts
router.route('/:id/sessions')
    .post(Controllers.postSession);
```

* Sample request

```
POST /api/workshops/1/sessions

{
    "sequenceId": 1,
    "name": "Introduction to Express JS",
    "speaker": "John Doe",
    "duration": 1,
    "level": "Basic",
    "abstract": "In this session you will learn about the basics of Express JS"
}
```

## Step 23: Fetching all sessions of a workshop

* In `src/services/sessions.service.ts`

```ts
import Session from '../data/models/Session';
import Workshop from '../data/models/Workshop';
import { ErrorWithStatus } from '../models/utils';

const getSessions = async (workshopId: number) => {
    const workshop = await Workshop.findByPk(workshopId);

    if (!workshop) {
        const error: ErrorWithStatus = new Error('No such workshop');
        error.type = 'NotFound';
        error.status = 404;
        throw error;
    }

    const sessions = await Session.findAll({
        where: { workshopId },
        order: [['sequenceId', 'ASC']], // nice default ordering
    });

    return sessions;
};

export { addSession, getSessions };
```

* In `src/controllers/workshops.controller.ts`

```ts
import { Request, Response } from 'express';
import { ErrorWithStatus } from '../models/utils';
import * as SessionsService from '../services/sessions.service';

interface WorkshopIdParams {
    id: string;
}

// Sample: http://localhost:3000/api/workshops/1/sessions
const getSessions = async (req: Request<WorkshopIdParams>, res: Response) => {
    const { id } = req.params;
    const workshopId = +id;

    if (isNaN(workshopId)) {
        const err = new Error('Workshop id should be a number') as ErrorWithStatus;
        err.status = 400;
        err.type = 'ValidationError';
        throw err;
    }

    const sessions = await SessionsService.getSessions(workshopId);

    res.json({
        status: 'success',
        data: sessions,
    });
};
```

```ts
export {
    // existing exports...
    // ...,

    getSessions
};
```

* In `src/routes/workshops.route.ts`

```ts
router.route('/:id/sessions')
    .get(Controllers.getSessions)
    .post(Controllers.postSession);
```

* Sample request

```
GET http://localhost:3000/api/workshops/1/sessions
```

* **EXERCISE**: Modify the service, controller and add count of records to the response.

## Step 24: Embed sessions when fetching details of a workshop

* We enable serving the list of sessions along with the workshop details. In Sequelize, we do this by defining an **association** between `Workshop` and `Session`. Once an association is set up, we can include related data in a query using the `include` option.

* Create `src/data/models/associations.ts`
```ts
import Workshop from './Workshop';
import Session from './Session';

const setupAssociations = () => {
  Workshop.hasMany(Session, {
    foreignKey: 'workshopId',
    as: 'sessions',
  });

  Session.belongsTo(Workshop, {
    foreignKey: 'workshopId',
    as: 'workshop',
  });
};

export default setupAssociations;
```

* Update `src/data/init.ts` so models are registered first, then associations are wired.
```ts
// existing code...
// ...

// Register models (these call Model.init(...))
import './models/Workshop';
import './models/Session';

// Wire associations AFTER both models are loaded
import setupAssociations from './models/associations';
setupAssociations();
```
* In `src/services/workshops.service.ts` make changes to include sessions when fetching a workshop by id, if `embedSessions` is set to `true`.
```ts
import Workshop from '../data/models/Workshop';
import Session from '../data/models/Session';
import { ErrorWithStatus } from '../models/utils';

const getWorkshopById = async (id: number, embedSessions = false) => {
  const workshop = await Workshop.findByPk(id, {
    include: embedSessions
      ? [
          {
            model: Session,
            as: 'sessions',
            required: false,
            order: [['sequenceId', 'ASC']]
          }
        ]
      : []
  });

  if (!workshop) {
    throw new NotFoundError('No such workshop');
  }

  return workshop;
};
```

* In `src/controllers/workshops.controller.ts` pass on `embedSessions` based on the `embed` query string parameter value.

```ts
import { Request, Response } from 'express';
import { ErrorWithStatus } from '../models/utils';
import * as Service from '../services/workshops.service';

interface WorkshopIdParams {
  id: string;
}

// http://localhost:3000/api/workshops/:id
// http://localhost:3000/api/workshops/:id?embed=sessions
const getWorkshopById = async (
  req: Request<WorkshopIdParams, {}, {}, { embed?: string }>,
  res: Response
) => {
  const { id } = req.params;

  const workshopId = +id;

  if (isNaN(workshopId)) {
    const err = new Error('Workshop id should be a number') as ErrorWithStatus;
    err.status = 400;
    err.type = 'ValidationError';
    throw err;
  }

  const embedSessions = req.query.embed === 'sessions';

  const workshop = await Service.getWorkshopById(workshopId, embedSessions);

  res.json({
    status: 'success',
    data: workshop
  });
};
```

* Sample requests

```
GET http://localhost:3000/api/workshops/1
GET http://localhost:3000/api/workshops/1?embed=sessions
```

## Step 25: Enable voting on sessions

* We enable user to upvote / downvote on sessions. In PostgreSQL with Sequelize, we can increment / decrement a numeric column using an atomic update (so concurrent updates do not overwrite each other). Sequelize provides helpers like `Sequelize.literal()` to update a column relative to its current value.
* In `src/services/sessions.service.ts`

```ts
import Session from '../data/models/Session';
import { ErrorWithStatus } from '../models/utils';
import { sequelize } from '../data/init';
import { literal } from 'sequelize';

const upvoteSession = async (sessionId: number) => {
    const [count] = await Session.update(
        { upvoteCount: literal('"upvoteCount" + 1') },
        { where: { id: sessionId } }
    );

    if (count === 0) {
        const error: ErrorWithStatus = new Error('No such session');
        error.type = 'NotFound';
        error.status = 404;
        throw error;
    }

    const session = await Session.findByPk(sessionId);
    return session;
};

const downvoteSession = async (sessionId: number) => {
    const [count] = await Session.update(
        { upvoteCount: literal('"upvoteCount" - 1') },
        { where: { id: sessionId } }
    );

    if (count === 0) {
        const error: ErrorWithStatus = new Error('No such session');
        error.type = 'NotFound';
        error.status = 404;
        throw error;
    }

    const session = await Session.findByPk(sessionId);
    return session;
};

export {
    addSession,
    getSessions,
    upvoteSession,
    downvoteSession
};
```

* In `src/controllers/sessions.controller.ts`

```ts
import { Request, Response } from 'express';
import { ErrorWithStatus } from '../models/utils';
import * as Service from '../services/sessions.service';

interface SessionIdParams {
    id: string;
}

const patchUpvote = async (req: Request<SessionIdParams>, res: Response) => {
    const sessionId = +req.params.id;

    if (isNaN(sessionId)) {
        const err = new Error('Session id should be a number') as ErrorWithStatus;
        err.status = 400;
        err.type = 'ValidationError';
        throw err;
    }

    const updatedSession = await Service.upvoteSession(sessionId);
    res.json({
        status: 'success',
        data: updatedSession,
    });
};

const patchDownvote = async (req: Request<SessionIdParams>, res: Response) => {
    const sessionId = +req.params.id;

    if (isNaN(sessionId)) {
        const err = new Error('Session id should be a number') as ErrorWithStatus;
        err.status = 400;
        err.type = 'ValidationError';
        throw err;
    }

    const updatedSession = await Service.downvoteSession(sessionId);
    res.json({
        status: 'success',
        data: updatedSession,
    });
};

export {
    postSession,
    patchUpvote,
    patchDownvote
};
```

* In `src/routes/sessions.route.ts`

```ts
router.patch('/:id/upvote', Controller.patchUpvote);
router.patch('/:id/downvote', Controller.patchDownvote);
```

* Sample request

```
PATCH localhost:3000/api/sessions/10/upvote
PATCH localhost:3000/api/sessions/10/downvote
```

## Step 26: Enable authentication and authorization – Add user model

* We now enable authentication and authorization.
* First set up the IUser interface in `src/models/IUser.ts`. We shall add a custom method `checkPassword` on User model instances. With Sequelize, model instances are objects of a class that extends `Model`, so we can define instance methods directly on the class.

```ts
type Role = 'admin' | 'general';

interface IUser {
    id: number;
    email: string;
    name: string;
    password: string;
    role: Role;
}

export { IUser as default, Role };
```

* Next add the `User` model in `src/data/models/User.ts`. Note how we set up custom validators on certain fields, and also define an instance method `checkPassword()` to compare a plain text password with the hashed password stored in the database.

```ts
import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../init';
import IUser, { Role } from '../../models/IUser';

// Describe attributes required during creation (id is auto-generated, role can default)
type UserCreationAttributes = Optional<IUser, 'id' | 'role'>;

const emailPat = /^[A-Za-z0-9_\.]+@example\.com$/;
const passwordPat = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

class User extends Model<IUser, UserCreationAttributes> implements IUser {
    declare id: number;
    declare email: string;
    declare name: string;
    declare password: string;
    declare role: Role;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    // instance method
    async checkPassword(plainTextPassword: string): Promise<boolean> {
        return bcrypt.compare(plainTextPassword, this.password);
    }

    // Hide password when converting to JSON
    toJSON() {
        const values = { ...this.get() } as Partial<IUser>;
        delete values.password;
        return values;
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isValidEmail(value: string) {
                    if (!emailPat.test(value)) {
                        throw new Error(
                            'Invalid email. Please make sure the email is an example.com email.'
                        );
                    }
                },
            },
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isValidPassword(value: string) {
                    if (!passwordPat.test(value)) {
                        throw new Error(
                            'Password must have at least 1 digit, 1 special character, and should be 8-16 characters in length.'
                        );
                    }
                },
            },
        },

        role: {
            type: DataTypes.ENUM('admin', 'general'),
            allowNull: false,
            defaultValue: 'general',
        },
    },
    {
        sequelize,
        tableName: 'users',
        modelName: 'User',
    }
);

export default User;
```

* Import the new model file in `src/data/init.ts` so the `User` model is defined at app startup.

```ts
import './models/Workshop';
import './models/Session';
import './models/User';
```

> In the next step, we will create a migration to generate the `users` table.

## Step 26.2: Create migration to generate the `users` table

* Generate a migration file for the `users` table using Sequelize CLI.

```bash
npx sequelize-cli migration:generate --name create-users-table
```

* This command creates a new migration file under `src/data/migrations/` with a timestamped filename (for example, `20251217094500-create-users-table.js`).

* Open the generated migration file and update it as follows.

```js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      role: {
        type: Sequelize.ENUM('admin', 'general'),
        allowNull: false,
        defaultValue: 'general',
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop table first
    await queryInterface.dropTable('users');

    // ENUM types must be dropped manually in PostgreSQL
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_role";'
    );
  },
};
```

* **Important notes**:

  * PostgreSQL creates ENUM types separately. When rolling back (`down`), we explicitly drop the enum type to avoid errors in future migrations.
  * Table name is kept **lowercase (`users`)** to avoid quoting issues in PostgreSQL.
  * `createdAt` and `updatedAt` columns are required because Sequelize models expect them by default.

* Run the migration.

```bash
npx sequelize-cli db:migrate
```

* If the migration runs successfully, the `users` table will be created in the database.

* You can verify this in **pgAdmin** by expanding:

  ```
  Databases → workshopsdb → Schemas → public → Tables → users
  ```

## Step 27: Add user registration support

* In `src/services/users.service.ts`

```ts
import User from '../data/models/User';
import IUser from '../models/IUser';

const addUser = async (user: Omit<IUser, 'id'>) => {
    const insertedUser = await User.create(user);
    return insertedUser; // password is removed automatically by User.toJSON()
};

export {
    addUser
};
```

* In `src/controllers/users.controller.ts`

```ts
import { Request, Response } from 'express';
import * as Service from '../services/users.service';
import IUser from '../models/IUser';
import { ErrorWithStatus } from '../models/utils';

const register = async (req: Request<{}, {}, Omit<IUser, 'id'>>, res: Response) => {
    const user = req.body;

    // if user = req.body -> {}
    if (Object.keys(user).length === 0) {
        const error: ErrorWithStatus = new Error('Body is missing');
        error.status = 400;
        throw error;
    }

    const updatedUser = await Service.addUser(user);

    // password is removed automatically by User.toJSON() when sending JSON response
    res.status(201).json({
        status: 'success',
        data: updatedUser,
    });
};

export { register };
```

* In `src/routes/users.route.ts`

```ts
import express from 'express';
import * as Controller from '../controllers/users.controller';

const router = express.Router();

router.post('/register', Controller.register);

export default router;
```

* Set the router as an application middleware in `src/app.ts`

```ts
import usersRouter from './routes/users.route';
```

```ts
app.use(indexRouter);
app.use('/api/auth', usersRouter);
app.use('/api/workshops', workshopsRouter);
app.use('/api/sessions', sessionsRouter);
```

* You should now be able to register a user. Sample request

```
POST /api/auth/register

{
    "email": "john.doe@example.com",
    "name": "John Doe",
    "password": "Password123#",
    "role": "admin"
}
```

* **NOTE**: A public registration API like this would not support adding users with *admin* role. Here it is enabled just for convenience.

## Step 28: Hashing passwords using bcrypt

* Passwords must **never** be stored in plain text in the database. Instead, they should be **hashed** before storage so that even if the database is compromised, passwords are not directly exposed.
* In addition to hashing, passwords should be **salted**. Salting ensures that even if two users choose the same password, their hashed values will be different, preventing attackers from using precomputed hash tables (rainbow tables).
* The `bcrypt` package (which uses native bindings) is widely used for this purpose. A pure JavaScript alternative is `bcryptjs`, but it is slower. We will use `bcrypt`.

* Install bcrypt

```bash
npm i bcrypt
npm i --save-dev @types/bcrypt
```

* Update the User model to hash passwords automatically

* Instead, Sequelize provides **model hooks** such as `beforeCreate`, `beforeUpdate`, and `beforeSave`.
* We will:

  1. Hash the password **before inserting** a new user.
  2. Hash the password **before updating**, but only if the password has changed.
  3. Add an **instance method** to compare a plain text password with the stored hash (used during login).

* Modify `src/data/models/User.ts`

```ts
// IMPORTANT: Decides the "strength" of the salt
// Should not be too high (CPU-intensive) or too low (less secure)
const SALT_ROUNDS = 10;
```
- Add this as a method in the User Model
```ts
class User extends Model<IUser, UserCreationAttributes> implements IUser {
    // existing code...
    // ...

    /**
     * Compare plain text password with hashed password
     */
    public async checkPassword(plainTextPassword: string): Promise<boolean> {
        return bcrypt.compare(plainTextPassword, this.password);
    }
}

User.init(
    {
        // field definitions
        // ...
    },
    {
        sequelize,
        tableName: 'users',
        modelName: 'User',

        /**
         * Hide password when converting model to JSON
         */
        defaultScope: {
            attributes: { exclude: ['password'] },
        },

        /**
         * Model hooks
         */
        hooks: {
            /**
             * Hash password before creating a user
             */
            beforeCreate: async (user: User) => {
                user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
            },

            /**
             * Hash password before updating if it was modified
             */
            beforeUpdate: async (user: User) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
                }
            },
        },
    }
);

export default User;
```

- What this setup ensures
* Passwords are **never stored in plain text**.
* Passwords are **automatically hashed** during registration.
* Passwords are **re-hashed** only if they are changed.
* The password field is **excluded from API responses** automatically.
* The `checkPassword()` method can be used later during login to verify credentials.

- At this point:
* User registration securely stores hashed passwords.
* You are ready to implement **login and JWT-based authentication** in the next steps.

- __Note__: This step does not require a database migration. Password hashing is implemented entirely at the application level using Sequelize hooks, and the database schema remains unchanged.

## Step 29: Add login support

* In `src/services/users.service.ts`

```ts
import { ErrorWithStatus } from '../models/utils';
```
```ts
// Add these methods...
const getUserByEmail = async (email: string) => {
    // We must include password for login verification.
    // Our model hides password by default (defaultScope / toJSON), so we override it here.
    const user = await User.scope().findOne({
        where: { email },
    });

    if (user === null) {
        const error: ErrorWithStatus = new Error('Bad Credentials');
        error.type = 'BadCredentials';
        throw error;
    }

    return user;
};

const checkPassword = async (user: User, plainTextPassword: string) => {
    let isMatch: boolean;

    try {
        isMatch = await user.checkPassword(plainTextPassword);
    } catch (err) {
        const error: ErrorWithStatus = new Error('Something went wrong checking credentials');
        error.type = 'DBError';
        throw error;
    }

    if (!isMatch) {
        const error: ErrorWithStatus = new Error('Bad Credentials');
        error.type = 'BadCredentials';
        throw error;
    }

    return isMatch;
};

export { addUser, getUserByEmail, checkPassword };
```

* In `src/controllers/users.controller.ts`

```ts
interface Credentials {
    email: string;
    password: string;
}

const login = async (req: Request<{}, {}, Credentials>, res: Response) => {
    const credentials = req.body;

    if (!(credentials?.email && credentials?.password)) {
        const error: ErrorWithStatus = new Error('Bad request');
        error.status = 400;
        error.type = 'BadRequest';
        throw error;
    }

    const { email, password } = credentials;

    const user = await Service.getUserByEmail(email);

    await Service.checkPassword(user, password);

    res.json({
        status: 'success',
        data: 'Token to be generated',
    });
};

export {
    register,
    login
};
```

* Add a case to check for the custom error thrown due to bad credentials. In `src/middleware/errors.ts`, add this as another check inside `enrichResponseError` method

```ts
// Handle authentication related custom errors
if (error.type === 'BadCredentials') {
    error.status = 401; // Email, password is provided but is incorrect -> 401
}
```

* In `src/routes/users.route.ts`, add the login route

```ts
router.post('/register', Controller.register);
router.post('/login', Controller.login);
```

* **IMPORTANT**: If you had created users **before hashing was enabled**, those users may have passwords stored in plain text. Create a fresh user account after Step 28 so login works correctly.
* Sample request

```
POST /api/auth/login

{
    "email": "john.doe@example.com",
    "password": "Password123#"
}
```

## Step 30: Generate and send a JWT on successful login
- We shall generate a JSON Web Token (JWT) using the `jsonwebtoken` package. JWT hold user claims (privileges) along with other user information. The claims are digitally signed using a secret key on the server, and hence can be verified when access to secured API endpoints is needed. Install the package
```bash
npm i jsonwebtoken
npm i --save-dev @types/jsonwebtoken
```
- Add the secret key to `.env` - it will be used to sign the JWT (any key that is "secret enough" will do - like a password)
```
JWT_SECRET=xyz123abc%^&#skbdbcd7i711ibe7gb9F^&8ys89h@B
```
- In `src/controllers/users.controller.ts` make the following change in the `login` method
```ts
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
```
```ts
const signJwt = promisify<string | object | Buffer, jwt.Secret, jwt.SignOptions, string>(jwt.sign);
```
```ts
await Service.checkPassword( user, password );

// Replace the code sending response currently with this...
// res.json({
//     status: 'success',
//     data: 'Token to be generated',
// });

const claims = {
    role: user.role,
    email: user.email, // info useful for the backend in future requests
};

// The secret key which is used to generate the digital signature must be stored in environment variable and NEVER in code
const token = await signJwt(
    claims,
    process.env.JWT_SECRET as string,
    {
        expiresIn: "24h",
        algorithm: 'HS512',
    }
);

res.json({
    status: 'success',
    data: {
        name: user.name,
        email: user.email, // useful for frontend app
        // token: token
        token,
    },
});
```

## Step 31: Set up an authentication middleware
- In `src/middleware/auth.ts` add and export an `authenticate` middleware
```ts
import { promisify } from 'util';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, VerifyOptions, Secret } from 'jsonwebtoken';
import { ErrorWithStatus } from '../models/utils';

const verifyJwt = promisify<
    string, // token
    Secret, // secret
    VerifyOptions | undefined, // options
    string | JwtPayload // decoded payload
>(jwt.verify);

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const err: ErrorWithStatus = new Error('Missing or invalid Authorization header');
        err.type = 'BadCredentials';
        throw err;
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const claims = await verifyJwt(token, process.env.JWT_SECRET as string, {
            algorithms: ['HS512'],
        });
        res.locals.claims = claims;
        next();
    } catch (error) {
        const err: ErrorWithStatus = new Error('Bad credentials');
        err.type = 'BadCredentials';
        throw err;
    }
};

export { authenticate };
```
- Apply the above as a route-level middleware in `src/routes/workshops.route.ts`. The order is important - it must be applied before the controller for the route, so that user is authenticated before the request reaches the controller.
```ts
import { authenticate } from '../middleware/auth';
```
```ts
router.route('/')
    .get( Controllers.getWorkshops )
    .post( authenticate, Controllers.postWorkshop );
```
- You should now, not be able to add a workshop unless you send the token correctly. Sample request
```
POST /api/workshops

Header
---
Authorization: Bearer <token_obtained_on_login>

Body
---
{
    "name": "jQuery",
    "category": "frontend",
    "description": "jQuery is a JavaScript library",
    "startDate": "2020-03-01T04:00:00.000Z",
    "endDate": "2020-03-03T08:00:00.000Z",
    "startTime": {
        "hours": 9,
        "minutes": 30
    },
    "endTime": {
        "hours": 13,
        "minutes": 30
    },
    "speakers": [
        "John Doe",
        "Jane Doe"
    ],
    "location": {
        "address": "Tata Elxsi, Prestige Shantiniketan",
        "city": "Bangalore",
        "state": "Karnataka"
    },
    "modes": {
        "inPerson": true,
        "online": false
    },
    "imageUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/JQuery_logo.svg/524px-JQuery_logo.svg.png"
}
```

## Step 32: Set up an authorization middleware
- In `src/middleware/auth.ts` add and export an `authorize` middleware - it is created as a higher-order function (it is a function that exports a function) in order to support configuring roles that the returned middleware needs to allow.
```ts
import { Role } from '../models/IUser';
```
```ts
const authorize = (allowedRoles: Role[]) => {
    // when called, this returns the middleware
    return (req: Request, res: Response, next: NextFunction) => {
        // this is the actual middleware
        const { claims } = res.locals;

        if (!allowedRoles.includes(claims.role)) {
            const error: ErrorWithStatus = new Error('Unauthorized');
            // for a valid user, but one who has insufficient privileges (send 403)
            error.type = 'Unauthorized';
            throw error;
        }

        next();
    };
};

export {
    authenticate,
    authorize
};
```
- Set up error-handling logic in `src/middleware/errors.ts`
```ts
if (error.type === 'Unauthorized') {
    error.status = 403; // User does not have required privileges -> 403
}
```
- Apply the above as a route-level middleware in `src/routes/workshops.route.ts`. The order is important - it must be applied after the `authenticate` middleware for the route (but before the controller), so that user is authenticated and user details, specifically the _role_, is available on `res.locals` when authorization check is done.
```ts
import { authenticate, authorize } from '../middleware/auth';
```
```ts
router.route('/')
    .get( Controllers.getWorkshops )
    .post( authenticate, authorize( [ 'admin' ] ), Controllers.postWorkshop );
```
- You should now, not be able to add a workshop unless you send the token of an _admin_ user. Try with the token of an _admin_ and a _general_ user. Sample request
```
POST /api/workshops

Header
---
Authorization: Bearer <token_obtained_on_login_of_an_admin_user>

Body
---
{
    "name": "jQuery",
    "category": "frontend",
    "description": "jQuery is a JavaScript library",
    "startDate": "2020-03-01T04:00:00.000Z",
    "endDate": "2020-03-03T08:00:00.000Z",
    "startTime": {
        "hours": 9,
        "minutes": 30
    },
    "endTime": {
        "hours": 13,
        "minutes": 30
    },
    "speakers": [
        "John Doe",
        "Jane Doe"
    ],
    "location": {
        "address": "Tata Elxsi, Prestige Shantiniketan",
        "city": "Bangalore",
        "state": "Karnataka"
    },
    "modes": {
        "inPerson": true,
        "online": false
    },
    "imageUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/JQuery_logo.svg/524px-JQuery_logo.svg.png"
}
```

## Step 33: Set up authentication/authorization for relevant API endpoints
- All endpoints that mutate __workshops__ resource are allowed for _admin_ role, and all endpoints that mutate __sessions__ resource are allowed for authenticated users (no role-specific authorization).
- In `src/routes/workshops.route.ts`
```js
router.route('/')
    .get( Controllers.getWorkshops )
    .post( authenticate, authorize( [ 'admin' ] ), Controllers.postWorkshop );

router.route('/:id')
    .get( Controllers.getWorkshopById )
    .patch( authenticate, authorize( [ 'admin' ] ), Controllers.patchWorkshop )
    .delete( authenticate, authorize( [ 'admin' ] ), Controllers.deleteWorkshop );

router.route('/:id/speakers' )
    .patch( authenticate, authorize( [ 'admin' ] ), Controllers.addSpeakers );

router.route( '/:id/sessions' )
    .get( Controllers.getSessions )
    .post( authenticate, Controllers.postSession );
```
- In `src/routes/sessions.route.js`
```js
import express from 'express';
import * as Controller from '../controllers/sessions.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
    // .get( Controller.getSessions )
    .post( authenticate, Controller.postSession );

router.patch( '/:id/upvote', authenticate, Controller.patchUpvote );
router.patch( '/:id/downvote', authenticate, Controller.patchDownvote );

export default router;
```

## Step 34: Setup CORS middleware
```bash
npm i cors
```
- Make sure you have a `NODE_ENV` environment variable set to "development" or "production" based on the app's environment. In `src/app.ts`
```ts
import cors from 'cors';
```
```ts
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:4200", // eg. Allow the Angular app in development
      // `credentials: true` tells the server to allow browsers to send credentials (cookies, HTTP authentication headers, TLS client certs) with cross-origin requests - If your API is stateless and uses JWT tokens in headers (Authorization: Bearer ...), you usually don't need this.
      credentials: true,
    })
  );
} else {
  app.use(
    cors({
      origin: "https://your-angular-app.com", // eg. Allow the deployed (production) Angular app
      credentials: true,
    })
  );
}
```

## Step 35: Implement session voting feature using web sockets
- Web sockets enable real-time 2-way data communication between client and server in web applications. The Web Socket protocol is built on top of HTTP in the sense the `ws` connection is established over `http` / `https`. We enable web socket support using [`socket.io`](https://socket.io/docs/v4/server-api/). Install it.
```bash
npm i socket.io
```
- In `src/middleware/socket-auth.js`
```js
const jwt = require('jsonwebtoken');

const socketAuthMiddleware = (socket, next) => {
  console.log( 'socket middleware' );
  const token = socket.handshake.auth?.token || socket.handshake.headers['authorization'];

  if (!token || !token.startsWith('Bearer ')) {
    return next(new Error('Authentication token missing or invalid'));
  }

  const actualToken = token.replace('Bearer ', '');

  try {
    const payload = jwt.verify(actualToken, process.env.JWT_SECRET);
    socket.user = payload; // attach decoded user info to the socket
    next();
  } catch (err) {
    next(new Error('Invalid or expired token'));
  }
};

module.exports = socketAuthMiddleware;
```
- In `src/sockets/voting.socket.js`
```js
const sessionService = require('../services/sessions.service');
const socketAuth = require('../middleware/socket-auth');

module.exports = (io) => {
  // Attach middleware to every connection
  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log(`User ${socket.user?.email || socket.user?.id} connected via socket`, socket.id);

    socket.on('upvote', async (sessionId) => {
      try {
        const updated = await sessionService.upvoteSession(sessionId);
        io.emit('sessionUpdated', updated);
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('downvote', async (sessionId) => {
      try {
        const updated = await sessionService.downvoteSession(sessionId);
        io.emit('sessionUpdated', updated);
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
```
- In `src/app.js`
```js
const http = require( 'http' );
const { Server } = require('socket.io');
```
- Update the CORS settings so that the same CORS policy is enforced by the HTTP (REST API) server and the socket server.
```js
let corsOptions;

if (process.env.NODE_ENV === "development") {
  corsOptions = {
    origin: "http://localhost:4200",
    credentials: true,
  };
} else {
  corsOptions = {
    origin: "https://your-angular-app.com", // ✅ replace with real prod URL
    credentials: true,
  };
}

// Apply the existing CORS options to Express using the corsOptions object instead...
app.use(cors(corsOptions));

// more code...
// ...

// app.listen( PORT );

// Replace app.listen( PORT ) with the following for setting up web socket support
const server = http.createServer(app);

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    // not spreading the corsOptions object as some option properties may differ between the HTTP (Rest API) server and the CORS server
    origin: corsOptions.origin,
    credentials: corsOptions.credentials,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  },
});

require('./sockets/voting.socket')(io); // socket logic in separate module

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```
__NOTE__: Linked above is the server API. This is the link to the [client API](https://socket.io/docs/v4/client-api/).

## Step 36: Include Hemlet for enforcing some basic security best practices
- Helmet is a library that is used to enforce some basic security best practices (setting right HTTP headers/removing unnecessary ones). Check the Express documentation for a discussion on it - https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
- Install Helmet
```sh
npm install helmet
```
- In `src/app.js`
```js
// import helmet...
const helmet = require('helmet');
```
```js
const app = express();
// add this...
app.use(helmet());
```

## Step 37: Rate-limit the API requests
- __Rate limiting__ is a technique used to control the number of requests a client can make to an API within a specific time window, protecting the system from abuse, overload, or denial-of-service attacks. It ensures fair usage by rejecting or delaying excess requests once the defined limit is reached.
- We implement rate-limiting here using [`express-rate-limit`](https://www.npmjs.com/package/express-rate-limit). We use a memory store here to store requests data required for rate-limiting, but the package supports external stores like Redis which provide a more practical way to store this data.
```sh
npm i express-rate-limit request-ip
```
- In `src/middleware/limiter.js` we add this - we are rate-limiting (here, 10 requests per minute) by the API key if the API supports API keys (eg. you are build an API to be consumed by other apps that are required to register with your app to get an API key). If not, rate-limiting is done via the IP address of the incoming request.
```js
const { getClientIp } = require('request-ip');
const rateLimit = require('express-rate-limit');

// Configure in-memory rate limiter
const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,                        // v7+: use `limit` (not `max`)
    standardHeaders: 'draft-7',       // sends RateLimit-* headers
    legacyHeaders: false,             // no X-RateLimit-* headers
    // Use API key or user id if you have one; otherwise fallback to an IPv6-safe key:
    keyGenerator: (req, res) => {
        // Example: prefer an API key header first (optional)
        const apiKey = req.get('x-api-key');
        if (apiKey) return apiKey;

        // Fallback: client IP via request-ip, normalized for IPv6
        const ip = getClientIp(req) || req.ip || 'unknown';
        // Optionally pass a subnet size (eg /64). If omitted, library default is used.
        return rateLimit.ipKeyGenerator(ip /*, 64 */);
    },
    handler: (req, res) => {
        const error = new Error('You have exceeded the maximum number of requests. Please try after some time.');
        error.status = 429;
        throw error;
    },
});

module.exports = limiter;
```
- In `src/app.js`
```js
const limiter = require( './middleware/limiter' );
```
```js
app.use(helmet());

// add this...
app.use(limiter);
```

## Step 38: Sanitize user-generated content
- Sanitizing user-generated content means cleaning or transforming input (like text, HTML, or form data) to remove malicious code such as __Cross-Site Scripting (XSS)__ or __SQL injection__ attempts (eg. JavaScript injected onto web pages using `script` tags placed in rich HTML text). It ensures that only safe, expected data is stored or rendered, protecting both your application and its users. Examples of user-generated content - user blog posts and reviews, product reviews, social media posts etc. A package like [`sanitize-html`](https://www.npmjs.com/package/sanitize-html) can help remove malicious content from user-generated data, before it is gets stored in the database.
- Install it
```
npm i sanitize-html
```
- Set up the configuration for sanitizing user-generated content in `src/config/santize.js`
```js
const sanitizeHtml = require('sanitize-html');

const DESCRIPTION_POLICY = {
  // keep it tight; add tags only if you truly need them
  allowedTags: [
    'b','strong','i','em','u','s',
    'p','br','ul','ol','li',
    'blockquote','code','pre',
    'h1','h2','h3','h4','h5','h6',
    'a','img'
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    '*': ['title'] // very limited global attrs
  },
  // Only allow safe URL schemes; blocks javascript:, data: by default (except data for images if you add it)
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  // If you *must* allow data URLs for images, add: 'data' to allowedSchemesByTag.img
  allowedSchemesByTag: {
    img: ['http', 'https'] // add 'data' if you trust your inputs
  },
  // Add `rel="noopener nofollow"` etc. on anchors you keep
  transformTags: {
    'a': sanitizeHtml.simpleTransform('a', { rel: 'noopener nofollow ugc' }, true)
  },
  // Enforce <a target> safety if you allow target
  allowedIframeHostnames: [], // keep empty unless explicitly needed
};

function sanitizeDescription(html) {
  if (typeof html !== 'string') return '';
  return sanitizeHtml(html, DESCRIPTION_POLICY);
}

module.exports = { sanitizeDescription };
```
- In `src/controllers/workshops.controller.js`
```js
const { sanitizeDescription } = require('../config/sanitize' );
```
- Sanitize the new workshop object that is received in the POST request
```js
const postWorkshop = async ( req, res /*, next */ ) => {
    // existing code...
    // ...

    // sanitize only the rich-HTML field - description; leave other fields as plain text
    if (newWorkshop.description !== undefined) {
        newWorkshop.description = sanitizeDescription(newWorkshop.description);
    }

    try {
        const updatedWorkshop = await services.addWorkshop( newWorkshop );
        
        // existing code...
        // ...
    } catch( error ) {
        // existing code...
        // ...
    }
};
```

## Step 39: Add Winston for general logging
- We had added Morgan earlier for request logging. Winston is the de-facto standard logging library for Node.js for general-purpose logging. It gives you log levels, formatting, transports (console, file, JSON, etc.), and works great with Express.
- Install Winston
```bash
npm install winston
npm install --save-dev @types/winston
```
- Create a logger module `src/logger.ts`.
```ts
import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info", // default log level
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.colorize(),         // adds colors
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),               // log to console
    new transports.File({ filename: "logs/error.log", level: "error" }), // log errors
    new transports.File({ filename: "logs/combined.log" })               // log everything
  ],
});

export default logger;
```
- Use the logger throughout the app. Some examples are provided below. Add more logging yourself throughout.
- In `src.app/js`
```js
const logger = require( "./logger" );
```
```js
server.listen(PORT, () => {
    // no need to separately log to console now as the Winston logger does that along with loggin to file transport
    // console.log(`Server listening on port ${PORT}`);

    logger.info(`Server listening on port ${PORT}`);
});
```
- In `src/controllers/index.controller.js`
```js
const logger = require( "../logger" );
```
```js
const getHome = ( req, res ) => {
    logger.info("Root endpoint was hit");
    res.redirect( '/' );
};
```
- In `src/middleware/errors.js`
```js
const logger = require( "../logger" );
```
```js
// resource not found middleware
const notFoundHandler = ( req, res ) => {
    const err = new Error( 'Resource not found' );
    err.status = 404;
    
    logger.error(`Error: ${err.message}`);
    
    throw err;
};

// global error handler middleware
const errorHandler = ( err, req, res, next ) => { // a middleware with 4 arguments is an "Error handler middleware"
    const status = err.status || 500;

    const responseBody = {
        status: 'error',
        message: err.message
    };

    logger.error(`Sending error response:\n${JSON.stringify( responseBody, null, 4 )}\n`);

    res.status( status ).json( responseBody );
    // next(); // not a good idea to call next when a response is also sent
};
```
- Log files created:
* `logs/error.log` → only errors
* `logs/combined.log` → all logs

## Step 40: Enable file upload
- We use `multer` package to upload files. Install `multer`
```bash
npm i multer
```
- Todo