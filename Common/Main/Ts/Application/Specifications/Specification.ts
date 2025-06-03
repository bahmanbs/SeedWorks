import Result from "Src/Common/Main/Ts/Application/Result";

export default abstract class Specification<TEntity>
{
    public abstract isSatisfiedBy(candidate: TEntity): boolean;
    public abstract check(candidate: TEntity | string): Result<boolean>;

    public isIdentitySpecification(): boolean
    {
        return false;
    }

    public and(specification: Specification<TEntity>): Specification<TEntity>
    {
        const AndSpecification = require("Src/Common/Main/Ts/Domain/SeedWorks/Specifications/AndSpecification");

        if (this.isIdentitySpecification())
        {
            return specification;
        }
        if (specification.isIdentitySpecification())
        {
            return this;
        }
        return new AndSpecification(this, specification);
    }

    public or(specification: Specification<TEntity>): Specification<TEntity>
    {
        const OrSpecification = require("Src/Common/Main/Ts/Domain/SeedWorks/Specifications/OrSpecification");

        if ((this.isIdentitySpecification()) || (specification.isIdentitySpecification()))
        {
            return [ this, specification ].find((spec) => (spec.isIdentitySpecification()));
        }
        return new OrSpecification(this, specification);
    }
    
    public not(): Specification<TEntity>
    {
        const NotSpecification = require("Src/Common/Main/Ts/Domain/SeedWorks/Specifications/NotSpecification");

        return new NotSpecification(this);
    }
}
