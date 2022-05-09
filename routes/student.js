const express = require("express");
const session = require("express-session");
const upload = require("express-fileupload");
const fs = require("fs");
const res = require("express/lib/response");
const router = express.Router();
const data = require("../data");
const AppError = require("../middleware/appError");
const { ErrorType } = require("../middleware/enum");

router.get("/", async function (req, res, next) {
  try {
    // let username = req.session.user.username;
    let username = "user1";
    let coursesData = data.studentcourses;
    let courses = await coursesData.recommendedcourses();
    let enroll = await coursesData.enrolledcourses(username);
    let recommenda = await coursesData.recommend(username);

    res.render("./mainpage/students", {
      navbar: true,
      courses: courses,
      enrolled: enroll,
      recom: recommenda,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/");

module.exports = router;
