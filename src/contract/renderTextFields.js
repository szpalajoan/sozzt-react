import { TextField, Checkbox, FormControlLabel } from '@mui/material';

const renderTextFields = (fields, formState, handleInputChange) => {
    return fields.map(field => {
      if (field.type === "checkbox") {
        return (
          <FormControlLabel
            key={field.name}
            control={
              <Checkbox
                checked={formState[field.name] === true}
                onChange={(e) => {
                  if (!field.readOnly) {
                    console.log('Checkbox change:', field.name, e.target.checked);
                    handleInputChange({
                      target: {
                        name: field.name,
                        type: 'checkbox',
                        checked: e.target.checked
                      }
                    });
                  }
                }}
                name={field.name}
                disabled={field.readOnly}
              />
            }
            label={field.label}
          />
        );
      }

      return (
        <TextField
          key={field.name}
          label={field.label}
          name={field.name}
          type={field.type || "text"}
          value={formState[field.name] || field.value}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          required={field.required}
          InputLabelProps={field.type === "date" ? { shrink: true } : {}}
          disabled={field.readOnly}
        />
      );
    });
  };

  export { renderTextFields }