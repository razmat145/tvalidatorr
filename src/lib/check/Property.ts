
import _ from 'lodash';


class Property {

    public isPrimitive(type) {
        return this.isNumberType(type)
            || this.isDateType(type)
            || this.isStringType(type)
            || this.isBooleanType(type)
    }

    public checkPrimitive(inputToCheck: any, typeName: string, type: string, basePath = '') {
        switch (true) {
            case this.isNumberType(type):
                if (!this.isNumberValue(inputToCheck)) {
                    throw new Error(`Input has a ${typeName} type mismatch at path: *${basePath}* - number type expected`);
                }
                break;

            case this.isDateType(type):
                if (!this.isDateValue(inputToCheck)) {
                    throw new Error(`Input has a ${typeName} type mismatch at path: *${basePath}* - Date type expected`);
                }
                break;

            case this.isStringType(type):
                if (!this.isStringValue(inputToCheck)) {
                    throw new Error(`Input has a ${typeName} type mismatch at path: *${basePath}* - number type expected`);
                }
                break;

            case this.isBooleanType(type):
                if (!this.isBooleanValue(inputToCheck)) {
                    throw new Error(`Input has a ${typeName} type mismatch at path: *${basePath}* - number type expected`);
                }
                break;

            default:
                throw new Error(`Unrecognised or not yet implemented primitive type of: ${type}`);
        }
    }

    private isNumberType(type: string) {
        return type === 'number';
    }

    private isNumberValue(value: any) {
        return typeof value === 'number';
    }

    private isDateType(type: string) {
        return type === 'Date';
    }

    private isDateValue(value: any) {
        return _.isDate(value);
    }

    private isStringType(type: string) {
        return type === 'string';
    }

    private isStringValue(value: any) {
        return typeof value === 'string';
    }

    private isBooleanType(type: string) {
        return type === 'boolean';
    }

    private isBooleanValue(value: any) {
        return typeof value === 'boolean';
    }
}

export default new Property();