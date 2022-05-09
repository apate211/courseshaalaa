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
      let username = xss(req.session.user.username);
      // let username = "user1";
      let coursesData = data.studentcourses;
      let courses = await coursesData.allCourses();
      let enroll=await coursesData.enrolledcourses(username)
      let recommenda=await coursesData.recommend(username)
      
      for(x in courses){
        let string = ""
        for(let y of courses[x].description){
            string = string + y;
            if(y === '.'){
                string = string + y;
                break;
            }
        }
        courses[x].description = string;
        courses[x]._id = courses[x]._id.toString();
      }

      // for(x in enroll){
      //   let string = ""
      //   for(let y of enroll[x].description){
      //       string = string + y;
      //       if(y === '.'){
      //           string = string + y;
      //           break;
      //       }
      //   }
      //   enroll[x].description = string;
      //   enroll[x]._id = enroll[x]._id;
      // }

      // for(x in recommenda){
      //   let string = ""
      //   for(let y of recommenda[x].description){
      //       string = string + y;
      //       if(y === '.'){
      //           string = string + y;
      //           break;
      //       }
      //   }
      //   recommenda[x].description = string;
      //   recommenda[x]._id = string;
      // }
      if(enroll){
        for(let x = 0 ; x < enroll.length ; x++){
          enroll[x].course_id
        }
      }
      // if(recommenda){
      //   for(let x = 0 ; x < enroll.length ; x++){
      //     recommenda[x]._id.toString()
      //   }
      // }
      // console.log(enroll[0]._id.toString());
      res.render("./mainpage/students", { navbar: true, courses: courses,enrolled:enroll,recom:recommenda});
    } catch (error) {
        throw error;
    }
  });

  router.get("/reviews", async function (req,res,next){
    try{
      let username = req.session.user.username;
      let reviewData = data.reviews;
      let reviews2=await reviewData.getallreviews()
      res.render("./mainpage/reviews",{reviews:reviews2})
    }
    catch (error) {
      next(error);
    }
  })

  router.post("/reviews", async function (req,res,next){
    try{
      
      let ratings=req.body.Ratings
      let reviews=req.body.review
      let teacherusername="user3"
      let username = req.session.user.username;
      let coursename="Web"
      let reviewData = data.reviews;
      let reviews2=await reviewData.addreview(coursename,username,teacherusername,ratings,reviews)
      let reviews3=await reviewData.getallreviews()
      res.render("./mainpage/reviews",{reviews:reviews3})
    }
    catch (error) {
      next(error);
    }
  })


router.get('/enrolled/:id', async (req, res) => {
    const id = req.params.id;
    let courses = data.enrolled_courses
    const enrolledCourse = await courses.getEnrolledCourseById(id);
    // const teacher = enrolledCourse.teacher;
    // const courseName = enrolledCourse.course_name;
    // const course = await enrolledData.getCourseByNameAndCourse(courseName, teacher);
    // course.assignments = enrolledCourse.assignments;
    // course.enrolledCourseId = id;
    //console.log('Router Course: ',course)
    res.render('mainpage/enrollecourse', {course: enrolledCourse});
});


router.get('/not_enrolled/:id', async (req, res) => {
  const id = req.params.id;
  let courses = data.enrolled_courses
  const enrolledCourse = await courses.getEnrolledCourseById(id);
  enrolledCourse._id = enrolledCourse._id.toString();
  // const teacher = enrolledCourse.teacher;
  // const courseName = enrolledCourse.course_name;
  // const course = await enrolledData.getCourseByNameAndCourse(courseName, teacher);
  // course.assignments = enrolledCourse.assignments;
  // course.enrolledCourseId = id;
  //console.log('Router Course: ',course)
  res.render('mainpage/notenrolledcourse', {course: enrolledCourse});
});


router.get('/enrollthestudent/:id', async(req,res)=>{
  const id  = req.params.id;
  const username = req.session.user.username;
  let courses = data.enrolled_courses;
  const enrolledCourse = await courses.onEnrollment(id,username);
  res.redirect('/student');
});






module.exports=router;