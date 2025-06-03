import { map, Observable } from "rxjs";
import { Response } from "express";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import ApiResponse from "Src/Common/Main/Ts/Infrastructure/ApiResponse";

@Injectable()
export default class ResponseInterceptor implements NestInterceptor
{
    public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>
    {
        return next.handle().pipe(
            map((result) =>
            {
                if (result instanceof ApiResponse)
                {
                    if (result.isStreaming)
                    {
                        result.startStreaming();
                    }

                    else result.toJSON();
                }

                const response = context.switchToHttp().getResponse<Response>();

                const method = ApiResponse.fromStatusCodeOf(response.statusCode);

                return method(result).toJSON();
            })
        );
    }
}
