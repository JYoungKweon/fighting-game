import express from "express";
import livereload from "livereload";
import connectLiveReload from "connect-livereload";

const PORT = 3000;

const livereloadServer = livereload.createServer({
  exts: ["js", "html", "css"],
  delay: 1000,
});
livereloadServer.watch(__dirname);

const app = express();
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.use(connectLiveReload());
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("index"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);
app.listen(PORT, handleListening);
