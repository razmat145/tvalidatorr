# tvalidatorr

Typescript JSO(N) input validator against Typescript Types

## Motivation

Ability to validate various JSO(N) user/3rd patry inputs against type definitions.   

###### Workings
- errors will be thrown in the order of detection
- read source files that contain types are cached in order to be reused
- if no errors are thrown then the input is valid and conforms with the given type
###### Rules
- optional properties are only validated against the type and not the presence
- additional properties that are not defined in the source types are considered a violation of input validity


### Installing

```
npm install --save tvalidatorr
```

### Usage
Given type
``` typescript
export interface User {
    id: number;

    active: boolean

    address: Address;

    phone?: Array<string>;

    tasks: Array<Task>;
}

interface Address {
    street: string;

    county: string;

    flatNumber?: number;
}

interface Task {
    name: string;

    priority: number;

    createdAt?: Date;
}
```

##### Types can either be pre-loaded

```typescript
// initialise by pre-loading types
await Validator.initialise({
    files: ['./lib/types/User.ts'],
    callerBaseDir: __dirname
});

const fakeUserInput = {
    id: 101,
    active: true
};

try {
    Validator.validateByName(fakeUserInput, 'User');
} catch (err) {
    console.error(err.message);
    // Input is missing property *address* for type User
}

const moreCompleteFakeUserInput = {
    id: 101,
    active: true,
    address: {
        street: 'Some Street 101'
    }
}

try {
    Validator.validateByName(moreCompleteFakeUserInput, 'User');
} catch (err) {
    console.error(err.message);
    // Input is missing property *address.county* for type User
}
```
##### Or loaded and used on the spot
```typescript
const userWithInvalidTaskInput = {
    id: 101,
    active: true,
    address: {
        street: 'Some Street 101',
        county: 'County near you'
    },
    tasks: [
        {
            name: 'House Duties',
            priority: 'Should be a number!'
        }
    ]
}

try {
    await Validator.validateAsTypeSource(userWithInvalidTaskInput, {
        files: ['./lib/types/User.ts'],
        callerBaseDir: __dirname,
        typeName: 'User'
    });
} catch (err) {
    console.error(err.message);
    //  Input has a User type mismatch at path: *tasks[0].priority* - number type expected
}
```

## License
This library is licensed under the Apache 2.0 License
