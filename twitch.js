const config = require("config");
const fetch = require("node-fetch");
let activeChannel = config.get("channel");
const dayjs = require("dayjs");
const client = require("tmi.js/lib/client");

let access_token = null;
let expires_at = null;
let stream_id = null;

const checkLogin = async () => {
  if (!access_token || expires_at.isBefore(dayjs())) {
    const params = new URLSearchParams();
    params.append("client_id", config.get("twitch.client_id"));
    params.append("client_secret", config.get("twitch.secret"));
    params.append("grant_type", "client_credentials");
    params.append("scope", "clips:edit");

    const loginResponse = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      body: params,
    });
    let loginData = await loginResponse.json();

    expires_at = dayjs().add(loginData.expires_in, "second");
    access_token = loginData.access_token;
  }
}

const twitch = {
  isLive: async () => {
    await checkLogin();

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

    if (stream) {
      stream_id = stream.id;
      return stream.is_live;
    }

    return false;
  },

  createClip: async () => {
    clipResponse = await fetch(
      "https://api.twitch.tv/helix/clips?broadcaster_id=" + config.get('twitch.broadcaster_id'),
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + config.get('bot.oauth_token').substring(6),
          "client-id": config.get("bot.client_id"),
        },
      }
    );
    let clipData = await clipResponse.json();

    return clipData.data && Array.isArray(clipData.data) ? clipData.data[0] : null;
  },
};

module.exports = twitch;
