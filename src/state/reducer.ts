import { State } from "./state";
import { Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
    type: "UPDATE_PATIENT_FULL_DATA";
    payload: Patient;
  };

export const setPatientList = (patientList: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST", payload: patientList
  };
};

export const addPatient = (entry: Patient): Action => {
  return {
    type: "ADD_PATIENT", payload: entry
  };
};

export const updatePatientFullData  = (entry: Patient): Action => {
  return {
    type: "UPDATE_PATIENT_FULL_DATA", payload: entry
  };
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "UPDATE_PATIENT_FULL_DATA":
      return {
        ...state,
        patientsFullData: {
          ...state.patientsFullData,
          [action.payload.id]: action.payload
        }
      };
    default:
      return state;
  }
};
