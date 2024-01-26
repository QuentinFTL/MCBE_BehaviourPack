import { Player, system, world } from "@minecraft/server";

let json;

export class CommandManager {
    static Init() {
        if (system.commandMgr == null) {
            world.sendMessage("Creating manager...");
            system.commandMgr = new CommandManager("!");
            world.sendMessage("Manager created!");

        }
        else {
            world.sendMessage("Getting existing manager");

        }

        return system.commandMgr;
    }
    constructor(prefix, ) {
        if (system.commands == null)
            system.commands = {};

        this.prefix = prefix;
        this.commands = {};

        this.addFile(json);
    }

    addFile(json) {
        for (let i = 0; i < json.commands.length; i++) {
            const command = json.commands[i];
            this.commands[command.key] = command;
        }

        if (json.registers != null) {
            for (let i = 0; i < json.registers.length; i++) {
                const register = json.registers[i];
                system.commands[register.name] = register;
            }
        }
    }
    showClasses(sender) {
        for (let index = 0; index < Object.keys(system.commands).length; index++) {
            const key = Object.keys(system.commands)[index];
            const command = system.commands[key];
            //console.error("commands:", key);
            sender.sendMessage(`class '${key}'`);
        }
    }

    showCommands(sender, command_ = "") {
        if (sender == null) {
            sender = world;
        }

        if (command_ == "") {
            for (let index = 0; index < Object.keys(this.commands).length; index++) {
                const key = Object.keys(this.commands)[index];
                const command = this.commands[key];
                //console.error("commands:", key);
                this.showCommands(sender, key);
            }
        }
        else {
            if (this.commands[command_] == null) {
                this.showCommands(sender);
            }
            else {
                const key = command_;
                const command = this.commands[key];
                sender.sendMessage(`Command '${this.prefix}${key} ${command.params}'`);
            }
        }


    }

    getArgument(message, between = null) {
        let value = {
            argument: "",
            len: 0
        }
        let inString = -1;
        let prevChar = null;
        let argument = "";
        if (between == "'" || between == '"') {
            value.len++;
            for (let i = 0; i < message.length; i++) {
                const _char = message[i];

                if (_char == between) {
                    if (prevChar == "\\" && inString != -1) {
                        argument += _char;
                    }
                    else {
                        inString++;
                    }
                }
                else {
                    if (inString != -1) {
                        argument += _char;
                    }
                }



                value.len++;
                if (inString == 1) {
                    value.argument = argument;
                    return value;
                }

                prevChar = _char;
            }
        }
        else {
            for (let i = 0; i < message.length; i++) {
                const _char = message[i];

                if (_char == " ") {
                    inString++;
                }
                else {
                    argument += _char
                }

                if (i == message.length - 1) {
                    inString++;
                }


                value.len++;
                if (inString >= 0) {
                    value.argument = argument;
                    return value;
                }

                prevChar = _char;
            }
        }

        throw new Error("Argument incomplete, you maybe forget to close your command with: " + between);
    }

    parseMessage(message) {
        let value = {
            args: [],
            command: "",
            prefix: ""
        };
        //<prefix><command> [arg0] [arg1]...
        let prefix = "";
        let command = "";

        prefix = message.substring(0, this.prefix.length);

        //<command> [arg0] [arg1]...
        message = message.slice(this.prefix.length, message.length).trim();
        command = message.split(' ')[0];

        //[arg0] [arg1]...
        message = message.slice(command.length, message.length).trim();
        //translate strings....
        while (message.length > 0) {
            let arg = "";

            //if(message.startsWith('"') || message.startsWith("'")) 
            {
                switch (message.slice(0, 1)) {
                    case "'":
                        arg = this.getArgument(message, "'");
                        break;

                    case '"':
                        arg = this.getArgument(message, '"');
                        break;

                    default:
                        arg = this.getArgument(message);
                        break;
                }
                value.args.push(arg.argument);
                message = message.slice(arg.len, message.length).trim();

            }
        }

        value.command = command;
        value.prefix = prefix;

        return value;
    }

    parseParam(message, _in, _out) {
        let value = {
            name: "",
            type: "string",
            need: (_in == "<" ? true : false),
            len: 0
        }
        let inParam = -1;
        let checkType = false;
        let prevChar = null;
        let argument = "";
        if (_in == "<" || _in == '[') {
            value.len++;
            for (let i = 0; i < message.length; i++) {
                const _char = message[i];

                if (_char == " ") {
                    value.len++;
                    continue;
                }

                if (_char == _in || _char == _out) {
                    inParam++;
                }
                else if (_char == ":") {
                    checkType = true;
                    value.type = "";
                }
                else {
                    if (inParam != -1 && !checkType) {
                        value.name += _char;
                    }
                    else if (inParam != -1 && checkType) {
                        value.type += _char;
                    }
                }



                value.len++;
                if (inParam == 1) {
                    return value;
                }

                prevChar = _char;
            }
        }

        throw new Error("Syntax incorrect");
    }
    concatParams(params) {
        let str = "";

        for (let i = 0; i < Object.keys(params).length; i++) {
            const key = Object.keys(params)[i];
            const param = params[key];

            str += "{" + this.paramToString(param, false) + "} ";
        }
        return str.trim();
    }

    parseTip(command, params) {
        let tip = command.tip.toString();

        tip = tip.replace("{params}", this.concatParams(params));
        tip = tip.replace("{prefix}", this.prefix)
        tip = tip.replace("{key}", command.key);
        for (let i = 0; i < Object.keys(params).length; i++) {
            const key = Object.keys(params)[i];
            const param = params[key];

            tip = tip.replace("{" + this.paramToString(param, false) + "}", this.paramToString(param))
        }

        return tip;
    }

