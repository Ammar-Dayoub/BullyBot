import { Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";

// tslint:disable-next-line:class-name
export class purgeCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            args: [
                {
                    key: "target",
                    prompt: "Which messages should be deleted (self, channel)",
                    type: "string",
                    // Use oneOf instead of validate when it's available
                    validate: (argumentValue: string) => {
                        return (argumentValue === "channel" || argumentValue === "self");
                    },
                },
            ],
            description: "Deletes all messages",
            examples: ["!purge channel", "!purge self"],
            group: "admin",
            memberName: "purge",
            name: "purge",
            ownerOnly: true,
        });
    }

    public async run(recievedMessage: CommandMessage, args: { target: string }): Promise<Message | Message[]> {
        let lastMessageId: string;
        let hasMessages: boolean = true;
        switch (args.target) {
            case "channel":
                do {
                    await recievedMessage.channel.fetchMessages({ limit: 100 })
                        .then(async (messages) => {
                            if (messages.size < 100) { hasMessages = false; }
                            messages = messages.filter((m) => m.deletable);
                            for (const message of messages.values()) {
                                await message.delete();
                            }
                        })
                        .catch((error) => { console.log(error); });
                } while (hasMessages);
                break;
            case "self":
                do {
                    await recievedMessage.channel.fetchMessages({ before: lastMessageId, limit: 100 })
                        .then(async (messages) => {
                            if (messages.size < 100) { hasMessages = false; }
                            lastMessageId = messages.last().id;
                            messages = messages.filter((m) => m.deletable && m.author === this.client.user);
                            for (const message of messages.values()) {
                                await message.delete();
                            }
                        })
                        .catch((error) => { console.log(error); });
                } while (hasMessages);
                await recievedMessage.deletable && recievedMessage.delete();
                break;
            default:
                break;
        }
        return;
    }
}
