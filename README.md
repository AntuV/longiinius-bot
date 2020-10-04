## Install
1. Clone repository

2. Install modules `npm i` or `yarn install`

3. Copy example config

    ```bash
    cp config/default.example.json5 config/default.json5
    ```
    
4. Setup bot

`oauth_token` you can get [here by login via bot](https://twitchapps.com/tmi/)

```
bot: {
    username: "your-bots-username-here",
    oauth_token: "oauthtokenhere"
},
channel: "your-channel-here"
```

5. Run bot `node bot.js`
