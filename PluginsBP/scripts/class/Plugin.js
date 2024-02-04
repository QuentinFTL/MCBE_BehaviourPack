import { Player, system, world } from "@minecraft/server"; 

export class Plugin {
    constructor() {

    }

    start(pluginPrefix = "") {
        if(pluginPrefix != "") {
            world.sendMessage(pluginPrefix + ": Plugin Started !");
        }
        else
        {
            world.sendMessage("Plugin Started !");
        }
    }

    stop() {

    }

    reload() {

    }

    pause() {

    }

    commands(json_) {

        system.pluginMgr.commandManager.addJson(json_);
    }
}