type Color = [number, number, number, number];
type Callback = (cbData: any) => void;
type Position = {
    x: number,
    y: number
    z?: number;
};

interface ISoundArray
{
    [index: string]: [string, string, boolean];
}

interface IMenuControls
{
    [index: string]: number;
}

interface IMenuButtons
{
    name: string;
}

interface IMenuOptions
{
    enableHeader?: boolean;
    enableGlare?: boolean;
    enablePageCounter?: boolean;
    headerColor?: Color;
}

interface ICheetoUI
{
    title: string;
    subtitle: string;
    closable?: boolean;
    options?: IMenuOptions;

    menuHandler?: any;
    buttons?: IMenuButtons[];
}

interface IMenuStates
{
    btnIndex: number;
}

function PushText(textString: string, fontIndex: number, scale: number, color: (Color | number[]), position: Position): void
{
    SetTextFont(fontIndex)
    SetTextScale(0.0, scale)
    SetTextColour(color[0], color[1], color[2], color[3])
    SetTextEntry("STRING")
    AddTextComponentString(textString || '')
    DrawText(position.x, position.y) 
};

function PushSound(soundName: string): void
{
    const sound = CheetoUI.MenuSounds[soundName];
    if (!sound) return;
    PlaySoundFrontend(-1, sound[1], sound[0], sound[2]);
}

function GetPlayerKeyState(key: string): boolean
{
    return IsControlJustReleased(0, CheetoUI.MenuControls[key]);
}

let glareHandle: any;
let menuTick: any;
class CheetoUI
{
    public menu: ICheetoUI;
    private menuStates: IMenuStates;

    public static isMenuOpened: boolean = false;
    private isGlareLoaded: boolean = false;

    public static defaultStates: IMenuStates = {
        btnIndex: 0,
    }

    constructor(menuStruct: ICheetoUI)
    {
        this.menu = menuStruct;
        this.menuStates = CheetoUI.defaultStates;
        this.menu.buttons = [];
    }

    public static MenuConfig = {
        glareScaleformName: "MP_MENU_GLARE",
        enableSounds: false,

        globalFontIndex: 0,
        globalFontSize: 0.25,
        globalFontColor: {
            inactive: [245, 245, 245, 235],
            active: [10, 10, 10, 250]
        },

        structPosition: {
            x: 0.15,
            y: 0.135
        },

        globalWidth: 0.210,

        header: {
            height: 0.095,
            color: [38, 92, 180, 245],
            title: {
                fontIndex: 1,
                size: 0.70
            }
        },

        subtitle: {
            rect: {
                color: [26, 26, 26, 245],
                height: 0.025,
            }
        },

        button: {
            rect: {
                height: 0.0295,
                color: {
                    inactive: [26, 26, 26, 200],
                    active: [250, 250, 250, 245]
                }
            }
        }
    };

    public static MenuSounds: ISoundArray = {
        open: ["GTAO_FM_Events_Soundset", "OOB_Start", false],
    }

    public static MenuControls: IMenuControls = {
        navigateUp: 300,
        navigateDown: 299,
    }
    
    public static openMenu(title: string, subtitle: string, closable?: boolean, options?: IMenuOptions, menuHandler?: Callback): void
    {
        const GlobalConfig = this.MenuConfig;
        let instance: CheetoUI = new CheetoUI({ title, subtitle, closable, options, menuHandler });
        this.isMenuOpened = true;

        if (GlobalConfig.enableSounds) PushSound('open');
        menuTick = setTick(() => {
            if (!this.isMenuOpened) clearTick(menuTick);

            instance.drawMenu();
            instance.menu.menuHandler((btnsData?: IMenuButtons[]) => {
                if (btnsData) instance.refreshMenu(btnsData);
            })
        })
    }

    public static closeMenu(): void { this.isMenuOpened = false };

    private refreshMenu(btns: IMenuButtons[]): void
    {
        if (!btns || (btns.length < 1)) return;
        for (let i = 0; i < btns.length; i++)
        {
            if (!this.menu.buttons![i]) this.menu.buttons![i] = btns[i];
            this.drawButton({ name: this.menu.buttons![i].name }, i);
        }
    }

