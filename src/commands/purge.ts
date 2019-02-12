import { Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";

// tslint:disable-next-line:class-name
export class purgeCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            args: [
                {
                    key: "target",
                    prompt: "Which messages should be deleted (self, channel, amount <number>)",
                    type: "string",
                    // Use oneOf instead of validate when it's available
                    validate: (argumentValue: string) => {
                        return (argumentValue === "channel" || argumentValue === "self" || argumentValue === "amount");
                    },
                },
                {
                    default: 0,
                    key: "amount",
                    max: 100,
                    min: 1,
                    prompt: "How many messages should be deleted",
                    type: "integer",
                },
            ],
            description: "Deletes messages",
            examples: ["!purge channel", "!purge self", "!purge amount <number>"],
            group: "admin",
            memberName: "purge",
            name: "purge",
            ownerOnly: true,
        });
    }

    public async run(recievedMessage: CommandMessage, args: { target: string, amount: number })
        : Promise<Message | Message[]> {
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
                // Delete command message
                await recievedMessage.deletable && recievedMessage.delete();
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
                break;
            case "amount":
                // Delete command message
                await recievedMessage.deletable && recievedMessage.delete();
                args.amount && await recievedMessage.channel.bulkDelete(args.amount)
                    .catch(console.log);
                break;
            default:
                break;
        }
        return;
    }
}
