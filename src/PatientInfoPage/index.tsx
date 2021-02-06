import React from "react";
import { useParams } from "react-router-dom";
import { Icon, CardGroup } from 'semantic-ui-react';

import axios from "axios";
import { Patient, Gender, Entry } from "../types";
import { apiBaseUrl } from "../constants";
import { EntryDetails } from "./entrydetails";
import AddEntryModal from "../AddEntryModal";
import { useStateValue, updatePatientFullData, addDiagnosisEntry } from "../state";

import { Button } from 'semantic-ui-react';
import { DiagnosisEntryValues } from "../AddEntryModal/AddEntryForm";


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

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>("");

  const openModal = (): void => setModalOpen(true);
  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

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
  }, [id, patientsFullData, diagnoses, dispatch]);

  const submitNewEntry = async (values: DiagnosisEntryValues) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(addDiagnosisEntry(id, newEntry));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

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
          <AddEntryModal 
            modalOpen={modalOpen}
            onSubmit={submitNewEntry}
            error={error}
            onClose={closeModal}
          />
          <br />
          <Button onClick={() => openModal()}>Add New Entry</Button>
        </div>
    }
    </div>
  );
};

export default PatientInfoPage;