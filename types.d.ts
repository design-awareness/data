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
  description?: string;
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
   * Additional written description associated with the entry
   *
   * @default (empty)
   */
  description?: string;

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
