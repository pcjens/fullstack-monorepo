import axios from "axios";
import { Entry, EntryWithoutId, Patient, PatientFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const get = async (id: string) => {
  const { data } = await axios.get<Patient>(
    `${apiBaseUrl}/patients/${id}`
  );

  return data;
};

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const addEntry = async (patientId: string, entry: EntryWithoutId): Promise<Entry> => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${patientId}/entries`,
    entry
  );
  return data;
};

export default {
  get, getAll, create, addEntry,
};

