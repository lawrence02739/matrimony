import { PrismaClient } from "@prisma/client";
import JWT from "jsonwebtoken";
import { luvError } from "./responseHandler";
import { HttpStatus, ResponseCode } from "./errorCodes";

interface DecodedToken {
    userId: number;
  }

export const getUserFromToken = (authorization: string) => {
  try {
    if (!authorization || !authorization.startsWith("Bearer ")) return { userId: null };

      const token = authorization.substring(7);
      const jwtSignature = process.env.JWT_SIGNATURE || '';

      if (!jwtSignature) return { userId: null };

      const decodedToken = JWT.verify(token, jwtSignature) as DecodedToken;

      return { userId: decodedToken?.userId };
    
  } catch (error) {
    throw new luvError('Invalid token: userId is missing', ResponseCode.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
  }
};

export const authMember = async (userId: number) => {
  try {
      const store = new PrismaClient();
      const member = await store.member.findFirst({
          where: { id: userId, status: true }
      });

      if (member) {
          return member;
      } else {
          throw new luvError('Member UnAuthorized', ResponseCode.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }
  } catch (error) {
    if (!(error instanceof luvError)) {
      error = new luvError(`Failed to Authenticate: ${error instanceof Error ? error.message : "Unknown error occurred"}`, ResponseCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw error;
  }
};