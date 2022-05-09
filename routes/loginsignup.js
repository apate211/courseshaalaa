const express = require("express");
const session = require("express-session");
const router = express.Router();
const data = require("../data");
const userdata=data.users
const AppError = require("../middleware/appError");
const { ErrorType } = require("../middleware/enum");
const validation = require("../middleware/validation");
const mongoCollection = require("../config/mongoCollections");
const coursesCollection = mongoCollection.courses;
const studentCoursersCollection = mongoCollection.studentcourses;
const dropdownCollection = mongoCollection.dropdowndata;
const userCollection = mongoCollection.users;

router.get('/',async (req,res)=>{
  if(req.session.user){
      return "hello"
  }
  else{
      res.render('./loginsignup/login',{title:'Login'})
      return
  }
})

router.get('/signup',async (req,res)=>{
  if(req.session.user){
      return res.render('./loginsignup/login',{title:'Login'})
  }
  else{
      res.render('loginsignup/signup',{title:'Sign Up',hasErrors:false})
      return
  }
})

router.post("/signup", async function (req, res, next) {
  
  try{
    const {username,password,firstname,lastname,email,usertype}=req.body;
    let checkspaces=/\s/g
    let checkuser=/^[a-z0-9]+$/i
    let checkpassword=/^[a-z0-9\W]+$/i

    if(!username.trim()||!password.trim()){
        res.status(400).render('loginsignup/signup',{
            hasErrors:true,
            error:'Error: You did not provide Username or Password',
            title:'Signup'
        })
        return
    }
    if(typeof username!=='string'||typeof password!=='string'){
        res.status(400).render('loginsignup/signup',{
            hasErrors:true,
            error:'Error: Username or Password must be String',
            title:'Signup'
        })
        return
    }
    if(username.match(checkspaces)||password.match(checkspaces)){
        res.status(400).render('loginsignup/signup',{
            hasErrors:true,
            error:'Error: Empty Spaces not allowed',
            title:'Signup'
        })
        return
    }
    if(!username.match(checkuser)){
        res.status(400).render('loginsignup/signup',{
            hasErrors:true,
            error:'Error: Username input is invalid',
            title:'Signup'
        })
        return
    }
    if(!password.match(checkpassword)){
        res.status(400).render('loginsignup/signup',{
            hasErrors:true,
            error:'Error: Password  input is invalid',
            title:'Signup'
        })
        return
    
    }
    
    username3=username.toLowerCase()
    const storeuser= await userdata.addUser(username3,password,firstname,lastname,email,usertype)
    if(storeuser.userInserted==true){
        return res.redirect('/login')
    }
    else{
        res.status(400).render('loginsignup/signup',{
            hasErrors:true,
            error:"Error:User already exist",
            title:'Signup'
        })
        return
    }
}
catch(e){
    if(typeof e=='object'){
        if(e[1]){
            res.status(400).render('loginsignup/signup',{
                hasErrors:true,
                error:e[1],
                title:'Signup'
            })
            return
        }
        else{
            res.status(500).render('loginsignup/signup',{
                hasErrors:true,
                error:"Internal Server Error",
                title:"Signup"
            })
            return
        }
    }
}
})

router.post("/", async function (req, res) { 
  try{
    const {username,password}=req.body;
    let checkspaces=/\s/g
    let checkuser=/^[a-z0-9]+$/i
    let checkpassword=/^[a-z0-9\W]+$/i

    if(!username.trim()||!password.trim()){
        res.status(400).render('loginsignup/login',{
            hasErrors:true,
            error:'Error: You did not provide Username or Password',
            title:'Login'
        })
        return
    }



    if(typeof username!=='string'||typeof password!=='string'){
        res.status(400).render('loginsignup/login',{
            hasErrors:true,
            error:'Error: Username or Password must be String',
            title:'Login'
        })
        return
    }
    if(username.match(checkspaces)||password.match(checkspaces)){
        res.status(400).render('loginsignup/login',{
            hasErrors:true,
            error:'Error: Empty Spaces not allowed',
            title:'Login'
        })
        return
    }
    if(!username.match(checkuser)){
        res.status(400).render('loginsignup/login',{
            hasErrors:true,
            error:'Error: Username input is invalid',
            title:'Login'
        })
        return
    }
    if(!password.match(checkpassword)){
        res.status(400).render('loginsignup/login',{
            hasErrors:true,
            error:'Error: Password  input is invalid',
            title:'Login'
        })
        return
    
    }
    let username4=username.toLowerCase()
    //    console.log(username4)
       let checkus=await userdata.checkUser(username4,password)
      //  console.log(checkus.usertype)
    //    console.log("routes"+checkus)
        if(checkus.usertype=="teacher"){
            req.session.user={Username:username4}
            res.redirect("/mainpage");
            return
        }
        else if(checkus.usertype==='student'){
          req.session.user = { Username: username4 };
          res.redirect("/student");
          return
        }
        else{
            res.status(400).render('loginsignup/login',{
                hasErrors:true,
                error: "Did not provide a valid username and/or password",
                title:"Login"
            })
            return
        }

    }
    catch(e){
        if(typeof e=='object'){
            // console.log('error'+e)
            // if(e[1].length>0){
                res.status(400).render('loginsignup/login',{
                    hasErrors:true,
                    error:e[1],
                    title:'Login'
                })
                return
            // }
        }
        else{
            res.status(500).render('loginsignup/login',{
                hasErrors:true,
                error:'Internal Server Error',
                title:'Login'
            })
            return
        }
    }

})

router.get('/logout',async(req,res)=>{
  req.session.destroy()
  res.redirect('/login')
})

module.exports = router;
