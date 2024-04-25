import { v4 as uuidv4 } from 'uuid';
import { Context } from '../../../types/comType';
import { UserCreateArg, UserUpdateArg, DeleteUserArg, UserResponse } from '../../../types/userType';
import validator from 'validator';
import { luvError, luvResponse } from '../../../utils/responseHandler';
import { HttpStatus, ResponseCode } from '../../../utils/errorCodes';

export const userMutation = {
  createUser: async (_: any, { input }: UserCreateArg, { store }: Context, { fieldName }: any):Promise<UserResponse> => {
    try {
      const { name, email, firstName, lastName, mobileNumber } = input;
      const isEmail = validator.isEmail(email);
      if (!isEmail) throw new luvError('Invalid Email', ResponseCode.INVALID_EMAIL, HttpStatus.BAD_REQUEST);

      const createUser: any = await store.user.create({
        data: { id: uuidv4(), name, email, firstName, lastName, mobileNumber },
      });

      return luvResponse( true, fieldName, "User Created Successfully", createUser );
    } catch (error) {
      if (!(error instanceof luvError)) {
          error = new luvError(`Failed to create user: ${ error instanceof Error? error.message: "Unknown error occurred" }`, ResponseCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw error;
    }
  },
  updateUser: async (_: any, { id, input }: UserUpdateArg, { store }: Context, { fieldName }: any):Promise<UserResponse> => {
    try {
      const updatedUser = await store.user.update({
        where: { id },
        data: input,
      });
      return luvResponse( true, fieldName, "User Updated Successfully", updatedUser );
    } catch (error) {
      throw new luvError(`Failed to update user: ${ error instanceof Error? error.message: "Unknown error occurred" }`, ResponseCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  },
  deleteUser: async (_: any, { id }: DeleteUserArg, { store }: Context, { fieldName }: any):Promise<UserResponse> => {
    try {
      const deletedUser = await store.user.delete({
        where: { id },
      });
      return luvResponse( true, fieldName, "User Deleted Successfully", deletedUser );
    } catch (error) {
      throw new luvError(`Failed to delete user: ${ error instanceof Error? error.message: "Unknown error occurred" }`, ResponseCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
};
