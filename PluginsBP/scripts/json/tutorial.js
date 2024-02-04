import { world } from "@minecraft/server";


//First step, class
class Tutorial3 {
    //Write static function just here
    static PrintN(sender, text, n = 1) {
        for (let i = 0; i < n; i++) {
            sender.sendMessage(`Whisper to ${sender.name}: ${text}`);
        }
    }
}

//Let's test another class ?
class Tutorial2 {
    //Write static function just here
    static WorldPrintN(text, n = 1) {
        for (let i = 0; i < n; i++) {
            world.sendMessage(`World cast: ${text}`);
        }
    }
}

export let json = {
    commands: [
        {
            key: "printN",
            params: "<text: string> [n: number]",
            tip: "§4Please use '{prefix}{key} {params}' to use the command !",
            call: "Tutorial3.PrintN(sender, <text>, [n])"
        },
        {
            key: "worldPrintN",
            params: "<text: string> [n: number]",
            tip: "§4Please use '{prefix}{key} {params}' to use the command !",
            call: "Tutorial2.WorldPrintN(<text>, [n])"
        }
    ],
    registers: [
        Tutorial3,
        Tutorial2
    ]
}