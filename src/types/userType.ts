import { User } from "@prisma/client";

export interface UserCreateArg {
  input: {
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
  }
}

export interface UserUpdateArg {
  id: string
  input: UserCreateArg
}

export interface DeleteUserArg {
  id: string
}

export interface UserResponse {
  status: boolean
  type: string
  message: string
  data: User | null;
}

export interface UsersResponse {
  status: boolean
  type: string
  message: string
  data: [User] | null;
}

