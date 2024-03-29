# Gunner Changelog

## Changelog

All notable changes to this project will be documented in this file.

## [0.80.0] - 2023-06-25
- Added `dayjs` export to `toolbox`
  - Usage: `toolbox.datetime('2023-05-15T00:00:00.000Z').format('MMM DD YYYY');`

## [0.80.0] - 2023-06-25
- Fixed issue when running tests, changing the project root in gunner:constructor
  - this,projectRoot variable

## [0.79.0] - 2022-08-10

## [0.78.0] - 2022-06-10

- fixed issue when passing what appears to be number to flag which expects string

## [0.77.0] - 2022-06-08

- Fixed issue when passing array of options, was also reported as `object`
- Renamed `Options:` to `Command Options:` when displaying command help
- Added `Global Options` output when executing command --help
- Adjusted padding of Commands, Options and Global Options so they are consistent
> This has been a long standing issue, hopefully it is right everywhere

## [0.74.0 .. 0.74.28] - 2022-01-26

- Bump version

## [0.74.0 .. 0.74.3] - 2021-12-09

- Updated LICENSE
- Reorganized CHANGELOG (this document)

## [0.72.0 .. 0.73.0] - 2021-09-09

- added `prompt.disabled` flag which will instruct prompt runner to display prompt
- added prompt.run method, allow to execute automatic prompt

## [0.70.0] - 2021-09-01

- adjusted error message when calling a command which does not exist (they are all consistent error messages)
- added `help` flag property (different than prompt `hint`) with help being displayed in expanded command help
- added extended command help (each flag may contain a separate `help` property)

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

## [0.3.0] - 2019-03-09

### Added

- First public Release
- husky and commitlint to development workflow

### Added

- Prompt interface (powered by enquirer)

### Changed

### Removed

### References

- [enquirer](https://github.com/enquirer)

- The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---
