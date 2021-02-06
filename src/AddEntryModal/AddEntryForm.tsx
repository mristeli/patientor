import React, { useState } from 'react';
import { Formik, Form, Field } from "formik";
import { useStateValue } from "../state";
import { Grid, Button } from "semantic-ui-react";

import { DiagnosisSelection, TextField, SelectField, NumberField } from './FormField';
import { 
  HospitalEntry, 
  OccupationalHealthcareEntry,
  HealthCheckEntry } from '../types';

export type DiagnosisEntryValues = 
| Omit<HealthCheckEntry, 'id'>
| Omit<HospitalEntry, 'id'>
| Omit<OccupationalHealthcareEntry, 'id'>;

type EntryTypeOption = {
  value: string;
  label: string;
};

interface Props {
  onSubmit: (values: DiagnosisEntryValues) => void;
  onCancel: () => void;
}

const entryTypeOptions: EntryTypeOption[] = [
  { value: "HealthCheck", label: "HealthCheck" },
  { value: "Hospital", label: "Hospital" },
  { value: "OccupationalHealthcare", label: "OccupationalHealthcare" }
];

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const validateDate = (date: string | undefined): string | undefined => {
  const requiredError = "Field is required";
  const dateFormatError = "Date is in incorrect format";
  if(!date) {
    return requiredError;
  } else if (!isDate(date)) {
    return dateFormatError;
  }
  return undefined;
};

type errorsOccupational = { 
  employerName?: string;
  sickLeave?: { startDate?: string; endDate?: string }; 
};
type errorsHospital = {   
  discharge?: { date?: string; criteria?: string }; 
};

const validateOccupational = (employerName: string, sickLeave: { startDate?: string; endDate?: string }) => {
  const errors: errorsOccupational = {};
  const startDate = validateDate(sickLeave.startDate);
  const endDate = validateDate(sickLeave.endDate);
  if(startDate) {
    errors.sickLeave = {};
    errors.sickLeave.startDate = startDate;
  }
  if(endDate) {
    if(!errors.sickLeave) errors.sickLeave = {};
    errors.sickLeave.endDate = endDate;
  }
  if(!employerName) {
    errors.employerName = "Field is required";
  }
  return errors;
};

const validateHospital = (discharge: { date?: string; criteria?: string }) => {
  const errors: errorsHospital = {};
  const date = validateDate(discharge.date);
  if(date) {
    errors.discharge = {};
    errors.discharge.date = date;
  }
  if(!discharge.criteria) {
    if(!errors.discharge) errors.discharge = {};
    errors.discharge.criteria = "Field is required";
  }
  return errors;
};

const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [{ diagnoses }] = useStateValue();
  const [entryType, setEntryType] = useState("HealthCheck");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entryValidator = (values: any) => {
    const requiredError = "Field is required";
    const errors: { [field: string]: string 
      | errorsOccupational | errorsHospital; } = {};
    if(entryType !== values.type) {
      setEntryType(values.type);
    }
    if(!values.description) {
      errors.description = requiredError;
    }
    if(!values.specialist) {
      errors.specialist = requiredError;
    }
    const error = validateDate(values.date); 
    if(error) {
      errors.date = error;
    }
    switch(values.type) {
      case "HealthCheck":
        if(!values.healthCheckRating) {
          errors.healthCheckRating = requiredError; 
        }
        break;
      case "Hospital":
        Object.assign(errors, 
          validateHospital(values.discharge));
        break;
      case "OccupationalHealthcare":
        Object.assign(errors, 
          validateOccupational(values.employerName, values.sickLeave));
        break;
    }
    return errors;
  };

  return (
    <Formik
      initialValues={{
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: [],
        type: "HealthCheck",
        healthCheckRating: 0,
        discharge: {
          date: "",
          criteria: ""
        },
        employerName: "",
        sickLeave: {
          startDate: "",
          endDate: ""
        }
      }}
      onSubmit={onSubmit}
      validate={entryValidator}
    >
    {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
      return (
        <Form className="form ui">
          <SelectField
            label="Type"
            name="type"
            options={entryTypeOptions}
          />
          <Field
            label="Entry input date"
            placeholder="YYYY-MM-DD"
            name="date"
            component={TextField}
          />
          <Field
            label="Description"
            placeholder="Description"
            name="description"
            component={TextField}
          />
          <Field
            label="Specialist"
            placeholder="Specialist's name"
            name="specialist"
            component={TextField}
          />
          <DiagnosisSelection
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            diagnoses={Object.values(diagnoses)}
          />

          { entryType === "Hospital" && 
            <>
              <Field
                label="Discharge date"
                placeholder="YYYY-MM-DD"
                name="discharge.date"
                component={TextField}
               />
              <Field 
                label="Discharge criteria"
                placeholder="Criteria"
                name="discharge.criteria"
                component={TextField}
               />
            </>
          }
          { entryType === "HealthCheck" && 
            <>
              <Field
                label="Health check rating"
                name="healthCheckRating"
                component={NumberField}
                min={0}
                max={3}
              />
            </>
          }
          { entryType === "OccupationalHealthcare" &&
            <>
              <Field
                label="Employer"
                placeholder="Employer's name"
                name="employerName"
                component={TextField}
              />
              <Field
                label="Sickleave start"
                placeholder="YYYY-MM-DD"
                name="sickLeave.startDate"
                component={TextField}
              />
              <Field
                label="Sickleave end"
                placeholder="YYYY-MM-DD"
                name="sickLeave.endDate"
                component={TextField}
               />
            </>
          }
          
          <Grid>
            <Grid.Column floated="left" width={5}>
              <Button type="button" onClick={onCancel} color="red">
                Cancel
              </Button>
            </Grid.Column>
            <Grid.Column floated="right" width={5}>
              <Button
                type="submit"
                floated="right"
                color="green"
                disabled={!dirty || !isValid}
              >
                Add
              </Button>
            </Grid.Column>
          </Grid>
         </Form>
      );
    }}
  </Formik>
  );
};

export default AddEntryForm;