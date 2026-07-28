# Testing the Workshops App (Unit, Integration Tests) 
Jest is the chosen unit test runner. Supertest shall be used for integration tests.

This is the folder structure for reference. For a more detailed view of the src folder, check the lab guide for creating the workshops app using Node and Express (using TypeScript).
```
workshops-app/
├── __tests__/
│   ├── unit/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── services/
│   ├── integration/
│   └── setupMongoMemory.ts
├── src/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── app.ts
│   └── server.ts
├── .env
├── .env.test
├── jest.config.js
├── jest.setup.js
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.base.json
├── tsconfig.projects.json
└── tsconfig.test.json
```

Keeping the `__tests__` folder in the project root rather than `src`,  
✅ Keeps test code separate from production code  
✅ Easy to wipe `dist/` without touching tests  
✅ Nice when you want CI/CD to run `tests/` as an isolated folder  

---

## Step 1. Install Dev Dependencies

```bash
npm install --save-dev jest ts-jest @types/jest supertest @types/supertest \
mongodb-memory-server \
jest-mock-extended \
@types/bcrypt
```

**Why these?**

* `jest` → testing framework
* `ts-jest` → TS transformer so Jest understands `.ts` directly
* `supertest` → to call API endpoints in integration tests
* `mongodb-memory-server` → spins up an ephemeral MongoDB server locally for tests (no Atlas needed)
* `jest-mock-extended` → type-safe mocks for services/repositories in unit tests

---

## Step 2. Configure Jest

Create `jest.config.js` in project root:

```js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/__tests__'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    clearMocks: true,
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
```
- This config says _“Run Jest with TypeScript support (`ts-jest`), in a Node.js environment, load tests from `__tests__/**/*.test.ts`, auto-clear mocks, and initialize DB/test setup from `jest.setup.ts`.”_
---

## Step 3. Add Test Setup File

Create `jest.setup.ts`:

```ts
// Load .env.test if present, otherwise fall back to .env
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

// Ensure JWT_SECRET is always available in tests
if( !process.env.JWT_SECRET ) {
    throw new Error( 'JWT_SECRET not available in environment' );
} else {
    process.env.JWT_SECRET = process.env.JWT_SECRET as string;
}
```
  
👉 Create a `.env.test` file if you want test-specific values.

---

## Step 4. Modify `package.json` Scripts

Update `scripts`:

```json
"scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "start": "nodemon",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
}
```

---

## Step 5. Separate App and Server

Right now `src/app.ts` both **creates the app** and **starts the server**. It also runs `src/data/init.ts` which automatically connects to the MongoDB server (Atlas or local). For **integration testing** it will cause issues because:
* `src/app.ts` imports `src/data/init.ts`, which immediately runs `connect()` to your **Atlas DB**.
* In integration tests we want to **avoid Atlas** and instead connect to **mongodb-memory-server**.
* For tests, we want just the `app` (no `.listen()`).


If we leave it as-is, when Jest imports `app`, it will try to connect to Atlas before we override it, and also connect to the MongoDB server automatically - both of which are undesirable for tests.

---

We refactor code like so

### Split **connection logic** from **model registration**

* Keep model registration (`import './models/Workshop'`, etc.) in a lightweight `models.ts` file.
* Keep connection logic inside a `connect` function that we call only in `src/server.ts` or test setup.

---

### 👉 Refactor into:

**src/data/models/index.ts**

```ts
// Central place to import/register models
import './Workshop';
import './Session';
import './User';
```

**src/data/init.ts**

```ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import './models'; // registers all models - Note: file named 'index' is searched automatically if a folder path is provided

dotenv.config();

mongoose.set('strictQuery', true);
mongoose.set('strict', true);
mongoose.set('returnOriginal', false);
mongoose.set('runValidators', true);

mongoose.Schema.Types.String.cast((v: string) => {
  if (typeof v !== 'string') {
    throw new Error('Value must be a string');
  }
  return v;
});

export const connect = async (uri?: string) => {
  const connectionStr = uri || process.env.DB_CONNECTION_STRING;
  if (!connectionStr) {
    throw new Error('DB connection string not provided');
  }

  await mongoose.connect(connectionStr);
  console.log('Connected to DB');
};

export const disconnect = async () => {
  await mongoose.disconnect();
};
```
- __Note__: We imported the model files in one go, removed the call to `connect`, exported `connect`, and also added a `disconnect` method.

