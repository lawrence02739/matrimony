import { Context } from '../../../types/comType';
import { MemberResponse, MembersResponse } from '../../../types/memberType';
import { authMember } from '../../../utils/auth';
import { HttpStatus, ResponseCode } from '../../../utils/errorCodes';
import { luvError, luvResponse } from '../../../utils/responseHandler';

export const memberQuery = {
  members: async (_: any, __: any, { store }: Context, { fieldName }: any): Promise<MembersResponse> => {
    try {
      const members = await store.member.findMany({
        where: { status: true },
        orderBy: [ { createdAt: "desc" } ],
        include: { users: { include: { user: true } } },
      });
      const membersDetail = members.map(member => ({
        ...member,
        users: member.users.map(assignment => assignment.user),
      }));
      return luvResponse( true, fieldName, "Members fetch Successfully", membersDetail );
    } catch (error) {
      if (!(error instanceof luvError)) {
          error = new luvError(`Failed to fetched members: ${error instanceof Error ? error.message : "Unknown error occurred"}`, ResponseCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw error;
    }
  },
  memberById: async (_: any, { id }: any,  { store, userId }: Context, { fieldName }: any): Promise<MemberResponse> => {
    try {
      const member = await store.member.findFirst({
        where: { id, status: true },
        include: { users: { include: { user: true } } },
      });
      const memberDetail =  {
        ...member,
        users: member?.users.map(assignment => assignment.user),
      };
      return luvResponse( true, fieldName, "Member fetched Successfully", memberDetail );
    } catch (error) {
      if (!(error instanceof luvError)) {
          error = new luvError(`Failed to fetch member: ${error instanceof Error ? error.message : "Unknown error occurred"}`, ResponseCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw error;
    }
  },
  myUsers: async (_: any, __: any,  { store, userId }: Context, { fieldName }: any): Promise<MemberResponse> => {
    try {
      if (!userId) throw new luvError('Member UnAuthorized', ResponseCode.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      const memberDetails = await authMember(userId);
      if (!memberDetails) throw new luvError('Member UnAuthorized', ResponseCode.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      console.log(memberDetails);

      const member = await store.member.findFirst({
        where: { id:userId, status: true },
        include: { users: { include: { user: true } } },
      });
      const memberDetail =  {
        ...member,
        users: member?.users.map(assignment => assignment.user),
      };
      return luvResponse( true, fieldName, "Member fetched Successfully", memberDetail );
    } catch (error) {
      if (!(error instanceof luvError)) {
          error = new luvError(`Failed to fetch member: ${error instanceof Error ? error.message : "Unknown error occurred"}`, ResponseCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw error;
    }
  },
};
