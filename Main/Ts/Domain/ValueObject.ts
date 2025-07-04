import { shallowEqual } from "shallow-equal-object";

interface IProps<TValue>
{
    value: TValue;
}
export default class ValueObject<T>
{
    private _props: Readonly<IProps<T>>;

    public get value(): T
    {
        return this._props.value;
    }
    protected set value(value: IProps<T>)
    {
        this._props = Object.freeze(value);
    }

    public equals(valueObject: ValueObject<T>): boolean
    {
        return shallowEqual(this._props, valueObject._props);
    }
    
    protected constructor (value: IProps<T>)
    {
        this.value = value;
    }
}
