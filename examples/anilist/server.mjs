import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { registerSSRHandler, setupServer, startServer } from "tapped/src/server";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var config = {
    port: 8082,
    base: "/",
    isProduction: process.env.NODE_ENV === "production",
    isDev: !process.env.NODE_ENV || process.env.NODE_ENV === "development",
    abortDelay: 10000,
    graphQLURL: "https://swapi-graphql.netlify.app/.netlify/functions/index",
    debugLog: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return console.log.apply(console, args);
    },
};
var _a = await setupServer({
    config: config,
    __dirname: __dirname,
}), fastify = _a.fastify, vite = _a.vite, templateHtml = _a.templateHtml, serverModulePath = _a.serverModulePath;
// Register GraphQL proxy
var httpProxy = await import("@fastify/http-proxy");
await fastify.register(httpProxy.default, {
    upstream: "https://swapi-graphql.netlify.app",
    prefix: "/graphql",
    rewritePrefix: "/.netlify/functions/index",
});
registerSSRHandler({
    fastify: fastify,
    vite: vite,
    templateHtml: templateHtml,
    serverModulePath: serverModulePath,
    config: config,
    productionServerModulePath: pathToFileURL(path.resolve(__dirname, "./dist/server/tappedServerModule.mjs")).href,
});
startServer(fastify, config.port);
