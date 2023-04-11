
import { describe, it, expect } from '@jest/globals';

import TypeDescription from './files/TypeDescription.json';

import Checker from '../../src/lib/check/Checker';


describe('Checker', () => {
    const mockTypeName = 'User';

    it('should throw an error when provided empty input', async () => {
        const mockInput = {};

        expect(
            () => Checker.performChecks(mockInput, mockTypeName, TypeDescription)
        ).toThrow(`Provided input to check against type ${mockTypeName} is empty`);
    });

    it('should throw an error when *id* is missing', async () => {
        const mockInput = {
            active: false
        };

        expect(
            () => Checker.performChecks(mockInput, mockTypeName, TypeDescription)
        ).toThrow(`Input is missing property *id* for type ${mockTypeName}`);
    });

    it('should throw an error when *active* is missing', async () => {
        const mockInput = {
            id: 101
        };

        expect(
            () => Checker.performChecks(mockInput, mockTypeName, TypeDescription)
        ).toThrow(`Input is missing property *active* for type ${mockTypeName}`);
    });

    it('should throw an error when *id* has a type missmatch', async () => {
        const mockInput = {
            id: 'mockId',
            active: false
        };

        expect(
            () => Checker.performChecks(mockInput, mockTypeName, TypeDescription)
        ).toThrow(`Input has a ${mockTypeName} type mismatch at path: *id* - number type expected`);
    });

    it('should throw an error when nested *address* is missing', async () => {
        const mockInput = {
            id: 101,
            active: false
        };

        expect(
            () => Checker.performChecks(mockInput, mockTypeName, TypeDescription)
        ).toThrow(`Input is missing property *address* for type ${mockTypeName}`);
    });

    it('should throw an error when nested *address.county* is missing', async () => {
        const mockInput = {
            id: 101,
            active: false,
            address: {
                street: 'SomeMockStreet'
            }
        };

        expect(
            () => Checker.performChecks(mockInput, mockTypeName, TypeDescription)
        ).toThrow(`Input is missing property *address.county* for type ${mockTypeName}`);
    });

    it('should throw an error when nested *address.flatNumber* is optional, but has a type missmatch', async () => {
        const mockInput = {
            id: 101,
            active: false,
            address: {
                street: 'SomeMockStreet',
                county: 'SomeMockCounty',
                flatNumber: 'SomeFlatDescription'
            }
        };

        expect(
            () => Checker.performChecks(mockInput, mockTypeName, TypeDescription)
        ).toThrow(`Input has a ${mockTypeName} type mismatch at path: *address.flatNumber* - number type expected`);
    });

    it('should throw an error when a nested *extraNestedProperty* is found but not defined on our type', async () => {
        const mockInput = {
            id: 101,
            active: false,
            address: {
                street: 'SomeMockStreet',
                county: 'SomeMockCounty',
                extraNestedProperty: true,
                extraNestedPropertyTwo: 102
            }
        };

        expect(
            () => Checker.performChecks(mockInput, mockTypeName, TypeDescription)
        ).toThrow(`Input has extra properties [extraNestedProperty, extraNestedPropertyTwo] that are not defined on type ${mockTypeName} at base path *address*`);
    });

    it('should throw an error when an array prop is optional but not of defined type', async () => {
        const mockInput = {
            id: 101,
            active: false,
            address: {
                street: 'SomeMockStreet',
                county: 'SomeMockCounty'
            },
            phone: [102]
        };

        expect(
            () => Checker.performChecks(mockInput, mockTypeName, TypeDescription)
        ).toThrow(`Input has a ${mockTypeName} type mismatch at path: *phone[0]* - number type expected`);
    });

    it('should throw an error if any of the array prop is not of defined type', async () => {
        const mockInput = {
            id: 101,
            active: false,
            address: {
                street: 'SomeMockStreet',
                county: 'SomeMockCounty'
            },
            phone: ['07966675224', 101]
        };

        expect(
            () => Checker.performChecks(mockInput, mockTypeName, TypeDescription)
        ).toThrow(`Input has a ${mockTypeName} type mismatch at path: *phone[1]* - number type expected`);
    });

    it('should throw an error when *tasks* are missing from the base type', async () => {
        const mockInput = {
            id: 101,
            active: false,
            address: {
                street: 'SomeMockStreet',
                county: 'SomeMockCounty',
                flatNumber: 102
            }
        };

        expect(
            () => Checker.performChecks(mockInput, mockTypeName, TypeDescription)
        ).toThrow(`Input is missing property *tasks* for type ${mockTypeName}`);
    });

    it('should throw an error when *tasks* items have invalid priority', async () => {
        const mockInput = {
            id: 101,
            active: false,
            address: {
                street: 'SomeMockStreet',
                county: 'SomeMockCounty',
                flatNumber: 102
            },
            tasks: [{
                name: 'House Duties',
                priority: 'should be a number'
            }]
        };

        expect(
            () => Checker.performChecks(mockInput, mockTypeName, TypeDescription)
        ).toThrow(`Input has a ${mockTypeName} type mismatch at path: *tasks[0].priority* - number type expected`);
    });

    it('should throw an error when *tasks* items have invalid createdAt', async () => {
        const mockInput = {
            id: 101,
            active: false,
            address: {
                street: 'SomeMockStreet',
                county: 'SomeMockCounty',
                flatNumber: 102
            },
            tasks: [{
                name: 'House Duties',
                priority: 1,
                createdAt: 101
            }]
        };

        expect(
            () => Checker.performChecks(mockInput, mockTypeName, TypeDescription)
        ).toThrow(`Input has a ${mockTypeName} type mismatch at path: *tasks[0].createdAt* - Date type expected`);
    });

    it('should throw an error when a *extraProperty* is found but not defined on our type', async () => {
        const mockInput = {
            id: 101,
            active: false,
            address: {
                street: 'SomeMockStreet',
                county: 'SomeMockCounty',
                flatNumber: 102
            },
            tasks: [],
            extraProperty: true
        };

        expect(
            () => Checker.performChecks(mockInput, mockTypeName, TypeDescription)
        ).toThrow(`Input has extra properties [extraProperty] that are not defined on type ${mockTypeName} at base path`);
    });

});