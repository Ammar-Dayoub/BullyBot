import { Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { delay } from "../utils";

const emojis: string[] = ["🇷", "🇪", "🇵", "🇴", "🇸", "🇹"];

// tslint:disable-next-line:class-name
export class repostCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            args: [
                {
                    default: "",
                    key: "messageId",
                    prompt: "Which message should be tagged",
                    type: "string",
                },
            ],
            description: "Tags messages as repost",
            examples: ["!repost", "!repost <messageId>"],
            group: "custom",
            memberName: "repost",
            name: "repost",
        });
    }

    public async run(recievedMessage: CommandMessage, args: { messageId: string }): Promise<Message | Message[]> {
        // !repost <id> >>> tag message with id = <id>
        if (args.messageId) {
            await recievedMessage.channel.fetchMessage(args.messageId)
                .then(async (message) => { await tagMessage(message); })
                .catch(() => {
                    recievedMessage.channel
                        .send("The message was not found. use a valid messageId for an existing message")
                        .then(async (sentMessage: Message) => {
                            // Delete the error message after 5 seconds
                            await delay(5000);
                            sentMessage.deletable && await sentMessage.delete();
                        })
                        .catch();
                });
            // !repost >>> tag message before command
        } else {
            recievedMessage.channel.fetchMessages({ before: recievedMessage.id, limit: 1 })
                .then(async (messages) =>
                    await tagMessage(messages.first()),
                );
        }
        return;
    }
}

async function tagMessage(message: Message): Promise<void> {
    for (const emoji of emojis) {
        await message.react(emoji);
    }
    return;
}
