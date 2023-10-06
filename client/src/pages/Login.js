import React, { useEffect } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import  "../cssfile/page.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [visible, setVisible] = useState(false);

    const [data, setData] = useState({
        email: "",
        password: "",
    }); // console.log(data)

    const url = "http://localhost:8081/login";
    const history = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
    },[])

    function submit(e) {
        e.preventDefault();
        axios
            .post(url, {
                email: data.email,
                password: data.password,
            })
            .then((res) => {
                console.log(res.data);
                if (res.data === "Invalid") {
                    alert("user haven't Registered");
                } else if (res.data.message === "Valid" ) {
                    alert("login successful")
                    sessionStorage.setItem('email',data.email)
                    history("/Home", { state: { id: data } });
                }
            })
            .catch((err) => {
                alert("Please Enter Valid Credentials to login");
                console.log(err);
            });
    }

    function handle(e) {
        const newdata = { ...data };
        newdata[e.target.id] = e.target.value;
        setData(newdata);
        // console.log(newdata);
    }

    return (
        <section>
            <div className="container">
                <div className="header">
                    <p> Enter your credentials to access your account</p>
                </div>

                <form action="" className="form" onSubmit={(e) => submit(e)}>
                    <div>
                        <input 
                            placeholder="User ID"
                            type="email"
                            id="email"
                            onChange={(e) => handle(e)}
                            value={data.email}
                        />{" "}
                    </div>

                    <div className="password">
                        <input 
                            placeholder="Password"
                            type={visible ? "text" : "password"}
                            id="password"
                            onChange={(e) => handle(e)}
                            value={data.password}
                        />
                        <div
                            onClick={() => {
                                setVisible(!visible);
                            }}
                        >
                            {visible ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
                        </div>
                    </div>

                    <button className="submit">Sign In</button>
                    <Link className="link" to="/Signup">Sign Up</Link>
                </form>
               
            </div>
        </section>
    );
};
export default Login;
