# BullyBot
A bot to bully peasants in Discord

Requirements
Node.js needs to be installed

https://nodejs.org/en/download/

A Package restore is required after cloning the bot (in the project directory, as an admin)

npm install

Conecting to Discord
Authorisation of the app is required by visiting

https://discordapp.com/oauth2/authorize?client_id=XXX&scope=bot

Where XXX is the app ClientID

A file containing the bot token is required

The file name should be secrets.json

The file should exist in the 'src' directory

The contents of the file have the format

  {
      "command_prefix": "!",
      "bot_secret_token": "XXX",
      "owners": [
          "YYY"
      ]
  }
Where XXX is the bot token acquired from

https://discordapp.com/developers/applications > AppName > Bot > Click to reveal token

YYY is the owner's Discord Id

Running the bot:
Compile and start the bot with

npm start

Discord Client object documentation
https://discord.js.org/#/docs/main/stable/class/Client

Unicode emojis
https://unicode.org/emoji/charts/full-emoji-list.html
