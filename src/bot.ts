import { CommandoClient } from "discord.js-commando";
import { join } from "path";
import * as Addons from "./Addons";
import Secrets from "./secrets.json";

const client = new CommandoClient({
    commandPrefix: Secrets.command_prefix,
    owner: Secrets.owner_id,
});

//  Register commands
client.registry
    // Registers custom groups
    .registerGroup("admin", "Admin")
    // Registers all built-in groups, commands, and argument types
    .registerDefaults()
    // Registers all of your commands in the ./commands/ directory
    .registerCommandsIn(join(__dirname, "commands"));

client.on("ready", () => {
    // List servers the bot is connected to
    console.log("Servers:");
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name);

        // List all channels
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
        });
        console.log();
    });

    client.on("message", (receivedMessage) => {
        // Prevent bot from responding to its own messages
        if (receivedMessage.author === client.user) {
            return;
        }
    });
});

// Custom method calls go here
// Addons.typingStart(client);

client.login(Secrets.bot_secret_token);
