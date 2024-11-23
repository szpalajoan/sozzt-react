import { TextField } from '@mui/material';


const renderTextFields = (fields, formState, handleInputChange) => {
    return fields.map(field => (
      <TextField
        key={field.name}
        label={field.label}
        name={field.name}
        type={field.type || "text"}
        value={formState[field.name] || field.value}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required={field.required}
        InputLabelProps={field.type === "date" ? { shrink: true } : {}}
      />
    ));
  };

  export { renderTextFields }