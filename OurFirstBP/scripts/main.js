import * as myCommands from "./json/myCommands";
import * as account from "./json/account";
import * as tutorial from "./json/tutorial";
import { CommandManager } from "./class/CommandManager";
import { world } from "@minecraft/server";

//Creation of the Manager
let c_mgr = CommandManager.Init();

c_mgr.addFile(myCommands.json);
c_mgr.addFile(account.json);
c_mgr.addFile(tutorial.json);

//Important: start the world.beforeChat Event !
c_mgr.end();


for (let index = 0; index < Object.keys(world).length; index++) {
    const key = Object.keys(world)[index];
    //const command = world[key];
    //console.error("commands:", key);
    world.sendMessage(`world '${key}'`);
}