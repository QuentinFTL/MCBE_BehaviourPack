import { Color } from "../../class/MinecraftConst";
import { Plugin } from "../../class/Plugin";
import { Player, system, world } from "@minecraft/server";

class HCorePlugin {
    static pl(sender) {
        system.pluginMgr.showPlugins(sender);       
    }
}


export default class CorePlugin extends Plugin {
    constructor() {
        super();

    }

    start() {
        super.start(`${Color.WHITE}[${Color.MINECOIN_GOLD}CorePlugin${Color.WHITE}]`);
    }

    commands() {

        super.commands({
            commands: [
                {
                    key: "plugin",
                    params: "",
                    tip: "Please type '{prefix}{key} {params}' to use correctly the commands",
                    call: "HCorePlugin.pl(sender)"
                }
            ],
            registers: [
                HCorePlugin
            ]
        })
    }
}

