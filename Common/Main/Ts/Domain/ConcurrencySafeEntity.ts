import Entity from "Src/Common/Main/Ts/Domain/Entity";
import UUID from "Src/Common/Main/Ts/Infrastructure/UUIDV4";

export default abstract class ConcurrencySafeEntity<TId extends UUID> extends Entity<TId>
{
    private _concurrencyVersion: number = 1;

    public get concurrencyVersion(): number
    {
        return this._concurrencyVersion;
    }
    protected set concurrencyVersion(aNewValue: number)
    {
        // if (this.concurrencyVersion !== null)
        // {
        //     this.failWhenConcurrencyViolation(aNewValue);
        // }
        this._concurrencyVersion = aNewValue;
    }
    // public failWhenConcurrencyViolation(aVersion: UUID): void
    // {
    //     if (!aVersion.equals(this.concurrencyVersion))
    //     {
    //         throw new UnprocessableEntityException("Concurrency Violation: Stale data detected. Entity was already modified.");
    //     }
    // }
}
