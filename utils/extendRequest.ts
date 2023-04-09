import { Admin } from ".prisma/client";
import { Request } from "express";
export interface ExtendedRequest extends Request {
  admin?: Admin | null;
}
