import Discord from 'discord.js';
import { bot_secret_token } from './secrets';
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

        receivedMessage.channel.send("Message received: " + receivedMessage.content);
    });
})

client.login(bot_secret_token);