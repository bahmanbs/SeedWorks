export default class IdentifiedDomainObject<TId>
{
    protected _id: TId;

    public get id(): TId
    {
        return this._id;
    }
    
    protected set id(newValue: TId)
    {
        this._id = newValue;
    }
}
