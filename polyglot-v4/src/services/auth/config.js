import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: 'c3967625-0eeb-428a-be55-01c88f7f6d1f',
    authority: 'https://login.microsoftonline.com/205c471b-d21f-4505-afd6-751da3ed6138',
    redirectUri: "http://localhost:5173",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
      logLevel: LogLevel.Verbose
    }
  }
};

export const loginRequest = {
  scopes: ["User.Read"]
};
