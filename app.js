const express = require("express");
const app = express();
const fs = require("fs");
const errorMiddleware = require("./middleware/errorHandler");

// const { execSync } = require("child_process");
// const DB_Name = "courshaalaa";
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
const path = require("path");
app.use(
  session({
    name: "maintainUserInfo",
    secret: "This is a secret..",
    saveUninitialized: true,
    resave: false,
  })
);
// app.use("/", async function (req, res, next) {
//   try {
//     execSync(
//       `mongoimport --db ${DB_Name} --collection courses --drop --file "${process.cwd()}/seeder/courses.json" -jsonArray`
//     );
//     execSync(
//       `mongoimport --db ${DB_Name} --collection studentcourses --drop --file "${process.cwd()}/seeder/studentcourses.json" -jsonArray`
//     );
//     execSync(
//       `mongoimport --db ${DB_Name} --collection dropdowndata --drop --file "${process.cwd()}/seeder/dropdowndata.json" -jsonArray`
//     );
//     execSync(
//       `mongoimport --db ${DB_Name} --collection users --drop --file "${process.cwd()}/seeder/users.json" -jsonArray`
//     );
//   } catch (error) {
//     next(error);
//   }
// });

configRoutes(app);
app.use(errorMiddleware);

app.listen(3000, async () => {
  console.log("your server is ready!");
  console.log("Your routes will be running on http://localhost:3000/login");
});
