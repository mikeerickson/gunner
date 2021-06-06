# Docker Test
The following instructions outline the steps necessary to run `gunner cli` in docker

## Installation / Setup
Setup requires two simple steps

_Note: Tested through docker 3.3.3 (build 64133)_

Step 1: Build container (using latest node image)...

```bash
$ docker build -t gunner-node .
```

Step 2: run using image created in Step 1

```bash
$ docker run --name gunner --rm -ti gunner-node /bin/bash
```

## Notes

You can reinstall CLI inside container (through bash prompt)

```bash
$ npm i -g @codedungeon/gunner@latest
```

## References
The following provide additional information

[Running Node CLI in Docker Container](https://janikarhunen.fi/run-nodejs-cli-tools-in-docker-container)

[Using Docker Build](https://docs.docker.com/engine/reference/commandline/build/)

[Using Docker Run](https://docs.docker.com/engine/reference/run/)
