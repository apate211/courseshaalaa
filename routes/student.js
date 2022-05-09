const express = require("express");
const session = require("express-session");
const upload = require('express-fileupload');
const fs = require("fs");
const res = require("express/lib/response");
const router = express.Router();
const data = require("../data");
const AppError = require("../middleware/appError");

router.use(upload()) 

router.get("/", async function (req, res, next) {
    try {
      let username = req.session.user.username;
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
      if(enroll){
        for(let x = 0 ; x < enroll.length ; x++){
          enroll[x].course_id.toString()
          enroll[x].course_id   
        }
      }
     
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
  const stud = req.session.user.username;
    const id = req.params.id;
    let courses = data.studentcourses
    // const username=req.session.user.username
  //  console.log('here22')
    //const username = 'aniket2499'
    const enrolledCourse = await courses.getStudentcourseById(id);
    const courseName = enrolledCourse.coursename;
    const username = enrolledCourse.username;
    const seq = await courses.getVideoSequenceByUserAndCourse(courseName, stud)
   // console.log(seq)
    const course = await courses.getCourseByNameAndCourse(courseName, username);
    let videoLectures= await course.videos;
    let tick=[];
    for(let i=0;i<videoLectures.length;i++){
        let j = {}
        console.log(videoLectures[i].path)
        j['url'] = videoLectures[i].path
        j['tick'] = i < seq;
        j['index'] = i + 1
        j['disable'] = i > seq
        j['enrolledCourseId'] = id;
        tick.push(j)
    }

    course['tickedVideos'] = tick;
    course.assignments = enrolledCourse.assignments;
      // course.assignments = enrolledCourse.assignments;
    // course.enrolledCourseId = id;
    //console.log('Router Course: ',course)
    res.render('mainpage/enrollecourse', {course: course});
});

router.get('/videos/:id/:index', async(req, res) => {
  const stud = req.session.user.username;
  const id = req.params.id;
  const index = req.params.index;
  let courses = data.studentcourses
  const enrolledCourse = await courses.getStudentcourseById(id);
  const courseName = enrolledCourse.coursename;
    const username = enrolledCourse.username;
    const seq = await courses.getVideoSequenceByUserAndCourse(courseName, stud)
  const curSeq = seq
  const showButton = index-1 == curSeq;
  const coursename = enrolledCourse.coursename;
  const teacher = enrolledCourse.teacher;
  const curVideo = enrolledCourse.videos[index-1].path;
  const len = enrolledCourse.videos.length;
  res.render('mainpage/video', {enrolledCourseId: id, seq: curSeq, showButton: showButton, 
    curVideo: curVideo, index: index, coursename: coursename, len: len})
});

router.post('/videoCompleted', async function(req,res){
 // console.log('button clicked')
  const stud = req.session.user.username;
  let courses = data.studentcourses
  let dt = req.body.btnn;
  let vals = dt.split('#')
  let enrolledCourseId = vals[0]
  let curSeq = +vals[1]
  let len = +vals[2]
  curSeq = curSeq + 1
  //console.log('Reached here')
  try {
    if(curSeq <= len) {
      const enrolledCourse = await courses.getStudentcourseById(enrolledCourseId);
      const courseName = enrolledCourse.coursename;
    const username = enrolledCourse.username;
    console.log('stud: ' + stud)
    console.log('course: ' + courseName)
      await courses.updateVideoSequenceByUserAndCourse(courseName, stud, curSeq);
    }   
  }
  catch(e) {
    console.log('Unable to update')
  }
 res.redirect('/student/enrolled/'+enrolledCourseId)
})

//     const id = req.params.id;   
//     let courses = data.enrolled_courses
//     const enrolledCourse = await courses.getEnrolledCourseById(id);
//     const teacher = enrolledCourse.teacher;
//     const courseName = enrolledCourse.course_name;
//     const course = await enrolledData.getCourseByNameAndCourse(courseName, teacher);
//     course.assignments = enrolledCourse.assignments;
//     course.enrolledCourseId = id;
//     console.log('Router Course: ',course)
//    enrolledCourse._id = enrolledCourse._id.toString();
//     res.render('mainpage/enrollecourse', {course: enrolledCourse});
// });


router.get('/not_enrolled/:id', async (req, res) => {
  const id = req.params.id;
  let courses = data.enrolled_courses
  const enrolledCourse = await courses.getEnrolledCourseById(id);
  enrolledCourse._id = enrolledCourse._id.toString();
  res.render('mainpage/notenrolledcourse', {course: enrolledCourse});
});

// router.get('/videos/:id/:index', async(req, res) => {
//   const id = req.params.id;
//   const index = req.params.index;
//   const enrolledCourse = await enrolledData.getEnrolledCourseById(id);
//   const curSeq = enrolledCourse.videos;
//   const showButton = index-1 == curSeq;
//   const coursename = enrolledCourse.course_name;
//   const teacher = enrolledCourse.teacher;
//   const course = await enrolledData.getCourseByNameAndCourse(coursename, teacher);
//   const curVideo = course.videos[index-1];
//   const len = course.videos.length;
//   res.render('course/video', {enrolledCourseId: id, seq: curSeq, showButton: showButton, 
//     curVideo: curVideo, index: index, coursename: coursename, len: len})
// });

// router.post('/videoCompleted', async function(req,res){
//   console.log('button clicked')
//   let dt = req.body.btnn;
//   let vals = dt.split('#')
//   let enrolledCourseId = vals[0]
//   let curSeq = +vals[1]
//   let len = +vals[2]
//   curSeq = curSeq + 1
//   console.log('Reached here')
//   try {
//     if(curSeq <= len) {
//       await enrolledData.updateVideoSequenceByUserAndCourse(enrolledCourseId, curSeq);
//     }   
//   }
//   catch(e) {
//     console.log('Unable to update')
//   }
//  res.redirect('/student/enrolled/'+enrolledCourseId)
// });


router.get('/enrollthestudent/:id', async(req,res)=>{
  const id  = req.params.id;
  const username = req.session.user.username;
  let courses = data.enrolled_courses;
  const enrolledCourse = await courses.onEnrollment(id,username);
  res.redirect('/student');
});

// router.get('/enrollthestudent/:id', async(req,res)=>{
//   const id  = req.params.id;
//   const username = req.session.user.username;
//   let courses = data.enrolled_courses;
//   const enrolledCourse = await courses.onEnrollment(id,username);
//   res.redirect('/student');
// });

router.post('/uploadassignment',async(req,res)=>{           // when the teacher press upload video button this post method is called.
  let filedata = req.files.textfile;
  let filename = req.files.textfile.name;

  let studentusername = req.session.user.username;
  // let username = 'user3'
  let coursename = decodeURI(req.body.coursename);
  // let videotitle = decodeURI(req.body.videotitle);
  // let sequencenumber = decodeURI(req.body.sequencenumber);
  // let videodescription = decodeURI(req.body.description)

  let id = decodeURI(req.body.id);
  let teacherusername =  decodeURI(req.body.teacherusername);

  let initialpath = '/public/uploads/'

  try {
    if (!fs.existsSync("." + initialpath + studentusername)) {
      fs.mkdirSync("." + initialpath + studentusername);
    }
    if (!fs.existsSync("." + initialpath + studentusername + "/" + coursename)) {
      fs.mkdirSync("." + initialpath + studentusername + "/" + coursename);
    }
    if (!fs.existsSync("." + initialpath + studentusername + "/" + coursename + "/assignments")) {
      fs.mkdirSync("." + initialpath + studentusername + "/" + coursename + "/assignments");
    }
  } catch (err) {
    console.error(err);
  }

  let finalpath = initialpath + studentusername + "/" + coursename + "/assignments/"
  //  finalpath+filename
  filedata.mv("." + finalpath + "/" + filename,function(err){
      if(err){
        console.log("error");
          // return res.json({true: true})
      }else{
        console.log("done")
          // return res.json({true: true})
      }
  })

  let transferdata = {
      teacherusername : teacherusername,
      coursename : coursename,
      studentusername : studentusername,
      id: id,
      path: finalpath + filename
  }

  
  let uploadassignment = data.studentcourses;

  let result; 
  try{ 
      result = await uploadassignment.adduploadedassignment(transferdata)
  }catch(e){
      throw e;
  }

  return res.json({"assignment": result});
})

router.get('/assignmentssubmission/:id', async(req,res)=>{
  // const coursename = req.params.coursename
  // const teacherusername = req.params.teacherusername
  // const studentusername = req.session.user.username
  
  const id = req.params.id;
  let students = data.studentcourses;
  let uandcobj = await students.getdetailsforsubmission(id);
  uandcobj.studentusername = uandcobj.username;
  uandcobj.teacherusername = req.session.user.username;

  res.render('mainpage/submitassignment',{object: uandcobj});

})

router.post('/uploadassignment',async(req,res)=>{           // when the teacher press upload video button this post method is called.
    let filedata = req.files.video;
    let filename = req.files.video.name;

    let username = req.session.user.username;
    // let username = 'user3'
    let coursename = decodeURI(req.body.coursename);
    let videotitle = decodeURI(req.body.videotitle);
    let sequencenumber = decodeURI(req.body.sequencenumber);
    let videodescription = decodeURI(req.body.description)

    let initialpath = '/public/uploads/'

    try {
      if (!fs.existsSync("." + initialpath + username)) {
        fs.mkdirSync("." + initialpath + username);
      }
      if (!fs.existsSync("." + initialpath + username + "/" + coursename)) {
        fs.mkdirSync("." + initialpath + username + "/" + coursename);
      }
      if (!fs.existsSync("." + initialpath + username + "/" + coursename + "/videos")) {
        fs.mkdirSync("." + initialpath + username + "/" + coursename + "/videos");
      }
    } catch (err) {
      console.error(err);
    }

    let finalpath = initialpath + username + "/" + coursename + "/videos/"

    filedata.mv("." + finalpath+filename,function(err){
        if(err){
            // return res.json({true: true})
        }else{
            // return res.json({true: true})
        }
    })

    let transferdata = {
        studentusername : studentusername,
        coursename : coursename,
        teacherusername : teacherusername,
        path: finalpath + filename
    }

    
    let addvideo = data.courses;

    let result 
    try{ 
        result = await addvideo.addvideo(transferdata)
    }catch(e){
        throw e;
    }
    // testing file names

  return res.json({stat: true})
})

module.exports=router;