import { Client as WorkflowClient } from "@upstash/qstash";
import {
  QSTASH_URL,
  QSTASH_TOKEN,
} from "./env.js";

export const workflowClient = new WorkflowClient({
  url: QSTASH_URL,
  token: QSTASH_TOKEN
});