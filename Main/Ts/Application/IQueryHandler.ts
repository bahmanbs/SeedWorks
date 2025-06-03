export interface IQueryHandler<IQuery, IDTO>
{
    handle(query: IQuery): IDTO;
}
