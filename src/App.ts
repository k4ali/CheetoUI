interface IMenuOptions
{
    enableHeader?: boolean;
    enableGlare?: boolean;
    headerColor?: number[];
}

interface ICheetoUI
{
    title: string;
    subtitle: string;
    options?: IMenuOptions;
}