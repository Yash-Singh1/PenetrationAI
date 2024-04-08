const mp = new Map<string, Function>();

Bun.serve({
  port: 6767,
  fetch(req, server) {
    const uri = new URL(req.url);
    console.log(uri, req);
    if (req.method === "GET" && uri.pathname === "/await") {
      console.log("awaiting req");
      server.publish(
        "publish",
        JSON.stringify({
          type: "run",
          command: uri.searchParams.get("command")!,
          id: uri.searchParams.get("id")!,
        })
      );
      return new Promise((resolve) => {
        console.log("awaiting");
        mp.set(uri.searchParams.get("id")!, resolve);
      });
    } else if (uri.pathname === "/ws") {
      server.upgrade(req);
      return undefined;
    }

    return new Response("Not found", { status: 404 });
  },

  websocket: {
    open(ws) {
      ws.subscribe("publish");
    },
    message(_ws, message) {
      if (message instanceof Buffer) return;
      const data = JSON.parse(message);
      console.log(data);
      if (data.type === "run") {
        const output = data.output;
        const id = data.id;
        const headers = new Headers();
        headers.set("Content-Type", "text/plain");
        mp.get(id)!(new Response(output));
        console.log("done");
      }
    },
  },
  hostname: "0.0.0.0",
});