---

**`src/app.ts`**

No DB connect here — just Express setup. Note that we have removed the import of `src/data/init.ts`

```ts
import express from 'express';
import path from 'node:path';
import dotenv from 'dotenv';
import morgan from 'morgan';

import './data/models'; // ✅ ensures models are registered before routes

import indexRouter from './routes/index.route';
import workshopsRouter from './routes/workshops.route';
import sessionsRouter from './routes/sessions.route';
import usersRouter from './routes/users.route';
import workshopsPageRouter from './routes/pages/workshops.route';

import { resourceNotFoundHandler, errorHandler } from './middleware/errors';

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(morgan('combined'));
app.use(express.json());

app.use(indexRouter);
app.use('/api/auth', usersRouter);
app.use('/api/workshops', workshopsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/workshops', workshopsPageRouter);

app.use(resourceNotFoundHandler);
app.use(errorHandler);

export default app;
```

---

**`src/server.ts`**

Now **explicitly connect** to the DB before starting the server:

```ts
import { connect } from './data/init';
import app from './app';

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connect(); // uses Atlas URI from .env
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to DB', (err as Error).message);
    process.exit(1);
  }
};

start();
```

---

__Note__: With this refactor, you can now swap out Atlas / local MongoDB server with **mongodb-memory-server** easily. The below code is just for understanding - you don't need to add it anywhere in the app right now.

```ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../src/app';
import { connect, disconnect } from '../../src/data/init';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await connect(mongo.getUri()); // ✅ connect to in-memory DB
});

afterAll(async () => {
  await disconnect();
  await mongo.stop();
});
```

**What this means in tests**
* You can freely `Workshop.create(...)`, `Workshop.find(...)` in tests.
* The data lives in memory only.
* After each test, you can wipe it (`await mongoose.connection.db.dropDatabase()` or your `clearTestDB()` helper).
* When `mongo.stop()` runs in `afterAll`, the in-memory DB disappears.

---

## 🔑 Benefits of Refactor

* `src/app.ts` is **pure Express**, no side effects.
* `src/server.ts` controls when to connect to real DB.
* Thus, Tests can import `app` directly without starting a real HTTP server, and Integration tests can override DB connection string easily.

---

## Step 6. Modify TypeScript Configuration to Accommodate Testing

* **`tsconfig.base.json`** → options shared for your **build** and **tests**
* **`tsconfig.json`** → for your **build** (only app code, goes to `dist/`)
* **`tsconfig.test.json`** → for **tests** (type-checking test files, no output build)

---

### Add a `tsconfig.base.json`

This will hold the **shared compiler options** used by both build and test configs:

```json
{
    "compilerOptions": {
        "target": "es2022",
        "module": "commonjs",
        "esModuleInterop": true,
        "resolveJsonModule": true,
        "strict": true,
        "skipLibCheck": true,
        "sourceMap": true,
        "forceConsistentCasingInFileNames": true
    }
}
```

---

### Update `tsconfig.json` (for build)

```json
{
    "extends": "./tsconfig.base.json",
    "compilerOptions": {
        "rootDir": "./src",
        "outDir": "./dist",
        "declaration": true
    },
    "include": ["src"],
    "exclude": [
        "node_modules",
        "dist",
        "__tests__"
    ]
}
```

---

### Add `tsconfig.test.json`

```json
{
    "extends": "./tsconfig.base.json",
    "compilerOptions": {
        "noEmit": true,
        "types": ["jest", "node"]
    },
    "include": [
        "__tests__/**/*.ts",
        "src/**/*.ts"
    ]
}
```

---

### Add a Root `tsconfig.projects.json`

This tells VS Code to treat both configs as part of one workspace, and VS Code automatically resolves types for both app (`src/`) and tests (`__tests__/`)

```json
{
    "files": [],
    "references": [
        { "path": "./tsconfig.json" },
        { "path": "./tsconfig.test.json" }
    ]
}
```

---

### Update Jest Config

Make sure Jest uses the test config by adding this in `jest.config.js`

```js
module.exports = {
    // existing configurations...
    // ...

    // Add this...
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.test.json'
            }
        ]
    }
};
```

---

## Step 7. In-Memory DB for Integration Tests

Create `__tests__/setupMongoMemory.ts`:

