type TwitterNotifications<E extends string = string> = Record<E, {
  "id": E;
  "timestampMs": `${number}`;
  "icon": {
    "id": `${string}_${string}`;
  };
  "message": {
    "text": string;
    "entities": [
      {
        "fromIndex": number;
        "toIndex": number;
        "ref": {
          "user": {
            "id": `${number}`;
          };
        };
      },
    ];
    "rtl": boolean;
  };
  "template": {
    "aggregateUserActionsV1": {
      "targetObjects": {
        "tweet": {
          "id": `${number}`;
        };
      }[];
      "fromUsers": {
        "user": {
          "id": `${number}`;
        };
      }[];
    };
  };
}>;
