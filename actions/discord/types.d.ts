type DiscordNotifications = {
  "id": `${number}`;
  "type": number;
  "content": string;
  "channel_id": `${number}`;
  "author": {
    "id": `${number}`;
    "username": string;
    "global_name": string;
    "avatar": string;
    "avatar_decoration_data": unknown;
    "discriminator": string;
    "public_flags": number;
    "clan": unknown;
  };
  "attachments": unknown[];
  "embeds": unknown[];
  "mentions": {
    "id": `${number}`;
    "username": string;
    "global_name": string;
    "avatar": string;
    "avatar_decoration_data": unknown;
    "discriminator": string;
    "public_flags": number;
    "clan": unknown;
  }[];
  "mention_roles": unknown[];
  "mention_everyone": boolean;
  "pinned": boolean;
  "tts": boolean;
  "timestamp": string;
  "edited_timestamp": unknown;
  "flags": number;
  "components": unknown[];
  "message_reference": {
    "type": number;
    "channel_id": `${number}`;
    "guild_id": `${number}`;
    "message_id": `${number}`;
  };
  "position": number;
}[];
