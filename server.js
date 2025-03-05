const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const PORT = process.env.port || 6500;
const { logger, logEvent } = require("./middleware/logEvent");
const erroHandler = require("./middleware/errorHndler");

// custon middleware logger
app.use(logger);

//third-party middleware
const whitList = [
  "http://google.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Nor allowed by cors"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

// apply middleware and handle url in form data
app.use(express.urlencoded({ extended: false })); // write before all rouths, apply for all rouths

//apply middleware for JSON data
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, "./public")));

app.get("^/$|index(.html)?", (req, res) => {
  //  res.sendFile("./views/index.html", {root:__dirname});
  // res.sendFile(path.join(__dirname, "views/index.html"));
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  //  res.sendFile("./views/index.html", {root:__dirname});
  // res.sendFile(path.join(__dirname, "views/index.html"));
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
  //  res.sendFile("./views/index.html", {root:__dirname});
  // res.sendFile(path.join(__dirname, "views/index.html"));
  res.redirect(301, "/new-page.html");
});

// routh handeler
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("Try to load hello.html");
    next();
  },
  (req, res) => {
    res.send("Hello world, Hello Sahar");
  }
);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(erroHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
