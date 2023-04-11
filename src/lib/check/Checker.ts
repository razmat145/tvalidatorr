
import _ from 'lodash';

import { ITypeDescription } from 'tparserr';

import Property from './Property';

import { TObjectOrJson } from '../types/ValidatorOpts';


class Checker {

    public performChecks<T extends TObjectOrJson>(input: T, typeName: string, typeDescription: ITypeDescription) {
        const inputToCheck = this.parseIfRequired(input);

        if (_.isEmpty(inputToCheck)) {
            throw new Error(`Provided input to check against type ${typeName} is empty`);
        }

        return this.validateObjectProperties(inputToCheck, typeName, typeDescription);
    }

    private validate(inputToCheck: any, typeName: string, typeDescription: ITypeDescription, basePath = '') {
        switch (true) {
            case Property.isPrimitive(typeDescription.type):
                return Property.checkPrimitive(inputToCheck, typeName, typeDescription.type, basePath);

            case typeDescription.type === 'object':
                return this.validateObjectProperties(inputToCheck, typeName, typeDescription, basePath);

            case typeDescription.type === 'array':
                return this.validateArrayItems(inputToCheck, typeName, typeDescription, basePath);

            default:
                throw new Error(`Unrecognised or not yet implemented typeDescription of: ${typeDescription.type}`);
        }
    }

    private validateObjectProperties(inputToCheck: Record<string, any>, typeName: string, typeDescription: ITypeDescription, basePath = '') {

        const validatedProps = [];
        for (const prop in typeDescription.properties) {
            const newPropPath = this.concatPropertyPath(basePath, prop);

            const isRequired = typeDescription.properties[prop].required;
            if (isRequired && !_.has(inputToCheck, prop)) {
                throw new Error(`Input is missing property *${newPropPath}* for type ${typeName}`);
            }

            if (!isRequired && !_.has(inputToCheck, prop)) {
                continue;
            }

            this.validate(inputToCheck[prop], typeName, typeDescription.properties[prop], newPropPath);
            validatedProps.push(prop);
        }

        const extraProps = _(inputToCheck)
            .omit(validatedProps)
            .keys()
            .value();

        if (!_.isEmpty(extraProps)) {
            throw new Error(`Input has extra properties [${extraProps.join(', ')}] that are not defined on type ${typeName} at base path${basePath ? ` *${basePath}*` : ''}`);
        }
    }

    private validateArrayItems(inputToCheck: Array<any>, typeName: string, typeDescription: ITypeDescription, basePath = '') {
        for (let index = 0; index < inputToCheck.length; index++) {
            this.validate(inputToCheck[index], typeName, typeDescription.items, this.concatArrayPath(basePath, index));
        }
    }

    private parseIfRequired<T extends TObjectOrJson>(input: T): Record<string, any> {
        if (typeof input === 'string') {
            try {
                const parsedInput = JSON.parse(input);
                return parsedInput;
            } catch (err) {
                throw new Error(`Provided JSON input is invalid JSON`);
            }
        } else {
            return input;
        }
    }

    private concatPropertyPath(basePath = '', path: string) {
        return basePath
            ? `${basePath}.${path}`
            : path;
    }

    private concatArrayPath(basePath = '', index: number) {
        return basePath
            ? `${basePath}[${index}]`
            : `[${index}]`;
    }

}

export default new Checker();