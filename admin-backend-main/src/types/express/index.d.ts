import express from "express";
import { JwtPayload } from "jsonwebtoken";
import { VerifiedJwtPayload } from "..";

declare module "express-serve-static-core" {
  interface Request {
    user: VerifiedJwtPayload | string;
  }
}