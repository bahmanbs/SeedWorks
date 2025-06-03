import UUIDV4 from "Src/Common/Main/Ts/Infrastructure/UUIDV4";

export default class DomainEvent
{
    private _id = UUIDV4.create().value.value;
    private _name = this.constructor.name;
    private _proccessed = false;
    private _occuredOn: Date;
    private _correlationId: string;

    constructor (occuredOn?: Date, correlationId?: string)
    {
        this.occuredOn = occuredOn ?? new Date();
        this.correlationId = correlationId ?? UUIDV4.create().value.value;
    }

    public get id(): string
    {
        return this._id;
    }

    public get name(): string
    {
        return this._name;
    }

    public get proccessed(): boolean
    {
        return this._proccessed;
    }

    private set proccessed(proccessed: boolean)
    {
        this._proccessed = proccessed;
    }

    public get occuredOn(): Date
    {
        return this._occuredOn;
    }

    private set occuredOn(date: Date)
    {
        this._occuredOn = date;
    }

    public get correlationId(): string
    {
        return this._correlationId;
    }

    private set correlationId(value: string)
    {
        this._correlationId = value;
    }

    public getJSONPayload(): string
    {
        const payload = Object.fromEntries(Object.entries(this));

        delete payload._id;
        delete payload._name;
        delete payload._proccessed;
        delete payload._occuredOn;
        delete payload._correlationId;

        return JSON.stringify(payload);
    }
}
