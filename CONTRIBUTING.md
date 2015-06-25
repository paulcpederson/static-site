# Contributing Guidelines

Contributions welcome! Please check past issues and pull requests before you open your own issue or pull request to avoid duplicating a frequently asked question.

## Install

Fork and clone the repo, then `npm install` to install all dependencies.

## Testing

Tests are run with `npm test`. Please ensure all tests are passing before submitting a pull request (unless you're creating a failing test to increase test coverage or show a problem).

When adding a new feature, ensure that the new feature is tested thoroughly so I don't break it in the future.

## Code Style

[![standard][standard-image]][standard-url]

This repository uses [`standard`][standard-url] to maintain code style and consistency and avoid style arguments. `npm test` runs `standard` so you don't have to!

[standard-image]: https://cdn.rawgit.com/feross/standard/master/badge.svg
[standard-url]: https://github.com/feross/standard
[semistandard-image]: https://cdn.rawgit.com/flet/semistandard/master/badge.svg
[semistandard-url]: https://github.com/Flet/semistandard