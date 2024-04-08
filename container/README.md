# bun-shell-over-docker

Container that allows users to interact with a Linux instance over WebSockets.

Uses Docker so make sure you have it installed if you want to run this.

## Building

```sh
docker build --pull -t bun-hello-world .
```

## Running

```sh
docker run -d -p 3003:3000 bun-hello-world
```
