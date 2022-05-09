const express = require('express');
const session = require('express-session');
const upload = require('express-fileupload');
const fs = require('fs');
const res = require('express/lib/response');
const router = express.Router();
const data = require('../data');
const xss = require('xss');

router.use(upload())

router.get('/',async function(req,res){                 // when ever the login this page will be displayed( like a main page ) 
    let username = req.session.user.username;        // changed
    // let username = 'user3'
    let courses;

    let coursesData = data.courses;

    try{
        courses = await coursesData.getcourses(username);
        console.log(courses);

        for(x in courses.not_deployed_courses){
            let string = ""
            for(let y of courses.not_deployed_courses[x].description){
                string = string + y;
                if(y === '.'){
                    string = string + y;
                    break;
                }
            }
            courses.not_deployed_courses[x].description = string;
        }

        for(x in courses.deployed_courses){
            let string = ""
            for(let y of courses.deployed_courses[x].description){
                string = string + y;
                if(y === '.'){
                    string = string + y;
                    break;
                }
            }
            courses.deployed_courses[x].description = string;
        }
    }
    catch(e){
        throw "probem in fetching the data";
    }
    
    res.render("./mainpage/teachers",{navbar: true,courses : courses})
})

router.get('/createcourse', async function(req,res){
    res.render("./mainpage/createcourse",{navbar:true})
})

router.post('/addcourse',async function(req,res){
    let body = req.body;
 
    xss(body.coursename);
    xss(body.coursetag);
    xss(body.description);
    xss(body.startdate);
    xss(body.enddate);
    xss(req.session.user.username);


    let course = {
        coursename: body.coursename,
        coursetag: body.coursetag,
        description: body.description,
        startdate: body.startdate,
        enddate: body.enddate,
        deployed: 0,
        username: req.session.user.username
    }
    // course.username = "user3"
    let coursesData = data.courses;
    try{
        let flag = await coursesData.addcourse(course);
        if(flag === "true"){
            res.redirect("/mainpage")
        }
        else{
            console.log("did not inserted")
        }
    }catch(e){
        console.log(e)
    }
})

router.get('/gettagsfordropdown',async function(req,res){
    let coursesData = data.courses;
    let tags;
    
    try{
        tags = await coursesData.gettagsdropdown("tags");
    }catch(e){
        throw e
    }

    // console.log(tags[0].tags);
    return res.json({tags: tags[0].tags});
})

router.get('/uploadedassignments/:id', async function(req,res){
    let username = req.session.user.username;
    let coursename = req.params.id;

    xss(req.session.user.username)
    xss(req.params.id)

    // let username = 'user3';
    // let coursename = 'Web Technologies';
    coursename = decodeURI(coursename);
    
    let coursesData = data.courses;
    let assignments
    try{ 
        assignments = await coursesData.getallasignments(coursename,username); 
    }catch(e){
        throw e;
    }
    return res.json(assignments)
})

router.get('/uploadedvideos/:id',async function(req,res){
    let username = req.session.user.username;
    let coursename = req.params.id;

    // let username = 'user3';
    // let coursename = 'Web Technologies';
    coursename = decodeURI(coursename);
    let videodetails = data.courses;

    let result
    try{ 
        result = await videodetails.getallvideodetails(coursename,username);
    }catch(e){
        throw e
    }
    
    result = JSON.stringify(result);

    return res.json(result);
})

router.get('/details/:id', async function(req,res){                //This route will fetch all the details of the assignment
    const coursename = req.params.id
    const username = req.session.user.username
    
    // const username = 'user3';
    // const coursename = 'Web Technologies';
    let coursedata = data.courses;
    let cdata;

    try{
    cdata = await coursedata.getcourse(coursename,username);
    }catch(e){
        throw e;
    }

    if(cdata.deployed === 0){
        res.render('./mainpage/detailspercourse', {coursename: coursename, coursedata: cdata,buttonrequired: "required"})
    }else{
        let sdata;
        try{ 
            sdata = await coursedata.getstudentsenroled(coursename,username);
        }catch(e){
            throw e;
        }
        res.render('./mainpage/detailspercourse', {coursename: coursename, coursedata: cdata, studentsenrolled: sdata})
    }
})

router.get('/:id',async function(req,res){
    const coursename = req.params.id
    const username = req.session.user.username
    
    // const username = 'user3';
    // const coursename = 'Web Technologies';
    let coursedata = data.courses
    try{
        let data = await coursedata.getcourse(coursename,username);
        data.coursename = encodeURI(data.coursename);
        res.render('./mainpage/coursedetails',{ navbar: true, data: data})
    }
    catch(e){
        throw e
    }
    console.log(coursename)
})

router.post('/addassignment',async function(req,res){
    let username = req.session.user.username;
    // let username = 'user3';
    let object = req.body;
    console.log(object);

    let addassignment = data.courses;
    let assignment
    try{
        assignment = await addassignment.addassignment(object,username);
    }catch(e){
        console.log(e)
    }
    return res.json({assignment: object});
})

router.post('/updateassignment',async function(req,res){
    let username = "user3";
    let object = req.body;
    console.log(object);

    let updateassignment = data.courses;
    let assignment
    try{
        assignment = await updateassignment.updateassignment(object,username);
    }catch(e){
        throw e
    }
    return res.json({status: "true"})
})

router.post('/uploadvideo',async function(req,res){             // when the teacher press upload video button this post method is called.
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
        username : username,
        coursename : coursename,
        videotitle : videotitle,
        sequencenumber : sequencenumber,
        videodescription : videodescription,
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

    return res.json({status: true, data: transferdata});
})

router.post('/deleteassignment',async function(req,res){
    let reqdata = req.body
    let username = user.session.user.username
    // let username = 'user3'
    let coursename = decodeURI(reqdata.coursename);
    let sequencenumber = decodeURI(reqdata.deleteId);
    
    // for deleting data in database
    let assignments = data.courses;
    let result
    try{
        result = await assignments.deleteassignment(coursename,username,sequencenumber)
    }catch(e){
        throw e;
    }
    return res.json({status: true});
})

router.post('/deletevideo',async function(req,res){
    let username = req.session.user.username;
    
    let reqdata = req.body
    // let username = 'user3'
    let coursename = decodeURI(reqdata.coursename);
    let sequencenumber = decodeURI(reqdata.deleteId);
    let path = decodeURI(reqdata.path);
    console.log(path)
    if(fs.existsSync('.'+path)){
        console.log("true");
        fs.unlinkSync('.'+path);
    }
    console.log(username + " " + coursename + " " + sequencenumber)
    
    // for deleting data in database
    let videos = data.courses;
    let result
    try{
        result = await videos.deletevideo(coursename,username,sequencenumber)
    }catch(e){
        throw e;
    }
    return res.json({status: true});
})

router.post('/deploycourse',async function(req,res){

    let username = req.session.user.username
    // username = 'user3'
    let coursename = req.body.coursename
    
    let courses = data.courses;
    try{
        result = await courses.deploycourse(coursename,username)
    }catch(e){
        throw(e);
    }
    return res.json({status: false})
})



module.exports = router