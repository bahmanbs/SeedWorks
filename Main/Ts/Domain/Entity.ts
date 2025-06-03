import IdentifiedDomainObject from "Src/Common/Main/Ts/Domain/IdentifiedDomainObject";
import ULID from "Src/Common/Main/Ts/Infrastructure/ULID";

export default abstract class Entity<TId extends ULID> extends IdentifiedDomainObject<TId>
{ }
