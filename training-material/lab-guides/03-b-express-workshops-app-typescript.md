# Building the Workshops App API Server using Express JS
We build the API server for the Workshops App (serves only data, and not HTML views).

- __Documentation__:
    - https://nodejs.org/docs/latest/api/
    - https://expressjs.com/
- __Production database__: `mongodb+srv://admin:<db_password>@cluster0.9d7mmqx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    - Check with the instructor for `db_password`
- Completed frontend app can be run from the `demos/01-angular/workshops-app` folder

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

app.listen( PORT );
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
        "endDate": "2019-20-22T07:00:00.000Z",
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
        "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAz1BMVEXjTyb////vZSrr6+vpWijtYSnr8PHuWg7jQwv61czjRxbvYR7owrz++fb5y7/mnpDjSx7r5ePouLDhPgD2sZ3leGDiRhXiSRvlUybvYSHuVwDiQQb76OTr8/ThOgD6497xrqH98/D73NLyt6vwq53jUiroc1jqgWrmmovrinXpzsj31M30wbbsk4DnbVDjWTXnrqPkYD/q2NTxdkX1pYv3var2rpb0m3zzj2v5zb7mZkXxfVHwajDqZz3odVrovrXmi3jyimXxe075xbX0noHFi51LAAANlElEQVR4nN3d61rbOBAGYAI0MYaAwZAAIQnhFE5JOJRDabeFpfd/TWvT7kKlmfnksRQvzL99nm3wi030RRopM7W3tZHMvP/qLPxhmvnjv07aVV+eh0r7gvA4rvryPFS6Iwj3W1VfnodqNQXheVT15XmopCYIFzpVX56HmkjCflr15ZWvZCwJdz6AsH0iCZsf4J0mPpaEtQ8w4rcOROHk/ROjc1E4fv/Czpko/ACxLd0ThR8gthmhzRQevP8307QpCj9AbGvXRGH42Db/yXNt/vn6yaUs3AseauZnPZcpHMvC8LEtuHAoC5vvT2i8fnskC8PHttBCM7RZwsvQxNDCaB8Ij96b8JMpXAbCYejYFlpohjZLOAod23wL503hDhAGj23BhQMg3A8d20ILoxoQLr93YYKEwWObb6EZaR6QMHhsCy00Q5slHIT+cOFbaLy8FdosYe29/R0aL99agcL3lmlMoRnabOFDYKJnIQxttnD4voXpGRSOAgfT0MI+FK4Ejm2ehTC02cLQy8CBhXETCkPHtsDCiemxhWeBQ41nIQxtthAvA0flqlGmtpDwOxYOkDBaWypTZwslau/OJBoXZy4AU8Im+pCfXtXLlHUFhep2URbGVmizhbUJEHZO58pUOeEdELZ2HYQotkVL9eqET+"
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
const workshops from '../data/workshops.json';

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

## Step 11: Connecting to a MongoDB database
- We connect to a MongoDB database hosted on [MongoDB Atlas (official MongoDB cloud service)](https://www.mongodb.com/products/platform/atlas-database). To do so, we can use the [official MongoDB driver for Node JS runtime](https://www.mongodb.com/docs/drivers/node/current/). But it is low-level - if we instead use something like [Mongoose JS](https://mongoosejs.com/), it can help us simplify queries, set up schema-based validation, provide hooks to tap into queries (running logic before and after certain queries) etc. We first install Mongoose.
```bash
npm i mongoose
```
- Update the `.env` file with `DB_CONNECTION_STRING`. Get the `<db_password>` from the instructor.
```
DB_CONNECTION_STRING=mongodb+srv://admin:<db_password>@cluster0.9d7mmqx.mongodb.net/workshopsDB?retryWrites=true&w=majority&appName=Cluster0
```
- Create an `src/data/init.ts` file. In it
```js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let connectionStr;

if (process.env.DB_CONNECTION_STRING) {
    connectionStr = process.env.DB_CONNECTION_STRING;
} else {
    console.log('DB connection string not found in environment');
    process.exit(1);
}

const connect = async () => {
    try {
        await mongoose.connect( connectionStr );
        console.log( 'connected to the db' );
    } catch( error ) {
        console.log( 'unable to connect to the db : ' + error.message );
        process.exit(1);
    }
};

connect();
```
- Set up the DB connection by invoking this file at startup in `src/app.ts` at the very top.
```ts
import './data/init';
```
- You should get the _connected to the db_ message when you restart the app.

## Step 12: Define Workshops Model
- Define interfaces related to the workshop model. These define the shape of a Workshop document in the workshops collection that is part of the app. In `src/models/IWorkshop.ts`
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
    _id: string;
    name: string;
    category: 'frontend' | 'backend' | 'database' | 'devops' | 'language' | 'mobile';
    // id: Number,
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
- Mongoose let you define a __schema__ for a resource. When we try to add a new document to the MongoDB collection for example, the document is validated against the schema, and added only if it is valid. Once a schema is defined a __Model__ is created from it. The Model is a class for every resource that lets us make queries on the related collection.
- Define the Time schema in `src/data/models/Time.ts` - we need to define the Model class only if a corresponding collection is needed. Time schema here is just part of the larger schema - Workshop (defined below). Hence a model is not to be created for it.
```ts
/** No model is created from this schema (therefore no collection as well). This is intended to be used as part of other schemas */
import mongoose from 'mongoose';
import { ITime } from '../../models/IWorkshop';

const TimeSchema = new mongoose.Schema<ITime>(
    {
        hours: {
            type: Number,
            required: true,
            min: 0,
            max: 23,
        },
        minutes: {
            type: Number,
            default: 0,
            min: 0,
            max: 59,
        },
    },
    { _id: false } // a unique _id will be generated for every time part of every document. But we do not need it in this app.
);

