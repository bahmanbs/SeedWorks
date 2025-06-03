import Result from "Src/Common/Main/Ts/Application/Result";
import Specification from "Src/Common/Main/Ts/Application/Specifications/Specification";

export default class AndSpecification<TEntity> extends Specification<TEntity>
{
    public constructor (private readonly _left: Specification<TEntity>, private readonly _right: Specification<TEntity>)
    {
        super();
    }
    
    public get left(): Specification<TEntity>
    {
        return this._left;
    }

    public get right(): Specification<TEntity>
    {
        return this._left;
    }

    public override isSatisfiedBy(candidate: TEntity): boolean
    {
        return this._left.isSatisfiedBy(candidate) && this._right.isSatisfiedBy(candidate);
    }

    public check(candidate: string | TEntity): Result<boolean>
    {
        throw new Error("Method not implemented.");
    }
}
