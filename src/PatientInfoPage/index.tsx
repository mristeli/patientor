import React from "react";
import { useParams } from "react-router-dom";
import { Icon, CardGroup } from 'semantic-ui-react';

import axios from "axios";
import { Patient, Gender } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, updatePatientFullData } from "../state";
import { EntryDetails } from "./entrydetails";

const GenderIcon = ({ gender }: { gender: Gender }) => {
  switch (gender) {
    case "male":
      return <Icon name="mars" />;
    case "female":
      return <Icon name="venus" />; 
  }
  return <Icon name="genderless" />;
};

const PatientInfoPage: React.FC = () => {
  const [{ patientsFullData, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {
    const fetchPatientRecord = async () => {
      try {
        const { data: patientData } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(updatePatientFullData(patientData))
      } catch (e) {
        console.error(e);
      }
    };
    if(!patientsFullData[id]) {
      fetchPatientRecord();
    }
  }, [id, patientsFullData, diagnoses, dispatch]);

  const patient = patientsFullData[id];
  return (
    <div className="App">
      { patient &&
        <div>
          <h1>{ patient.name } <GenderIcon gender={patient.gender} /></h1>
          <p>
            ssn: { patient.ssn } <br />
            occupation: { patient.occupation } <br />
            date of birth: { patient.dateOfBirth } <br />
          </p>          
          { patient.entries && 
            <div>
              <p><b>Entries</b></p>
              <CardGroup>
                {patient.entries.map(entry => (
                  <EntryDetails key={entry.id} entry={entry} />
                ))} 
              </CardGroup>
            </div>
          }
        </div>
    }
    </div>
  );
};

export default PatientInfoPage;