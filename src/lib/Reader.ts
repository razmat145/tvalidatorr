
import _ from 'lodash';

import { promises as afs } from 'fs';
import path from 'path';

import { ITypeDescription, Parserr, IParserOpts } from 'tparserr';

import { IValidatorOpts } from './types/ValidatorOpts';


class Reader {

    private typeDescriptionCacheMap: Record<string, ITypeDescription> = {};

    public async getTypeDescription(opts: IValidatorOpts): Promise<ITypeDescription> {

        const { typeName } = opts;
        const doesExistInCache = !_.isEmpty(this.typeDescriptionCacheMap[typeName]);

        if (!doesExistInCache) {
            await this.loadTypeDescriptions(opts);
        }

        return this.getCachedTypeDescription(typeName);
    }

    public getCachedTypeDescription(typeName: string): ITypeDescription {
        const doesExistInCache = !_.isEmpty(this.typeDescriptionCacheMap[typeName]);

        if (doesExistInCache) {
            return this.typeDescriptionCacheMap[typeName];
        } else {
            throw new Error(`Type: ${typeName} does not exist in cache, have you forgot to load it?`);
        }
    }

    public async loadTypeDescriptionsByFile(file?: string) {
        const typeDescriptions = await afs.readFile(file || path.resolve(process.cwd(), 'typeDescriptions.json'), 'utf-8');

        this.loadTypeDescriptionsToCache(JSON.parse(typeDescriptions));
    }

    public async loadTypeDescriptions(opts: Partial<IValidatorOpts>) {
        const parserOpts = this.extractParserOpts(opts);

        const typeDescriptions = await Parserr.parse(parserOpts);

        this.loadTypeDescriptionsToCache(typeDescriptions);
    }

    private loadTypeDescriptionsToCache(typeDescriptions: Array<ITypeDescription>) {
        for (const typeDesc of typeDescriptions) {
            const typeName = typeDesc.name;
            const doesExistInCache = !_.isEmpty(this.typeDescriptionCacheMap[typeName]);

            if (!doesExistInCache) {
                this.typeDescriptionCacheMap[typeName] = typeDesc;
            }
        }
    }

    private extractParserOpts(opts: Partial<IValidatorOpts>): IParserOpts {
        const { file } = opts;

        const parserOpts = _.pick(opts, [
            'callerBaseDir',
            'files',
            'targetDir'
        ]);

        file && _.assign(parserOpts, { files: [file] });
        _.assign(parserOpts, {
            includeOnlyExports: true,
            enableDecorators: true,
            enableSourceFilePathing: true
        });

        return parserOpts;
    }

}

export default new Reader();