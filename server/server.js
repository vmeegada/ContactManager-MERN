const express = require("express");//help to set up server
const mongoose =require("mongoose");//connect to schema database
const cors = require('cors');// connect to database and api and minimize errors
const bodyParser = require("body-parser");//our data injson
const bcrypt =require("bcrypt");//hash or hide our password
const jwt =require('jsonwebtoken');//token followse the user sigin token add and remove like
const User =require('./models/usersSchema')
const contacts =require('./models/contacts')

const SECRET_KEY ="secret_key"
//connetc to express app
const app =express();




//connetc to express Mongoose
//pasword:paeYmURDzTdU5xdH username:contactmanager
const DB ="mongodb+srv://contactmanager:paeYmURDzTdU5xdH@cluster0.9kngod9.mongodb.net/UsersDB?retryWrites=true&w=majority"
mongoose.connect(DB, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{
    app.listen(8081,()=>{
        console.log(" Server is connected to port 8081 and db is conneted")})
    })
.catch(()=>console.log("db is  not connected"))

//middleware

app.use(bodyParser.json())
app.use(cors()) 


//Routes
//create-POST,Read-GET,Update-PATCH or PUT,Delete- DELETE REQUESTS
//USER SIGNUP


//POST SIGNUP

app.post('/register' , async(req,res) =>{
    const {email,password,cpassword} =req.body
    const password_pattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$/;
    if(!email || !password ||!cpassword)
    {
        res.json("fill the all detailes")
    }
    try{
    
        const user =await User.findOne({email:email});
        if(user){
            res.json("Exist")
        }
        else if(password !== cpassword  || !password_pattern){
            res.json("password not matched")
        }
        else{
        const hashedPassword = await bcrypt.hash(password,10);
        const hashedcPassword =await bcrypt.hash(cpassword,10);
        const newUser =new User({email,password:hashedPassword,cpassword:hashedcPassword})
        const storedata=await newUser.save()
        res.json("create")
        res.json({message:'created',
         data:storedata})
        }
    }
    catch (error)
    {
        res.json('error')
    }

})

//Get signup

app.get("/register" ,async(req,res)=>{
    try{
        const users =await User.find()
       res.status(200).json(users)
    }
    catch (error)
    {
        res.status(500).json({error:'Unable to get users'})
    }
})


//GET LOGIN


app.post('/login' , async(req,res) =>{
    
        const {email,password} = req.body
        const user =await User.findOne({email})
        const isPasswordValied = await bcrypt.compare(password,user.password)
        if(!user || !isPasswordValied)
        {
            res.json('Invalid')
        }
        else
        {
         const token =jwt.sign({email:user.email},SECRET_KEY, {expiresIn:10,})
         res.json({message:"Valid",data:token})

         }
         
        }
        
       )

       //contacts

       const verfiyFwt = (req,res,next)=>{
        const token = req.headers.authorization;
        if(!token){
            next();
        }
        const decodeing = jwt.verify(token,process.env.SECRET_KEY);
        req.user = decodeing;
        return next();
    }
    app.use(verfiyFwt);


     app.get("/contacts_details",(req,res)=>{
    console.log(req.user)
    res.send("contact page..")
   })
app.post("/importContacts", async (req, res) => {
    try {
      let user = req.body.user;
      let contact = req.body.contacts.map((data) => {
        return {
          company: data.company,
          country: data.country,
          name: data.name,
          email: data.email,
          phone: data.phone,
          industry: data.industry,
          designation: data.designation,
          user,
        };
      })
      if(contact.length !== 0) {
        await contact.forEach(async (obj) => {
          await contacts.create({...obj});
        })
      }
      res.send({
        message: "success",
        error: false
      })
    } catch (err) {
      res.send({
        message: err,
      });
    }
  })
  
  app.post("/deleteContacts", async(req, res) => {
    try {
      let contact = req.body.contacts;
      let user = req.body.user;
      if(contact.length !== 0) {
          contact.forEach(async (data) => {
            await contacts.deleteOne({...data, user});
          })
      }
    } catch (err) {
      res.send({
        message: err,
      });
    }
  })
  //search
  app.get("/search/:key",async(res,req)=>{
    console.log(req.params.key)
    let search=req.params.id
    let data =await contacts.find(
     
        {"$or":
         [
           { "name" :{$regex :req.param.key}},
           { "email" :{$regex :req.param.key}},
           { "Company*" :{$regex :req.param.key}}
          ]
         }
    )
    res.send(data)
 })


