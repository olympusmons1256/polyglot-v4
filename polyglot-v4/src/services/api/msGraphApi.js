// src/services/api/msGraphApi.js
import { Client } from "@microsoft/microsoft-graph-client";

export const getMsGraphClient = (accessToken) => {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });
};
