import { State } from "./state";
import { Diagnosis, Patient, Entry } from "../types";

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
      type: "ADD_DIAGNOSIS_ENTRY",
      payload: {
        patientId: string;
        entry: Entry;
      }
  }
  | {
    type: "UPDATE_PATIENT_FULL_DATA";
    payload: Patient;
  }
  | {
    type: "SET_DIAGNOSIS_LIST";
    payload: Diagnosis[];
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

export const addDiagnosisEntry = (patientId: string, entry: Entry): Action => {
  return {
    type: "ADD_DIAGNOSIS_ENTRY", payload: {
      patientId, 
      entry
    }
  };
};

export const updatePatientFullData  = (entry: Patient): Action => {
  return {
    type: "UPDATE_PATIENT_FULL_DATA", payload: entry
  };
};

export const setDiagnosisList = (diagnosisList: Diagnosis[]): Action => {
  return {
    type: "SET_DIAGNOSIS_LIST", payload: diagnosisList
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
    case "ADD_DIAGNOSIS_ENTRY": 
      const patientId = action.payload.patientId;
      const newEntry = action.payload.entry;
      const entries = state.patientsFullData[patientId].entries; 
      return {
        ...state,
        patientsFullData: {
          ...state.patientsFullData,
          [patientId] : {
            ...state.patientsFullData[patientId],
            entries : entries ? entries.concat(newEntry) : [newEntry]
          }
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
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state, 
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnoses
        }
      };
    default:
      return state;
  }
};
