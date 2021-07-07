import type {
  AsyncEntry,
  AsyncProject,
  DesignModel,
  ProjectNote,
  RealtimeProject,
  RealtimeSession,
  TimedNote,
} from "./types";

type DefaultProps = {
  $format: "design-awareness";
  version: "1.0.0";
  meta?: object;
};

type DAEntityExportType =
  | (DefaultProps & { data: AsyncEntry; type: "AsyncEntry" })
  | (DefaultProps & { data: AsyncProject; type: "AsyncProject" })
  | (DefaultProps & { data: DesignModel; type: "DesignModel" })
  | (DefaultProps & { data: ProjectNote; type: "ProjectNote" })
  | (DefaultProps & { data: RealtimeProject; type: "RealtimeProject" })
  | (DefaultProps & { data: RealtimeSession; type: "RealtimeSession" })
  | (DefaultProps & { data: TimedNote; type: "TimedNote" });
