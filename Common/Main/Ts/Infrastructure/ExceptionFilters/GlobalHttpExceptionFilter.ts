import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import ApiResponse from 'Src/Common/Main/Ts/Infrastructure/ApiResponse';

// const farsiErrors = {};

@Catch()
export default class GlobalHttpExceptionFilter implements ExceptionFilter
{
  constructor (private _httpAdapterHost: HttpAdapterHost) { }

  public catch(exception: HttpException, host: ArgumentsHost): void
  {
    const { httpAdapter } = this._httpAdapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error = exception?.getResponse?.() ?? exception.message;

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const apiResponse = ApiResponse.fromStatusCodeOf(httpStatus)(error);

    httpAdapter.reply(response, apiResponse.toJSON(), httpStatus);
  }
}
