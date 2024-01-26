import { Player, system, world } from "@minecraft/server";

class Account {
    static register(sender, password, confirm) {
        password = password.trim();
        confirm = confirm.trim();
        
        if(password != confirm) {
            sender.sendMessage("§4Please make sure you tip the correct password !");
            return;
        }
        
        sender.sendMessage("Registration Succesfull!");
    }
}

export let json = {
    commands: [
        {
            key: "register",
            params: "<password: string> <confirm: string>",
            tip: "Please type '{prefix}{key} {params}' to use correctly the commands",
            call: "Account.register(sender, <password>, <confirm>)"
        }
    ],
    registers: [
        Account
    ]
};

