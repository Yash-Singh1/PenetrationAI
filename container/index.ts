Bun.serve({
  port: 3000,
  fetch(request, server) {
    server.upgrade(request);
    return undefined;
  },
  websocket: {
    open(ws) {},
    message(ws, data) {
      if (typeof data === "string") {
        const msg = JSON.parse(data);
        if (msg.type === "run") {
          console.log("running command", msg);
          Bun.$`cd ${msg.pwd} && bash -c "cd ${msg.pwd} && ${msg.command}; pwd"`
            .text()
            .then((res) => {
              const RE = /(.*?)\n$/;
              const pwd = RE.exec(res)![1];
              res = res.replace(RE, "");
              console.log("result", res);
              ws.send(
                JSON.stringify({ type: "result", result: res, id: msg.id, pwd })
              );
            })
            .catch((err) => {
              console.log("error", err);
            });
        } else if (msg.type === 'write') {
          // await Bun.write('/usr/src/app/main.py', ) 
        }
      }
    },
  },
});
