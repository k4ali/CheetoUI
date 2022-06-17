type Color = [number, number, number, number];

interface IMenuOptions
{
    enableHeader?: boolean;
    enableGlare?: boolean;
    headerColor?: Color;
}

interface ICheetoUI
{
    title: string;
    subtitle: string;
    closable?: boolean;
    options?: IMenuOptions;
}

interface IActualMenu extends ICheetoUI
{
    btnIndex: number = 0;
}

class CheetoUI
{
    menu: ICheetoUI;

    constructor(menuStruct: ICheetoUI)
    {
        this.menu = menuStruct;
    },

    private static MenuConfig = {
        structPosition: {
            x: 0.2,
            y: 0.2
        },

        globalSize: {
            width: 0.15
        },

        header: {
            height: 0.12
        }
    };

    public static drawHeader(): void
    {
        const GlobalConfig = this.MenuConfig;
        DrawRect(GlobalConfig.structPosition.x, GlobalConfig.structPosition.y, GlobalConfig.globalSize.width, GlobalConfig.header.height, 255, 255, 255, 255);
    }
}

setTick(() => {
    CheetoUI.drawHeader();
})