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

interface IMenuStates
{
    btnIndex: number = 0;
}

class CheetoUI
{
    private menu: IActualMenu;
    private menuStates: IMenuStates;

    public static defaultStates: IMenuStates = {
        btnIndex: 0,
    }

    constructor(menuStruct: ICheetoUI)
    {
        this.menu = menuStruct;
        this.menuStates = CheetoUI.defaultStates;
    },

    public static MenuConfig = {
        structPosition: {
            x: 0.2,
            y: 0.2
        },

        globalSize: {
            width: 0.15
        },

        header: {
            height: 0.12,
            color: [27, 91, 189, 245]
        }
    };

    private drawHeader(): void
    {
        const GlobalConfig = CheetoUI.MenuConfig;
        let headerColor = (this.menu.options?.headerColor ?? GlobalConfig.header.color);

        DrawRect(GlobalConfig.structPosition.x, GlobalConfig.structPosition.y, GlobalConfig.globalSize.width, GlobalConfig.header.height, headerColor[0], headerColor[1], headerColor[2], headerColor[3]);
    }
}

let newMenu: I
setTick(() => {

})