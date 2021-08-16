# Gunner Changelog

## Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.61.0] - 2021-08-15

- fixed command help display (incorrect key, was hard coded to `gunner`)
- Upgraded @codedungeon/messenger to v0.14.0
- Fixed issue with `make-command.mustache` template, should include require of `@codedungeon/gunner`
- Fixed issue when running cli for first time after install (create commands directory if not exists)

## [0.57.0 .. 0.57.1] - 2021-07-23

- Fixed assumption that `commandName` would use `input` prompt
- Added CLI abort (Command-c) to display abort message (unless `--quite` flag is supplied)
  - e.g. `gunner test --quiet` will not show abort message
- Added `disabled` option to `prompt` object which will skip prompt
- Added `options` to arguments and flags which are displayed when show help

## [0.36 .. 0.56.0] - 2021-06-12

- Implemented Messenger `system` logging interface
- Added `.logger` entrypoint to allow configuration of logs directory

## [0.27 .. 0.35] - 2021-05-24

- Added prompt interface (see test-prompt for supported prompts)
- Too much to list, powering through bug fixes and new features

## [0.26.0] - 2021-04-16

- Fixed issue where CLI based on gunner were reporting upgrade notice, should only appear when running gunner CLI directly.
-

## [0.10.0] - 2021-02-01

## [0.8.0] - 2020-07-03

## [0.7.0] - 2020-06-02

### Added

- Prompt interface (powered by enquirer)

### Changed

### Removed

### References

- [enquirer](https://github.com/enquirer)

## [0.3.0] - 2019-03-09

### Added

- First public Release
- husky and commitlint to development workflow

---
