const connection = require('./config/mongoConnection');
const mongoCollections = require("./config/mongoCollections");
const courses=require('./data/courses');
const studentcourses = mongoCollections.studentcourses;

const studen=require('./data/studentcourses')
const reviews= require('./data/reviews')
const users= require('./data/users')

const { ObjectId } = require('mongodb');


const main = async () => {
    const db = await connection.connectToDb();
    await db.dropDatabase()
try{

    console.log(await courses.addCourseForSeed("Web","programming",
    "In this course, we'll look at the JavaScript language, and how it supports the Object-Oriented pattern, with a focus on the unique aspect of how JavaScript approaches OO. We'll explore a brief introduction to the jQuery library, which is widely used to do in-browser manipulation of the Document Object Model (DOM) and event handling. You'll also learn more about JavaScript Object Notation (JSON), which is commonly used as a syntax to exchange data between code running on the server (i.e. in PHP) and code running in the browser (JavaScript/jQuery).",
    "2022-05-16","2022-06-30","user3",[],[],0))

    console.log(await courses.addCourseForSeed("Web 2","programming","The first two courses in this Specialization cover front-end frameworks: Bootstrap 4 and React. On the server side, you’ll learn to implement NoSQL databases using MongoDB, work within a Node.js environment and Express framework, and communicate to the client side through a RESTful API. Learners enrolling in this Specialization are expected to have prior working knowledge of HTML, CSS and JavaScript.",
        "2022-04-30","2022-06-30","user3",[],[],"Deployed"))

    console.log(await courses.addCourseForSeed("Data","data science","The Data Mining Specialization teaches data mining techniques for both structured data which conform to a clearly defined schema, and unstructured data which exist in the form of natural language text. Specific course topics include pattern discovery, clustering, text retrieval, text mining and analytics, and data visualization. The Capstone project task is to solve real-world data mining challenges using a restaurant review data set from Yelp.",
    "2022-05-16","2022-07-30","user2",[],[],"Deployed"))

    console.log(await courses.addCourseForSeed("Web Mining","SEO",
    "In this course, we'll look at the JavaScript language, and how it supports the Object-Oriented pattIn this Specialization, learners develop advanced Excel Skills for Business.  Upon completing the four courses in this Specialization, learners can design sophisticated spreadsheets, including professional dashboards, and perform complex calculations using advanced Excel features and techniques. Learners have acquired the skills to manage large datasets efficiently, extract meaningful information from datasets, present data and extract information effectivelyern, with a focus on the unique aspect of how JavaScript approaches OO. We'll explore a brief introduction to the jQuery library, which is widely used to do in-browser manipulation of the Document Object Model (DOM) and event handling. You'll also learn more about JavaScript Object Notation (JSON), which is commonly used as a syntax to exchange data between code running on the server (i.e. in PHP) and code running in the browser (JavaScript/jQuery).",
    "2022-05-16","2022-07-30","user3",[],[],"Deployed"))

    console.log(await courses.addCourseForSeed("TCP/IP","networks",
    " In this course ‘Introduction to TCP/IP,’ you will learn the operational functions of Internet technologies (which include IPv4, IPv6, TCP, UDP, addressing, routing, domain names, etc.) and your PC/laptop's security and gateway Internet setup and basic principles. In addition, through a simple Wireshark experiment, you will see the TCP/IP packets and security systems in action that are serving your PC/laptop, that serves you.",
    "2022-05-16","2022-08-30","user1",[],[],"Deployed"))

    console.log(await courses.addCourseForSeed("Cyber Sec","hacking",
    "Introduction to Cyber Security was designed to help learners develop a deeper understanding of modern information and system protection technology and methods. The learning outcome is simple: We hope learners will develop a lifelong passion and appreciation for cyber security, which we are certain will help in future endeavors. Students, developers, managers, engineers, and even private citizens will benefit from this learning experience. Special customized interviews with industry partners were included to help connect the cyber security concepts to live business experiences."
    ,"2022-05-16","2022-10-30","user1",[],[],"Deployed"))

    console.log(await courses.addCourseForSeed("Data Structures","algorithms",
    "A good algorithm usually comes together with a set of good data structures that allow the algorithm to manipulate the data efficiently. In this online course, we consider the common data structures that are used in various computational problems. You will learn how these data structures are implemented in different programming languages and will practice implementing them in our programming assignments. This will help you to understand what is going on inside a particular built-in implementation of a data structure and what to expect from it. You will also learn typical use cases for these data structures."
    ,"2022-05-16","2022-11-30","user2",[],[],"Deployed"))

    
    console.log(await courses.addCourseForSeed("Java","java",
    "In this course, we'll look at the JavaScript language, and how it supports the Object-Oriented pattIn this Specialization, learners develop advanced Excel Skills for Business.  Upon completing the four courses in this Specialization, learners can design sophisticated spreadsheets, including professional dashboards, and perform complex calculations using advanced Excel features and techniques. Learners have acquired the skills to manage large datasets efficiently, extract meaningful information from datasets, present data and extract information effectivelyern, with a focus on the unique aspect of how JavaScript approaches OO. We'll explore a brief introduction to the jQuery library, which is widely used to do in-browser manipulation of the Document Object Model (DOM) and event handling. You'll also learn more about JavaScript Object Notation (JSON), which is commonly used as a syntax to exchange data between code running on the server (i.e. in PHP) and code running in the browser (JavaScript/jQuery).",
    "2022-05-16","2022-12-30","user2",[],[],"Deployed"))

    console.log(await studen.addcourse("Web","Sahil","user3","enrolled"))
    console.log(await studen.addcourse("Data Structures","Sahil","user2","enrolled"))
    console.log(await studen.addcourse("Web 2","Sahil","user3","enrolled"))
    console.log(await studen.addcourse("Web Mining","Sahil","user3","not_enrolled"))


    console.log(await studen.addcourse("Web 2","Hariom","user3","enrolled"))
    console.log(await studen.addcourse("Web","Hariom","user3","enrolled"))
    console.log(await studen.addcourse("Data Structures","Hariom","user2","enrolled"))
    console.log(await studen.addcourse("Web Mining","Hariom","user3","not_enrolled"))


    console.log(await studen.addcourse("TCP/IP","Aniket","user1","enrolled"))
    console.log(await studen.addcourse("Java","Aniket","user2","enrolled"))
    console.log(await studen.addcourse("Cyber Sec","Aniket","user1","not_enrolled"))

    console.log(await studen.addcourse("Java","Vanshika","user2","enrolled"))
    
    console.log(await studen.addcourse("TCP/IP","Kevin","user1","enrolled"))
    console.log(await studen.addcourse("Cyber Sec","Kevin","user1","enrolled"))
    
    console.log(await reviews.addreview("Web","Sahil","user3","4.5","Highly recommended course. I liked all the concept covered in this."))
    console.log(await reviews.addreview("Web 2","Sahil","user3","3.5","Not as good as Web 1 but still covers all the concepts."))
    console.log(await reviews.addreview("Data Structures","Sahil","user2","4.5","Nobody should miss out on this course."))
    
    console.log(await reviews.addreview("Web","Hariom","user3","3.5"))
    console.log(await reviews.addreview("Data Structures","Hariom","user2","4","Love this course!"))

    console.log(await reviews.addreview("TCP/IP","Aniket","user1","2.5","Would rather learn from a friend then here. Very static. Slept midway"))
    console.log(await reviews.addreview("Java","Aniket","user2","3.0","Good course structure but need to improve a lot on the way it was taught."))

    console.log(await reviews.addreview("Java","Vanshika","user2","5","Best course EVER!!"))

    console.log(await reviews.addreview("Cyber Sec","Kevin","user1","4.5","Good course. Tough assignments though!"))




}
catch(e){
    console.log(e)
}
try{
    console.log(await courses.addcourse("Web tec","Sahil","user3","enrolled"))
    // console.log(await studen.addcourse("Data","Sahil","user3","not_enrolled"))
    // console.log(await studen.addcourse("Structures","Kevin","user3","not_enrolled"))
    // console.log(await studen.addcourse("Web 2","Hariom","user3","not_enrolled"))
    // console.log(await studen.addcourse("Web Mining","Hariom","user3","not_enrolled"))
    // console.log(await studen.addcourse("TCP","Aniket","user3","not_enrolled"))
    // console.log(await studen.addcourse("IP","Aniket","user3","not_enrolled"))
    // console.log(await studen.addcourse("Java","Vanshika","user3","not_enrolled"))

}
catch(e){
    console.log(e)
}





console.log(await "---------------------------------------------------------------------------")
}
main()