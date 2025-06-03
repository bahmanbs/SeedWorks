export interface IMessageHandler<IMessage, IResult = void>
{
    handle(message: IMessage): IResult;
}
