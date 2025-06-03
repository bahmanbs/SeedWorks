import * as crypto from "crypto";
import Notification from "Src/Common/Main/Ts/Application/Notification";
import Result from "Src/Common/Main/Ts/Application/Result";
import ValueObject from "Src/Common/Main/Ts/Domain/ValueObject";

export default class UUIDV4 extends ValueObject<string>
{
    private static UUIDV4_VALIDATOR = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

    public static createEmpty(): Result<UUIDV4>
    {
        return Result.ok(new UUIDV4({ value: "" }));
    }
    
    public static create(): Result<UUIDV4>
    {
        return Result.ok(new UUIDV4({ value: crypto.randomUUID({ disableEntropyCache: true }) }));
    }

    public static fromValid(aUUIDV4: string): Result<UUIDV4>
    {
        return Result.ok(new UUIDV4({ value: aUUIDV4 }));
    }

    public static isValid(aUUIDV4: string): boolean
    {
        return new RegExp(UUIDV4.UUIDV4_VALIDATOR).test(aUUIDV4);
    }

    public static createFromInput(aUUID: string): Result<UUIDV4>;
    public static createFromInput(aUUID: string[]): Result<UUIDV4[]>;
    public static createFromInput(...args: any[]): any
    {
        const [ firstArgument, propertyKey ] = args;

        if (Array.isArray(firstArgument))
        {
            const uuids = firstArgument.map((uuid) => UUIDV4.createFromString(uuid, propertyKey));

            const validationResult = Result.combine(uuids);

            if (validationResult.isFailure())
            {
                const notification = new Notification();
                notification.addError({ [ propertyKey ]: "INVALID_ID" });
                return Result.fail(notification);
            }
            return Result.ok(uuids.map(uuid => uuid.value));
        }
        else
        {
            return UUIDV4.createFromString(firstArgument, propertyKey);
        }
    }

    private static createFromString(aUUID: string, propertyKey: string): Result<UUIDV4>
    {
        const uuid = aUUID.trim();

        if (!UUIDV4.UUIDV4_VALIDATOR.test(uuid))
        {
            const notification = new Notification();
            notification.addError({ [ propertyKey ]: "INVALID_ID" });
            return Result.fail(notification);
        }
        return Result.ok(new UUIDV4({ value: uuid }));
    }
}
