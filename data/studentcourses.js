const mongoCollections = require("../config/mongoCollections");
const courses = mongoCollections.courses;
const studentcourses = mongoCollections.studentcourses;
const { ObjectId } = require("mongodb");
const upload = require("express-fileupload");
const { dropdowndata } = require("../config/mongoCollections");
const AppError = require("../middleware/appError");
const { ErrorType } = require("../middleware/enum");


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
        assignments: [],
        videos:[]
        
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



async function main(){
    console.log(await recommend("Hariom"))
//   console.log(await addcourse("aniket","user1","user3","enrolled"))
}
main()
module.exports={
    addcourse,
    allCourses,
    enrolledcourses,
    recommend
}