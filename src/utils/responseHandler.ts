import { ApolloError } from 'apollo-server-errors';
import { Response } from '../types/comType';

export class luvError extends ApolloError {
    constructor(message: string, code: string, httpStatusCode: number) {
        super(message, code, { httpStatusCode });
        Object.defineProperty(this, 'name', { value: this.constructor.name });
    }
}

export const luvResponse = (status: boolean, type: string, message: string, data: any): Response => {
    return { status, type, message, data };
};