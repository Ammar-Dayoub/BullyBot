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
                        recievedMessage.channel.fetchMessages().then(
                            (messages) => messages.forEach((message) => {
                                message.deletable && message.delete();
                            }),
                        );
                        break;
                    case "self":
                        recievedMessage.channel.fetchMessages().then(
                            (messages) => messages.forEach((message) => {
                                message.deletable && message.author === this.client.user && message.delete();
                            }),
                        );
                        break;
                    default:
                        recievedMessage.channel.send("I don't understand the command.");
                        break;
                }
            } else {
                recievedMessage.channel.send("I don't understand the command.");
            }
        } else {
            recievedMessage.reply("This Channel is not a text channel.");
        }
        return;
    }
}