    parseParams(sender, command, args) {
        let params = command.params;
        let _params = {};
        params = params.trim();
        let index = 0;
        while (params.length > 0) {
            let _in = params.slice(0, 1);
            let _out = (_in == "<" ? ">" : "]");
            let arg = this.parseParam(params, _in, _out);
            _params[arg.name] = {
                param: arg,
                callParam: args[index],
                index: index
            };
            if (_params[arg.name].param.type == "number" ||
                _params[arg.name].param.type == "float" ||
                _params[arg.name].param.type == "double" ||
                _params[arg.name].param.type == "int") {
                try {
                    let test = parseInt(_params[arg.name].callParam);
                    if (test.toString() == "NaN") {
                        sender.sendMessage("§4'§1" + arg.name + "§4' hasn't a correct type ! Please use the '§1" + _params[arg.name].param.type + "§4' type !");
                        throw new Error(arg.name + " hasn't a correct type ! Please use the '" + _params[arg.name].param.type + "' type !");
                    }

                }
                catch (e) {
                    if (e.name == "Exception") {

                        sender.sendMessage("§4" + arg.name + " hasn't a correct type ! Please use the " + _params[arg.name].param.type + " type !");
                        throw new Error(arg.name + " hasn't a correct type ! Please use the " + _params[arg.name].param.type + " type !");
                    }
                }
            }
            params = params.slice(arg.len, params.length).trim();
            index++;
        }
        if (args.length > Object.keys(_params).length) {
            sender.sendMessage(this.parseTip(command, _params));
            throw new Error("too much arguments !");
        }

        return _params;
    }

    paramToString(param, isntTip = true) {
        let isNeeded = param.param.need;

        if (!isntTip) {
            return param.param.name;

        }

        if (isNeeded) {
            return "<" + param.param.name + ">";
        }
        else {
            return "[" + param.param.name + "]";
        }
    }

    paramToValue(param, isUndefined = false) {
        if (param.param.type == "string") {
            return "`" + (isUndefined ? "" : param.callParam) + "`";
        }
        return param.callParam;
    }

    parseCall(sender, command, params) {
        let call = command.call;
        for (let i = 0; i < Object.keys(params).length; i++) {
            const key = Object.keys(params)[i];
            const param = params[key];
            let isNeeded = param.param.need;
            if (param.callParam == null) {
                if (param.param.need) {
                    sender.sendMessage(this.parseTip(command, params));

                    throw new Error(`${param.param.name} is needed to call this method !`);
                }
                let ts = this.paramToString(param);
                if (call.includes(ts + ",")) {
                    call = call.replace(ts + ",", "");
                }
                else {
                    call = call.replace(this.paramToString(param), this.paramToValue(param, true));
                }
            }
            else {
                call = call.replace(this.paramToString(param), this.paramToValue(param));
            }

        }

        return "system.commands." + call;
    }

    execute(sender, cmd) {
        /*let cmd = {
            args: [],
            command: "",
            prefix: ""
        };*/
        let commandManager = this;
        let params = this.parseParams(sender, this.commands[cmd.command], cmd.args);
        let evalCode = this.parseCall(sender, this.commands[cmd.command], params);
        eval(evalCode);
        try {
        }
        catch {
            throw new Error(`"${cmd.command}" isn't registered !`);
        }
    }

    rewriteEngineFunction(sender) {
        if (sender._sendMessage == null) {
            sender._sendMessage = sender.sendMessage;

            sender.sendMessage = function (msg) {
                system.run(() => sender._sendMessage(msg));
            };
        }

        if (world._sendMessage == null) {
            world._sendMessage = world.sendMessage;

            world.sendMessage = function (msg) {
                system.run(() => world._sendMessage(msg));
            };
        }

        if (sender._runCommand == null) {
            sender._runCommand = sender._runCommand;

            sender.runCommand = function (msg) {
                system.run(() => sender._runCommand(msg));
            };
        }

        return sender;
    }

    exists(cmd) {
        return this.commands[cmd.command] != null;
    }

    end() {
        world.beforeEvents.chatSend.subscribe((arg) => {
            if (arg.message.startsWith(this.prefix)) arg.cancel = true;

            arg.sender = this.rewriteEngineFunction(arg.sender);

            let cmd = this.parseMessage(arg.message);

            if (arg.message.startsWith(this.prefix) && this.exists(cmd)) {


                this.execute(arg.sender, cmd);
            }

        });
    }
}

class BaseCommand {
    static Command(sender, commandManager, command = "") {
        sender.sendMessage("======== Commands ========");
        commandManager.showCommands(sender, command);
        sender.sendMessage("==========================");
    }

    static Classes(sender, commandManager) {
        sender.sendMessage("======== Classes ========");
        commandManager.showClasses(sender);
        sender.sendMessage("=========================");
    }
}

json = {
    commands: [
        {
            key: "commands",
            params: "[command: string]",
            tip: "§4Please use '{prefix}{key} {params}' to use the command !",
            call: "BaseCommand.Command(sender, commandManager, [command])"
        },
        {
            key: "classes",
            params: "",
            tip: "§4Please use '{prefix}{key}' to use the command !",
            call: "BaseCommand.Classes(sender, commandManager)"
            
        }
    ],
    registers: [
        BaseCommand
    ]
}