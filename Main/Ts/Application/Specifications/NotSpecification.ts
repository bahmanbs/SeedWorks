import Result from "Src/Common/Main/Ts/Application/Result";
import Specification from "Src/Common/Main/Ts/Application/Specifications/Specification";


export default class NotSpecification<TEntity> extends Specification<TEntity>
{
    public constructor (private readonly _specification: Specification<TEntity>)
    {
        super();
    }
    
    public get specification(): Specification<TEntity>
    {
        return this._specification;
    }

    public override isSatisfiedBy(candidate: TEntity): boolean
    {
        return !this._specification.isSatisfiedBy(candidate);
    }

    public check(candidate: string | TEntity): Result<boolean>
    {
        throw new Error("Method not implemented.");
    }
}
