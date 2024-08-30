import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Formtable from './components/Formtable';


axios.defaults.baseURL = "http://localhost:8080/";

function App() {
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "" });
  const [formDataEdit, setFormDataEdit] = useState({ name: "", email: "", mobile: "", _id: "" });
  const [dataList, setDataList] = useState([]);

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/create", formData);
      if (data.success) {
        setAddSection(false);
        alert(data.message);
        getFetchData();
        setFormData({ name: "", email: "", mobile: "" });
      }
    } catch (error) {
      console.error("Error creating entry:", error);
      alert("An error occurred while creating the entry. Please try again.");
    }
  };

  const getFetchData = async () => {
    try {
      const { data } = await axios.get("/");
      if (data.success) {
        setDataList(data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getFetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete("/delete/" + id);
      if (data.success) {
        getFetchData();
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("An error occurred while deleting the entry. Please try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/update", formDataEdit);
      if (data.success) {
        getFetchData();
        alert(data.message);
        setEditSection(false);
      }
    } catch (error) {
      console.error("Error updating entry:", error);
      alert("An error occurred while updating the entry. Please try again.");
    }
  };

  const handleEditOnChange = (e) => {
    const { value, name } = e.target;
    setFormDataEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (el) => {
    setFormDataEdit(el);
    setEditSection(true);
    setAddSection(false); // Ensure add section is closed
  };

  return (
    <div className="container">
      <button className="btn btn-add" onClick={() => { setAddSection(true); setEditSection(false); }}>Add</button>

      {addSection && (
        <Formtable
          handleSubmit={handleSubmit}
          handleOnChange={handleOnChange}
          handleclose={() => setAddSection(false)}
          rest={formData}
          formTitle="Add"
        />
      )}

      {editSection && (
        <Formtable
          handleSubmit={handleUpdate}
          handleOnChange={handleEditOnChange}
          handleclose={() => setEditSection(false)}
          rest={formDataEdit}
          formTitle="Edit"
        />
      )}

      <div className='tableContainer'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dataList.length ? (
              dataList.map((el) => (
                <tr key={el._id}>
                  <td>{el.name}</td>
                  <td>{el.email}</td>
                  <td>{el.mobile}</td>
                  <td>
                    <button className='btn btn-edit' onClick={() => handleEdit(el)}>Edit</button>
                    <button className='btn btn-delete' onClick={() => handleDelete(el._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
