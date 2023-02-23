/* eslint-disable @typescript-eslint/no-namespace */
import { NODE_ENV } from "./enums/nodeEnv";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BLOB_CONNECTION_STRING: string;
      BOT_STATE_BLOB_CONTAINER_NAME: string;
      BOT_TRANSCRIPT_BLOB_CONTAINER_NAME: string;
      LOG_LEVEL: string;
      LANGUAGE_ENDPOINT_HOST_NAME: string;
      LANGUAGE_ENDPOINT_KEY: string;
      MICROSOFT_APP_ID: string;
      MICROSOFT_APP_PASSWORD: string;
      MICROSOFT_APP_TENANT_ID: string;
      MICROSOFT_APP_TYPE: string;
      NODE_ENV: NODE_ENV;
      ENGLISH_PROJECT_NAME: string;
      ARABIC_PROJECT_NAME: string;
      CHINESE_PROJECT_NAME: string;
      PORTUGUESE_PROJECT_NAME: string;
      BAHASA_PROJECT_NAME: string;
      TECHNICAL_QUESTION_SOURCE_NAME: string;
      PORT: string;
      SENDGRID_API_KEY: string;
      SENDFRID_SENDER_EMAIL: string;
      SENDGRID_ADMIN_EMAIL: string;
      SENDGRID_TECHNICAL_EMAIL: string;
      SENDGRID_TEMPLATE_ID: string;
      LEEAINT_USER_EXISTS_URL: string;
      LEEAINT_API_TOKEN: string;
      LEEAINT_LOGO_BASE_URL: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { };
