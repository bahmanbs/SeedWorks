import { Response } from "express";
import { Observable } from "rxjs";
import { createHash } from 'crypto';
import { HttpStatus } from "@nestjs/common";

export default class ApiResponse
{
    private _headers: Record<string, any>;
    private _data: Record<string, string | number | boolean | object | null>;
    private _message: string;
    private _isStreaming: boolean;
    private _stream$: Observable<any> | null;
    private _response: Response | null;

    private constructor (message: string, data = {}, headers = {}, stream$?: Observable<any>, response?: Response)
    {
        this.message = message;
        this.data = data;
        this.headers = headers;
        this.isStreaming = false;

        if (!!stream$)
        {
            if (!!response)
            {
                this.stream$ = stream$;
                this.response = response;
                this.isStreaming = true;
            }
            else
            {
                throw new Error("Can not start streaming without access to the response object");
            }
        }
    }

    // #region accessors
    public get headers(): object
    {
        return this._headers;
    }

    private set headers(headers: object)
    {
        this._headers = headers;
    }

    public get data(): object
    {
        return this._data;
    }

    private set data(data: Record<string, string | number | boolean | object | null>)
    {
        this._data = data;
    }

    public get message(): string
    {
        return this._message;
    }

    private set message(message: string)
    {
        this._message = message;
    }

    public get isStreaming(): boolean
    {
        return this._isStreaming;
    }

    private set isStreaming(isStreaming: boolean)
    {
        this._isStreaming = isStreaming;
    }

    public get stream$(): Observable<any>
    {
        return this._stream$;
    }

    private set stream$(stream$: Observable<any>)
    {
        this._stream$ = stream$;
    }

    public get response(): Response
    {
        return this._response;
    }

    private set response(response: Response)
    {
        this._response = response;
    }
    // #endregion

    // #region factories
    public static informational(message: string): ApiResponse
    {
        return new ApiResponse(message);
    }

    public static success(message: string, data: object): ApiResponse
    {
        return new ApiResponse(message, data);
    }

    public static redirection(message: string, location: string): ApiResponse
    {
        return new ApiResponse(message, undefined, { Location: location });
    }

    public static clientError(message: string, data = {}): ApiResponse
    {
        return new ApiResponse(message, data);
    }

    public static serverError(message: string, data = {}): ApiResponse
    {
        return new ApiResponse(message, data);
    }
    // #endregion

    // #region Success
    public static OK(data = {}): ApiResponse
    {
        return ApiResponse.success('OK', data);
    }

    public static created(data = {}): ApiResponse
    {
        return ApiResponse.success('Created', data);
    }

    public static accepted(data: object = {}): ApiResponse
    {
        return ApiResponse.success('Accepted', data);
    }

    public static fromStream(stream$: Observable<any>, response: Response)
    {
        return new ApiResponse
            (
                "",
                {},
                {
                    'Transfer-Encoding': 'chunked',
                    'Content-Type': 'text/html; charset=utf-8'
                },
                stream$,
                response
            );
    }
    // #endregion

    // #region Redirection
    public static movedPermanently(location: string): ApiResponse
    {
        return ApiResponse.redirection('Moved Permanently', location);
    }

    public static notModified(): ApiResponse 
    {
        return new ApiResponse('Not Modified');
    }
    // #endregion

    // #region Client Error
    public static badRequest(data = {}): ApiResponse
    {
        return ApiResponse.clientError('Bad Request', data);
    }

    public static unauthorized(data = {}): ApiResponse
    {
        return ApiResponse.clientError('Unauthorized', data);
    }

    public static unprocessableEntity(data = {}): ApiResponse
    {
        return ApiResponse.clientError('Unprocessable Entity', data);
    }
    // #endregion

    // #region Server Error
    public static internalServerError(message = 'Internal Server Error'): ApiResponse
    {
        return ApiResponse.serverError(message);
    }
    // #endregion

    public static eTag(data: object, weak = false): ApiResponse
    {
        const hash = createHash('sha1').update(JSON.stringify(data)).digest('hex');

        const eTagValue = `${ weak ? 'W/' : '' }"${ hash }"`;
        return new ApiResponse('OK', data, { ETag: eTagValue });
    }

    public static cacheControl(maxAge = 3600, publicCache = true): ApiResponse
    {
        const cacheControlValue = `max-age=${ maxAge }${ publicCache ? ', public' : '' }`;
        return new ApiResponse('OK', undefined, { 'Cache-Control': cacheControlValue });
    }

    public startStreaming()
    {
        if (this.isStreaming)
        {
            for (const key in this.headers)
            {
                this.response.setHeader(key, this.headers[ key ]);
            }

            this.stream$.subscribe({
                next: (chunk: any) =>
                {
                    this.response.write(chunk);
                },
                complete: () =>
                {
                    this.response.end();
                }
            });
        }
    }

    public toJSON(): Object
    {
        return {
            message: this.message,
            data: this.data
        };
    }

    static fromStatusCodeOf(statusStatus: HttpStatus)
    {
        switch (statusStatus)
        {
            case HttpStatus.OK:
                {
                    return ApiResponse.OK;
                }
            case HttpStatus.CREATED:
                {
                    return ApiResponse.created;
                }
            case HttpStatus.ACCEPTED:
                {
                    return ApiResponse.accepted;
                }
            case HttpStatus.MOVED_PERMANENTLY:
                {
                    return ApiResponse.movedPermanently;
                }
            case HttpStatus.NOT_MODIFIED:
                {
                    return ApiResponse.notModified;
                }
            case HttpStatus.BAD_REQUEST:
                {
                    return ApiResponse.badRequest;
                }
            case HttpStatus.UNAUTHORIZED:
                {
                    return ApiResponse.unauthorized;
                }
            case HttpStatus.UNPROCESSABLE_ENTITY:
                {
                    return ApiResponse.unprocessableEntity;
                }
            case HttpStatus.INTERNAL_SERVER_ERROR:
                {
                    return ApiResponse.internalServerError;
                }
            default:
                {
                    return ApiResponse.OK;
                }
        }
    }
}
