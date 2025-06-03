import DTO from "Src/Common/Main/Ts/Application/DTO";
import Notification from "Src/Common/Main/Ts/Application/Notification";
import Result from "Src/Common/Main/Ts/Application/Result";

type Factory = { createFromInput(...args: any[]): any; };

export default function Type(factory: Factory)
{
    return function (target: DTO, propertyKey: string)
    {
        let value: Result<any>;

        const getter = function ()
        {
            return value;
        };

        const setter = function (...args: any[])
        {
            value = factory.createFromInput.apply(this, args);

            if (value.isFailure())
            {
                if (!this.errors)
                {
                    this.errors = new Notification();
                }
                this.errors.combineWith(value.getNotification());
            }
        };
        
        Object.defineProperty(target, propertyKey, { get: getter, set: setter });
    };
}