export { TimeSchema };

```
- Define the Workshop resource schema and model in `src/data/models/Workshop.ts`
```ts
import mongoose from 'mongoose';
import { TimeSchema } from './Time';
import IWorkshop from '../../models/IWorkshop';

/**
 * In MongoDB, the documents can store related information together
 * For example, we can store the sessions (topics) for a particular workshop
 *      1. in the workshop document as an array, say "sessions" (preferred way)
 *      2. in a separate collection (say, Sessions), and store the array of related session ids
 */
const workshopsSchema = new mongoose.Schema<IWorkshop>({
    // name: String, // if we do not want validation except type validation, we can do this
    name: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        enum: ['frontend', 'backend', 'database', 'devops', 'language', 'mobile'],
    },
    // id: Number,
    description: {
        type: String,
        required: true,
        maxLength: 1024,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        default: Date.now,
    },
    startTime: {
        type: TimeSchema,
        required: true,
    },
    endTime: {
        type: TimeSchema,
        required: true,
    },
    location: {
        address: String,
        city: String,
        state: String,
    },
    modes: {
        inPerson: Boolean,
        online: Boolean,
    },
    imageUrl: String,
    speakers: {
        type: [String],
        required: true,
    },

    // 1. store sessions as an array - preferred way
    // sessions: {
    //     type: [
    //         sessionSchema
    //     ]
    // }

    // 2. store session ids
    // sessions: {
    //     type: [ mongoose.Schema.Types.ObjectId ]
    // },
});

// The name of the collection is the plural form of the name of the Model
export default mongoose.model('Workshop', workshopsSchema);
```
- __Notes__:
    - By passing the interface (here `IWorkshop`) to the `mongoose.Schema` constructor we ensure that the schema matches the interface, and  that TypeScript is aware that we for example retrieve `IWorkshop[]` when we make a call to Workshop model's `find()`, or `IWorkshop` when we make a call to the Workshop model's `findById()` etc.
    - When we call `mongoose.model()` we pass the following arguments
        * a name to register the model in Mongoose with. Later we use this name (for example in the services) to retrieve the registered model by again calling `mongoose.model()` but with a single argument - the registered name.
        * The schema
        * Optionally, the name of the collection. By default the name of the collection is the plural form of the registered name of the Model (yes, Mongoose uses a dictionary of English words!)
    - The `mongoose.model()` method returns the newly created model. We export this here. We usually do not need to export it as `mongoose.model()` called with the registered name can be used to retrieve the model anywhere in the application.

- Import it in `src/data/init.ts` in order to create the model at app startup.
```ts
import mongoose from 'mongoose';
```
```ts
// create the collections (tables) if not present
import './models/Workshop';

// rest of code...
// ...
```

## Step 13: Define Workshop Service and use the MongoDB database
- We shall create methods to get workshops, create a new workshop etc. This logic may be used in various places repeatedly. Hence we define these in a separate _Services_ layer. Services in general refer to any logic shared across the application.
- Define the following custom Error object is not already done so in `src/models/utils.ts`
```ts
import { NextFunction, Request, Response } from 'express';

export type ErrorWithStatus = Error & {
    status?: number;
    code?: number;
    type?: string;
};

export type Controller = (req: Request, res: Response, next?: NextFunction) => void;
```
- In `src/services/workshops.service.ts`, define the methods to get all workshops and create a new workshop
```js
const mongoose = require("mongoose");
const Workshop = mongoose.model("Workshop");

const getAllWorkshops = async () => {
    const workshops = await Workshop.find();
    return workshops;
};

const addWorkshop = async (workshop: Omit<IWorkshop, '_id'>) => {
    try {
        const insertedWorkshop = await Workshop.create(workshop);
        return insertedWorkshop;
    } catch (err) {
        const error = err as ErrorWithStatus;

        if (error.name === 'MongoServerError' && error.code === 11000) {
            error.type = 'ValidationError';
        }

        if (error.name === 'ValidationError') {
            error.type = 'ValidationError';
        }

        if (error.name === 'CastError') {
            error.type = 'CastError';
        }

        throw error;
    }
};

module.exports = {
    getAllWorkshops,
    addWorkshop,
};
```
- Modify the workshops controller to make use of the database. You don't need Joi for validation now as Mongoose does that for you. In `src/controllers/workshops.controller.ts`
```js
import { Controller, ErrorWithStatus } from '../models/utils';

import * as Service from '../services/workshops.service';

// http://localhost:3000/api/workshops
// http://localhost:3000/api/workshops?page=1&sort=name&category=frontend
// http://localhost:3000/api/workshops?sort=name&category=frontend
const getWorkshops: Controller = async (req, res) => {
    const workshops = await Service.getAllWorkshops();

    res.json({
        status: 'success',
        data: workshops
    });
};

const postWorkshop: Controller = async (req, res) => {
    const newWorkshop = req.body;

    // Check if body is sent and not empty
    if (!newWorkshop || Object.keys(newWorkshop).length === 0) {
        const err = new Error('The request body is empty. Workshop object expected.');
        err.status = 400;
        throw err;
    }

    try {
        const updatedWorkshop = await addWorkshop( newWorkshop );
        res.status(201).json({
            status: 'success',
            data: updatedWorkshop
        });
    } catch( error ) {
        error.status = 400;
        throw error;
    }
};

export {
    getWorkshops,
    postWorkshop
};
```
- You should now be able to get all workshops in the database (initially empty), and add new workshops. Also check if field validations are working fine. You will see most are, but type-casting is allowed by default (eg. name is passed as a number and is accepted). We disable this behavior by setting this in `src/data/init.ts`
```ts
const mongoose = require( 'mongoose' );

