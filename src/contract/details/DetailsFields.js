import { TextField } from '@mui/material';


const contractFields = (contractDetails, location) => [
  { label: "Numer umowy klienta", name: "contractNumber", value: contractDetails?.contractNumber || "", required: true },
  { label: "Nr roboczy", name: "workNumber", value: contractDetails?.workNumber || "", required: true },
  { label: "Nr stacji trafo i obwód", name: "transformerStationNumberWithCircuit", value: location?.transformerStationNumberWithCircuit || "" },
  { label: "Region", name: "region", value: location?.region || "", required: true },
  { label: "Dzielnica", name: "district", value: location?.district || "" },
  { label: "Miasto", name: "city", value: location?.city || "", required: true },
  { label: "Numer pola", name: "fieldNumber", value: location?.fieldNumber || "" },
  { label: "Numer kontraktu klienta", name: "customerContractNumber", value: contractDetails?.customerContractNumber || "" , required: true },
  { label: "Link do mapy", name: "googleMapLink", value: location?.googleMapLink || "", required: true },
  {
    label: "Data zamówienia",
    name: "orderDate",
    value: contractDetails.orderDate ? contractDetails.orderDate.split('T')[0] : '', 
    type: "date"
  },
];

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

export { contractFields, renderTextFields };
