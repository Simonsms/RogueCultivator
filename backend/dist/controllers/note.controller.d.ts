import { Request, Response, NextFunction } from 'express';
export declare const getNotes: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getNote: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createNote: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateNote: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteNote: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
