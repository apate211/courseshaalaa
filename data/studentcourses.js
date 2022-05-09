const mongoCollections = require("../config/mongoCollections");
const courses = mongoCollections.courses;
const studentcourses = mongoCollections.studentcourses;
const { ObjectId } = require("mongodb");
const upload = require("express-fileupload");
const { dropdowndata } = require("../config/mongoCollections");
const AppError = require("../middleware/appError");
const { ErrorType } = require("../middleware/enum");

async function gettagsdropdown(type) {
  const dropdowndatacollection = await dropdowndata();
  const info = await dropdowndatacollection.find({}).toArray();
  if (!info) {
    throw new AppError("failed to get tags", ErrorType.not_found);
  }
  return info;
}

async function addcourse(coursename, studentusername, teacherusername, type) {
  if (!coursename || !studentusername || !teacherusername || !type) {
    throw new AppError(
      "Please send all necessary details",
      ErrorType.validation_error
    );
  }
  const scoursescollection = await studentcourses();
  let stud = {
    // _id: ObjectId,
    coursename: coursename.trim(),
    studentusername: studentusername,
    teacherusername: teacherusername,
    type: type,
    assignments: [],
  };
  const insertInfo = await scoursescollection.insertOne(stud);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw new AppError("Could not add", ErrorType.unknown_error);
  console.log(await `${coursename} created`);
  const newId = insertInfo.insertedId.toString();

  // const bad = await this.get(newId);
  // return bad;
  return newId;
}

async function recommendedcourses() {
  const coursescollection = await courses();
  const insertInfo = await coursescollection.find({}).toArray();
  return insertInfo;
}

async function enrolledcourses(username) {
  if (!username) {
    throw new AppError("Please send username", ErrorType.validation_error);
  }
  const coursescollection = await studentcourses();
  const enrolledinfo = await coursescollection
    .find(
      { $and: [{ studentusername: username }, { type: "enrolled" }] },
      { projection: { coursename: 1, _id: 0 } }
    )
    .toArray();
  return enrolledinfo;
}

async function recommend(username) {
  if (!username) {
    throw new AppError("please send user name", ErrorType.validation_error);
  }
  const coursescollection = await courses();
  const studentcoursecollection = await studentcourses();
  const insertInfo = await coursescollection.find({}).toArray();
  const enrolledinfo = await studentcoursecollection
    .find(
      { $and: [{ studentusername: username }, { type: "enrolled" }] },
      { projection: { coursename: 1, _id: 0 } }
    )
    .toArray();

  for (i = 0; i < enrolledinfo.length; i++) {
    recommendations = [];
    // console.log(insertInfo[i].coursename)
    for (j = 0; j < insertInfo.length; j++) {
      if (insertInfo[j].coursename !== enrolledinfo[i].coursename) {
        recommendations.push(insertInfo[j]);
      }
    }
  }
  return recommendations;
}

// async function main(){
//     console.log(await recommend("user1"))
// }
// main()
module.exports = {
  addcourse,
  recommendedcourses,
  enrolledcourses,
  recommend,
};
