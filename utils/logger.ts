import { blue, gray, red, yellow } from "@ryu/enogu";

export function log(
  // deno-lint-ignore ban-types
  type: "info" | "warn" | "error" | (string & {}),
  ...args: (string | number | undefined | null)[]
) {
  const outputStack: string[] = args.map((arg) => {
    if (typeof arg === "string") {
      return arg;
    } else if (typeof arg === "number") {
      return arg.toString();
    } else {
      return arg || "";
    }
  });

  const date = new Date();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");

  console.log(
    `${gray(`[${hour}:${minute}]`)} ${
      type === "info"
        ? blue("[INFO]")
        : type === "warn"
        ? yellow("[WARN]")
        : type === "error"
        ? red("[ERROR]")
        : `${type}`
    } ${outputStack.join(" ")}`,
  );
}
