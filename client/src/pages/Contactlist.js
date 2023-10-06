import React from 'react';
import '../cssfile/ContactList.css'

const ContactList = ({contacts, selectedContacts, selectContact, handleDelete}) => {
     console.log(contacts);

    const handleSelect = (e, index) => {
                const value = e.target.checked;
                selectContact(index, value, undefined); }

    const handleSelectAll = (e) => {
                const value = e.target.checked;
                selectContact(0, false, value) }

    const getValue = (i) => {
                const value = selectedContacts.includes(i);
                return value }


    return (
        <div id='contactList'>
        <table>
            <thead>
                <tr>
                    <th >
                      <div className='checkbox'>
                        <input type="checkbox"  onChange={handleSelectAll}
                                                 checked={ contacts.length > 0 && contacts.length === selectedContacts.length} />
                        <label> Name  </label>  </div>
                        </th>
                    
                        <th> <div> Designation  </div></th>
                     
                        <th> <div>  Company   </div></th>
                   
                        <th> <div> Industry  </div></th>
              
                         <th> <div> Email   </div></th>
                  
                         <th><div> Phone Number </div></th>
                     
                        <th><div> Country  </div></th>
                  
                         <th><div> Action</div></th> </tr>
                </thead>
                <tbody>
                    {contacts.map((data, i) => ( 
                    <tr key={i}>
                          <th>
                            <div>
                                <input type="checkbox"  onChange={(e) => handleSelect(e,i)} checked={getValue(i)}  />
                                <label> {data.name} </label> </div> </th>
                              <th><div>{data.designation}</div></th>
                                
                                <th><div> {data.company}</div></th>
                                
                                <th><div> {data.industry}</div></th>
                                
                                <th><div> {data.email}</div></th>
                                
                                <th><div> {data.phone}</div></th>

                                <th><div>  <button onClick={() => handleDelete(i)}> delete </button></div></th>
                     </tr>  ))}
                </tbody>
            </table>
        </div>
    );
}

export default ContactList;