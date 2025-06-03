import Result from "Src/Common/Main/Ts/Application/Result";
import Specification from "Src/Common/Main/Ts/Application/Specifications/Specification";

export default class IdentitySpecification<TEntity> extends Specification<TEntity>
{
    public override isIdentitySpecification(): boolean
    {
        return true;
    }
    
    public override check(): Result<boolean>
    {
        return Result.ok(true);
    }

    public override isSatisfiedBy(): boolean
    {
        return true;
    }
}
