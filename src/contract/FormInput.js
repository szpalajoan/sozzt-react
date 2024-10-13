import React from 'react';
import './AddContract.css';

const FormInput = ({ label, type = 'text', value, onChange, required = false, readOnly = false }) => (
  <div className="form-group">
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
      className="input-field"
    />
  </div>
);

export default FormInput;
