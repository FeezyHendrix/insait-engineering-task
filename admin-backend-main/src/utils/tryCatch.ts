import { NextFunction, Request, RequestHandler, Response } from "express";

const tryCatch = (controller: RequestHandler) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await controller(req, res, next)
  } catch (err) {
    next(err)
  }
}
export default tryCatch