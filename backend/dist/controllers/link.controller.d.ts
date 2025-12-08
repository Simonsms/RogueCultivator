import { Request, Response, NextFunction } from "express";
export declare const getLinks: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getLink: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createLink: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateLink: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteLink: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const fetchMeta: (req: Request, res: Response, _next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
