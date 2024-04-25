import { Member, User } from "@prisma/client";

export interface MemberCreateArg {
  input: {
    name: string;
    email: string;
    password: string;
  }
}

export interface MemberUpdateArg {
  id: number
  input: MemberCreateArg
}

export interface DeleteMemberArg {
  id: number
}

export interface SigninMemberArgs {
  input: {
    email: string;
    password: string;
  }
}

export interface MemberResponse {
  status: boolean
  type: string
  message: string
  data: Member | null;
}

export interface MembersResponse {
  status: boolean
  type: string
  message: string
  data: [Member] | null;
}


export interface TokenResponse {
  status: boolean
  type: string
  message: string
  data: { token: string } | null;
}

export interface MemberAssignmentResponse {
  status: boolean
  type: string
  message: string
  data: MemberAssignment | null;
}


interface MemberAssignment  {
  memberId: number
  userId: string
  member: Member
  user: User
}


