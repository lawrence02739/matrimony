
import { userMutation } from './userMutation'
import { memberMutation } from './memberMutation'

export const mutationResolvers = {
  Mutation: {
    ... userMutation,
    ... memberMutation,
  },
};
