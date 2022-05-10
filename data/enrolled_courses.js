const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const courses = mongoCollections.courses;
const studentcourses =mongoCollections.studentcourses;
const { ObjectId } = require('mongodb');
const upload = require('express-fileupload');
const { dropdowndata } = require('../config/mongoCollections');

const getCourseByNameAndCourse = async(courseName, username) => {
    const courses = await courseCollection();
    const course = await courses.findOne({$and:[{username: username}, {coursename: courseName}]})
    //console.log('Course: ',course)
    return course;
}

const getAssigmentById = async(id) => {
    const assignments = await assignmentCollection();
    const assignment = await assignments.findOne({_id: ObjectId(id)});
    //console.log('Data Assigment:',assignment)
    return assignment;
}

async function onEnrollment(id,studentusername)
{
    try{
        const coursescollection = await courses();
    const course = await coursescollection.findOne({"_id": ObjectId(id)})

    let obj = {
        _id:ObjectId(),
        coursename : course.coursename,
        teachersusername : course.username,
        studentusername: studentusername,
        type: "enrolled",
        assignments: [],
        videos: 1, 
        course_id: ObjectId(id)
    }

    const studentcoursescollection = await studentcourses();
    const insertInfo = await studentcoursescollection.updateOne({"coursename": course.coursename, "teacherusername": course.username, "studentusername": studentusername},
        {  
            $setOnInsert: { 
                "coursename": course.coursename,
                "teachersusername" : course.username,
                "studentusername": studentusername,
                "type": "enrolled",
                "assignments": [],
                "videos": 1,
                "course_id": ObjectId(id)
            } 
        },{upsert:true});
    if(insertInfo.upsertedCount == 0){
        throw "course already exists"
    } 
    return obj;

//     const enrolledCollection = await enrolledCourses();
//     const assignmentsCollection = await assignments();

//     let username=user.username;
//     let teacher=user.teacher;
//     let course_name=user.course_name;
    
//     const assignmentlist = await assignmentsCollection.find({teacher:teacher,course_name:course_name}).toArray();
//     if (!assignmentlist) throw 'Could not get all bands';

//    console.log(assignmentlist)

//    for(i in assignmentlist)
//    {
//         delete assignmentlist[i].teacher;
//         delete assignmentlist[i].course_name;
//         assignmentlist[i].grades=0;
//         assignmentlist[i].studentFile=""

//    }

//    console.log(assignmentlist)

//     let obj={
//                 username:username,
//                 teacher:teacher,
//                 course_name:course_name,
//                 videos:0,
//                 assignments:assignmentlist,
//                 type:"enrolled"
//     }
//     const insertInfo = await enrolledCollection.insertOne(obj);
    if(!insertInfo.acknowledged){
        throw "Error inserting values"
    }
        else return insertInfo.acknowledged;
    }catch(e){
        console.log(e);
    }
}

const updateVideoSequenceByUserAndCourse = async(id, seq) => {
    const studentcoursescollection = await studentcourses();
    const res = await studentcoursescollection.updateOne({"_id":ObjectId(id)}, 
        {$set : {"videos.$.sequencenumber": seq}});
        if(res.upsertedCount == 0){
            throw "Couldn't update video sequence"
        } 
}


const getVideoSequenceByUserAndCourse = async(courseName, username) => {
    const stucoursescollection = await studentcourses();
    const enrolledCourse = await stucoursescollection.findOne({$and:[{"teacherusername": username}, {"coursename": courseName}]})
    return enrolledCourse.videos;
}

const getEnrolledCourseById = async(id) => {
    const coursescollection = await courses();
    const enrolledCourse = await coursescollection.findOne({_id: ObjectId(id)});
    console.log(enrolledCourse)
    return enrolledCourse;
}

async function checkIfFinished(id)
{
    const enrolledCollection = await enrolledCourses();
    const enrolledCourse = await enrolledCollection.findOne({_id: ObjectId(id)});

    let assignmentlist = enrolledCourse.assignments;

    for(i in assignmentlist)
    {
        if(assignmentlist.studentFile="")
        {
            return false;
        }
    } 
    
    return true;

}

async function getEnrolledCourses(user)
{
    try{
        const enrolledCollection = await enrolledCourses();
        username=user.username;
        const studentCourses = await enrolledCollection.find({username:username}).toArray();
        return studentCourses;
    }
    catch(e){
        console.log(e)
    }

}

async function onAssSubmit(user)
{
    try{
        let username=user.username;
        let teacher=user.teacher;
        let course_name=user.course_name;
        let assignment_number=user.assignment_number;

        
        const enrolledCollection = await enrolledCourses();   
        const assignmentsCollection = await assignments();
        
        
        //const enrolledList = await enrolledCollection.findOne({teacher:teacher,course_name:course_name,username:username});
        // console.log(enrolledList)

        // if (enrolledList === null) throw 'error';

        
        const updated = await enrolledCollection.update(
            {$and:[{"teacher":teacher},{"course_name":course_name},{"username":username},{"assignments.assignment_number":"1"}]},
            { $set: { "assignments.$.file" : "updated_path" } }
            //{ $set: { "videos" : "updated_path" } }
        )
        if(!updated.acknowledged){
            throw "Error inserting values"
        }

    }catch(e){(console.log(e))};
}

module.exports={
    getEnrolledCourseById,
    onEnrollment,
    getVideoSequenceByUserAndCourse,
    updateVideoSequenceByUserAndCourse,
    getCourseByNameAndCourse

}