    private setMenuControlsHandler(): void
    {
        if (GetPlayerKeyState('navigateUp'))
        {

            if (this.menu.buttons![this.menuStates.btnIndex - 1]) this.menuStates.btnIndex--;
        }
        else if (GetPlayerKeyState('navigateDown'))
        {
            if (this.menu.buttons![this.menuStates.btnIndex + 1]) ++this.menuStates.btnIndex;
        }
    }

    private drawButton(btnData: IMenuButtons, btnIndex: number): void
    {
        const GlobalConfig = CheetoUI.MenuConfig;
        let btnColor: number[] = ((btnIndex === this.menuStates.btnIndex) ? GlobalConfig.button.rect.color.active : GlobalConfig.button.rect.color.inactive);
        let btnStructPosition: Position = {
            x: GlobalConfig.structPosition.x,
            y: (GlobalConfig.structPosition.y + 0.0895)
        }

        if (btnIndex > 0) btnStructPosition.y += ((btnStructPosition.y / 7.6) * btnIndex);
        DrawRect(btnStructPosition.x, btnStructPosition.y, GlobalConfig.globalWidth, GlobalConfig.button.rect.height, btnColor[0], btnColor[1], btnColor[2], btnColor[3]);
    }

    private drawMenu(): void
    {
        const HeaderEnabled: boolean = (this.menu.options?.enableHeader ?? true);
        if (HeaderEnabled) this.drawHeader();
        this.drawSubtitle();
        this.setMenuControlsHandler();
    }

    private drawSubtitle(): void
    {
        const GlobalConfig = CheetoUI.MenuConfig;
        const rectColor: number[] = GlobalConfig.subtitle.rect.color;
        const subtitleStructPosition: Position = {
            x: GlobalConfig.structPosition.x,
            y: (GlobalConfig.structPosition.y + 0.061)
        }
        
        DrawRect(subtitleStructPosition.x, subtitleStructPosition.y, GlobalConfig.globalWidth, GlobalConfig.subtitle.rect.height, rectColor[0], rectColor[1], rectColor[2], rectColor[3]);
        if (this.menu.subtitle.length > 0)
        {
            PushText(this.menu.subtitle.toUpperCase(), GlobalConfig.globalFontIndex, GlobalConfig.globalFontSize, GlobalConfig.globalFontColor.inactive, { 
                x: (subtitleStructPosition.x - 0.1),
                y: (subtitleStructPosition.y - 0.010)
            })
        }
    }

    private drawTitle(): void
    {
        PushText(this.menu.title, CheetoUI.MenuConfig.header.title.fontIndex, CheetoUI.MenuConfig.header.title.size, [255, 255, 255, 255], { 
            x: CheetoUI.MenuConfig.structPosition.x / 2.5,
            y: CheetoUI.MenuConfig.structPosition.y / (CheetoUI.MenuConfig.header.height * 12.05)
        })
    }

    private drawHeader(): void
    {
        const GlobalConfig = CheetoUI.MenuConfig;
        let headerColor = (this.menu.options?.headerColor ?? GlobalConfig.header.color);

        DrawRect(GlobalConfig.structPosition.x, GlobalConfig.structPosition.y, GlobalConfig.globalWidth, GlobalConfig.header.height, headerColor[0], headerColor[1], headerColor[2], headerColor[3]);
        if (this.menu.title.length > 0) this.drawTitle();

        if (this.menu.options?.enableGlare)
        {
            if (!this.isGlareLoaded)
            {
                glareHandle = RequestScaleformMovie(GlobalConfig.glareScaleformName);
                if (HasScaleformMovieLoaded(glareHandle)) this.isGlareLoaded = true;
            }
            else DrawScaleformMovie(glareHandle, (GlobalConfig.structPosition.x * 3.118), (GlobalConfig.structPosition.y * 4.182), (GlobalConfig.globalWidth * 4.5), (GlobalConfig.header.height * 11.15), 255, 255, 255, 255, 1);
        }
    }
}

// debug part
RegisterCommand('cheeto', () => {
    let valuetest: string = 'gryazne tantse';
    let btns: IMenuButtons[] = [
        {
            name: "testo cheeto",
        },
        {
            name: 'eta vzsio'
        },
        {
            name: 'jobani y urod'
        },
        {
            name: 'pidaras'
        }
    ]

    CheetoUI.openMenu('Cheeto Menu', 'Subtitle!', true, { enableGlare: false }, (cb: Callback) => {
        cb(btns);
    });
}, false)

RegisterCommand('close', () => {
    CheetoUI.closeMenu();
}, false)