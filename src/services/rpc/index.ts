import axios from "axios";
import { HTTPClient } from "@theta-rpc/http-client";
import {
  RPC_MALFORMED_ACCESS_TOKEN_ERR_CODE,
  RPC_ACCOUNT_IS_BLOCKED_ERR_CODE,
} from "@/services/rpc/error-codes";
import Router from "@/router/index";
import Store from "@/store";
import { Session } from '@/store/modules/account.module';
import { showToastMessage, ToastType } from "@/services/toast";

import { acquireAccount } from '@/store/account';

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_RPC_URL,
});

let deletedId: number | null = null;
axiosInstance.interceptors.response.use(async (response) => {
  if (response.status === 200) {
    if (response.data.error) {
      const account = acquireAccount();
      const jsonrpcError = response.data.error;
      const activeSession = account.activeSession;

      if (activeSession) {
        if (jsonrpcError.code === RPC_MALFORMED_ACCESS_TOKEN_ERR_CODE) {
          if(deletedId != null || deletedId === activeSession.id) {
            deletedId = null;
            return response;
          }
          showToastMessage("Invalid session", ToastType.Danger);
          deletedId = activeSession.id;
          await account.deleteSession(activeSession.id);
          Router.push({ name: "Authentication" });
          return response;
        } else if (
          jsonrpcError.code === RPC_ACCOUNT_IS_BLOCKED_ERR_CODE &&
          Router.history.current.name !== "AccountBlocked"
        ) {
          Router.push({ name: "AccountBlocked" });
          return response;
        }
      }
    }
  }

  return response;
});

const excludedRoutes = ["Authenticate", "CreateAccount"];

axiosInstance.interceptors.request.use(async (config) => {
  const activeSession = acquireAccount().activeSession;
  const notExcluded = !excludedRoutes.includes(Router.history.current.name);

  if (notExcluded && activeSession) {
    config.headers["session"] = activeSession.session;
  }

  return config;
});

export const rpc = HTTPClient.attach(axiosInstance);
