import { ArgumentsHost, BadRequestException, Catch, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

interface IClassValidatorReturnType {
  statusCode: number;
  message: [string];
  error: string;
}

@Injectable()
@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const code = exception.code;
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    let message = `${exception}`;

    if (exception instanceof BadRequestException) {
      // class-validator will automatically throw BadRequestException if validation fails
      try {
        const validatorResponse = exception.getResponse() as IClassValidatorReturnType;
        message = Array.isArray(validatorResponse.message) ? validatorResponse.message[0] : validatorResponse.message;
        this.logger.warn(`class-validator: ${message}`);
      } catch (e) {
        // noop
      }
    }

    response.status(status).json({
      code,
      message,
      path: request.path,
      statusCode: status,
      timestamp: new Date().toISOString(),
      type: exception.name,
    });
  }
}
