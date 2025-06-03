import { Observable } from 'rxjs';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnprocessableEntityException } from '@nestjs/common';
import { PARAMTYPES_METADATA, ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import DTO from 'Src/Common/Main/Ts/Application/DTO';
import Notification from 'Src/Common/Main/Ts/Application/Notification';

@Injectable()
export class TransformInterceptor implements NestInterceptor
{
    public intercept(context: ExecutionContext, next: CallHandler): Observable<any>
    {
        let errors: Notification;

        const target = context.getClass();
        const request = context.switchToHttp().getRequest();
        const handler = context.getHandler();
        const handlerName = handler.name;

        const routeArguments = Reflect.getMetadata(ROUTE_ARGS_METADATA, target, handlerName);
        const routeArgumentTypes = Reflect.getMetadata(PARAMTYPES_METADATA, target.prototype, handlerName);
        const shouleValidate = Reflect.getMetadata(`validate:${ handlerName }`, target.prototype);

        if (shouleValidate)
        {
            errors = new Notification();
        }

        if (routeArgumentTypes && (routeArgumentTypes.length > 0))
        {
            for (const argument in routeArguments)
            {
                const [ routeArgumentType, routeArgumentIndex ] = argument.split(":");
                const Constructor = routeArgumentTypes[ routeArgumentIndex ];

                const command: DTO = new Constructor();

                switch (parseInt(routeArgumentType) as RouteParamtypes)
                {
                    case RouteParamtypes.BODY:
                        {
                            request.body = Object.assign(command, request.body) as DTO;
                            request.body.notifyRedundantKeys("body");
                            this.collectErrors(shouleValidate, request.body, errors);
                            break;
                        }
                    case RouteParamtypes.QUERY:
                        {
                            request.query = Object.assign(command, request.query) as DTO;
                            request.query.notifyRedundantKeys("query");
                            this.collectErrors(shouleValidate, request.query, errors);
                            break;
                        }
                    case RouteParamtypes.PARAM:
                        {
                            request.params = Object.assign(command, request.params) as DTO;
                            request.params.notifyRedundantKeys("params");
                            this.collectErrors(shouleValidate, request.params, errors);
                            break;
                        }
                    default:
                        {
                            break;
                        }
                }
            }
        }
        this.throwIfNeeded(shouleValidate, errors);

        return next.handle();
    }

    private collectErrors(shouleValidate: boolean, object: { errors?: Notification; }, errors: Notification)
    {
        if (shouleValidate && !!object?.errors?.hasError())
        {
            errors.combineWith(object.errors);
        }
    }

    private throwIfNeeded(shouleValidate: boolean, errors: Notification)
    {
        if (shouleValidate && errors.hasError())
        {
            throw new UnprocessableEntityException(errors.getError());
        }
    }
}
