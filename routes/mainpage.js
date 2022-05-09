const express = require("express");
const session = require("express-session");
const upload = require("express-fileupload");
const fs = require("fs");
const res = require("express/lib/response");
const router = express.Router();
const data = require("../data");
const AppError = require("../middleware/appError");
const { ErrorType } = require("../middleware/enum");

router.use(upload());

router.get("/", async function (req, res, next) {
  try {
    // let username = req.session.user.username;
    let username = "user3";
    let coursesData = data.courses;
    let courses = await coursesData.getcourses(username);
    for (x in courses) {
      let string = "";
      for (let y of courses[x].description) {
        string = string + y;
        if (y === ".") {
          string = string + y;
          break;
        }
      }
      courses[x].description = string;
    }
    res.render("./mainpage/teachers", { navbar: true, courses: courses });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/createcourse", async function (req, res) {
  res.render("./mainpage/createcourse", { navbar: true });
});

router.post("/addcourse", async function (req, res, next) {
  let body = req.body;
  try {
    if (
      !body.coursename ||
      !body.coursetag ||
      !body.description ||
      !body.startdate ||
      !body.enddate
    ) {
      throw new AppError(
        "Please Insert all the values",
        ErrorType.validation_error
      );
    }
  } catch (error) {
    return next(error);
  }
  let course = {
    coursename: body.coursename,
    coursetag: body.coursetag,
    description: body.description,
    startdate: body.startdate,
    enddate: body.enddate,
    deployed: 0,
    // username: req.session.user.username
  };
  course.username = "user3";
  let coursesData = data.courses;
  try {
    let flag = await coursesData.addcourse(course);
    if (flag === "true") {
      res.redirect("/mainpage");
    } else {
      console.log("did not inserted");
      throw new AppError("Failed to insert", ErrorType.unknown_error);
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/gettagsfordropdown", async function (req, res, next) {
  try {
    let coursesData = data.courses;
    let tags = await coursesData.gettagsdropdown("tags");
    console.log(tags[0].tags);
    return res.json({ tags: tags[0].tags });
  } catch (error) {
    next(error);
  }
});

router.get("/uploadedassignments/:id", async function (req, res, next) {
  try {
    // let username = req.session.user.username;
    // let coursename = req.params.id;
    if (!req.params.id) {
      throw new AppError("Please insert valid id", ErrorType.invalid_request);
    }
    let username = "user3";
    let coursename = "Web Technologies";
    coursename = decodeURI(coursename);

    let coursesData = data.courses;
    let assignments = await coursesData.getallasignments(coursename, username);
    return res.json(assignments);
  } catch (error) {
    next(error);
  }
});

router.get("/uploadedvideos/:id", async function (req, res, next) {
  try {
    // let username = req.session.user.username;
    // let coursename = req.params.id;
    if (!req.params.id) {
      throw new AppError("Please insert valid id", ErrorType.invalid_request);
    }

    let username = "user3";
    let coursename = "Web Technologies";
    coursename = decodeURI(coursename);
    let videodetails = data.courses;
    let result = await videodetails.getallvideodetails(coursename, username);
    result = JSON.stringify(result);
    // console.log(result)
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/details/:id", async function (req, res, next) {
  try {
    // const coursename = req.params.id
    // const username = req.session.user.username
    if (!req.params.id) {
      throw new AppError("Please insert valid id", ErrorType.invalid_request);
    }
    const username = "user3";
    const coursename = "Web Technologies";
    let coursedata = data.courses;
    let cdata = await coursedata.getcourse(coursename, username);

    res.render("./mainpage/detailspercourse", {
      coursename: coursename,
      coursedata: cdata,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    // const coursename = req.params.id
    // const username = req.session.user.username
    if (!req.params.id) {
      throw new AppError("Please send valid id", ErrorType.invalid_request);
    }
    const username = "user3";
    const coursename = "Web Technologies";
    let coursedata = data.courses;
    let data = await coursedata.getcourse(coursename, username);
    data.coursename = encodeURI(data.coursename);
    res.render("./mainpage/coursedetails", { navbar: true, data: data });
  } catch (e) {
    next(e);
  }
  console.log(coursename);
});

router.post("/addassignment", async function (req, res, next) {
  try {
    // let username = req.session.user.username;
    if (!req.body) {
      throw new AppError("Please send all fields", ErrorType.validation_error);
    }
    let username = "user3";
    let object = req.body;
    console.log(object);

    let addassignment = data.courses;
    let assignment = await addassignment.addassignment(object, username);
    return res.json({ assignment: object });
  } catch (error) {
    next(error);
  }
});

router.post("/updateassignment", async function (req, res, next) {
  try {
    let username = "user3";
    let object = req.body;
    console.log(object);
    if (!object) {
      throw new AppError("Please send valid data", ErrorType.validation_error);
    }
    let updateassignment = data.courses;
    let assignment = await updateassignment.updateassignment(object, username);
    return res.json({ status: "true" });
  } catch (error) {
    next(error);
  }
});

router.post("/uploadvideo", async function (req, res, next) {
  try {
    let filedata = req.files.video;
    let filename = req.files.video.name;

    // let username = req.session.user.username;
    let username = "user3";
    let coursename = decodeURI(req.body.coursename);
    let videotitle = decodeURI(req.body.videotitle);
    let sequencenumber = decodeURI(req.body.sequencenumber);
    let videodescription = decodeURI(req.body.description);
    if (
      !filedata ||
      !filename ||
      !username ||
      !coursename ||
      !videotitle ||
      !sequencenumber ||
      !videodescription
    ) {
      throw new AppError("Please send all fields", ErrorType.validation_error);
    }

    let initialpath = "/public/uploads/";

    try {
      if (!fs.existsSync("." + initialpath + username)) {
        fs.mkdirSync("." + initialpath + username);
      }
      if (!fs.existsSync("." + initialpath + username + "/" + coursename)) {
        fs.mkdirSync("." + initialpath + username + "/" + coursename);
      }
    } catch (err) {
      console.error(err);
      next(err);
    }

    let finalpath = initialpath + username + "/" + coursename + "/";

    filedata.mv("." + finalpath + filename, function (err) {
      if (err) {
        // return res.json({true: true})
      } else {
        // return res.json({true: true})
      }
    });

    let transferdata = {
      username: username,
      coursename: coursename,
      videotitle: videotitle,
      sequencenumber: sequencenumber,
      videodescription: videodescription,
      path: finalpath + filename,
    };

    let addvideo = data.courses;
    let result = await addvideo.addvideo(transferdata);
    // testing file names
    return res.json({ status: true, data: transferdata });
  } catch (error) {
    next(error);
  }
});

router.post("/deleteassignment", async function (req, res, next) {
  try {
    let reqdata = req.body;
    if (!reqdata.coursename || reqdata.deleteId) {
      throw new AppError("Please send valid body", ErrorType.validation_error);
    }
    let username = "user3";
    let coursename = decodeURI(reqdata.coursename);
    let sequencenumber = decodeURI(reqdata.deleteId);

    // for deleting data in database
    let assignments = data.courses;
    let result = await assignments.deleteassignment(
      coursename,
      username,
      sequencenumber
    );
    return res.json({ status: true });
  } catch (error) {
    next(error);
  }
});

router.post("/deletevideo", async function (req, res, next) {
  try {
    // let username = req.session.user.username;
    let reqdata = req.body;
    if (!reqdata.coursename || !reqdata.deleteId || !reqdata.path) {
      throw new AppError("Please send all fields", ErrorType.validation_error);
    }
    let username = "user3";
    let coursename = decodeURI(reqdata.coursename);
    let sequencenumber = decodeURI(reqdata.deleteId);
    let path = decodeURI(reqdata.path);
    console.log(path);
    if (fs.existsSync("." + path)) {
      console.log("true");
      fs.unlinkSync("." + path);
    }
    console.log(username + " " + coursename + " " + sequencenumber);

    // for deleting data in database
    let videos = data.courses;
    let result = await videos.deletevideo(coursename, username, sequencenumber);
    return res.json({ status: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
