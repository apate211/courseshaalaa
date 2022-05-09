const mongoCollections = require("../config/mongoCollections");
const courses = mongoCollections.courses;
const studentcourses = mongoCollections.studentcourses;
const { ObjectId } = require("mongodb");
const upload = require("express-fileupload");
const { dropdowndata } = require("../config/mongoCollections");
const AppError = require("../middleware/appError");
const { ErrorType } = require("../middleware/enum");
const { response } = require("express");
const { query } = require("express");


async function gettagsdropdown(type){
    const dropdowndatacollection = await dropdowndata();
      const info = await dropdowndatacollection.find({}).toArray();
      if (!info) {
        throw new AppError("failed to get tags", ErrorType.not_found);
      }
      return info;

}
async function addcourse(coursename,studentusername,teacherusername,type){
    const scoursescollection = await studentcourses();
    let stud = {
        // _id: ObjectId, 
        coursename: coursename.trim(),
        studentusername: studentusername,
        teacherusername: teacherusername,
        type: type,
        assignments: []
        
    }
    const insertInfo = await scoursescollection.insertOne(stud);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add';
    console.log( await`${coursename} created`)
    const newId = insertInfo.insertedId.toString();

    // const bad = await this.get(newId);
    // return bad;
    return newId
}



async function allCourses(){
    const coursescollection = await courses();
        const insertInfo = await coursescollection
          .find({})
          .toArray();
        return insertInfo;
}

async function enrolledcourses(username){
    const coursescollection = await studentcourses();
        const enrolledinfo = await coursescollection
          .find({ $and: [{ "studentusername": username },{"type":"enrolled"}]},{ projection: { "course_id": 1, "coursename": 1, "_id": 0 } })
          .toArray();
        let enrolledcourses = []
        for( let x =0 ; x < enrolledinfo.length ; x++){
            enrolledcourses.push(await coursescollection.findOne({"course_id":enrolledinfo[x].course_id}))
        }
        console.log(enrolledcourses)
        return enrolledcourses;
}

async function recommend(username){
    const coursescollection= await courses()
    const studentcoursecollection= await studentcourses()
    const insertInfo = await coursescollection.find({}).toArray();
    const enrolledinfo = await studentcoursecollection.find({ $and: [{ "studentusername": username },{"type":"enrolled"}]},{ projection: { "coursename": 1, "_id": 0 } }).toArray();
    let recommendations

    for(i=0;i<enrolledinfo.length;i++){
        recommendations=[]
        // console.log(insertInfo[i].coursename)
        for(j=0;j<insertInfo.length;j++){
           
            if(insertInfo[j].coursename==enrolledinfo[i].coursename){
                 recommendations.push(insertInfo[j].coursetag)
                // console.log(insertInfo[j].coursetag
            }
        }
    }
    if(recommendations!==undefined){
    const recommendInfo = await coursescollection.find({"coursetag":{$in:recommendations}}).toArray();
    return recommendInfo
    }
    else{
        return insertInfo
    }
}

async function getdetailsforsubmission(id){
    let coursescollection = await courses();
    let new_obj = await coursescollection.findOne({"assignments._id": ObjectId(id)}, {projection: {"username": 1, "coursename": 1, "serialnumber": 1}})
    console.log(new_obj);
    return new_obj;
}

// async function adduploadedassignment(obj){
//     let coursescollection = await studentcourses();
//     let findone = await coursescollection.findOneAndUpdate({$and: [{ "coursename": obj.coursename},{"studentusername" : obj.studentusername},{"teacherusername" : obj.teacherusername},{"assignment.$.assignment_id": obj.assignment_id}]})
    
//     if (findone){
//         // let finddoc = coursescollection.findOne({"_id": findone._id})
//         let insert_info = coursescollection.findOneAndUpdate({query:{"_id": findone._id}},{update: {"assignment.$.path": obj.path}});
//         resobj = {
//             inserted: 1,
//             deletefile: 1,
//             path: insert_info.path
//         }
//         return resobj
//     }else
//     {
//         let insert_obj = {
//             coursename: obj.coursename,
//             studentusername : obj.studentusername, 
//             teacherusername : obj.teacherusername,
//             type: "enrolled",
//             assignments: []
//         }
//         let assignmentobject = {
//             "path": obj.path,
//             "duedate": "",
//             "grade":0,
//             "gradeposted":0,
//             "assignmenttitle": obj.assignmenttitle,
//             "assignment_id": obj.id
//         }

//         insert_obj.assignments.push(assignmentobject);

//         let new_obj = await coursescollection.insertOne(insert_obj);

//     }

//     return obj;
// }

async function finduploadedassignment(teacherusername,coursename,id){
    let coursescollection = await studentcourses();
    let find_info = coursescollection.findOne({$and:[{"assignmets.assignmet_id": id},{"teacherusername":teacherusername},{"coursename":coursename}]});
    console.log(find_info);
}

async function main(){
    console.log(await recommend("Hariom"))
//   console.log(await addcourse("aniket","user1","user3","enrolled"))
}

main()
module.exports={
    addcourse,
    allCourses,
    enrolledcourses,
    recommend,
    getdetailsforsubmission,
    // adduploadedassignment,
    finduploadedassignment
    // finduploadedassignment
}