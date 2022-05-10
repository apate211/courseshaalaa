const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const courses = mongoCollections.courses;
const studentcourses =mongoCollections.studentcourses;
const { ObjectId } = require('mongodb');
const upload = require('express-fileupload');
const { dropdowndata } = require('../config/mongoCollections');

module.exports = { 
    gettagsdropdown: async(type)=>{
        const dropdowndatacollection = await dropdowndata();
        try{
            const info = await dropdowndatacollection.find({}).toArray();
            return info;
        }catch(e){
            throw "error in loading dropdown data"
        }
        
    },
    addcourse: async (course)=>{
        const coursescollection = await courses()
        course.deployed = 0;
        try{
            const insertInfo = await coursescollection.updateOne({coursename: course.coursename, username: course.username},
                {  
                    $setOnInsert: { 
                        "coursename": course.coursename,
                        "coursetag": course.coursetag,
                        "description": course.description,
                        "startdate": course.startdate,
                        "enddate": course.enddate,
                        "username": course.username,
                        "videos": [],
                        "assignments": [],
                        "deployed": course.deployed
                    } 
                },{upsert:true});
            if(insertInfo.upsertedCount == 0){
                throw "course already exists"
            } 
            return "true";
        }catch(e){
            throw "error in adding the course";
        }
        
    },

    getcourses: async (username)=>{
        const coursescollection = await courses()
        let not_deployed_courses;
        let deployed_courses;

        try{
            not_deployed_courses = await coursescollection.find({ username: username, deployed: 0 }).toArray();
            deployed_courses = await coursescollection.find({ username: username, deployed: 1 }).toArray();
        }catch(e){
            throw "not able to catch the courses";
        }

        final_output = {};
        final_output.not_deployed_courses = not_deployed_courses;
        final_output.deployed_courses = deployed_courses;

        return final_output;
    },
    
    getcourse: async (coursename,username)=>{
        const coursescollection = await courses()
        try{
            const insertInfo = await coursescollection.findOne({ "username": username, "coursename": coursename});
            return insertInfo;
        }catch(e){
            throw "error in fetching couses from database"
        }
    },

    getstudentsenroled: async (coursename,username)=>{
        const coursescollection = await studentcourses()
        let insertInfo 
        try{
            insertInfo= await coursescollection.find({$and: [{ "teacherusername": username, "coursename": coursename}]}, {projection: {"studentusername" : 1, "assignments" : 1, "_id":0}}).toArray();
        }catch(e){
            throw "error in fetching enrolled student"
        }
        let usersarray = []
        for(x of insertInfo){
            let count = 0
            let ans = 0
            let userobj = {}

            for(y of x.assignments){
                ans = ans + y.grade;
                count++;
            }

            let average = ans / count;  // calculating average for the perticular subject;

            const userscollection = await users();
            let userinfo;
            try{
                userinfo = await userscollection.findOne({$and: [{ "username": x.studentusername, "usertype": "student"}]}, {projection: {"firstname": 1, "lastname": 1, "_id":0}});
            }catch(e){
                throw "error in fetching enrolled student"
            }

            userobj.firstname = userinfo.firstname
            userobj.lastname = userinfo.lastname
            userobj.grade = average;
            
            usersarray.push(userobj);
            // const grades
        }
        return usersarray;
    },

    deploycourse: async(coursename,username)=>{
        const coursescollection = await courses()
        try{
            const insertInfo = await coursescollection.findOne({$and: [{"username": username, "coursename": coursename}]});
            console.log(insertInfo)

            // if(checkvalid(InsertInfo)){
            if(true){
                let updateInfo;
                try{
                    updateInfo = await coursescollection.updateOne({$and: [{"coursename": coursename}, {"username": username}]} , {$set: { "deployed" : 1} })
                    console.log(updateInfo);
                    if(updateInfo.modifiedCount === 1){
                        return true;
                    }
                }catch(e){
                    throw "not able to updateassignment"
                }
            }
            return insertInfo;
        }catch(e){
            throw "error in fetching couses from database"
        }
    },

    //assignments
    addassignment: async(assignment,username)=>{
        assignment._id = ObjectId();
        const coursescollection = await courses();
        let insertInfo;
        try{
            insertInfo = await coursescollection.find({$and: [{"coursename":assignment.coursename}, {"username":username}]},{projection: {"assignments":{$slice: -1}, "_id":0}}).toArray();
        }catch(e){
            throw "error in adding assignments"
        }
        if(insertInfo[0].assignments[0]){
            assignment.sequencenumber = Number(insertInfo[0].assignments[0].sequencenumber) + 1;
        }
        else{
            assignment.sequencenumber = 1
        }
        console.log(assignment.sequencenumber)
        try{
            insertInfo = await coursescollection.update({$and: [{"coursename":assignment.coursename}, {"username":username}]}, {$push: {"assignments": assignment}})
        }catch(e){
            throw "error in adding assignments"
        }
        return insertInfo;
    },
 
    getallasignments: async(coursename,username)=>{
        const coursescollection = await courses();
        let findInfo
        try{
            findInfo = await coursescollection.find({$and: [{"coursename":coursename}, {"username":username}]}, {projection : {"assignments": 1, "_id":0}}).toArray();
        }catch(e){
            throw "error in getting getting assignment";
        }
        return findInfo;
    },

    deleteassignment: async(coursename,username,sequencenumber)=>{
        const coursescollection = await courses();

        sequencenumber = sequencenumber.split("_")[1];
        let findvalue
        try{
            findvalue = await coursescollection.updateMany({$and: [{"coursename":coursename}, {"username":username}]}, {$pull: { "assignments" : {"sequencenumber" : Number(sequencenumber)}}});
            console.log(findvalue)
        }catch(e){
            throw "not able to delete assignment"
        }
        let updateInfo2;
        try{
            updateInfo2 = await coursescollection.updateMany({$and: [{"coursename":coursename}, {"username":username}]} , {$inc : { "assignments.$[elements].sequencenumber": -1}},{ "arrayFilters": [  { "elements.sequencenumber": {$gt : Number(sequencenumber)}}] });
        }catch(e){
            throw "not able to delete assignment"
        }
        console.log(updateInfo2);
        
        return ;
    },

    updateassignment: async(assignment,username)=>{
        const coursescollection = await courses();

        // sequencenumber = object.sequencenumber.split("_")[1];
        let updateInfo;
        try{
            updateInfo = await coursescollection.updateOne({$and: [{"coursename": assignment.coursename}, {"username": username}, { "assignments.sequencenumber": Number(assignment.sequencenumber)}]} , {$set: { "assignments.$.assignment_name": assignment.assignment_name, "assignments.$.startdate": assignment.startdate, "assignments.$.enddate": assignment.enddate,"assignments.$.assignmentdescription": assignment.assignmentdescription} })
        }catch(e){
            throw "not able to updateassignment"
        }
        console.log(updateInfo)

        return true;
    },

    //videos
    addvideo: async(video)=>{
        video._id = ObjectId();
        let coursescollection = await courses();
        try{
            insertInfo = await coursescollection.find({$and: [{"coursename": video.coursename}, {"username":video.username}]},{projection: {"videos":{$slice: -1}, "_id":0}}).toArray();
        }catch(e){
            throw "not able to addvideo";
        }
        if(insertInfo[0].videos[0]){
            video.sequencenumber = Number(insertInfo[0].videos[0].sequencenumber) + 1;
        }
        else{
            video.sequencenumber = 1
        }
        console.log(video.sequencenumber)

        try{
            insertInfo = await coursescollection.update({$and: [{"coursename":video.coursename}, {"username":video.username}]}, {$push: {"videos": video}})
        }catch(e){
            throw "not able to addvideo";
        }
        return;
    },

    getallvideodetails: async(coursename,username)=>{
        const coursescollection = await courses();
        let findInfo
        try{
            findInfo = await coursescollection.find({$and: [{"coursename":coursename}, {"username":username}]}, {projection : {"videos": 1, "_id":0}}).toArray();
        }catch(e){
            throw "not able to get all videos"
        }
        return findInfo;
    },

    deletevideo: async(coursename,username,sequencenumber)=>{
        const coursescollection = await courses();
        
        let findvalue;
        try{
            findvalue = await coursescollection.updateMany({$and: [{"coursename":coursename}, {"username":username}]}, {$pull: { "videos" : {"sequencenumber" : Number(sequencenumber)}}});
        }catch(e){
            throw "not able to delete videos"
        }
        console.log(findvalue)

        let updateInfo2;
        try{ 
        updateInfo2 = await coursescollection.updateMany({$and: [{"coursename":coursename}, {"username":username}]} , {$inc : { "videos.$[elements].sequencenumber": -1}},{ "arrayFilters": [  { "elements.sequencenumber": {$gt : Number(sequencenumber)}}] });
        }catch(e){
            throw "not able to delete videos"
        }
        console.log(updateInfo2);
        
        return;
    },

    //assignments
    gettotalssignments: async(coursename,username)=>{
        const coursescollection = await courses();

        let assignments
        try{
            assignments = await coursescollection.find({$and: [{"coursename":coursename}, {"username":username}]},{projection: {"assignments":1}}).toArray();
        }catch(e){
            return "error in getting all assignments throgh database"
        }
        return assignments;
    },

    studentsperassignment: async(coursename,teacherusername,assignment_id)=>{
        const studentcoursescollection = await studentcourses();

        let assignments
        try{ 
            assignments = await studentcoursescollection.find({$and: [{"coursename":coursename}, {"teacherusername":teacherusername},{"assignments.assignment_id": ObjectId(assignment_id)}]},{projection: {"assignments":1, "studentusername": 1, "_id":0}}).toArray();
        }catch(e){
            throw "error in getting student assignments from database";
        }
        return assignments;
    },

    updatestudentgrades: async(grade,assignment_id,studentusername,teacherusername,coursename)=>{
        const studentcoursescollection = await studentcourses();
        let info;
        try{
            info = await studentcoursescollection.updateOne({$and: [{"coursename":coursename}, {"teacherusername":teacherusername}, {"studentusername": studentusername}, {"assignments.assignment_id": ObjectId(assignment_id)}]} , {$set: {"assignments.$.grade" : Number(grade)}});
        }catch(e){
            throw "error in updating grades in database";
        }
        console.log(info);
        return false;
    },

    postgrades: async(teacherusername,data)=>{
        const studentcoursescollection = await studentcourses();
        for(x of data.assignment_details){
            let info; 
            try{
                info = await studentcoursescollection.updateOne({$and: [{"coursename":data.coursename}, {"teacherusername":teacherusername}, {"studentusername": x.studentusername}, {"assignments.assignment_id": ObjectId(data.assignment_id)}]} , {$set: {"assignments.$.grade" : Number(x.grade), "assignments.$.gradesposted" : 0}})
            }catch(e){
                throw "error in posting the grades in datbase"
            }
            console.log(info);
        }
        return true;
    }
}
