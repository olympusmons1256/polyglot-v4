// src/services/api/googleWorkspaceApi.js
import { google } from "googleapis";

export const getGoogleWorkspaceClient = (accessToken) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.workspace({ version: 'v1', auth });
};
