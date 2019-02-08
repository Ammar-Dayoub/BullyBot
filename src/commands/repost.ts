import { Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { delay } from "../utils";

const emojis: string[] = ["🇷", "🇪", "🇵", "🇴", "🇸", "🇹"];

// tslint:disable-next-line:class-name
export class repostCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            description: "Tags messages as repost",
            examples: ["!repost", "!repost <messageId>"],
            group: "admin",
            memberName: "repost",
            name: "repost",
        });
    }

    public async run(recievedMessage: CommandMessage, args: object | string | string[]): Promise<Message | Message[]> {
        // !repost <id> >>> tag message with id = <id>
        if (args) {
            recievedMessage.channel.fetchMessage(args.toString()).then((message) => {
                tagMessage(message);
            }).catch(() => {
                recievedMessage.channel.send("The message was not found. use a valid messageId for an existing message")
                    .then(async (sentMessage: Message) => {
                        // Delete the error message after 5 seconds
                        await delay(5000);
                        sentMessage.deletable && sentMessage.delete();
                    })
                    .catch();
            });
            // !repost >>> tag message before command
        } else {
            recievedMessage.channel.fetchMessages({ limit: 2 })
                .then((messages) => tagMessage(messages[0]))
                .catch();
        }
        // Delete the command message
        recievedMessage.delete();
        return;
    }
}

function tagMessage(message: Message): void {
    emojis.forEach((emoji) => {
        message.react(emoji);
    });
}
