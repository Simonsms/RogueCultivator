import { Request, Response, NextFunction } from "express";
export declare const getTags: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createTag: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTag: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
