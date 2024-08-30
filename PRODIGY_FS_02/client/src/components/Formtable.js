import React from 'react';
import "../App.css";
import { MdClose } from 'react-icons/md';

const Formtable = ({ handleSubmit, handleOnChange, handleclose, rest, formTitle }) => {
  return (
    <div className="addContainer">
      <form onSubmit={handleSubmit}>
        <div className="close-btn" onClick={handleclose}><MdClose /></div>
        <h2>{formTitle} Form</h2> {/* Display form title */}
        <label htmlFor="name">Name: </label>
        <input type="text" id="name" name="name" onChange={handleOnChange} value={rest.name} />

        <label htmlFor="email">Email: </label>
        <input type="email" id="email" name="email" onChange={handleOnChange} value={rest.email} />

        <label htmlFor="mobile">Mobile: </label>
        <input type="number" id="mobile" name="mobile" onChange={handleOnChange} value={rest.mobile} />

        <button className="btn">Submit</button>
      </form>
    </div>
  );
}

export default Formtable;
