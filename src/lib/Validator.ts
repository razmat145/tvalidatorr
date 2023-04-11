
import { IValidatorOpts, TObjectOrJson } from './types/ValidatorOpts';

import Reader from './Reader';
import Checker from './check/Checker';


class Validator {

    public async validateAsTypeSource<T extends TObjectOrJson>(input: T, opts: IValidatorOpts) {
        const typeDescription = await Reader.getTypeDescription(opts);
        const { typeName } = opts;

        return Checker.performChecks(input, typeName, typeDescription);
    }

    public async initialise(opts: Partial<IValidatorOpts>) {
        await Reader.loadTypeDescriptions(opts);
    }

    public validateByName<T extends TObjectOrJson>(input: T, typeName: string) {
        const typeDescription = Reader.getCachedTypeDescription(typeName);

        return Checker.performChecks(input, typeName, typeDescription);
    }

}

export default new Validator();