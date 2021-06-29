// Copyright (c) 2021, Design Awareness Contributors.
// SPDX-License-Identifier: BSD-3-Clause

/**
 * A basic database entity. Base interface for all other types.
 */
interface Entity {
  /**
   * An identifier for this entity. In most cases, this identifier
   * should be globally unique and not start with `well-known:`.
   * The Design Awareness App generates random 24-character
   * alphanumeric IDs for this purpose.
   *
   * Well-known or standard entities (currently only DesignModels)
   * should use the format:
   *
   * ```
   * "well-known:" + (reverse DNS identifier) [optionally, + "@" + version]
   * ```
   *
   * @example `"well-known:edu.washington.hcde.engineering-design@1"`
   * @example `"kobyeor9a9y5cca9iufm8jjv"`
   */
  id: string;
}

/**
 * A single design activity that makes up part of a {@link DesignModel}.
 */
interface Activity {
  /**
   * The name of the activity
   */
  name: string;

  /**
   * A short, human-readable description of the activity
   *
   * @default (empty)
   */
  description?: string;

  /**
   * A short (two-four letter) uppercase abbreviation of the activity name
   */
  code: string;

  /**
   * Accent color to use for the activity. Should be a pair of six-digit hex
   * color values, excluding "#", where the first is to be used in a light theme
   * (i.e., has high contrast with white) and the second is to be used in a dark
   * theme (i.e., has high contrast with black).
   *
   * @example `["0C8375", "14B8A5"]`
   */
  color: [string, string];
}

/**
 * Detailed human-readable information about a design model.
 */
interface DesignModelDescription {
  /**
   * A long-form written description of the design model.
   * Separate paragraphs with two newlines (`\n\n`).
   */
  description: string;

  /**
   * One or more URLs to use as image sources. Implementers may choose not to
   * display images or to restrict valid image origins for security reasons.
   *
   * In the Design Awareness app, images will only be shown when online.
   *
   * @default (empty)
   */
  imageURL?: string | string[];

  /**
   * Plain-text written citations for images, description, or the design model
   * itself.
   *
   * @default (empty)
   */
  citation?: string;

  /**
   * Link the user can follow to learn more about the design model.
   *
   * @default (empty)
   */
  moreInfoURL?: string;
}

/**
 * A design model for use in a project. Design models are a collection of
 * {@link Activity design activities} used for coding design processes.
 */
export interface DesignModel extends Entity {
  /**
   * Name of the design model.
   */
  name: string;

  /**
   * Long-form description of the design model, optionally including images,
   * citations, and/or a link to learn more.
   *
   * The Design Awareness app will only show descriptions for design models
   * where {@link DesignModel.wellKnown wellKnown} is `true`.
   *
   * @default (empty)
   */
  description?: DesignModelDescription | null;

  /**
   * The ordered list of {@link Activity activities} used in this design model.
   */
  activities: Activity[];

  /**
   * Whether the design model is "well known" or standard. This should be true
   * exactly when the design model's {@link DesignModel.id id} starts with
   * `well-known:`.
   *
   * @see {@link DesignModel.id}
   * @default false
   */
  wellKnown?: boolean;
}

/**
 * Shared project metadata for multiple project types
 */
interface ProjectMetadata {
  /**
   * Project name
   */
  name: string;

  /**
   * Project description (plain text)
   *
   * @default (empty)
   */
  description?: string;

  /**
   * Project creation date
   *
   * @default (current date)
   */
  created?: Date;

  /**
   * Project's most recent modification date
   *
   * @default (current date)
   */
  modified?: Date;

  /**
   * Whether the project is active. When a project is active, it can show
   * up in the user's recent projects and tracking/adding entries is possible.
   * If not active, the project is "archived".
   *
   * @default `true`
   */
  active?: boolean;

  /**
   * Design model used by this project
   */
  designModel: DesignModel;

  /**
   * Project-level notes not associated with any particular entry, session,
   * or activity.
   *
   * @default `[]`
   */
  notes?: ProjectNote[];
}

/**
 * Represents a single on-off event for an {@link Activity}, with
 * session-relative timestamps in milliseconds: [activity on time, activity
 * off time]. Except for the case described below, the off time must be greater
 * than the on time. No off time should be greater than the session's duration.
 *
 * An activity off time of -1 indicates that the activity has not been turned
 * off. Such a value should never be present once a session is no longer
 * ongoing; instead, it should be normalized to the RealtimeSession's duration.
 */
type RealtimeActivityTimingPair = [number, number];

/**
 * An ordered array of {@link RealtimeActivityTimingPair pairs} representing all
 * the on-off times for an activity over the course of a session.
 *
 * Pairs must be ordered such that each pair's off time is less than the on time
 * of the next pair.
 */
