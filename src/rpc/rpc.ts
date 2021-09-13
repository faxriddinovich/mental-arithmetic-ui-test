import axios from "axios";
import { HTTPClient } from "@theta-rpc/http-client";
import { Database } from "@/services/indexeddb/database";

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_RPC_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await Database.getCurrentSession();
  if (session) config.headers["session"] = session.session;

  return config;
});

export const rpc = HTTPClient.attach(axiosInstance);
