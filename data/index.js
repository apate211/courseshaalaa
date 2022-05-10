const usersData = require('./users')
const coursesData = require('./courses')
const studentcourses=require('./studentcourses')
const reviews=require("./reviews")
const enrolledData=require('./enrolled_courses.js')

module.exports = {
    users: usersData,
    courses: coursesData,
    studentcourses:studentcourses,  
    reviews: reviews,
    enrolled_courses: enrolledData
}