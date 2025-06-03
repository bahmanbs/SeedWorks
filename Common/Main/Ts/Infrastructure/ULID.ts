import { ulid } from "ulid";
import Notification from "Src/Common/Main/Ts/Application/Notification";
import Result from "Src/Common/Main/Ts/Application/Result";
import ValueObject from "Src/Common/Main/Ts/Domain/ValueObject";

export default class ULID extends ValueObject<string>
{
    private static _VALIDATOR = /^[0-9A-HJKMNP-TV-Z]{26}$/i;

    public static createEmpty(): Result<ULID>
    {
        return Result.ok(new ULID({ value: "" }));
    }

    public static create(): Result<ULID>
    {
        return Result.ok(new ULID({ value: ulid().toString() }));
    }

    public static fromValid(anULID: string): Result<ULID>
    {
        return Result.ok(new ULID({ value: anULID }));
    }

    public static isValid(anULID: string): boolean
    {
        return new RegExp(ULID._VALIDATOR).test(anULID);
    }

    public static createFromInput(anULID: string, propertyKey: string): Result<ULID>;
    public static createFromInput(anULID: string[], propertyKey: string): Result<ULID>;
    public static createFromInput(...args: any[]): any
    {
        const [ firstArgument, propertyKey ] = args;

        if (Array.isArray(firstArgument))
        {
            const ulids = firstArgument.map((ulid) => ULID.createFromString(ulid, ulid));

            const validationResult = Result.combine(ulids);

            if (validationResult.isFailure())
            {
                const notification = new Notification();
                notification.addError({ [ propertyKey ]: "INVALID_ID" });
                return Result.fail(notification);
            }

            return Result.ok(ulids.map((ulid) => (ulid.value)));
        }
        else
        {
            return ULID.createFromString(firstArgument, propertyKey);
        }
    }

    private static createFromString(aULID: string, propertyKey: string): Result<ULID>
    {
        const ulid = String(aULID).trim();

        if (![ 'null', '' ].includes(ulid) && !ULID._VALIDATOR.test(ulid))
        {
            const notification = new Notification();
            notification.addError({ [ propertyKey ]: "INVALID_ID" });
            return Result.fail(notification);
        }

        return Result.ok(new ULID({ value: ulid }));
    }
}
