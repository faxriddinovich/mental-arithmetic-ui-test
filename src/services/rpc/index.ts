import axios from "axios";
import { HTTPClient } from "@theta-rpc/http-client";
import Router from "@/router/index";
import Store from "@/store";

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_RPC_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const activeSession = await Store.dispatch("getActiveSession");
  // Hard code. Can we fix this ?
  if (
    !["Authenticate", "CreateAccount"].includes(Router.history.current.name) &&
    activeSession
  ) {
    config.headers["session"] = activeSession.session;
  }

  return config;
});

export const rpc = HTTPClient.attach(axiosInstance);