// disallows saving fields not in the schema
mongoose.set('strictQuery', true);
mongoose.set('strict', true);

// prevent casting - Be careful, this affects all String fields globally!
mongoose.Schema.Types.String.cast((v: string) => {
    if (typeof v !== 'string') {
        throw new Error('Value must be a string');
    }
    return v;
});

// create the collections (tables) if not present
import './models/Workshop';

// rest of code...
// ...
```
- Restart and check now - you should not be able to add name as a number (for example).

## Step 14: Set up centralized error handling
- Instead of duplicating error checks in the services, we can have the errors thrown by the services, fall through the controller and passed on. to the error handler middleware. The error handler middleware can handle the errors and set appropriate error type and status code for the response. This way we can keep the error handling logic DRY, and remove the need for writing error-specific logic in the services and the controllers.
- Remove error handling from the service `src/services/workshops.service.ts`
```ts
const addWorkshop = async (workshop: Omit<IWorkshop, '_id'>) => {
    const insertedWorkshop = await Workshop.create(workshop);
    return insertedWorkshop;
};
```
- Remove the error-handling for error thrown by the service, in the controller `src/controllers/workshops.controller.ts`
```ts
const postWorkshop: Controller = async (req, res) => {
    // existing code
    // ...

    // Remove the try..catch block here...
    const updatedWorkshop = await Service.addWorkshop(newWorkshop);
    res.status(201).json({
        status: 'success',
        data: updatedWorkshop,
    });
};
```
- Add centralized error handling in `src/middleware/errors.ts`. The `enrichResponseError` checks for errors thrown by Mongoose and adds an appropriate `type` and `status` to the errors. The error handler middleware calls `enrichResponseError` to enrich the errow with these properties.
```ts
import { NextFunction, Request, Response } from 'express';
import { ErrorWithStatus } from '../models/utils';

import mongoose from 'mongoose';

// Utility to enrich error with type and status code
export const enrichResponseError = (error: ErrorWithStatus) => {
    // Duplicate key error (e.g. unique index violation)
    if (error instanceof mongoose.Error && (error as any).code === 11000) {
        error.type = 'DuplicateKeyError';
        error.status = 400;
    }

    // Mongoose ValidationError (schema validation, required fields, minlength, etc.)
    if (error instanceof mongoose.Error.ValidationError) {
        error.type = 'ValidationError';
        error.status = 400;
    }

    // CastError (invalid ObjectId, number cast failure, etc.)
    if (error instanceof mongoose.Error.CastError) {
        error.type = 'CastError';
        error.status = 400;
    }

    // DocumentNotFoundError (if you use `orFail()`)
    if (error instanceof mongoose.Error.DocumentNotFoundError) {
        error.type = 'NotFound';
        error.status = 404;
    }

    // StrictModeError (if strict schema is enabled and unknown fields appear)
    if (error instanceof mongoose.Error.StrictModeError) {
        error.type = 'StrictModeError';
        error.status = 400;
    }

    // ParallelSaveError (two save calls on same doc simultaneously)
    if (error instanceof mongoose.Error.ParallelSaveError) {
        error.type = 'ParallelSaveError';
        error.status = 409; // conflict
    }

    // VersionError (document version mismatch, optimistic concurrency control)
    if (error instanceof mongoose.Error.VersionError) {
        error.type = 'VersionError';
        error.status = 409; // conflict
    }

    // MongoDB native driver errors (not wrapped by Mongoose)
    if (error.name === 'MongoServerError') {
        error.type = 'MongoServerError';
        error.status = 500;
    }

    // Fallback — unknown error
    error.type = error.type || 'InternalServerError';
    error.status = error.status || 500;
    
    return error;
};

export const resourceNotFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const err: ErrorWithStatus = new Error('Resource not found');
    err.status = 404;
    err.type = 'Not Found';

    // pass an error object to transfer control directly to the erro handler middleware (error handler middlware need not be the next one in the middleware chain) / or, throw an error
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
- You will get TypeScript issues due to type narrowing of the error object in `enrichResponseError()`. We can set up a Type Definition file to extend built-in Mongoose error types. In `src/types/mongoose/error.ts`
```ts
import 'mongoose';

declare module 'mongoose' {
    namespace Error {
        interface ValidatorError {
            status?: number;
            type?: string;
        }
        interface CastError {
            status?: number;
            type?: string;
        }
        interface ValidationError {
            status?: number;
            type?: string;
        }
        interface DocumentNotFoundError {
            status?: number;
            type?: string;
        }
        interface StrictModeError {
            status?: number;
            type?: string;
        }
        interface ParallelSaveError {
            status?: number;
            type?: string;
        }
        interface VersionError {
            status?: number;
            type?: string;
        }
    }
}
```
Now the error-handling logic need not be repeated across service or in the controller when calling service methods, resulting in DRY code.

