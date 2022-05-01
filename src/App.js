import React, { useState, Fragment,useEffect } from "react";
import "./App.css";
import ReadOnlyRow from "./components/ReadOnlyRow";
import EditableRow from "./components/EditableRow";

const App = () => {
  const [data,setData]=useState([]);
  const getData = ()=>{
    fetch('http://localhost:8000/data')
    .then(function(response){
      return response.json();
    })
    .then(function(myJson){
      setData(myJson)
    });
  };
  useEffect(()=>{
    getData()
  },[])
  console.log(data)
  const [addFormData, setAddFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
  });

  const [editFormData, setEditFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
  });

  const [editContactId, setEditContactId] = useState(null);

  const handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;
    
    setAddFormData(newFormData);
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);

  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();

    const newContact = {
      id: data.id+1,
      fullName: addFormData.fullName,
      address: addFormData.address,
      phoneNumber: addFormData.phoneNumber,
      email: addFormData.email,
    };
    fetch('http://localhost:8000/data',{
      method: 'POST',
      headers:{"Content-type":"application/json"},
      body: JSON.stringify(newContact)
    })
    const newContacts = [...data, newContact];
    setData(newContacts);
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    const editedContact = {
      id: editContactId,
      fullName: editFormData.fullName,
      address: editFormData.address,
      phoneNumber: editFormData.phoneNumber,
      email: editFormData.email,
    };

    const newContacts = [...data];

    const index = data.findIndex((contact) => contact.id === editContactId);

    newContacts[index] = editedContact;
    fetch('http://localhost:8000/data/' + editContactId,{
      method: 'PUT',
      headers:{"Content-type":"application/json"},
      body: JSON.stringify(editedContact)
    })
    setData(newContacts);
    setEditContactId(null);
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);

    const formValues = {
      fullName: contact.fullName,
      address: contact.address,
      phoneNumber: contact.phoneNumber,
      email: contact.email,
    };

    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = (contactId) => {
    const newContacts = [...data];

    const index = data.findIndex((contact) => contact.id === contactId);

    newContacts.splice(index, 1);
    fetch('http://localhost:8000/data/' + contactId,{
      method: 'DELETE'
    })
    setData(newContacts);
    
  };
  const [addShow, setAddShow] = useState(false)
  const handleAddShow = (event) =>{
    if(addShow === false && event.key === 'Enter'){
      setAddShow(true);
    };
    if(addShow === true && event.key === 'Enter'){
      setAddShow(false);
    };
  };
  return (
    <div className="app-container" onKeyPress={handleAddShow} tabindex="0">
      <form onSubmit={handleEditFormSubmit}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {data.map((contact) => (
              <Fragment key={data.id}>
                {editContactId === contact.id ? (
                  <EditableRow
                    key={data.id}
                    editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                    handleCancelClick={handleCancelClick}
                  />
                ) : (
                  <ReadOnlyRow
                    key={data.id}
                    contact={contact}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </form>

      {
      addShow?
      <form onSubmit={handleAddFormSubmit}>
        <input
          type="text"
          name="fullName"
          required="required"
          placeholder="Enter a name..."
          onChange={handleAddFormChange}
        />
        <input
          type="text"
          name="address"
          required="required"
          placeholder="Enter an addres..."
          onChange={handleAddFormChange}
        />
        <input
          type="text"
          name="phoneNumber"
          required="required"
          placeholder="Enter a phone number..."
          onChange={handleAddFormChange}
        />
        <input
          type="email"
          name="email"
          required="required"
          placeholder="Enter an email..."
          onChange={handleAddFormChange}
        />
        <button type="submit">Add</button>
      </form>
      :null
      }
    </div>
  );
};

export default App;
