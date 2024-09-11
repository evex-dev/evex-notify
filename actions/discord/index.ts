import { NotifyAction } from "../internal.ts";
import { sleep } from "../../utils/sleep.ts";
import { log } from "../../utils/logger.ts";
import { bold, gray, magenta, white, bgRgb24 } from "@ryu/enogu";

export class DiscordNotifyAction extends NotifyAction {
  private getNotifications: () => Promise<DiscordNotifications>;
  private lastNotificationDate: Date = new Date();

  constructor(
    discordToken: string,
  ) {
    super();

    this.getNotifications = async () => {
      const response = await fetch(
        "https://discord.com/api/v9/users/@me/mentions?limit=25&roles=true&everyone=false",
        {
          "headers": {
            "accept": "*/*",
            "accept-language":
              "ja-JP,ja;q=0.9,ar-SS;q=0.8,ar;q=0.7,en-US;q=0.6,en;q=0.5,ko-KR;q=0.4,ko;q=0.3",
            "authorization": discordToken,
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-ch-ua":
              '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-debug-options": "bugReporterEnabled",
            "x-discord-locale": "en-US",
            "x-discord-timezone": "Asia/Tokyo",
            "x-super-properties":
              "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImphIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyOC4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTI4LjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjMyNjAzOCwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0=",
          },
          "referrer": "https://discord.com/channels/@me",
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": null,
          "method": "GET",
          "mode": "cors",
          "credentials": "include",
        },
      );

      if (response.ok) {
        return (await response.json());
      } else {
        return {};
      }
    };
  }

  public async polling(): Promise<void> {
    const noopNotifications = await this.getNotifications();

    if (!noopNotifications) {
      log("error", "Failed to get twitter notifications");
      return Promise.reject();
    }

    this.lastNotificationDate = new Date(
      noopNotifications[0].timestamp,
    );

    while (true) {
      const notifications = await this.getNotifications();

      for (const key in notifications) {
        const notification = notifications[key];
        const notificationDate = new Date(
          notification.timestamp,
        );

        if (notificationDate > this.lastNotificationDate) {
          this.lastNotificationDate = notificationDate;
          const cleanedContent = notification.content.replace(/<@[0-9]+?>\S?/g, "");

          log(
            bgRgb24(white("  Discord  "), 0x7289da),
            bold(
              magenta(
                `[Mention]`,
              ),
            ),
            `${
              notification.message_reference
                ? `$${notification.message_reference.guild_id}`
                : `#${notification.channel_id}`
            }`,
            `${gray(cleanedContent.slice(0, 20) + (cleanedContent.length > 20 ? "..." : ""))}`,
          );
        }
      }

      sleep(10000 + (Math.random() * 30000));
    }
  }
}