type RealtimeActivityRecord = RealtimeActivityTimingPair[];

/**
 * Represents a single session for a {@link RealtimeProject project} tracked
 * in realtime.
 */
export interface RealtimeSession extends Entity {
  /**
   * The total duration of the session, in milliseconds
   */
  duration: number;

  /**
   * The start date/time for the session
   */
  start: Date;

  /**
   * Activity data for the session, where each element corresponds to the
   * tracking data for the {@link Activity} with the same index in
   * the project's {@link DesignModel}.
   */
  data: RealtimeActivityRecord[];

  /**
   * The notes on this project.
   *
   * @default `[]`
   */
  notes?: ProjectNote[];
}

/**
 * Represents a project tracked in realtime (i.e., "synchronously").
 */
export interface RealtimeProject extends Entity, ProjectMetadata {
  /**
   * Sessions contained in the project, which contain the project's tracking
   * data.
   */
  sessions: RealtimeSession[];
}

/**
 * Contains a data point with the amount of time spent working on a single
 * {@link Activity} during a single {@link AsyncEntry entry}, and an
 * optional written description.
 */
interface AsyncActivityData {
  /**
   * The amount of time spent on the activity in this entry, in minutes.
   */
  value: number;

  /**
   * Additional written description assoiated with this particular activity in
   * an entry.
   *
   * @default (empty)
   */
  note?: string;
}

/**
 * Represents a single entry in an {@link AsyncProject}, listing
 * the amount of time spent on each activity.
 */
export interface AsyncEntry extends Entity {
  /**
   * Activity data for the entry, where each element corresponds to the
   * information for the {@link Activity} with the same index in the project's
   * {@link DesignModel}.
   */
  data: AsyncActivityData[];

  /**
   * Which time period this entry corresponds to.
   *
   * Time periods are timezone-agnostic and always represented using UTC.
   * Implementers are strongly encouraged to normalize period values to the
   * start of a day or week period. For example, an entry corresponding to
   * June 20, 2021 should use the date `2021-06-20T00:00:00.000Z`.
   *
   * For week-based periods, use the day of the week indicated by the
   * project's {@link AsyncProject.periodAlignment `periodAlignment`} to
   * normalize this value. That is, the value should be the start of a day
   * whose `getUTCDay()` is the same as the `periodAlignment`.
   *
   * For example, if `periodAlignment` is `1`, a period for the week starting
   * with Monday, June 21, 2021 should be represented by the date
   * `2021-06-21T00:00:00.000Z`
   *
   * If necessary, non-normalized date values should be interpreted by
   * truncation. For example, a value of `2021-06-23T01:33:40.908Z` is
   * interpreted as June 23, 2021. For week-based periods, if the weekday
   * does not match `periodAlignment`, decrement the date until it does.
   */
  period: Date;

  /**
   * Additional written description associated with the entry
   *
   * @default (empty)
   */
  note?: string;

  /**
   * Entry creation date
   *
   * @default (current date)
   */
  created?: Date;

  /**
   * Entry's most recent modification date
   *
   * @default (current date)
   */
  modified?: Date;
}

declare enum Weekday {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

/**
 * Represents a project with timing data logged retrospectively
 * (i.e., "asynchronously").
 */
export interface AsyncProject extends Entity, ProjectMetadata {
  /**
   * Timescale of entry logging for this project.
   */
  reportingPeriod: "day" | "week";

  /**
   * Used for projects where the {@link reportingPeriod `reportingPeriod`}
   * is `week` to determine which weekday is the "start" of the week.
   *
   * This property is not required when `reportingPeriod` is `day`, but it may
   * still be useful to decide how to align weekly summaries in a UI or report.
   *
   * @default `0` (Sunday)
   */
  periodAlignment?: Weekday;

  /**
   * Entries in the project, which contain activity time data.
   */
  entries: AsyncEntry[];
}

/**
 * Generic note interface for user-written notes
 */
interface GenericNote extends Entity {
  /**
   * Note content (plain text)
   */
  content: string;

  /**
   * Note creation date/time
   *
   * @default (current date)
   */
  created?: Date;
}

/**
 * A user-written note associated with a project.
 * @see {@link RealtimeProject.notes}
 * @see {@link AsyncProject.notes}
 */
export interface ProjectNote extends GenericNote {}

/**
 * Represents a note associated with an exact moment in a
 * {@link RealtimeSession session} tracked in realtime.
 */
export interface TimedNote extends GenericNote {
  /**
   * The session-relative time, in milliseconds.
   */
  time: number;
}
