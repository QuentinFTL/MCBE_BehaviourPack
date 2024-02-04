import { system } from "@minecraft/server";
import { CommandManager } from "./CommandManager.js";
import { Color } from "./MinecraftConst.js";


export class PluginManager {

    static Init() {
        if(system.pluginMgr == null) {
            system.pluginMgr = new PluginManager();
        }

        system.pluginMgr.__init()

        return system.pluginMgr;
    }

    constructor() {
        this.plugins = [];
        this.plugins_num = -1;
        this.commandManager = CommandManager.Init();
    }

    __init() {
        import("../plugins.js").then(t => {
            if(this.plugins_num == -1) {
                this.plugins_num = Object.keys(t.default).length;
            }

            for (let i = 0; i < Object.keys(t.default).length; i++) {
                const key = Object.keys(t.default)[i];
                const element = t.default[key];

                if(element.enabled != false) {
                    this.loadPlugin(element);
                }
                else {
                    this.plugins_num--;
                    if(this.plugins_num == 0) {
                        this.runPlugins();
                    }
                }
            }
        });
    }

    runPlugins() {
        this.registerCommands();
        this.startPlugins();


        this.commandManager.end();
    }

    registerCommands() {
        for (let i = 0; i < this.plugins.length; i++) {
            const plugin = this.plugins[i];
            plugin.obj.commands();
        }
    }

    startPlugins() {
        for (let i = 0; i < this.plugins.length; i++) {
            const plugin = this.plugins[i];
            plugin.obj.start();
        }
    }

    loadPlugin(plugin) {
        let mgr = this;

        import(`../${plugin.path}`).then( t => {
            let v = new t.default();
            mgr.plugins.push({name: plugin.name, path: plugin.path, obj: v});

            this.plugins_num--;
            if(this.plugins_num == 0) {
                this.runPlugins();
            }
        });
    }

    showPlugins(sender) {
        let msg = `${Color.WHITE}[${Color.GREEN}Plugins${Color.WHITE}] (${Color.YELLOW}${this.plugins.length}${Color.WHITE}): `;
        
         for (let i = 0; i < this.plugins.length; i++) {
            const plugin = this.plugins[i];
            if(i == this.plugins.length -1) {
                msg += `${plugin.name}`;

            }
            else
            {
                msg += `${plugin.name}, `;
            }

            
         }
        
        sender.sendMessage(msg);
    }
}