## Step 15: Adding sorting and pagination support
- We now support serving the list of workshop sorted by a user-supplied field, and also 10 records at a time. Additionally list API does not need to serve all fields to the client - hence we omit description, reducing the API response size. Both `find()` and `countDocuments()` take a filtering criteria as an argument. In the service `src/services/workshops.service.ts`
```ts
const getAllWorkshops = async (page: number, sortField: string = '', category = '') => {
    const filters: Record<string, any> = {};

    if (category) {
        filters.category = category;
    }

    // if we do not await, the query does not execute immediately (it will only execute when the function pauses/completes without pausing) - this allows us to customize the query (Add sorting, pagination etc.)
    const query = Workshop.find(filters);

    // We can either blacklist or whitelist fields. Here we blacklist (i.e. omit certain fields)
    query.select({
        description: false
    });

    if (sortField) {
        query.sort({
            [sortField]: 1,
        });
    }

    // pagination (assuming 10 per page)
    query.skip(10 * (page - 1)).limit(10);

    const [ workshops, count ] = await Promise.all(
        [
            query.exec(),
            Workshop.countDocuments(filters)
        ]
    );

    return {
        workshops,
        count
    };
};
```
- In the controller `src/controllers/workshops.controller.ts` we add support for `page` and `sort` query string parameters.
```ts
// http://localhost:3000/api/workshops
// http://localhost:3000/api/workshops?page=1&sort=name&category=frontend
interface GetWorkshopsQuery {
    page?: string | number; // query strings are always string or undefined. But we shall type cast this property to a number.
    sort?: string;
    category?: string;
}

const getWorkshops: Controller = async ( req, res ) => {
    let { page, sort: sortField, category } = req.query as GetWorkshopsQuery;

    if( page ) {
        page = +page;
    } else {
        page = 1;
    }

    const workshopsWithCount = await Service.getAllWorkshops( page, sortField, category );

    // send(), redirect(), json(), sendFile(), render() are other methods on response `res` object
    res.json({
        status: 'success',
        data: workshopsWithCount,
    });
};
```
- Some sample requests
```
http://localhost:3000/api/workshops
http://localhost:3000/api/workshops?page=1&sort=name&category=frontend
```
- __NOTE__: Instead of asserting the type of `req.query` you can also set the generic type parameters of the Express `Request` object (`Request<ParamsDictionary = {}, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>`). Find out how - an example of this (although for request params, and not request query) is illustrated in the next step!

## Step 16: Support getting a single workshop by its id
- The Mongoose Model `findById()` let's us retrieve a document by its unique `_id`. We use it to set up a service method to get a workshop by its `_id` in `src/services/workshops.service.ts`
```ts
const getWorkshopById = async (id: string) => {
    const workshop = await Workshop.findById(id);

    if (workshop === null) {
        const error: ErrorWithStatus = new Error('No such workshop');
        error.type = 'NotFound';
        throw error;
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
- Now in `src/controllers/workshops.controller.ts`, we support `GET /api/workshops/:id`. Note how a dynamic path parameter is configured in the Express router - the `:` indicates a dynamic path parameter, and `id` shall be the property within `req.params` which shall be set to the actual value.
```ts
interface WorkshopIdParams {
    id: string;
}

// http://localhost:3000/api/workshops/:id
const getWorkshopById = async (req: Request<WorkshopIdParams>, res: Response) => {
    const { id } = req.params;

    try {
        const workshop = await Service.getWorkshopById(id);

        res.json({
            status: 'success',
            data: workshop,
        });
    } catch (error) {
        (error as ErrorWithStatus).status = 404;
        throw error;
    }
};
```
```ts
export {
    getWorkshops,
    getWorkshopById,
    postWorkshop
};
```
- Add the route in `src/routes.workshops.route.ts`. Note that since there is an extra dynamic path fragment, we need to configure the route separately.
```ts
import express from 'express';
import * as Controllers from '../controllers/workshops.controller';

const router = express.Router();

router.route('/').get(Controllers.getWorkshops).post(Controllers.postWorkshop);

// Add this...
router.route('/:id').get(Controllers.getWorkshopById);

export default router;
```
- A sample request (surely, a workshop with the given `_id` shoudl exist in the database)
```
http://localhost:3000/api/workshops/6873679dac11710477aa5d60
```
- By default methods like `findById()`, that find a document by its `_id` return `null` when no matching documen is found. So you need o handle this case and throw a not found error. You can automate this behavior by chaining the method call with `orFail()` which sets up the query to throw an error if no matching document is found. Simplify the code in the following files using this approach.
- In `services/workshops.service.ts`
```ts
const getWorkshopById = async (id: string) => {
    const workshop = await Workshop.findById(id).orFail();

    return workshop;
};
```
- In `controllers/workshops.controller.ts`
```ts
const postWorkshop = async (req: Request<{}, {}, IWorkshop>, res: Response) => {
    const newWorkshop = req.body;

    // Check if body is sent and not empty
    if (!newWorkshop || Object.keys(newWorkshop).length === 0) {
        const err = new Error(
            'The request body is empty. Workshop object expected.'
        ) as ErrorWithStatus;
        err.status = 400;
        throw err;
    }

    // Remove the try..catch so that the service error is propagated to the error hanler middleware when a workshop is not found
    const updatedWorkshop = await Service.addWorkshop(newWorkshop);
    res.status(201).json({
        status: 'success',
        data: updatedWorkshop,
    });
};
```
- The error handler middleware is still able to send a 404 response when a workshop is not found!

## Step 17: Supporting update of workshop
- The Mongoose Model `findByIdAndUpdate()` let's us update a document having the unique `_id`. We use it to set up a service method to partially update a workshop matching the given `_id` in `src/services/workshops.service.ts`
```ts
const updateWorkshop = async (id: string, workshop: IWorkshop) => {
    // NOTES
    // ---
    // 1. By default, MongoDB $set operator is applied to the fields. FOr an array field, we explicitly use an operator like $push to addd to an existing array (else it will be completely replaced).
    /**
     *  {
            $set: {
                "name": "Express JS v5",
                "category": "backend"
            }
        }
     */
    // 2. By default Mongoose will not perform schema validations on update. We need to explicitly configure Mongoose to do so.
    // we do not need to pass returnOriginal / new if it has been configured similalrly at a global level
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
        id,
        workshop /*, {
        // returnOriginal: false
        new: true
    } */
    ).orFail();

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
- In the controller `app/src/controllers/workshops.controller.ts`
```ts
const patchWorkshop = async (req: Request<WorkshopIdParams, {}, IWorkshop>, res: Response) => {
    const id = req.params.id;

    const workshop = req.body;

    // if workshop = req.body -> {}
    if( Object.keys( workshop ).length === 0 ) {
        const err = new Error('The request body is empty. A partial Workshop object expected.');
        err.status = 400;
        throw err;
    }

    const updatedWorkshop = await services.updateWorkshop( id, workshop );
    res.json({
        status: 'success',
        data: updatedWorkshop
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
- In the route file `app/src/routes/workshops.route.js`
```js
router.route('/')
    .get( Controllers.getWorkshops )
    .post( Controllers.postWorkshop );