```ts
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer;

/**
 * Start in-memory MongoDB and connect mongoose.
 */
export const connectTestDB = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
};

/**
 * Clear all collections between tests.
 */
export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

/**
 * Drop DB and disconnect.
 */
export const closeTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongo) {
    await mongo.stop();
  }
};
```

Then in `jest.setup.ts`:

```ts
import { connectTestDB, closeTestDB, clearTestDB } from './__tests__/setupMongoMemory';
```
```ts
beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});
```

---

## Step U1 — Unit Test for `authenticate` Middleware

### 🎯 Goal

Verify that the `authenticate` middleware correctly enforces JWT authentication:

* Rejects requests with missing/invalid headers
* Rejects requests with invalid/expired tokens
* Accepts valid tokens and attaches claims to `res.locals`

---

### Install helper for request/response mocks

```bash
npm install --save-dev node-mocks-http
```

---

### Create the test file

**File:** `__tests__/unit/middleware/auth.test.ts`

```ts
import type { NextFunction, Request, Response } from 'express';
import httpMocks from 'node-mocks-http';
import jwt from 'jsonwebtoken';
import { authenticate } from '../../../src/middleware/auth';

const SECRET = process.env.JWT_SECRET;

// Utility runner for async middleware
async function runAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<{ thrown?: any; calledNext?: boolean }> {
  try {
    await authenticate(req, res, next);
    return { calledNext: true };
  } catch (err) {
    return { thrown: err };
  }
}

describe('authenticate middleware', () => {
  it('throws error when Authorization header is missing', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    const result = await runAuth(req, res, jest.fn());

    expect(result.thrown).toBeInstanceOf(Error);
    expect(result.thrown.type).toBe('BadCredentials');
  });

  it('throws error for malformed Authorization header', async () => {
    const req = httpMocks.createRequest({
      headers: { Authorization: 'Token abc' },
    });
    const res = httpMocks.createResponse();

    const result = await runAuth(req, res, jest.fn());

    expect(result.thrown).toBeInstanceOf(Error);
    expect(result.thrown.type).toBe('BadCredentials');
  });

  it('throws error for invalid JWT token', async () => {
    const req = httpMocks.createRequest({
      headers: { Authorization: 'Bearer not.a.valid.jwt' },
    });
    const res = httpMocks.createResponse();

    const result = await runAuth(req, res, jest.fn());

    expect(result.thrown).toBeInstanceOf(Error);
    expect(result.thrown.type).toBe('BadCredentials');
  });

  it('calls next() and attaches claims for valid token', async () => {
    const token = jwt.sign({ userId: 'u1', role: 'admin' }, SECRET, {
      algorithm: 'HS512',
      expiresIn: '1h',
    });

    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = httpMocks.createResponse();

    const next: NextFunction = jest.fn();

    const result = await runAuth(req, res, next);

    expect(result.calledNext).toBe(true);
    expect(res.locals.claims).toBeDefined();
    expect(res.locals.claims.userId).toBe('u1');
    expect(res.locals.claims.role).toBe('admin');
  });
});
```
- __Note__: We have created a wrapper so that we can test what `type` of error is thrown in the test. If we called `authenticate` directly in the tests, our test would throw an error when an error is thrown in the middleware. We then would need to enclose the call to the middleware in a try..catch to test the error `type`. Instead, using the wrapper above make our code simpler. We can check if next is called or not though easily. What changes would you make for that?
- **Solution**
```ts
const next = jest.fn(); // still define it, even though not called
const result = await runAuth(req, res, next);
expect(next).not.toHaveBeenCalled(); // ❌ should not call next... or, expect(next).toHaveBeenCalled();
```
---

