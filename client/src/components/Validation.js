function Validation(values)
{
   let error={}
   const email_pattern=/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
   const password_pattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$/;
   if(values.email=== "")
  {
   error.email="Email Id can't be Empty "   
  }
  else if(!email_pattern.test(values.email))
  {
    error.email="Enter valid Email Id"
  }
  if(values.password=== "")
  {
   error.password="password can't be Empty "   
  }
  else if(!password_pattern.test(values.password))
  {
    error.email="Enter valid password"
  }
  if(values.cpassword === "" || values.cpassword !== values.password)
  {
   error.cpassword ="Password not matched"
  }
  return error;
 
}
export default Validation