router.route('/:id')
    .get( Controllers.getWorkshopById )
    .patch( Controllers.patchWorkshop );
``` 
- Make a request to update a workshop by its id. Sample request
```
localhost:3000/api/workshops/6873679dac11710477aa5d60

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
- You will see that validations do not run and the old details are returned. Now configure Mongoose to do validations on update, and return the updated document details by default. In `src/data/init.ts`
```ts
mongoose.set('strictQuery', true);
mongoose.set('strict', true);

// add these...
mongoose.set( 'returnOriginal', false );
mongoose.set( 'runValidators', true );

```
- Make an update request again. You will see the new details being returned.

## Step 18: Supporting deletion of workshop
- The Mongoose Model `findByIdAndDelete()` let's us update a document having the unique `_id`. We use it to set up a service method to partially update a workshop matching the given `_id` in `src/services/workshops.service.ts`
```ts
const deleteWorkshop = async (id: string) => {
    const deletedWorkshop = await Workshop.findByIdAndDelete(id).orFail();

    return deletedWorkshop;
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
- In
```ts
const deleteWorkshop = async (req: Request<WorkshopIdParams>, res: Response) => {
    const id = req.params.id;

    await Service.deleteWorkshop(id);
    // 204 -> use this status code for successful operation but you do not want to send any data in response (as in res.status(204).end())
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
- In `src/routes/workshops.route.js`
```js
router.route('/')
    .get( Controllers.getWorkshops )
    .post( Controllers.postWorkshop );

router.route('/:id')
    .get( Controllers.getWorkshopById )
    .patch( Controllers.patchWorkshop )
    .delete( Controllers.deleteWorkshop );
```
- Sample request
```
DELETE http://localhost:3000/api/workshops/6873679dac11710477aa5d60
```

## Step 19: Adding speakers
- If we do not want to replace and array field, and instead want to handle updates to it differently - for example by pushing new items to it, we need to do updates a bit differently (for example using the MongoDB `$addToSet` operator). We now support adding speakers for a workshop this way.
- In `src/services/workshops.service.ts`
```js
const addSpeakers = async (id: string, speakers: string[]) => {
    // by default, $set is applied to the fields
    // Therefore we ned to construct the update clause ourselves
    const updateClause = {
        $addToSet: {
            speakers: {
                $each: speakers,
            },
        },
    };

    const updatedWorkshop = await Workshop.findByIdAndUpdate(
        id,
        updateClause
    ).orFail();

    return updatedWorkshop;    
};
```
```js
module.exports = {
    getAllWorkshops,
    getWorkshopById,
    addWorkshop,
    updateWorkshop,
    deleteWorkshop,
    addSpeakers
};
```
- In `src/controllers/workshops.controller.ts`
```ts
// http://localhost:3000/api/workshops/62ed07b0437f58e437c01f57/speakers
// body -> [
//     "john.doe@example.com",
//     "jane.doe@example.com"
// ]
const addSpeakers = async (req: Request<WorkshopIdParams, {}, string[], {}>, res: Response) => {
    const id = req.params.id;
    const speakers = req.body;

    if (!(speakers instanceof Array) || speakers.length === 0) {
        const error: ErrorWithStatus = new Error(
            'Speakers must be a non-empty array. Data is missing or formed incorrectly'
        );
        error.status = 400;
        throw error;
    }

    const updatedWorkshop = await Service.addSpeakers(id, speakers);
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
- In `src/routes/workshops.route.ts`
```js
router.route('/')
    .get( Controllers.getWorkshops )
    .post( Controllers.postWorkshop );

router.route('/:id')
    .get( Controllers.getWorkshopById )
    .patch( Controllers.patchWorkshop )
    .delete( Controllers.deleteWorkshop );

router.route('/:id/speakers' )
    .patch( Controllers.addSpeakers );
```
- Sample request
```
PATCH localhost:3000/api/workshops/6873676dc9f4ad0bf84713f0/speakers

[
    "Diana Taylor",
    "David Taylor"
]
```

## Step 20: Adding topics for workshops - The Session Model
- We shall add topics (called sessions in the application) for a workshop.
- Begin by defining a `Session` interface in `src/models/ISession.ts`
```ts
type Level = 'Basic' | 'Intermediate' | 'Advanced';

interface ISession {
    _id: string;
    workshopId: string;
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
- Now define the Mongoose model `Session` in `src/data/models/Session.ts`
```js
import mongoose from 'mongoose';
import ISession from '../../models/ISession';

const sessionSchema = new mongoose.Schema<ISession>({
  workshopId: {
    type: String,
    required: true
  },
  sequenceId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  speaker: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true, // assuming duration is in hours
    min: 0.25        // optional: 15 minutes as minimum
  },
  level: {
    type: String,
    enum: ['Basic', 'Intermediate', 'Advanced'],
    required: true
  },
  abstract: {
    type: String,
    required: true,
    maxlength: 1024
  },
  upvoteCount: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('Session', sessionSchema);
```
- Import the new model file in `src/data/init.ts` so the `Session` model is defined at app startup.
```js
import './models/Workshop';
import './models/Session';
```

## Step 21: API to add a topics (sessions)
- Create `src/services/sessions.service.ts`
```ts
import mongoose from 'mongoose';
import ISession from '../models/ISession';
import { ErrorWithStatus } from '../models/utils';

const Session = mongoose.model('Session');
const Workshop = mongoose.model('Workshop');

const addSession = async (session: Omit<ISession, '_id'>) => {
    const workshop = await Workshop.findById(session.workshopId).orFail();

    if (!workshop) {
        const error: ErrorWithStatus = new Error(`Workshop not found`);
        error.type = 'ValidationError';
        throw error;
    }

    if (workshop) {
        const insertedSession = await Session.create(session);
        return insertedSession;
    }
};

export { addSession };
```
- In `src/controllers/sessions.controller.ts`
```ts
import { Request, Response } from 'express';

import * as Service from '../services/sessions.service';
import ISession from '../models/ISession';

const postSession = async (req: Request<{}, {}, ISession>, res: Response) => {
    const session = req.body;

    let newSession = await Service.addSession(session);

    res.status(201).json({
        status: 'success',
        data: newSession,
    });
};

export {
    postSession,
};
```
- In `src/routes/sessions.route.ts`
```ts
import express from 'express';
import * as Controller from '../controllers/sessions.controller';

const router = express.Router();

router.route('/')
    .post( Controller.postSession );

export default router;
```
- Add the new router as a middleware in `src/app.ts`
```ts
import sessionsRouter from './routes/sessions.route';
```
```ts
app.use( '/api/sessions', sessionsRouter );
```
- Sample request
```
POST /api/sessions

{
    "workshopId": "68736598bcd41b2ebd0233e1",
    "sequenceId": 1,
    "name": "Introduction to Express JS",
    "speaker": "John Doe",
    "duration": 1,
    "level": "Basic",
    "abstract": "In this session you will learn about the basics of Express JS"
}
```

## Step 22: Add a topic through workshops route
- With REST APIs, related resources can often be accesed in multiple ways. For example, we shall support accessing sessions both standalone (`/api/sessions`), and through the resource workshop resource (`/api/workshops/:id/sessions`). We now make changes to support access via the second route.
- In `src/controllers/workshops.controller.ts`
```ts
import * as SessionsService from '../services/sessions.service';
import ISession from '../models/ISession';
```
```ts
const postSession = async (
    req: Request<WorkshopIdParams, {}, Omit<ISession, '_id' | 'workshopId'>>,
    res: Response
) => {
    const workshopId = req.params.id;

    const session = {
        // workshopId: workshopId,
        workshopId,
        ...req.body,
    };

    let newSession = await SessionsService.addSession(session);

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
- In `src/routes/workshops.route.ts` add this
```js
router.route( '/:id/sessions' )
    .post( Controllers.postSession );
```
- Sample request
```
POST /api/workshops/68736598bcd41b2ebd0233e1/sessions

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
- In `src/services/sessions.service.ts`
```ts
const getSessions = async ( workshopId: string ) => {
    const workshop = await Workshop.findById( workshopId ).orFail();

    const sessions = await Session.find({
        workshopId: workshopId
    });

    return sessions;
};
```
```js
module.exports = {
    addSession,
    getSessions
};
```
- In `src/controllers/workshops.controller.ts`
```ts
// Sample: http://localhost:3000/api/workshops/62ed150ad0d302eca77f0f38/sessions
const getSessions = async (req: Request<WorkshopIdParams>, res: Response) => {
    const workshopId = req.params.id;

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
- In `src/routes/workshops.route.js`
```js
router.route( '/:id/sessions' )
    .get( Controllers.getSessions )
    .post( Controllers.postSession );
```
- Sample request
```
GET http://localhost:3000/api/workshops/62ed150ad0d302eca77f0f38/sessions
```
- __EXERCISE__: Modify the service, controller and add count of documents to the response.

## Step 24: Embed sessions when fetching details of a workshop
- We enable serving the list of sessions along with the workshop details. Make changes in `src/data/models/Workshop.ts` so it gets a __virtual field__ which shall hold the array of sessions for the workshop. When sending out workshop(s) in the response we generally would like the virtual fields to be serialized to JSON as well. For this reason we add appropriate options when setting up the `Workshop` model.
```js
const workshopsSchema = new mongoose.Schema(
    {
        // the field defintions
        // existing code...
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

workshopsSchema.virtual( 'sessions', {
    ref: 'Session',
    localField: '_id',
    foreignField: 'workshopId' // the field in the other collection (Session) that references a document in this collection (Workshop)
});
```
- In `src/services/workshops.service.ts` makes changes to populate the virtual `sessions` property with the list of sessions for the workshop, if `embedSessions` is set to `true`. For this we use the Mongoose model method - `populate()`
```ts
const getWorkshopById = async (id: string, embedSessions = false) => {
    const query = Workshop.findById(id).orFail();

    if (embedSessions) {
        query.populate('sessions');
    }

    const workshop = await query.exec();

    return workshop;
};
```
- In `src/controllers/workshops.controller.ts` pass on `embedSessions` based on the `embed` query string parameter value.
```js
// http://localhost:3000/api/workshops/:id
// http://localhost:3000/api/workshops/:id?embed=sessions
const getWorkshopById = async (req: Request<WorkshopIdParams & { embed: string }>, res: Response) => {
    const { id } = req.params;
    const embedSessions = req.query.embed === 'sessions';

    const workshop = await Service.getWorkshopById( id, embedSessions );

    res.json({
        status: 'success',
        data: workshop
    });
};
```
- Sample requests
```
GET http://localhost:3000/api/workshops/62ed150ad0d302eca77f0f38
GET http://localhost:3000/api/workshops/62ed150ad0d302eca77f0f38?embed=sessions
```

## Step 25: Enable voting on sessions
- We enable user to upvote / downvote on sessions. The session `upvoteCount` property is incremented / decremented in such case using the `$inc` operator of MongoDB.
- In `src/services/sessions.service.ts`
```ts
const upvoteSession = async (sessionId: string) => {
    const session = await Session.findByIdAndUpdate(sessionId, {
        $inc: { upvoteCount: 1 },
    }).orFail();

    return session;
};

const downvoteSession = async (sessionId: string) => {
    const session = await Session.findByIdAndUpdate(sessionId, {
        $inc: { upvoteCount: -1 },
    }).orFail();

    return session;
};

export {
    addSession,
    getSessions,
    upvoteSession,
    downvoteSession
};
```
- In `src/controllers/sessions.controller.ts`
```ts
interface SessionIdParams {
    id: string;
}

const patchUpvote = async (req: Request<SessionIdParams>, res: Response) => {
    const id = req.params.id;

    const updatedSession = await Service.upvoteSession(id);
    res.json({
        status: 'success',
        data: updatedSession,
    });
};

const patchDownvote = async (req: Request<SessionIdParams>, res: Response) => {
    const id = req.params.id;

    const updatedSession = await Service.downvoteSession(id);
    res.json({
        status: 'success',
        data: updatedSession,
    });
};

export {
    postSession,
    patchUpvote,
    patchDownvote
}
```
- In `src/routes/sessions.route.ts`
```ts
router.patch( '/:id/upvote', Controller.patchUpvote );
router.patch( '/:id/downvote', Controller.patchDownvote );
```
- Sample request
```
PATCH localhost:3000/api/sessions/6873b8b9f5aef68c5fcccad0/upvote
PATCH localhost:3000/api/sessions/6873b8b9f5aef68c5fcccad0/downvote
```

## Step 26: Enable authentication and authorization - Add user model
- We now enable authentication and authorization. 
- First set up the IUser interface in `src/models/IUser.ts`. We shall add a custom method `checkPassword` on User model instances, hence we extend the Mongoose Document type with `IUser` and ths method (defined in `IUserMethods`).
```ts
import { Document, Model } from 'mongoose';

type Role = 'admin' | 'general';

interface IUser {
    email: string;
    name: string;
    password: string;
    role: Role;
}

// Methods that live on *instances* (documents)
interface IUserMethods {
    checkPassword(plainTextPassword: string): Promise<boolean>;
}

// Document type = IUser fields + Mongoose Document methods + your methods
type UserDocument = Document & IUser & IUserMethods;

// Model type = normal Model with awareness of custom methods
export type UserModel = Model<IUser, {}, IUserMethods>;

export { UserModel as default, UserDocument, IUser, IUserMethods, Role };
```
- Next add the `User` model in `src/data/models/User.ts`. Note how we set up custom validators on certain paths (fields). Note that these have to be added to the schema before the model is created from it.
```ts
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, IUserMethods, UserModel } from '../../models/IUser';

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'general',
        enum: ['admin', 'general'],
    },
});

