import React from 'react';
import { Card, Icon } from 'semantic-ui-react';

import { Entry,
      HospitalEntry, 
      OccupationalHealthcareEntry, 
      HealthCheckEntry,
      HealthCheckRating } from "../types";
import { assertNever } from "../utils";

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
  return <Card>
    <Card.Content>
      <Card.Header>
        {entry.date} <Icon name="hospital symbol" />
      </Card.Header>
      <Card.Description>
        {entry.description}
      </Card.Description>
    </Card.Content>
  </Card>;
};

const OccupationalHealthcareDetails = ({ entry }: { entry: OccupationalHealthcareEntry }) => {
  return <Card>
    <Card.Content>
      <Card.Header>
        {entry.date} <Icon name="stethoscope" />
      </Card.Header>
      <Card.Description>
        {entry.description}
      </Card.Description>
    </Card.Content>
  </Card>;
};

const RatingIcon = ({ rating }: { rating: HealthCheckRating }) => {
  switch(rating) {
    case HealthCheckRating.Healthy:
      return <Icon name="heart" color="red" />;
    case HealthCheckRating.LowRisk:
      return <Icon name="heart" color="yellow" />;
    case HealthCheckRating.HighRisk:
      return <Icon name="heart" color="black" />;
    case HealthCheckRating.CriticalRisk:
      return <Icon name="ambulance" />;
    default:
      assertNever("health rating", rating);
  }
  return null;
};

const HealthCheckDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  return <Card>
    <Card.Content>
      <Card.Header>
        {entry.date} <Icon name="user md"/>
      </Card.Header>
      <Card.Description>
        {entry.description}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <RatingIcon rating={entry.healthCheckRating} />
    </Card.Content>
  </Card>;};

export const EntryDetails: React.FC<{ entry: Entry}> = ({ entry }) => {
  switch(entry.type) {
  case "Hospital":
    return <HospitalEntryDetails entry={entry} />;
  case "OccupationalHealthcare":
    return <OccupationalHealthcareDetails entry={entry}/>;
  case "HealthCheck":
    return <HealthCheckDetails entry={entry}/>;
  default:
    return assertNever("EntryType", entry);
  }
}