### Workspace settings
- If TypeScript does not pick up types for Jest. Open the Command Palette of VS Code and restart the TypeScript Server. If that also does not help, make sure to open the `workshops-app` project as the top-level folder in th VS Code Workspace, and add these to `.vscode/settings.json` (within `workshops-app` folder)
```json
{
    // any existing configuration
    // ...

    // add this...
    "typescript.tsdk": "node_modules/typescript/lib",
    "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Run the test
Run the tests
- Either as a one-time run
```sh
npm test
```
- Or, run perpetually
```sh
npm run test:watch
```

### ✅ Acceptance Criteria

* **Missing header** → throws error with `type = 'BadCredentials'`
* **Malformed header** → throws error with `type = 'BadCredentials'`
* **Invalid token** → throws error with `type = 'BadCredentials'`
* **Valid token** → `next()` is called and `res.locals.claims` contains decoded payload

---

## Step U2 — Unit Test for `authorize` Middleware

### 🎯 Goal

Verify that the `authorize` middleware enforces role-based access control (RBAC):

* Rejects when user’s role is not in the allowed list → throws error
* Allows when user’s role is permitted → calls `next()`

---

### Add a new test suite to the file

**File:** `__tests__/unit/middleware/auth.test.ts`

```ts
// Add these imports...
import { authenticate, authorize } from '../../../src/middleware/auth';
import { ErrorWithStatus } from '../../../src/models/utils';
import { Role } from '../../../src/models/IUser';
```
```ts
describe('authorize middleware', () => {
  it('throws error if user role is not allowed', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    res.locals.claims = { userId: 'u1', role: 'general' };

    const middleware = authorize(['admin']); // only admins allowed

    expect(() => middleware(req, res, jest.fn())).toThrow(
      expect.objectContaining({ type: 'Unauthorized' })
    );
  });

  it('calls next() if user role is allowed', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    res.locals.claims = { userId: 'u1', role: 'admin' as Role };

    const next: NextFunction = jest.fn();
    const middleware = authorize(['admin', 'general']); // allow both

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
```

---

### ✅ Acceptance Criteria

* **When claims.role is not in allowedRoles** → throws `ErrorWithStatus` with `type = 'Unauthorized'`
* **When claims.role is in allowedRoles** → calls `next()` with no error

---

Perfect 👍 Thanks for sharing the actual `workshops.service.ts`.
We’ll now build **Step U2b — Unit Tests for WorkshopsService**, mocking Mongoose methods so we don’t touch the real DB.

---

## Step U3 — Unit Tests for `WorkshopsService`

### 🎯 Goal

Validate service layer logic by mocking `mongoose.model('Workshop')` methods:

* **`getAllWorkshops`** → calls `Workshop.find` with filters, applies pagination, returns `{ workshops, count }`
* **`addWorkshop`** → calls `Workshop.create`
* **`getWorkshopById`** → calls `Workshop.findById().orFail()`, with/without `populate`
* **`addSpeakers`** → calls `Workshop.findByIdAndUpdate().orFail()`

---

### Create the test file

**File:** `__tests__/unit/services/workshops.service.test.ts`

```ts
import mongoose from 'mongoose';
import {
  getAllWorkshops,
  addWorkshop,
  getWorkshopById,
  addSpeakers,
} from '../../../src/services/workshops.service';

// Mock Workshop model returned by mongoose.model('Workshop')
const execMock = jest.fn();
const populateMock = jest.fn(() => ({ exec: execMock }));

const findMock = jest.fn(() => ({
  select: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  exec: execMock,
}));

const findByIdMock = jest.fn(() => ({
  orFail: jest.fn().mockReturnThis(),
  populate: populateMock,
  exec: execMock,
}));

const countDocumentsMock = jest.fn();
const createMock = jest.fn();
const findByIdAndUpdateMock = jest.fn(() => ({
  orFail: jest.fn().mockReturnThis(),
}));

// Replace mongoose.model with a mocked Workshop object
jest.spyOn(mongoose, 'model').mockReturnValue({
  find: findMock,
  countDocuments: countDocumentsMock,
  create: createMock,
  findById: findByIdMock,
  findByIdAndUpdate: findByIdAndUpdateMock,
} as any);

describe('WorkshopsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllWorkshops', () => {
    it('returns workshops and count with category filter', async () => {
      const workshops = [{ name: 'React' }, { name: 'Angular' }];
      execMock.mockResolvedValueOnce(workshops);
      countDocumentsMock.mockResolvedValueOnce(2);

      const result = await getAllWorkshops(1, 'name', 'frontend');

      expect(findMock).toHaveBeenCalledWith({ category: 'frontend' });
      expect(execMock).toHaveBeenCalled();
      expect(countDocumentsMock).toHaveBeenCalledWith({ category: 'frontend' });
      expect(result.workshops).toEqual(workshops);
      expect(result.count).toBe(2);
    });

    it('applies sorting, skip and limit', async () => {
      execMock.mockResolvedValueOnce([]);
      countDocumentsMock.mockResolvedValueOnce(0);

      await getAllWorkshops(2, 'name');

      expect(findMock).toHaveBeenCalledWith({});
      // skip called with page=2 => skip(10 * (2-1)) = skip(10)
      expect(findMock().skip).toHaveBeenCalledWith(10);
      expect(findMock().limit).toHaveBeenCalledWith(10);
      expect(findMock().sort).toHaveBeenCalledWith({ name: 1 });
    });
  });

  describe('addWorkshop', () => {
    it('creates and returns a workshop', async () => {
      const workshop = { name: 'Vue', category: 'frontend' };
      createMock.mockResolvedValueOnce(workshop);

      const result = await addWorkshop(workshop as any);

      expect(createMock).toHaveBeenCalledWith(workshop);
      expect(result).toEqual(workshop);
    });
  });

  describe('getWorkshopById', () => {
    it('retrieves workshop without sessions populated', async () => {
      const workshop = { id: '1', name: 'React' };
      execMock.mockResolvedValueOnce(workshop);

      const result = await getWorkshopById('1');

      expect(findByIdMock).toHaveBeenCalledWith('1');
      expect(populateMock).not.toHaveBeenCalled();
      expect(result).toEqual(workshop);
    });

    it('retrieves workshop with sessions populated when embedSessions=true', async () => {
      const workshop = { id: '1', name: 'React', sessions: [] };
      execMock.mockResolvedValueOnce(workshop);

      const result = await getWorkshopById('1', true);

      expect(findByIdMock).toHaveBeenCalledWith('1');
      expect(populateMock).toHaveBeenCalledWith('sessions');
      expect(result).toEqual(workshop);
    });
  });

  describe('addSpeakers', () => {
    it('updates workshop by adding speakers', async () => {
      const updated = { id: '1', speakers: ['Alice', 'Bob'] };
      findByIdAndUpdateMock.mockReturnValueOnce({
        orFail: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(updated),
      });

      const result = await addSpeakers('1', ['Alice', 'Bob']);

      expect(findByIdAndUpdateMock).toHaveBeenCalledWith('1', {
        $addToSet: { speakers: { $each: ['Alice', 'Bob'] } },
      });
      expect(result).toEqual(updated);
    });
  });
});
```

---

### ✅ Acceptance Criteria

* **`getAllWorkshops`** → filters, sorts, paginates, returns `{ workshops, count }`
* **`addWorkshop`** → calls `Workshop.create` and returns created doc
* **`getWorkshopById`** → calls `Workshop.findById().orFail()`, populates sessions when requested
* **`addSpeakers`** → calls `Workshop.findByIdAndUpdate().orFail()` with `$addToSet`

---

## Step U4 — Unit Tests for `WorkshopsController`
These tests will **mock the services** (`workshops.service` and `sessions.service`) so that we only test the controller’s behavior (request parsing, error handling, and response formatting).

### 🎯 Goal

* Verify controllers call the right service functions.
* Ensure correct response codes and JSON structure.
* Ensure invalid input results in proper error throws.

---

### Create the test file

**File:** `__tests__/unit/controllers/workshops.controller.test.ts`

```ts
import httpMocks from 'node-mocks-http';
import * as Controller from '../../../src/controllers/workshops.controller';
import * as Service from '../../../src/services/workshops.service';
import * as SessionsService from '../../../src/services/sessions.service';
import { ErrorWithStatus } from '../../../src/models/utils';

