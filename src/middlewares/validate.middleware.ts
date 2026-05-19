import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError } from '../utils/ApiError.js';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      // Overwrite req with stripped and validated data to prevent mass assignment
      if (parsedData.body) req.body = parsedData.body;
      if (parsedData.query) req.query = parsedData.query as any;
      if (parsedData.params) req.params = parsedData.params as any;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map paths to messages for clear frontend feedback
        const errorMessages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
        throw new ApiError(400, errorMessages);
      }
      next(error);
    }
  };
};
