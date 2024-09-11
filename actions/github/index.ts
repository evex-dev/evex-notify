import { Octokit } from "@github/octokit";
import { NotifyAction } from "../internal.ts";
import { sleep } from "../../utils/sleep.ts";
import { log } from "../../utils/logger.ts";
import { bgBlack, bold, gray, magenta, white } from "@ryu/enogu";

export class GithubNotifyAction extends NotifyAction {
  private octokit: Octokit;
  private lastNotificationDate: Date = new Date();

  constructor(
    githubToken: string,
  ) {
    super();

    this.octokit = new Octokit({
      auth: githubToken,
    });
  }

  public async polling(): Promise<void> {
    const noopNotifications = await this.octokit.rest.activity
      .listNotificationsForAuthenticatedUser({
        all: true,
      });

    if (noopNotifications.status !== 200) {
      log("error", "Failed to get github notifications");
      return Promise.reject();
    }

    this.lastNotificationDate = new Date(noopNotifications.data[0].updated_at);

    while (true) {
      const notifications = await this.octokit.rest.activity
        .listNotificationsForAuthenticatedUser({
          all: true,
        });

      for (const notification of notifications.data.reverse()) {
        const notificationDate = new Date(notification.updated_at);

        if (notificationDate > this.lastNotificationDate) {
          this.lastNotificationDate = notificationDate;
          log(
            bgBlack(white("  GitHub   ")),
            bold(magenta(`[${notification.subject.type}]`)),
            `${notification.repository.full_name}`,
            `${gray(notification.subject.title)}`,
          );
        }
      }

      sleep(15000);
    }
  }
}