// Mock the services
jest.mock('../../../src/services/workshops.service');
jest.mock('../../../src/services/sessions.service');

describe('WorkshopsController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWorkshops', () => {
    it('calls service and returns workshops JSON', async () => {
      (Service.getAllWorkshops as jest.Mock).mockResolvedValueOnce({ workshops: [], count: 0 });

      const req = httpMocks.createRequest({
        method: 'GET',
        query: { page: '1', sort: 'name', category: 'frontend' },
      });
      const res = httpMocks.createResponse();

      await Controller.getWorkshops(req, res);

      expect(Service.getAllWorkshops).toHaveBeenCalledWith(1, 'name', 'frontend');
      expect(res._getJSONData()).toEqual({ workshops: [], count: 0 });
    });
  });

  describe('postWorkshop', () => {
    it('throws error if body is empty', async () => {
      const req = httpMocks.createRequest({ method: 'POST', body: {} });
      const res = httpMocks.createResponse();

      await expect(Controller.postWorkshop(req, res)).rejects.toThrow(Error);

      try {
        await Controller.postWorkshop(req, res);
      } catch (err) {
        const e = err as ErrorWithStatus;
        expect(e.status).toBe(400);
      }
    });

    it('creates workshop and returns 201 JSON', async () => {
      const workshop = { name: 'React' };
      (Service.addWorkshop as jest.Mock).mockResolvedValueOnce(workshop);

      const req = httpMocks.createRequest({ method: 'POST', body: workshop });
      const res = httpMocks.createResponse();

      await Controller.postWorkshop(req, res);

      expect(Service.addWorkshop).toHaveBeenCalledWith(workshop);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({
        status: 'success',
        data: workshop,
      });
    });
  });

  describe('getWorkshopById', () => {
    it('returns workshop with embedSessions=false', async () => {
      const workshop = { id: '1', name: 'React' };
      (Service.getWorkshopById as jest.Mock).mockResolvedValueOnce(workshop);

      const req = httpMocks.createRequest({ params: { id: '1' }, query: {} });
      const res = httpMocks.createResponse();

      await Controller.getWorkshopById(req as any, res);

      expect(Service.getWorkshopById).toHaveBeenCalledWith('1', false);
      expect(res._getJSONData()).toEqual({ status: 'success', data: workshop });
    });

    it('returns workshop with embedSessions=true', async () => {
      const workshop = { id: '1', name: 'React', sessions: [] };
      (Service.getWorkshopById as jest.Mock).mockResolvedValueOnce(workshop);

      const req = httpMocks.createRequest({
        params: { id: '1' },
        query: { embed: 'sessions' },
      });
      const res = httpMocks.createResponse();

      await Controller.getWorkshopById(req as any, res);

      expect(Service.getWorkshopById).toHaveBeenCalledWith('1', true);
      expect(res._getJSONData()).toEqual({ status: 'success', data: workshop });
    });
  });

  describe('addSpeakers', () => {
    it('throws error if body is not a non-empty array', async () => {
      const req = httpMocks.createRequest({ params: { id: '1' }, body: [] });
      const res = httpMocks.createResponse();

      await expect(Controller.addSpeakers(req as any, res)).rejects.toThrow(Error);

      try {
        await Controller.addSpeakers(req as any, res);
      } catch (err) {
        const e = err as ErrorWithStatus;
        expect(e.status).toBe(400);
      }
    });

    it('calls service and returns updated workshop', async () => {
      const updated = { id: '1', speakers: ['Alice'] };
      (Service.addSpeakers as jest.Mock).mockResolvedValueOnce(updated);

      const req = httpMocks.createRequest({
        params: { id: '1' },
        body: ['Alice'],
      });
      const res = httpMocks.createResponse();

      await Controller.addSpeakers(req as any, res);

      expect(Service.addSpeakers).toHaveBeenCalledWith('1', ['Alice']);
      expect(res._getJSONData()).toEqual({ status: 'success', data: updated });
    });
  });

  describe('postSession', () => {
    it('calls service and returns 201 JSON', async () => {
      const newSession = { id: 's1', title: 'Intro' };
      (SessionsService.addSession as jest.Mock).mockResolvedValueOnce(newSession);

      const req = httpMocks.createRequest({
        params: { id: 'w1' },
        body: { title: 'Intro' },
      });
      const res = httpMocks.createResponse();

      await Controller.postSession(req as any, res);

      expect(SessionsService.addSession).toHaveBeenCalledWith({
        workshopId: 'w1',
        title: 'Intro',
      });
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({ status: 'success', data: newSession });
    });
  });

  describe('getSessions', () => {
    it('calls service and returns sessions JSON', async () => {
      const sessions = [{ id: 's1' }];
      (SessionsService.getSessions as jest.Mock).mockResolvedValueOnce(sessions);

      const req = httpMocks.createRequest({ params: { id: 'w1' } });
      const res = httpMocks.createResponse();

      await Controller.getSessions(req as any, res);

      expect(SessionsService.getSessions).toHaveBeenCalledWith('w1');
      expect(res._getJSONData()).toEqual({ status: 'success', data: sessions });
    });
  });
});
```

---

### ✅ Acceptance Criteria

* **getWorkshops** → calls service with query params, returns JSON
* **postWorkshop** → throws error on empty body, otherwise returns 201 JSON
* **getWorkshopById** → returns JSON with/without sessions based on query
* **addSpeakers** → throws error if body invalid, otherwise returns JSON
* **postSession** → calls service, returns 201 JSON
* **getSessions** → calls service, returns JSON

---

## Step U5 — Controller Error Propagation Tests

### 🎯 Goal

Controllers don’t handle all errors themselves — when a service rejects, they should **throw the error** so Express’ error middleware can catch it. We’ll test this by mocking service methods to reject.

---

### Extend the controller test file

**File:** `__tests__/unit/controllers/workshops.controller.test.ts`

Add the following **new test block** near the bottom (after your happy-path tests):

```ts
describe('Controller error propagation', () => {
  it('getWorkshops propagates service error', async () => {
    (Service.getAllWorkshops as jest.Mock).mockRejectedValueOnce(
      new Error('DB failure')
    );

    const req = httpMocks.createRequest({ method: 'GET', query: {} });
    const res = httpMocks.createResponse();

    await expect(Controller.getWorkshops(req, res)).rejects.toThrow('DB failure');
  });

  it('postWorkshop propagates service error', async () => {
    (Service.addWorkshop as jest.Mock).mockRejectedValueOnce(new Error('Insert failed'));

    const req = httpMocks.createRequest({
      method: 'POST',
      body: { name: 'Test' },
    });
    const res = httpMocks.createResponse();
    (res as any).locals = { claims: { userId: 'u1', role: 'admin' } };

    await expect(Controller.postWorkshop(req, res)).rejects.toThrow('Insert failed');
  });

  it('getWorkshopById propagates service error', async () => {
    (Service.getWorkshopById as jest.Mock).mockRejectedValueOnce(new Error('Not found'));

    const req = httpMocks.createRequest({ params: { id: '123' }, query: {} });
    const res = httpMocks.createResponse();

    await expect(Controller.getWorkshopById(req as any, res)).rejects.toThrow('Not found');
  });

  it('addSpeakers propagates service error', async () => {
    (Service.addSpeakers as jest.Mock).mockRejectedValueOnce(new Error('Update failed'));

    const req = httpMocks.createRequest({
      params: { id: '1' },
      body: ['Alice'],
    });
    const res = httpMocks.createResponse();

    await expect(Controller.addSpeakers(req as any, res)).rejects.toThrow('Update failed');
  });

  it('postSession propagates service error', async () => {
    (SessionsService.addSession as jest.Mock).mockRejectedValueOnce(new Error('Insert failed'));

    const req = httpMocks.createRequest({
      params: { id: 'w1' },
      body: { title: 'Intro' },
    });
    const res = httpMocks.createResponse();

    await expect(Controller.postSession(req as any, res)).rejects.toThrow('Insert failed');
  });

  it('getSessions propagates service error', async () => {
    (SessionsService.getSessions as jest.Mock).mockRejectedValueOnce(new Error('Query failed'));

    const req = httpMocks.createRequest({ params: { id: 'w1' } });
    const res = httpMocks.createResponse();

    await expect(Controller.getSessions(req as any, res)).rejects.toThrow('Query failed');
  });
});
```

---

### ✅ Acceptance Criteria

* Each controller test confirms that **when the service rejects, the controller rejects with the same error**.
* This ensures the error handling middleware in Express will take over in production.

---

## Step I1 — Integration Test for Workshops API - Get  list of workshops

**File:** `__tests__/integration/workshops.api.test.ts`

```ts
// Ensure schemas are registered
import '../../src/data/models';

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import IWorkshop from '../../src/models/IWorkshop';

