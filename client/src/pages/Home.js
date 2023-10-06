

import React, { useEffect,useState} from "react";
import { useNavigate} from "react-router-dom";
import ContactList from './Contactlist';
import "../cssfile/Home.css";
import {
  DashboardOutlined,ContactsOutlined, LogoutOutlined,
  CalendarMonthOutlined,FilterListOutlined, DeleteOutlineOutlined,
   ImportExportOutlined,FileUploadOutlined, Search
} from "@mui/icons-material";


 const Home = ({userId, userContacts}) =>{
  const [contacts, setContacts] = useState([...userContacts]);
  const [selectedContacts, setSelectedContacts] = useState([]);
 // const csvConfig = mkConfig({ useKeysAsHeaders: true });
  
  //logout page 
    const navigate = useNavigate();
          useEffect(() => {
                 let email = sessionStorage.getItem('email');
                if(email === '' || email === null) {
                  navigate('/')
                  }
               });
    const handleLogout = () => {
      navigate("/");
    };

   //handleimport
    if(userId === "") handleLogout();
    const handleImport = () => {
        document.getElementById('importBtn').click();
    }
  //deletedicon

  const deleteSelected = async (selected) => {
    if(selected.length === 0) {
        alert("No contacts Available");
        return;
    }
    let newContacts = contacts.filter((data, i) => !selected.includes(i));
    let newSelectedContacts = selectedContacts.filter((data, i) => !selected.includes(i));
    let deleteContacts = contacts.filter((data, i) => selected.includes(i));
    setContacts(newContacts);
    setSelectedContacts(newSelectedContacts);
    await fetch("http://localhost:8000/deleteContacts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        user: userId,
        contacts: deleteContacts,
      }),
     }) }

     //selectcontent

     const selectContact = (index, value, selectAll) => {
      if(selectAll !== undefined) {
          if (selectAll) {
              const newSeletedContacts = contacts.map((data, i) => i);
              setSelectedContacts(newSeletedContacts);
          } 
          else setSelectedContacts([]);
      } else if(value) setSelectedContacts([...selectedContacts, index]);
      else setSelectedContacts(selectedContacts.filter((data, i) => i !== index));
  }

  //hadledelete and remove dublicates


  const handleDelete = (index) => {
    deleteSelected([index]);
}
const removeDuplicate = (array) => {
    const newArray = [];
    array.forEach((data) => {
        if(!newArray.find((i) => (data.phone === i.phone || data.email === i.email))){
            newArray.push(data);
        }
    })
    return newArray;

  }
     //importicon

     const handleFileImport = async (e) => {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = async function(e) {
          var jsonData = [];
          var headers = [];
          var rows = e.target.result.split("\r\n");            
          for (var i = 0; i < rows.length; i++) {
              var cells = rows[i].split(",");
              var rowData = {};
              for(var j=0;j<cells.length;j++){
                  if(i===0){
                      var headerName = cells[j].trim();
                      if(j===0) {
                          headers.push('name');
                      } else headers.push(headerName);
                  }else{
                      var key = headers[j];
                      if(key){
                          rowData[key] = cells[j].trim().replace(/['"]+/g, '');
                      }
                  }
              }
              if(i!==0){
                  jsonData.push(rowData);
              }
          }
          jsonData.length = jsonData.length - 1;
          jsonData = removeDuplicate(jsonData);
          await fetch("http://localhost:8000/importContacts", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                  user: userId,
                  contacts: jsonData,
              }),
          });
          setContacts(jsonData);
      };        
  }
  //search bar
  const searchHangle=async(event) =>
  {
    console.warn(event.target.value)
    let key =event.target.value;
    let result =await fetch(`http://localhost:8000/search/${key}`) 
       result = await result.json()
    if(result){
        setContacts(result)
    } }
  

    return(
     <div>

       <div className='col1'>
            <div className='logo'> LOGO </div>
            <div className='dashboard' ><button> <DashboardOutlined/> Dashboard </button></div>
            <div className='totalContacts'><button><ContactsOutlined/>TotalContacts </button> </div>
            <div className="gap"></div>
            <div className='logout'><button className='logoutBtn' onClick={handleLogout}> <LogoutOutlined/>Logout </button></div>
        </div>
     
       <div className='col2'>
           <div id='sub-col1'>
            <div className="head">
                <div className="title">Total Contacts </div>
                <div className="data"> <Search className="name"/><input placeholder="seach here" id="input" onChange={searchHangle}></input></div> </div></div>

          <div id='sub-col2'>
            <div className="leftbtn">
             <div className='selectData'> <button id="btn">< CalendarMonthOutlined/> Select Date </button> </div>
                      <div className='filter'><button id="btn"><FilterListOutlined/> Filter </button> </div> </div>

                  <div className='rightBtns'>
      <div className='delete button' ><button   id="btn"onClick={() => deleteSelected(selectedContacts)}><DeleteOutlineOutlined/>Delete </button></div>
                      <div className='import button' ><button  id="btn" onClick={handleImport}>< ImportExportOutlined/>Import</button>
                          <input type='file' id='importBtn' onChange={handleFileImport}/></div>
                      <div className='export button'><button  id="btn"> <FileUploadOutlined/>Export</button></div></div>
                  </div>

                  <div id='sub-col3' > <ContactList
                      contacts={contacts}
                      handleDelete={handleDelete}
                      selectContact={selectContact}
                      selectedContacts={selectedContacts}/>
                  </div>
                  
          </div>
      </div>
  
 
    )
 }
 
export default Home