import "@std/dotenv/load";
import { log } from "./utils/logger.ts";
import { GithubNotifyAction } from "./actions/github/index.ts";
import { TwitterNotifyAction } from "./actions/twitter/index.ts";
import { DiscordNotifyAction } from "./actions/discord/index.ts";

const {
  GITHUB_TOKEN,
  TWITTER_BEARER_TOKEN,
  TWITTER_AUTH_TOKEN,
  DISCORD_TOKEN,
} = Deno.env.toObject();

log("info", "Setup All Done");

console.log("\x1b[2J");

(new GithubNotifyAction(GITHUB_TOKEN)).polling();
(new TwitterNotifyAction(TWITTER_BEARER_TOKEN, TWITTER_AUTH_TOKEN)).polling();
(new DiscordNotifyAction(DISCORD_TOKEN)).polling();