const emailPat = /^[A-Za-z0-9_\.]+@example\.com$/;
const passwordPat = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

// we can customize the schema further before model is created
userSchema
    .path('email')
    .validate(
        (email: string) => emailPat.test(email),
        'Invalid email. Please make sure the email is an example.com email.'
    );

userSchema
    .path('password')
    .validate(
        (password: string) => passwordPat.test(password),
        'Password must have at least 1 upper case, 1 lower case, 1 digit, 1 special characters, and should be 8 characters in length.'
    );

// Hide password field in JSON output
userSchema.set('toJSON', {
    transform: function (doc, ret: Partial<IUser>) {
        delete ret.password; // remove password
        return ret;
    },
});

export default mongoose.model<IUser, UserModel>('User', userSchema);
```
- Import the new model file in `src/data/init.ts` so the `User` model is defined at app startup.
```ts
import './models/Workshop';
import './models/Session';
import './models/User';
```

## Step 27: Add user registration support
- In `src/services/users.service.ts`
```ts
import mongoose from 'mongoose';
import IUser from '../models/IUser';

const User = mongoose.model( 'User' );

const addUser = async ( user : Omit<IUser, '_id'> ) => {
    const insertedUser = await User.create( user );
    return insertedUser;
};

export {
    addUser
};
```
- In `src/controllers/users.controller.ts`
```ts
import { Request, Response } from 'express';
import * as Service from '../services/users.service';
import UserModel, { IUser } from '../models/IUser';
import { ErrorWithStatus } from '../models/utils';

