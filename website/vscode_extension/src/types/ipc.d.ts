export interface IPCMessage {
  type: "AIOS_EXECUTE_TASK" | "AIOS_GET_STATE" | "AIOS_STREAM_OUTPUT";
  payload: any;
}

export interface TaskPayload {
  command: string;
  context: string;
}
