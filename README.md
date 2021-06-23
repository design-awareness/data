# Design Awareness Data

This repository contains specifications for the data formats supported by the
[Design Awareness app](https://github.com/design-awareness/design-awareness-app).

**Latest version:** `1.0.0`

These data formats may be useful to build tools compatible with the
Design Awareness app, or for other general interchange of design process
tracking data.

This specification defines the following seven data types:

- `AsyncEntry`
- `AsyncProject`
- `DesignModel`
- `ProjectNote`
- `RealtimeProject`
- `RealtimeSession`
- `TimedNote`

# Serialization

These data types can be serialized for exchange between compatible applications.

Data should be encoded using JSON, and wrapped as follows:

```
{
  "$format": "design-awareness",
  "version": "1.0.0",
  "type": "<TYPE>",
  "data": ...
}
```

`<TYPE>` should be replaced with one of the data type names listed above
(e.g., `AsyncProject`). The `data` property contains the corresponding encoded
object data.

The Design Awareness app supports importing and exporting files containing an
`AsyncProject` or `RealtimeProject`.

Use of additional properties on the top-level object is discouraged, as this
space is reserved for future use. However, encoders may optionally include
a `meta` property for any additional data if needed. For example:

```
{
  "$format": "design-awareness",
  "version": "1.0.0",
  "type": "RealtimeProject",
  "data": ...,
  "meta": {
    "exportDate": "2021-06-10T01:28:01.915Z",
    "owner": "Jill Smith",
    "software": "XYZ Design Tool"
  }
}
```

This property is ignored by the Design Awareness app and will not be preserved
in later exports.

**Note**: This data format allows for the serialization of a single top-level
data type. Future versions may support serialization of multiple separate
top-level objects at once.

## Numbers

All values of type `number` should be **integers**.

## Dates

Dates should be encoded as ISO strings (e.g., with
[`.toISOString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)).
This is the standard behavior for `JSON.stringify`, so javascript
implementations likely won't need to perform this conversion manually.

## Optional properties

Properties marked as optional in this documentation are not required to be
included in serialized project data. If these properties are needed,
implementers should use the default value listed when a property is not
provided.

In particular, the Design Awareness app will fill in missing values with their
listed defaults when importing a project. All properties, even those marked
optional, will always be included in projects exported by the Design Awareness
app.

_In default values, `(empty)` refers to the empty string, `""`._

# Contributions & feedback

If you'd like to get involved with the project, provide feedback, bugfixes, or
request/submit additional functionality, please feel free to create an issue or
submit a pull request.
