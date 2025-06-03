import DomainEvent from "Src/Common/Main/Ts/Domain/DomainEvent";
import Entity from "Src/Common/Main/Ts/Domain/Entity";
import UUIDV4 from "Src/Common/Main/Ts/Infrastructure/UUIDV4";

export default abstract class AggregateRoot<TId extends UUIDV4> extends Entity<TId>
{
    private _events: Set<DomainEvent> = new Set();

    protected addEvent(event: DomainEvent): void
    {
        this._events.add(event);
    }
    
    protected clearEvent(): void
    {
        this._events.clear();
    }

    public getEvents(): Set<DomainEvent>
    {
        return this._events;
    }

    public equals(anEntity: Entity<TId>): boolean
    {
        if (this === anEntity)
        {
            return true;
        }
        if ((anEntity instanceof Entity) && (this.id === anEntity.id))
        {
            return true;
        }
        return false;
    }

    protected abstract validateInvariant(): void;
}
