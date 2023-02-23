# leeaint-bot

Microsoft Bot Framework V4 Bot

## Prerequisites

- [Node.js](https://nodejs.org) version 16 or higher

    ```bash
    # determine node version
    node --version
    ```

## To try this

- Install the Bot Framework Emulator version 4.14.1 or greater from [here](https://github.com/Microsoft/BotFramework-Emulator/releases)
- Clone the repository

    ```bash
    git clone https://leeaint@dev.azure.com/leeaint/leeaint/_git/leeaint-be
    ```

- In a terminal, navigate to `leeaint-be`
    ```bash
    cd leeaint-be
    ```

- Install modules
    ```bash
    npm install
    ```

- Run the sample
    ```bash
    npm start
    ```
- Connect to the bot using Bot Framework Emulator
  1) Launch Bot Framework Emulator
  2) File -> Open Bot
  3) Enter a Bot URL of `http://localhost:3978/api/messages`
