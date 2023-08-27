const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://localhost:8001/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    })
  );
  app.use(
    createProxyMiddleware("/websocket", {
      target: "http://localhost:3000",
      ws: true,
      changeOrigin: true,
    })
  );
};