const register = async (req: Request<{}, {}, IUser>, res: Response) => {
    const user = req.body;

    // if user = req.body -> {}
    if (Object.keys(user).length === 0) {
        const error: ErrorWithStatus = new Error('Body is missing');
        error.status = 400;
        throw error;
    }

    // @todo Fix the type
    const updatedUser = await Service.addUser(user as any);

    // We need to remove password - we can remove it ourselves, but we have customized toJson behavior - so it will be removed automatically when sending the response as JSON.
    // delete userToSend.password; // not needed to be done manually

    res.status(201).json({
        status: 'success',
        data: updatedUser, // internally userToSend.toJSON() runs which returns details about the user that are part of the user document
    });
};

export { register };
```
- In `src/routes/users.route.ts`
```ts
import express from 'express';
import * as Controller from '../controllers/users.controller';

const router = express.Router();

router.post('/register', Controller.register);

export default router;
```
- Set the router as an application middleware in `src/app.ts`
```ts
import usersRouter from './routes/users.route';
```
```ts
app.use( indexRouter );
app.use( '/api/auth', usersRouter );
app.use( '/api/workshops', workshopsRouter );
app.use( '/api/sessions', sessionsRouter );
```
- You should now be able to register a user. Sample request
```
POST /api/auth/register

{
    "email": "john.doe@example.com",
    "name": "John Doe",
    "password": "Password123#",
    "role": "admin"
}
```
- __NOTE__: A public registration API like this would not support adding users with _admin_ role. Here it is enabled just for convenience.

## Step 28: Hashing passwords using bcrypt
- Passwords need to be hashed and store in databases so they are not available to anyone, including those with access to the database. The password needs to be __salted__ for additional security (even if 2 users have the same password, the hashed values are different - so a compromised password for one user, cannot be used to break into another user's account with the same password).
- The `bcrypt` package that uses C++ modules under-the-hood (or `bcryptjs` for a pure JS implementation that is not as performant) is popularly used for this purpose (what we need can be implemented using the built-in crypto module, but the API is not as friendly). Install it
```bash
npm i bcrypt
npm i --save-dev @types/bcrypt
```
- In `src/data/models/User.ts` we set up a pre-save hook that hashes the password when a user is added (user registration). A convenience method is also added to the model methods, that will help verify the plain text password against the hashed password at the time of user login. Note that these have to be added to the schema before the model is created from it.
```ts
import bcrypt from 'bcrypt';
```
```ts
// IMPORTANT: Decides the "strength" of the salt (should not be too high as salting will take long time and occupy CPU time (blocking) - nothing else will execute in the app in that time. should not be too low, else the password is not securely hashed)
const SALT_ROUNDS = 10;

