import { PrismaClient } from "@prisma/client";
// import UserAPI from "../datasources/user";

// Apollo Context
export interface Context {
  query: string
  store: PrismaClient
  userId?: number | null;
  //dataSources;
}

interface User {
  id: string;
}

export interface Response {
  status: boolean;
  type: string;
  message: string;
  data: any; // Change 'any' to the specific type if needed
}

// export interface dataSources {
//     userAPI: UserAPI
// }

// // Apollo
// export interface DataSourceConfig<TContext = any> {
//     context: TContext
//     cache: KeyValueCache
// }

// User & Member
// export interface user {
//     id: String
//     name: String
//     email: String
//     firstName: String
//     lastName: String
//     mobileNumber: String
//     members: [member]
// }

// export interface MemberAssignment {
//     memberId: number;
//     userId: string;
//     user;
//     member; 
// }

// export interface member {
//     id: Int
//     name: String 
//     email: String 
//     users: [user]
// }