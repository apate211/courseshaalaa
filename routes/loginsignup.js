const express = require("express");
const session = require("express-session");
const router = express.Router();
const data = require("../data");
const AppError = require("../middleware/appError");
const { ErrorType } = require("../middleware/enum");
const validation = require("../middleware/validation");
const mongoCollection = require("../config/mongoCollections");
const coursesCollection = mongoCollection.courses;
const studentCoursersCollection = mongoCollection.studentcourses;
const dropdownCollection = mongoCollection.dropdowndata;
const userCollection = mongoCollection.users;

router.get("/", function (req, res) {
  res.render("./loginsignup/login", { title: "login", navbar: false });
});

router.get("/signup", function (req, res) {
  res.render("./loginsignup/signup", { title: "signup", navbar: false });
});

router.post("/signup", async function (req, res, next) {
  let body = req.body;
  let usersdata = data.users;
  try {
    if (
      !body.username ||
      !body.password ||
      !body.email ||
      !body.firstname ||
      !body.lastname ||
      !body.usertype
    ) {
      throw new AppError(
        "Please enter all required fields",
        ErrorType.validation_error
      );
    }
    body.username = await validation.checkString(body.username, "User-Name");
    body.password = await validation.checkString(body.password, "Password");
    body.email = await validation.checkEmail(body.email, "Email");
    body.firstname = await validation.checkString(body.firstname, "First Name");
    body.lastname = await validation.checkString(body.lastname, "Last Name");
  } catch (error) {
    return next(error);
  }

  let user = {
    username: body.username,
    password: body.password,
    email: body.email,
    firstname: body.firstname,
    lastname: body.lastname,
    usertype: body.usertype,
  };
  try {
    let flag = await usersdata.addUser(user);
    if (flag) {
      req.session.user = { username: body.username, usertype: body.usertype };
      return res.redirect("/login");
    } else {
      console.log("did not inserted");
      throw new AppError("Failed To insert", ErrorType.unknown_error);
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
  console.log(body.username);
});

router.post("/", async function (req, res, next) {
  let body = req.body;
  let usersdata = data.users;
  const courseData = JSON.parse(
    fs.readFileSync(`${__dirname}/seeder/courses.json`, "utf-8")
  );
  const collection1 = await coursesCollection();
  await collection1.insertMany(courseData);
  const studentCoursesData = JSON.parse(
    fs.readFileSync(`${__dirname}/seeder/studentcourses.json`, "utf-8")
  );
  const collection2 = await studentCoursersCollection();
  await collection2.insertMany(studentCoursesData);
  const dropdowndata = JSON.parse(
    fs.readFileSync(`${__dirname}/seeder/dropdowndata.json`, "utf-8")
  );
  const collection3 = await dropdownCollection();
  await collection3.insertMany(dropdowndata);
  const usersData = JSON.parse(
    fs.readFileSync(`${__dirname}/seeder/users.json`, "utf-8")
  );
  const collection4 = await userCollection();
  await collection4.insertMany(usersData);
  try {
    if (!body.username || !body.password) {
      throw new AppError(
        "Please send All required fields",
        ErrorType.validation_error
      );
    }
    let user = {
      username: body.username,
      password: body.password,
    };
    let flag = await usersdata.findUser(user);
    if (flag) {
      req.session.user = { username: body.username };
      console.log("user entered");
      res.redirect("/mainpage");
    } else {
      console.log("wrong input");
      throw new AppError("Incorrect Credential!!!", ErrorType.invalid_request);
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
