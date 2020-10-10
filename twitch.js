const config = require("config");
const fetch = require("node-fetch");
let activeChannel = config.get("channel");
const dayjs = require("dayjs");

let access_token = null;
let expires_at = null;

const twitch = {
  isLive: async () => {
    if (!access_token || expires_at.isBefore(dayjs())) {
      const params = new URLSearchParams();
      params.append("client_id", config.get("twitch.client_id"));
      params.append("client_secret", config.get("twitch.secret"));
      params.append("grant_type", "client_credentials");
      params.append("scope", "");

      const loginResponse = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        body: params,
      });
      let loginData = await loginResponse.json();

      expires_at = dayjs().add(loginData.expires_in, "second");
      access_token = loginData.access_token;
    }

    streamResponse = await fetch(
      "https://api.twitch.tv/helix/search/channels?query=" + activeChannel,
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "client-id": config.get("twitch.client_id"),
        },
      }
    );
    let streamData = await streamResponse.json();

    if (streamData && streamData.error) {
      return false;
    }

    const stream = streamData.data.find(c => c.display_name === activeChannel.toLowerCase());

    return stream ? stream.is_live : false;
  },
};

module.exports = twitch;
