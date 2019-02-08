import { Message, TextChannel } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";

// tslint:disable-next-line:class-name
export class purgeCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            description: "Deletes all messages",
            examples: ["!purge channel", "!purge self"],
            group: "admin",
            memberName: "purge",
            name: "purge",
        });
    }

    public async run(recievedMessage: CommandMessage, args: object | string | string[]): Promise<Message | Message[]> {
        if (recievedMessage.channel instanceof TextChannel) {
            if (args) {
                switch (args) {
                    case "channel":
                        recievedMessage.channel.fetchMessages()
                            .then(async (messages) => {
                                for (const message of messages.values()) {
                                    message.deletable && await message.delete();
                                }
                            });
                        break;
                    case "self":
                        recievedMessage.channel.fetchMessages()
                            .then(async (messages) => {
                                for (const message of messages.values()) {
                                    message.deletable && message.author === this.client.user && await message.delete();
                                }
                            });
                        break;
                    default:
                        await recievedMessage.channel.send("I don't understand the command.");
                        break;
                }
            } else {
                await recievedMessage.channel.send("I don't understand the command.");
            }
        } else {
            await recievedMessage.reply("This Channel is not a text channel.");
        }
        return;
    }
}
