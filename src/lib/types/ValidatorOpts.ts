
import { IParserOpts } from 'tparserr';


export type TObjectOrJson = Record<string, any> | string;

export type TParserInheritedOpts = Pick<IParserOpts,
    'callerBaseDir'
    | 'files'
    | 'targetDir'
>;

export interface IValidatorOpts extends TParserInheritedOpts {
    file?: string;

    typeName: string;
}