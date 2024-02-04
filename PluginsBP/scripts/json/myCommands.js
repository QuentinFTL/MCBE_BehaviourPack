import { Player, system, world } from "@minecraft/server";

class Help {
    static showPage(sender, page = 0) {
        world.sendMessage("<" + sender.name + "> ->> Help page: " + page);
    }
    static get(sender, key, player = "") {
        let prefix = "Your "+ key +" ";
        if(player == "") {
            player = sender.name;
        }
        else
        {
            prefix = player+"'s "+key+" ";
        }

        let _player = world.getAllPlayers().find(p => {
            if (p.name == player) {

                return p;
            }
        });
        if (_player != null) {
            sender.sendMessage(prefix+"is: " + _player[key]);
        }

    }

    static getId(sender, _target = "") {
        let target = _target;

        let player;

        if (target != "") {
            player = world.getAllPlayers().find(p => {
                if (p.name == target) {
                    return p;
                }
            });
            if (player != null) {
                sender.sendMessage(player.name + "'ID is: " + player.id);
            }
            else
            {
                sender.sendMessage("§4"+target + "'ID not foundable, the player may be disconnected");
            }
        }
        else {
            target = sender.name;
            player = world.getAllPlayers().find(p => {
                if (p.name == target) {

                    return p;
                }
            });
            if (player != null) {
                sender.sendMessage("Your ID is: " + sender.id);
            }

        }

    }

    static clear() {
        for (let i = 0; i < 256; i++) {
            world.sendMessage("");
            
        }
    }
}

export let json = {
    commands: [
        {
            key: "help",
            params: "[page: number]",
            tip: "Please type '{prefix}help {params}' to use correctly the commands",
            call: "Help.showPage(sender, [page])"
        },
        {
            key: "getId",
            params: "[player: string]",
            tip: "Please type '{prefix}getId {params}' to use correctly the commands",
            call: "Help.getId(sender, [player])"
        },
        {
            key: "get",
            params: "<key: string> [player: string]",
            tip: "Please type '{prefix}get {params}' to use correctly the commands",
            call: "Help.get(sender, <key>, [player])"
        },
        {
            key: "clear",
            params: "",
            tip: "Please type '{prefix}get {params}' to use correctly the commands",
            call: "Help.clear()"
        }
    ],
    registers: [
        Help
    ]
};