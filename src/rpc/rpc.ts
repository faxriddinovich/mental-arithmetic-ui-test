import { HTTPClient } from "@theta-rpc/http-client";
export const rpc = new HTTPClient(process.env.REACT_APP_RPC_URL as string);
