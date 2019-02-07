import * as Discord from 'discord.js';
import * as Secrets from './secrets.json';
const client = new Discord.Client();

client.on('ready', () => {
    // List servers the bot is connected to
    console.log("Servers:");
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name);

        // List all channels
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
        });
    });

    client.on('message', (receivedMessage) => {
        // Prevent bot from responding to its own messages
        if (receivedMessage.author == client.user) {
            return;
        }

        // Process command message
        if (receivedMessage.content.startsWith("!")) {
            processCommand(receivedMessage);
            return;
        }

        // Normal bot functions
        receivedMessage.channel.send("Message received: " + receivedMessage.content);
    });
});

client.login(Secrets.bot_secret_token);

// Helper functions
function processCommand(receivedMessage: Discord.Message) {
    let fullCommand: string = receivedMessage.content.substr(1); // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
    let args = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand);
    console.log("Arguments: " + args); // There may not be any arguments

    if (primaryCommand == "purge") {
        purgeCommand(args, receivedMessage);
    } else {
        receivedMessage.channel.send("I don't understand the command.");
    }
}
function purgeCommand(args: string[], receivedMessage: Discord.Message) {
    if (args.length > 0) {
        switch (args[0]) {
            case "channel":
                if (receivedMessage.channel instanceof Discord.TextChannel) {
                    receivedMessage.channel.fetchMessages().then(
                        messages => messages.forEach(message => {
                            message.deletable && message.delete();
                        })
                    );
                } else {
                    receivedMessage.channel.send("This Channel is not a text channel");
                }
                break;
            case "self":
                if (receivedMessage.channel instanceof Discord.TextChannel) {
                    receivedMessage.channel.fetchMessages().then(
                        messages => messages.forEach(message => {
                            message.deletable && message.author == client.user && message.delete();
                        })
                    );
                } else {
                    receivedMessage.channel.send("This Channel is not a text channel");
                }
                break;
            default:
                receivedMessage.channel.send("I don't understand the command.");
                break;
        }
    } else {
        receivedMessage.channel.send("I don't understand the command.");
    }
}