<<<<<<< HEAD
const express = require('express');
const session = require('express-session');
const upload = require('express-fileupload');
const fs = require('fs');
const res = require('express/lib/response');
const router = express.Router();
const data = require('../data')

router.use(upload())

router.get('/getassignments',async function(req,res){
    // let coursename = req.params.id;
    // let username = session.user.username
    
    // let coursename = "Web Technologies";
    // let username = "user3"
    // let coursedata = 
})

router.get('/assignmentdetails/:assignmentid/:coursename', async function(req,res){
    let coursename = req.params.coursename;
    //let username = req.session.user.username;
    // let teacherusername = 'user3'
    let teacherusername = req.session.username;
    // let assignment_id = "62723161f7dadbb5b6d1cd8c"
    let assignment_id = req.params.assignmentid;
    let initialpath = '/public/uploads/'

    // try {
    //   if (!fs.existsSync("." + initialpath + username)) {
    //     fs.mkdirSync("." + initialpath + username);
    //   }
    //   if (!fs.existsSync("." + initialpath + username + "/" + coursename + "/assignments")) {
    //     fs.mkdirSync("." + initialpath + username + "/" + coursename + "/assignments");
    //   }
    // } catch (err) {
    //   console.error(err);
    // }

    let studentsperassignment = data.courses;
    let result = await studentsperassignment.studentsperassignment(coursename,teacherusername,assignment_id)
    // console.log(result);
    // console.log(result[0].studentusername)
    if(result.length >0){
        let studentusername = result[0].studentusername
        result = result[0].assignments;
        console.log(result)
        result[0].studentusername = studentusername;
        return res.render("./mainpage/gradesperassignment",{title: "grades", assignments: result, coursename: coursename, assignment_id: assignment_id.toString()})
    }
    // console.log(result[0]);
    return res.render("./mainpage/gradesperassignment",{title: "grades", assignments: result, coursename: coursename, assignment_id: assignment_id.toString()})
})

router.get('/:id',async function(req,res){
    let coursename = req.params.id;
    // let username = 'user3';
    let username = req.session.user.username;
    // console.log(id + " " + username)

    let gettotalassignments = data.courses;
    let result = await gettotalassignments.gettotalssignments(coursename,username);
    if(result.length !== 0){
        result = result[0].assignments;
        console.log(result[0].assignments);
    }
    // for(let i = 0 ; i < result.length ; i++){
    //     console.log(result[i].sequencenumber)
    //     // result[i].sequencenumber = result[i].sequencenumber.toString();
    // }
    return res.render('./mainpage/gradespage',{title: "grades page", assignments: result, coursename: coursename})
})

router.post('/updategrades',async function(req,res){
    let teacherusername = req.session.user.username; 
    // let teacherusername = 'user3'
    let studentusername = req.body.studentusername;
    let grade = req.body.grade;
    let assignment_id = req.body.assignment_id;
    let coursename = req.body.coursename;

    let updategrades = data.courses;
    let result = await updategrades.updatestudentgrades(grade,assignment_id,studentusername,teacherusername,coursename);
})


router.post('/postgrades',async function(req,res){
    let teacherusername = req.session.user.username;
    // let teacherusername = "user3";
    let bodydata = req.body;
    bodydata.teacherusername = teacherusername;
    let post_grades = data.courses;
    let result = await post_grades.postgrades(teacherusername,bodydata);
    return res.json({status: result});
})

=======
const express = require('express');
const session = require('express-session');
const upload = require('express-fileupload');
const fs = require('fs');
const res = require('express/lib/response');
const router = express.Router();
const data = require('../data')

router.use(upload())

router.get('/getassignments',async function(req,res){
    // let coursename = req.params.id;
    // let username = session.user.username
    
    // let coursename = "Web Technologies";
    // let username = "user3"
    // let coursedata = 
})

router.get('/assignmentdetails/:assignmentid/:coursename', async function(req,res){
    let coursename = req.params.coursename;
    //let username = req.session.user.username;
    // let teacherusername = 'user3'
    let teacherusername = req.session.username;
    // let assignment_id = "62723161f7dadbb5b6d1cd8c"
    let assignment_id = req.params.assignmentid;
    let initialpath = '/public/uploads/'

    // try {
    //   if (!fs.existsSync("." + initialpath + username)) {
    //     fs.mkdirSync("." + initialpath + username);
    //   }
    //   if (!fs.existsSync("." + initialpath + username + "/" + coursename + "/assignments")) {
    //     fs.mkdirSync("." + initialpath + username + "/" + coursename + "/assignments");
    //   }
    // } catch (err) {
    //   console.error(err);
    // }

    let studentsperassignment = data.courses;
    let result = await studentsperassignment.studentsperassignment(coursename,teacherusername,assignment_id)
    // console.log(result);
    // console.log(result[0].studentusername)
    if(result.length >0){
        let studentusername = result[0].studentusername
        result = result[0].assignments;
        console.log(result)
        result[0].studentusername = studentusername;
        return res.render("./mainpage/gradesperassignment",{title: "grades", assignments: result, coursename: coursename, assignment_id: assignment_id.toString()})
    }
    // console.log(result[0]);
    return res.render("./mainpage/gradesperassignment",{title: "grades", assignments: result, coursename: coursename, assignment_id: assignment_id.toString()})
})

router.get('/:id',async function(req,res){
    let coursename = req.params.id;
    // let username = 'user3';
    let username = req.session.user.username;
    // console.log(id + " " + username)

    let gettotalassignments = data.courses;
    let result = await gettotalassignments.gettotalssignments(coursename,username);
    if(result.length !== 0){
        result = result[0].assignments;
        console.log(result[0].assignments);
    }
    // for(let i = 0 ; i < result.length ; i++){
    //     console.log(result[i].sequencenumber)
    //     // result[i].sequencenumber = result[i].sequencenumber.toString();
    // }
    return res.render('./mainpage/gradespage',{title: "grades page", assignments: result, coursename: coursename})
})

router.post('/updategrades',async function(req,res){
    let teacherusername = req.session.user.username; 
    // let teacherusername = 'user3'
    let studentusername = req.body.studentusername;
    let grade = req.body.grade;
    let assignment_id = req.body.assignment_id;
    let coursename = req.body.coursename;

    let updategrades = data.courses;
    let result = await updategrades.updatestudentgrades(grade,assignment_id,studentusername,teacherusername,coursename);
})


router.post('/postgrades',async function(req,res){
    let teacherusername = req.session.user.username;
    // let teacherusername = "user3";
    let bodydata = req.body;
    bodydata.teacherusername = teacherusername;
    let post_grades = data.courses;
    let result = await post_grades.postgrades(teacherusername,bodydata);
    return res.json({status: result});
})

>>>>>>> 441c236960c15741317322a14ac26e2087180329
module.exports = router