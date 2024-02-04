import { Color } from "../../class/MinecraftConst";
import { Plugin } from "../../class/Plugin";
import { Player, system, world } from "@minecraft/server";

class HWorldEdit {
    static test(sender) {
        sender.sendMessage("Testing WE");  
    }
}


export default class CorePlugin extends Plugin {
    constructor() {
        super();

    }

    start() {
        super.start(`${Color.WHITE}[${Color.MINECOIN_GOLD}WorldEdit${Color.WHITE}]`);
    }

    commands() {

        super.commands({
            commands: [
                {
                    key: "we",
                    params: "[test: string]",
                    tip: "Please type '{prefix}{key} {params}' to use correctly the commands",
                    call: "HWorldEdit.test(sender)"
                }
            ],
            registers: [
                HWorldEdit
            ]
        })
    }
}

