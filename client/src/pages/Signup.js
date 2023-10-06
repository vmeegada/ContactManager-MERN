import React from "react"
import { useState} from "react";
import axios from "axios";
import  "../cssfile/page.css";
import Validation from  "../components/Validation";
import { useNavigate } from "react-router-dom";

const SignUp =()=>
{
    const [values,setValues] = useState({
                                          email:"",
                                          password:"",
                                          cpassword:""});//console.log(values);

    const [errors,setErrors]=useState({});

    const history =useNavigate()


    const handleInput = (e) => {
        // console.log(e.target.value) //here name means input field name

        const {name,value}=e.target;

     setValues(() => {  return {
                                   ...values,
                                   [name]:value } })  }


     const  handleSubmit =  (e)  => {

         e.preventDefault();
         setErrors(Validation(values))
           
        axios.post('http://localhost:8081/register',{
            email:values.email,
            password:values.password,
            cpassword:values.cpassword }).then((res)=>{
            // console.log(res.data);

            if(res.data === "Exist")
            {
                alert("This email is alredy exist") 
            }
            else if(res.data === 'create')
            {
              
             alert("Registration successful")
             setValues('')
             history("/Home",{state:{id:values}})  
            }
        })
       .catch((err)=>console.log("error"))
             }


    return(
        <section>
            <div className="container">     
                <div className="header">
                <p> Create New Account</p>
                </div>
                <form action="" className="form"  onSubmit={handleSubmit}>
                    <div>
                    <input type="email" onChange={handleInput}  name="email" placeholder="Email ID" id="email" />
                    {errors.email && <p style={{color:"red",textAlign:"center"}}>{errors.email}</p>}
                    </div>
                    <div>
                    <input type="password" onChange={handleInput}  name="password" placeholder="Password" id="password"/>
                    {errors.password && <p style={{color:"red", textAlign:"center"}}>{errors.password}</p>}
                    </div>
                    <div>
                    <input type="conformpassword" onChange={handleInput} name="cpassword" placeholder=" Confirm Password" id="cpassword"/>
                    {errors.cpassword && <p style={{color:"red", textAlign:"center"}}>{errors.cpassword}</p>}
                   
                    </div>
                    <button className="submit">Sign up</button>
                </form>
                
            </div>
        </section>
    )
}

export default SignUp