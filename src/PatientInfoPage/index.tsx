import React from "react";
import { useParams } from "react-router-dom";
import { Icon } from 'semantic-ui-react';

import axios from "axios";
import { Patient, Gender } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, updatePatientFullData } from "../state";


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
  const [{ patientsFullData }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {
    const fetchPatientRecord = async () => {
      try {
        const { data: patientData } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(updatePatientFullData(patientData));
      } catch (e) {
        console.error(e);
      }
    };
    if(!patientsFullData[id]) {
      fetchPatientRecord();
    }
  }, [id, patientsFullData, dispatch]);

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
              <p>Entries</p>
              {patient.entries.map(entry => (
                <div key={entry.id}>
                <p>{entry.date} <i>{entry.description}</i></p>
                <ul>
                {entry.diagnosisCodes?.map(dc => (
                  <li key={dc}>{dc}</li>
                ))}              
                </ul>
                </div>
              ))} 
            </div>
          }
        </div>

    }
    </div>
  );
};

export default PatientInfoPage;