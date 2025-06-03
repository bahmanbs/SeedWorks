export default class Notification
{
    private _errors: Record<string, string[]>;

    public constructor ()
    {
        this._errors = {};
    }

    public hasError(): boolean
    {
        return Object.keys(this._errors).length > 0;
    }

    public addError(error: Record<string, string>): any
    {
        const [ [ key, value ] ] = Object.entries(error);

        if (!!this._errors[ key ])
        {
            this._errors[ key ].push(value);
        }
        else this._errors = { ...this._errors, [ key ]: [ value ] };
    }

    public addErrors(error: Record<string, string[]>): any
    {
        const [ [ key, values ] ] = Object.entries(error);

        for (const value in values)
        {
            this.addError({ [ key ]: values[ value ] });
        }
    }
    
    public getError()
    {
        return this._errors;
    }

    public combineWith(notification: Notification)
    {
        this._errors = { ...this._errors, ...notification.getError() };
    }
}
