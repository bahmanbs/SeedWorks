export function Validate()
{
    return function (target?: any, propertyKey?: string, descriptor?: PropertyDescriptor)
    {
        Reflect.defineMetadata(`validate:${ propertyKey }`, true, target);

        return descriptor;
    };
}
