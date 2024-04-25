import { userQuery } from './userQuery';
import { memberQuery } from './memberQuery';

export const queryResolvers = {
  Query: {
    ... userQuery,
    ... memberQuery
  }
};
