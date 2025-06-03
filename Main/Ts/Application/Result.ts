import Notification from "Src/Common/Main/Ts/Application/Notification";

export default class Result<T>
{
    private constructor (private _value: T | null, private notification: Notification | null)
    { }

    public static ok<U>(value?: U): Result<U>
    {
        return new Result<U>(value, null);
    }

    public static fail<U>(notification: Notification): Result<U>
    {
        return new Result<U>(null, notification);
    }

    public isSuccess(): boolean
    {
        return this.notification === null;
    }

    public isFailure(): boolean
    {
        return !this.isSuccess();
    }

    public get value(): T | null
    {
        if (this.isFailure())
        {
            throw new Error("Cannot get value from a failed result.");
        }
        return this._value;
    }

    public getNotification(): Notification | null
    {
        if (this.isSuccess())
        {
            throw new Error("Cannot get error from a successful result.");
        }
        return this.notification;
    }
    
    public static combine(results: Result<unknown>[]): Result<unknown>
    {
        const combinedNotification = new Notification();

        for (const result of results)
        {
            if (result.isFailure())
            {
                combinedNotification.combineWith(result.getNotification());
            }
        }
        if (combinedNotification.hasError())
        {
            return Result.fail(combinedNotification);
        }
        return Result.ok();
    }
}
