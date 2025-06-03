import Notification from "Src/Common/Main/Ts/Application/Notification";

export default class DTO
{
    public errors: Notification = null;

    public notifyRedundantKeys(propertyKey: string): void
    {
        const keys = Object.keys(this);

        const errorsIndex = keys.findIndex((key) => (key === "errors"));

        if ((errorsIndex !== 0) || (keys.length > 1))
        {
            if (!this.errors)
            {
                this.errors = new Notification();
                const redundantKeys = keys.filter((key) => (key !== "errors")).join(", ");
                this.errors.addError({ [ propertyKey ]: `Redundant keys of ${ redundantKeys } are not allowed` });
            }
        }
    }
}
