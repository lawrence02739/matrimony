import { Context } from '../../../types/comType';
import { UserResponse } from '../../../types/userType';
import { HttpStatus, ResponseCode } from '../../../utils/errorCodes';
import { luvError, luvResponse } from '../../../utils/responseHandler';

export const userQuery = {
  users: async (_: any, __: any, { store }: Context, { fieldName }: any):Promise<UserResponse> => {
    try {
      const users = await store.user.findMany({
        where: { status: true },
        orderBy: [ { createdAt: "desc" } ],
        include: { members: { include: { member: true } } },
      });
      const usersDetail = users.map(user => {
        return { ...user, members: user.members.map(assignment => assignment.member) }
      });
      return luvResponse( true, fieldName, "Users fetched Successfully", usersDetail );
    } catch (error) {
      if (!(error instanceof luvError)) {
          error = new luvError(`Failed to fetch users: ${error instanceof Error ? error.message : "Unknown error occurred"}`, ResponseCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw error;
    }
  },
  userById: async (_: any, args: any, { store }: Context, { fieldName }: any):Promise<UserResponse> => {
    try {
      const {id} = args;
      const user = await store.user.findFirst({
        where: { id, status: true },
        include: { members: { include: { member: true } } },
      })
      if (!user) throw new luvError('Invalid user detail','fgdg', HttpStatus.BAD_REQUEST);
      const userDetails =  { ...user, members: user?.members.map(assignment => assignment.member) };
      return luvResponse( true, fieldName, "User fetched Successfully", userDetails );
    } catch (error) {
      if (!(error instanceof luvError)) {
          error = new luvError(`Failed to fetch user: ${error instanceof Error ? error.message : "Unknown error occurred"}`, ResponseCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw error;
    }
  },
  // Using dataSources
  // users: async (_: any, __: any, { dataSources }:{ dataSources: dataSources}) => {
  //   console.log(dataSources);
  //   console.log(dataSources.userAPI);
  //   const allUsers = await dataSources.userAPI.getUsers();
  //   return allUsers;
  // },
};
