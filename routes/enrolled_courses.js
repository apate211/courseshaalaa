const express = require('express');
const router = express.Router();
const data = require('../data');
const enrolledData = data.enrolled_courses;
const fs = require('fs');

router.get('enrolled/:id', async (req, res) => {
    const id = req.params.id;
    const enrolledCourse = await enrolledData.getEnrolledCourseById(id);
    const teacher = enrolledCourse.teacher;
    const courseName = enrolledCourse.course_name;
    const course = await enrolledData.getCourseByNameAndCourse(courseName, teacher);
    course.assignments = enrolledCourse.assignments;
    // course.enrolledCourseId = id;
    //console.log('Router Course: ',course)
    res.render('course/course', {course: course});
});

router.get('enrolled/:id', async (req, res) => {
    const id = req.params.id;
    const enrolledCourse = await enrolledData.getEnrolledCourseById(id);
    const teacher = enrolledCourse.teacher;
    const courseName = enrolledCourse.course_name;
    const course = await enrolledData.getCourseByNameAndCourse(courseName, teacher);
    course.assignments = enrolledCourse.assignments;
    // course.enrolledCourseId = id;
    //console.log('Router Course: ',course)
    res.render('course/course', {course: course});
});


module.exports=router;