// IMPORTANT: DO NOT use arrow function here (the "this" binding will not be set correctly for an arrow function)
userSchema.pre( 'save', function( done ) {
    const user = this; // const user -> new User()

    if( !user.isModified( 'password' ) ) {
        return done();
    }

    bcrypt.genSalt( SALT_ROUNDS, function( err, salt ) {
        if( err ) {
            return done( err ); // Mongoose will not insert the user document 
        }

        bcrypt.hash( user.password, salt, function( err, hashedPassword ) {
            if( err ) {
                return done( err );
            }

            user.password = hashedPassword;
            done(); // pass no arguments to done() to signify success
        });
    })
});

// will be used to compare plain text password with the hashed password at the time of login
userSchema.methods.checkPassword = async function( plainTextPassword: string ) {
    const hashedPassword = this.password;
    
    // this line will throw an error sometimes
    // if on the other hand bcrypt is able to compare it will return true / false
    const isMatch = await bcrypt.compare( plainTextPassword, hashedPassword );
    return isMatch;
}

export default mongoose.model<IUser, UserModel>('User', userSchema);
```

## Step 29: Add login support
- In `src/services/users.service.ts`
```ts
import mongoose from 'mongoose';
import IUser, { UserDocument } from '../models/IUser';
import { ErrorWithStatus } from '../models/utils';

const User = mongoose.model('User');

const addUser = async (user: Omit<IUser, '_id'>) => {
    const insertedUser = await User.create(user);
    return insertedUser;
};

// Add these methods...
const getUserByEmail = async (email: string) => {
    const user = await User.findOne({
        // email: email
        email,
    });

    if (user === null) {
        const error: ErrorWithStatus = new Error('Bad Credentials');
        error.type = 'BadCredentials';
        throw error;
    }

    return user;
};

const checkPassword = async (user: UserDocument, plainTextPassword: string) => {
    let isMatch;

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
- In `src/controllers/users.controller.ts`
```ts
import { ErrorWithStatus } from '../models/utils';
```
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
- Add a case to check for the custom error thrown due to bad credentials. In `src/middleware/error.ts`, add this as another check inside `enhanceResponseError` method
```ts
// Handle authentication related custom errors
if (error.type === 'BadCredentials') {
    error.status = 401; // Email, password is provided but is incorrect -> 401
}
```
- In `src/routes/users.route.ts`, add the login route
```js
router.post( '/register', Controller.register );
router.post( '/login', Controller.login );
```
- __IMPORTANT__: You will need to create a fresh user account, as the one you may have created at the end of the earlier registration step would have the password stored as plain text.
- Sample request
```
POST /api/auth/login

{
    "email": "john.doe@example.com",
    "password": "Password123#"
}
```

## Step 29: Generate and send a JWT on successful login
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

## Step 30: Set up an authentication middleware
- In `src/middleware/auth.js` add and export an `authenticate` middleware
```js
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

## Step 31: Set up an authorization middleware
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

## Step 32: Set up authentication/authorization for relevant API endpoints
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

## Step 33: Setup CORS middleware
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

## Step 34: Implement session voting feature using web sockets
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

## Step 35: Include Hemlet for enforcing some basic security best practices
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

## Step 36: Rate-limit the API requests
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

## Step 37: Prevent MongoDB Operator Injection
- When acceping user-generated data that becomes part of a MongoDB query, it is better to sanitize the data to prevent MongoDB Operator Injection. We can use a package like [`express-mongo-sanitize`](https://www.npmjs.com/package/express-mongo-sanitize) to prevent this. By default, it removes `$` and `.` characters from user-generated input in the following places - `req.body`, `req.params`, `req.headers`, `req.query`.
- Install it
```sh
npm i express-mongo-sanitize
```
- Add it as a middleware in `src/app.js`
```js
const mongoSanitize = require('express-mongo-sanitize');
```
```js
app.use(helmet());

// add this...
app.use(mongoSanitize({
    onSanitize: ({ req, key }) => {
        // Log to track potential miscreants!
        console.warn(`This request[${key}] is sanitized`, req);
    },
}));
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