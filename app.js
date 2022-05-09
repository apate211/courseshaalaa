const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/errorHandler");
app.use(express.json());

// Public directory(View)
const exphbs = require("express-handlebars");
const static = express.static(__dirname + "/public");
const Handlebars = require("handlebars");
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use("/public", static);

// For routes
const configRoutes = require("./routes");
app.use(express.urlencoded({ extended: true }));

// For database
const { ConnectionCheckedInEvent } = require("mongodb");
// const connection = require('./mongoConnection');

// For session and middleware functions
const session = require("express-session");
app.use(
  session({
    name: "maintainUserInfo",
    secret: "This is a secret..",
    saveUninitialized: true,
    resave: false,
  })
);

configRoutes(app);
app.use(errorMiddleware);

app.listen(3000, async () => {
  console.log("your server is ready!");
  console.log("Your routes will be running on http://localhost:3000/login");
});
