import validator from 'validator';
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Context } from '../../../types/comType';
import { MemberCreateArg, MemberUpdateArg, DeleteMemberArg, SigninMemberArgs, MemberResponse, TokenResponse, MemberAssignmentResponse } from '../../../types/memberType';
import { AssignMemberUserArg } from '../../../types/memberAssignmentType';
import { luvError, luvResponse } from '../../../utils/responseHandler';
import { HttpStatus, ResponseCode } from '../../../utils/errorCodes';

export const memberMutation = {
  createMember: async (_: any, { input }: MemberCreateArg, { store }: Context , { fieldName }: any): Promise<MemberResponse> => {
    try {
      const { name, email, password } = input;
      const isValidEmail = validator.isEmail(email);
      if (!isValidEmail) throw new luvError('Invalid Email', ResponseCode.INVALID_EMAIL, HttpStatus.BAD_REQUEST);
      const isPassword = validator.isLength(password, {
        min: 8,
      });
      if (!isPassword) throw new luvError('Password must be at least 8 characters long.', ResponseCode.INVALID_PASSWORD, HttpStatus.BAD_REQUEST);
      const hashedPassword = await bcrypt.hash(password, 10);

      const createdmember =  await store.member.create({
        data: { name, email, password: hashedPassword },
      });

      return luvResponse( true, fieldName, "Member Created Successfully", createdmember );
    } catch (error) {
      if (!(error instanceof luvError)) {
          error = new luvError(`Failed to create member: ${error instanceof Error ? error.message : "Unknown error occurred"}`, ResponseCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw error;
    }
  },
  updateMember: async (_: any, { id, input }: MemberUpdateArg, { store }: Context, { fieldName }: any): Promise<MemberResponse> => {
    try {
      const updatedMember = await store.member.update({
        where: { id, status: true },
        data: input,
      });
      return luvResponse( true, fieldName, "Member Updated Successfully", updatedMember );
    } catch (error) {
      throw new luvError(`Failed to update member: ${error instanceof Error ? error.message : "Unknown error occurred"}`, ResponseCode.INTERNAL_SERVER_ERROR,HttpStatus.INTERNAL_SERVER_ERROR );
    }
  },
  deleteMember: async (_: any, { id }: DeleteMemberArg, { store }: Context, { fieldName }: any): Promise<MemberResponse> => {
    try {
      const deletedMember = await store.member.delete({
        where: { id },
      });
      return luvResponse( true, fieldName, "Member Deleted Successfully", deletedMember );
    } catch (error) {
        throw new luvError(`Failed to delete member: ${error instanceof Error ? error.message : "Unknown error occurred"}`, ResponseCode.INTERNAL_SERVER_ERROR,HttpStatus.INTERNAL_SERVER_ERROR );
    }
  },
  signinMember: async ( _: any, { input:{email, password} }: SigninMemberArgs, { store }: Context, { fieldName }: any ) => {
    try {
      const member = await store.member.findFirst({
        where: { email, status: true }
      });
      if (!member) throw new luvError('Invalid credentials', ResponseCode.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);

      const isValidMatch = await bcrypt.compare(password, member.password);
      if (!isValidMatch) throw new luvError('Invalid credentials', ResponseCode.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);

      const token = JWT.sign({ userId: member.id }, process.env.JWT_SIGNATURE as string, { expiresIn: process.env.EXPIRES_IN })
      return { token };
    } catch (error) {
      if (!(error instanceof luvError)) {
        error = new luvError(`Failed to Login member: ${error instanceof Error ? error.message : "Unknown error occurred"}`, ResponseCode.INTERNAL_SERVER_ERROR,HttpStatus.INTERNAL_SERVER_ERROR );
      }
      throw error;
    }
  },
  assignMemberToUser: async (_: any, { userId, memberId }: AssignMemberUserArg, { store }: Context, { fieldName }: any): Promise<MemberAssignmentResponse> => {
    try {
      const userExist = await store.user.findFirst({
        where: { id: userId, status: true },
      });
      if (!userExist) throw new luvError('Invalid user detail', ResponseCode.INVALID_USER, HttpStatus.BAD_REQUEST);

      const memberExist = await store.member.findFirst({
        where: { id: memberId, status: true },
      });
      if (!memberExist) throw new luvError('Invalid member detail', ResponseCode.INVALID_MEMBER, HttpStatus.BAD_REQUEST);

      const existingAssignment = await store.memberAssignment.findFirst({
        where: { userId, memberId },
      });
      if (existingAssignment) throw new luvError('Member already assigned to user', ResponseCode.ALREADY_ASSIGNED, HttpStatus.BAD_REQUEST);
      
      const newAssignment = await store.memberAssignment.create({
        data: { userId, memberId },
      });
      return luvResponse( true, fieldName, "Member assigned to user", newAssignment );
    } catch (error) {
      if (!(error instanceof luvError)) {
        error = new luvError(`Failed to Login member: ${error instanceof Error ? error.message : "Unknown error occurred"}`, ResponseCode.INTERNAL_SERVER_ERROR,HttpStatus.INTERNAL_SERVER_ERROR );
      }
      throw error;
    }
  },
  unassignMemberFromUser: async (_: any, { userId, memberId }: AssignMemberUserArg, { store }: Context, { fieldName }: any): Promise<MemberAssignmentResponse> => {
    try {
      const userExist = await store.user.findFirst({
        where: { id: userId, status: true },
      });
      if (!userExist) throw new luvError('Invalid user detail', ResponseCode.INVALID_USER, HttpStatus.BAD_REQUEST);

      const memberExist = await store.member.findFirst({
        where: { id: memberId, status: true },
      });
      if (!memberExist) throw new luvError('Invalid member detail', ResponseCode.INVALID_MEMBER, HttpStatus.BAD_REQUEST);

      const existingAssignment = await store.memberAssignment.findFirst({
        where: { userId, memberId },
      });
      if (!existingAssignment) throw new luvError('Member not assigned to user', ResponseCode.NOT_ASSIGNED, HttpStatus.BAD_REQUEST);

      const deletedAssignment = await store.memberAssignment.delete({
        where: { memberId_userId: { memberId, userId } },
      });
      return luvResponse( true, fieldName, "Member unassigned to user", deletedAssignment );
    } catch (error) {
      if (!(error instanceof luvError)) {
        error = new luvError(`Failed to Login member: ${error instanceof Error ? error.message : "Unknown error occurred"}`, ResponseCode.INTERNAL_SERVER_ERROR,HttpStatus.INTERNAL_SERVER_ERROR );
      }
      throw error;
    }
  },
};
