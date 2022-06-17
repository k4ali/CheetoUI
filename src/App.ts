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
    btnIndex: number;
}

function Delay(milliseconds: number): void
{
    new Promise((resolve: any) => setTimeout(resolve, milliseconds));
}

let glareHandle: any;
class CheetoUI
{
    private menu: ICheetoUI;
    private menuStates: IMenuStates;
    private isGlareLoaded: boolean = false;

    public static defaultStates: IMenuStates = {
        btnIndex: 0,
    }

    constructor(menuStruct: ICheetoUI)
    {
        this.menu = menuStruct;
        this.menuStates = CheetoUI.defaultStates;
    }

    public static MenuConfig = {
        glareScaleformName: "MP_MENU_GLARE",
        structPosition: {
            x: 0.15,
            y: 0.135
        },

        globalSize: {
            width: 0.210
        },

        header: {
            height: 0.095,
            color: [38, 92, 180, 245],
            title: {
                fontIndex: 1,
                size: 0.70
            }
        }
    };

    private drawTitle(): void
    {
        SetTextFont(CheetoUI.MenuConfig.header.title.fontIndex)
        SetTextScale(0.0, CheetoUI.MenuConfig.header.title.size)
        SetTextColour(255, 255, 255, 255)
        SetTextEntry("STRING")
        AddTextComponentString(this.menu.title)
        DrawText(CheetoUI.MenuConfig.structPosition.x / 2.5, CheetoUI.MenuConfig.structPosition.y / (CheetoUI.MenuConfig.header.height * 12.5)) 
    }

    public drawHeader(): void
    {
        const GlobalConfig = CheetoUI.MenuConfig;
        let headerColor = (this.menu.options?.headerColor ?? GlobalConfig.header.color);

        DrawRect(GlobalConfig.structPosition.x, GlobalConfig.structPosition.y, GlobalConfig.globalSize.width, GlobalConfig.header.height, headerColor[0], headerColor[1], headerColor[2], headerColor[3]);
        if (this.menu.title.length > 0)
        {
            this.drawTitle();
        }

        if (this.menu.options?.enableGlare)
        {
            if (!this.isGlareLoaded)
            {
                glareHandle = RequestScaleformMovie(GlobalConfig.glareScaleformName);
                if (HasScaleformMovieLoaded(glareHandle)) this.isGlareLoaded = true;
            }
            else
            {
                DrawScaleformMovie(glareHandle, (GlobalConfig.structPosition.x * 3.118), (GlobalConfig.structPosition.y * 4.182), (GlobalConfig.globalSize.width * 4.5), (GlobalConfig.header.height * 11.15), 255, 255, 255, 255, 1);
            }
        }
    }
}

let newMenu: CheetoUI = new CheetoUI({
    title: "Cheeto Menu",
    subtitle: "Subtitle",
    options: {
        enableGlare: true,
    }
})

setTick(() => {
    newMenu.drawHeader();
})