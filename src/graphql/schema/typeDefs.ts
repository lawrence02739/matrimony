import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Query {
    users: UsersResponse
    userById(id: String!): UserResponse
    members: MembersResponse
    memberById(id: Int!): MemberResponse
    myUsers: MemberResponse
  }

  type Mutation {
    createUser(input: CreateUserInput!): UserResponse
    updateUser(id: String!, input: UpdateUserInput!): UserResponse
    deleteUser(id: String!): UserResponse
    createMember(input: CreateMemberInput!): MemberResponse
    updateMember(id: Int!, input: UpdateMemberInput!): MemberResponse
    deleteMember(id: Int!): MemberResponse
    signinMember(input: SigninMemberInput!): Token
    assignMemberToUser(userId: String!, memberId: Int!): MemberAssignmentResponse
    unassignMemberFromUser(userId: String!, memberId: Int!): MemberAssignmentResponse
  }

  type UserResponse {
    status: Boolean!
    type: String!
    message: String!
    data: User
  }

  type UsersResponse {
    status: Boolean!
    type: String!
    message: String!
    data: [User]
  }

  type MemberResponse {
    status: Boolean!
    type: String!
    message: String!
    data: Member
  }

  type MembersResponse {
    status: Boolean!
    type: String!
    message: String!
    data: [Member]
  }

  type MemberAssignmentResponse {
    status: Boolean!
    type: String!
    message: String!
    data: MemberAssignment
  }

  
  
  type User {
    id: String
    name: String
    email: String
    firstName: String
    lastName: String
    mobileNumber: String
    status: Boolean!
    members: [Member]
  }

  type Member {
    id: Int
    name: String!
    email: String!
    status: Boolean!
    users: [User]
  }

  input CreateUserInput {
    name: String!
    email: String!
    firstName: String!
    lastName: String!
    mobileNumber: String!
  }

  input UpdateUserInput {
    name: String
    email: String
    firstName: String
    lastName: String
    mobileNumber: String
  }

  input CreateMemberInput {
    name: String!
    email: String!
    password: String!
  }

  input UpdateMemberInput {
    name: String
    email: String
  }

  type MemberAssignment {
    memberId: Int!
    userId: String!
    member: Member
    user: User
  }

  input SigninMemberInput {
    email: String!
    password: String!
  }
  
  type Token {
    token: String
  }
`;