describe('Workshops API (integration)', () => {
  it('GET /api/workshops returns paginated workshops', async () => {
    const Workshop = mongoose.model<IWorkshop>('Workshop');

    // Insert sample docs
    await Workshop.create([
      {
        name: 'React Basics',
        description: 'Intro to React',
        category: 'frontend',
        speakers: ['Alice'],
        startTime: { hours: 9, minutes: 0 },
        endTime: { hours: 17, minutes: 0 },
      },
      {
        name: 'Angular Deep Dive',
        description: 'Advanced Angular',
        category: 'frontend',
        speakers: ['Bob'],
        startTime: { hours: 9, minutes: 0 },
        endTime: { hours: 17, minutes: 0 },
      },
    ]);

    const res = await request(app)
      .get('/api/workshops?page=1&sort=name')
      .expect(200);

    expect(res.body).toHaveProperty('workshops');
    expect(Array.isArray(res.body.workshops)).toBe(true);
    expect(res.body.count).toBe(2);
    expect(res.body.workshops.length).toBe(2);
  });
});
```

---

This runs all tests - both unit and integration.
```sh
npm test
```

- If you need to run only unit, or only integration tests, you can create convenient scripts to filter the tests in Jest by folder path using `--testPathPatterns`. Add these to **`package.json`** **"scripts"**:

```json
"test:unit": "jest --testPathPatterns=__tests__/unit/",
"test:integration": "jest --testPathPatterns=__tests__/integration/"
```

---

### 🔑 Usage

* **Run all tests**

  ```bash
  npm test
  ```

* **Run only unit tests**

  ```bash
  npm run test:unit
  ```

* **Run only integration tests**

  ```bash
  npm run test:integration
  ```

---

### 🔑 Key Points
In the above file, and in `jest.setup.ts` and `__tests__/setupMongoMemory.ts` (that run before tests start runningG)
* We **override `process.env.DB_CONNECTION_STRING`** with the `mongodb-memory-server` URI before calling `connect()`.
* We use `disconnectDB()` after tests to close the connection.
* `afterEach` drops the DB so every test starts clean.
* The `Workshop` model is pulled from `mongoose.model('Workshop')`, which is already registered via `src/data/models/index.ts`.

---

## Step I2 — Integration Test for Workshops API - Create a new workshop
Since this endpoint is protected by JWT, we’ll need to:
1. Generate a test JWT with the same secret (`process.env.JWT_SECRET`).
2. Attach it in the `Authorization: Bearer <token>` header.
3. POST a valid workshop payload and check that it’s stored and returned.

---

**File:** `__tests__/integration/workshops.api.test.ts`
- Add this import
```ts
import jwt from 'jsonwebtoken';
```
- Update with the new test
```ts
describe('Workshops API (integration)', () => {
  const JWT_SECRET = process.env.JWT_SECRET as string;

  // Utility to generate test JWTs
  const generateToken = (role: 'admin' | 'general' = 'admin') => {
    return jwt.sign(
      { email: 'test@example.com', role },
      JWT_SECRET,
      { algorithm: 'HS512', expiresIn: '1h' }
    );
  };

  // existing test...
  // ...
  
  // Add this...
  it('POST /api/workshops creates a new workshop (authorized as admin)', async () => {
    const token = generateToken('admin');

    const payload = {
      name: 'Node.js Fundamentals',
      description: 'Intro to Node',
      category: 'backend',
      speakers: ['Charlie'],
      startTime: { hours: 10, minutes: 0 },
      endTime: { hours: 16, minutes: 0 },
    };

    const res = await request(app)
      .post('/api/workshops')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(201);

    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toMatchObject({
      name: 'Node.js Fundamentals',
      category: 'backend',
    });

    // Verify it was persisted
    const Workshop = mongoose.model<IWorkshop>('Workshop');
    const saved = await Workshop.findOne({ name: 'Node.js Fundamentals' }).exec();
    expect(saved).not.toBeNull();
    expect(saved?.speakers).toContain('Charlie');
  });

  it('POST /api/workshops fails without auth token', async () => {
    const payload = {
      name: 'Unauthorized Workshop',
        description: 'This should not be created',
        category: 'backend',
        speakers: ['Eve'],
        startTime: { hours: 11, minutes: 0 },
        endTime: { hours: 15, minutes: 0 },
    };

    const res = await request(app).post('/api/workshops').send(payload).expect(401); // your error middleware maps BadCredentials → 401

    expect(res.body).toEqual({
      "message": "Missing or invalid Authorization header",
      "status": "error",
      "type": "BadCredentials"
    });
  });

  it('POST /api/workshops fails with insufficient role (general → 403)', async () => {
    const token = generateToken('general');

    const payload = {
      name: 'General User Workshop',
      description: 'Should not be created by general role',
      category: 'backend',
      speakers: ['Dan'],
      startTime: { hours: 13, minutes: 0 },
      endTime: { hours: 17, minutes: 0 },
    };

    const res = await request(app)
      .post('/api/workshops')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(403); // Unauthorized → 403

    expect(res.body).toEqual({
      "message": "Unauthorized",
      "status": "error",
      "type": "Unauthorized"
    });
  });
});
```

---

## 🔑 Key Notes

* We use `jwt.sign` with **HS512** (matches your `authenticate` middleware).
* Token claims include `{ email, role }`.
* First `POST` test succeeds with an `admin` token.
* Second `POST` test fails if no token is provided — expected status depends on your error handler (in your case it throws → caught by error middleware → `500` JSON).

---