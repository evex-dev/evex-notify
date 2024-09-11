import { NotifyAction } from "../internal.ts";
import { sleep } from "../../utils/sleep.ts";
import { log } from "../../utils/logger.ts";
import { bgBlue, bold, gray, magenta, white } from "@ryu/enogu";
import { capitalize } from "../../utils/capitalize.ts";

export class TwitterNotifyAction extends NotifyAction {
  private getNotifications: () => Promise<TwitterNotifications>;
  private lastNotificationDate: Date = new Date();

  constructor(
    twitterBearerToken: string,
    twitterAuthToken: string,
  ) {
    super();

    this.getNotifications = async () => {
      let xCsrfTokenResponse: undefined | Response;

      try {
        xCsrfTokenResponse = await fetch(
          "https://twitter.com/i/release_notes",
          {
            headers: {
              "accept": "*/*",
              "authorization": "Bearer " + twitterBearerToken,
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.37 (KHTML, like Gecko) Chrome/89.0.142.86 Safari/537.36",
            },
          },
        );
      } catch {
        return {};
      }

      const xCsrfToken = xCsrfTokenResponse.headers.get("set-cookie")?.split(
        ", ",
      ).map((item) => item.split("; ")).flat().map((item) => {
        if (item.includes("ct0")) {
          return item.split("=")[1];
        } else {
          return null;
        }
      }).filter((item) => item !== null)[0];

      if (!xCsrfToken) {
        return {};
      }

      const response = await fetch(
        "https://x.com/i/api/2/notifications/all.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&include_ext_is_blue_verified=1&include_ext_verified_type=1&include_ext_profile_image_shape=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_ext_limited_action_results=true&include_quote_count=true&include_reply_count=1&tweet_mode=extended&include_ext_views=true&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&include_ext_sensitive_media_warning=true&include_ext_trusted_friends_metadata=true&send_error_codes=true&simple_quoted_tweet=true&count=20&requestContext=launch&ext=mediaStats%2ChighlightedLabel%2CvoiceInfo%2CbirdwatchPivot%2CsuperFollowMetadata%2CunmentionInfo%2CeditControl%2Carticle",
        {
          "headers": {
            "accept": "*/*",
            "accept-language":
              "ja-JP,ja;q=0.9,ar-SS;q=0.8,ar;q=0.7,en-US;q=0.6,en;q=0.5,ko-KR;q=0.4,ko;q=0.3",
            "authorization": "Bearer " + twitterBearerToken,
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
            "x-csrf-token": xCsrfToken,
            "x-twitter-active-user": "yes",
            "x-twitter-auth-type": "OAuth2Session",
            "x-twitter-client-language": "en",
            "x-twitter-polling": "true",
            "cookie": 'night_mode=1; g_state={"i_l":0}; auth_token=' +
              twitterAuthToken + "; ct0=" + xCsrfToken + "; lang=en",
            "Referer": "https://x.com/home",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
          "body": null,
          "method": "GET",
        },
      );

      if (response.ok) {
        return (await response.json()).globalObjects.notifications;
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
      Number(noopNotifications[Object.keys(noopNotifications)[0]].timestampMs),
    );

    while (true) {
      const notifications = await this.getNotifications();

      for (const key in notifications) {
        const notification = notifications[key];
        const notificationDate = new Date(Number(notification.timestampMs));

        if (notificationDate > this.lastNotificationDate) {
          this.lastNotificationDate = notificationDate;
          log(
            bgBlue(white("  Twitter  ")),
            bold(
              magenta(
                `[${
                  capitalize(notification.icon.id.split("_")[0]) || "Notify"
                }]`,
              ),
            ),
            `${
              notification.template.aggregateUserActionsV1.targetObjects[0]
                .tweet.id || "self"
            }`,
            `${gray(notification.message.text)}`,
          );
        }
      }

      sleep(30000 + (Math.random() * 60000));
    }
  }
}
