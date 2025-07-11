import axios from 'axios';
import { Exercise } from '../models/exercise';

const BASE_URL = 'http://localhost:3000/exercises';

export const getAllExercises = async (): Promise<Exercise[]> => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const getExerciseById = async (id: string): Promise<Exercise> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const createExercise = async (exercise: Partial<Exercise>): Promise<Exercise> => {
  const res = await axios.post(BASE_URL, exercise);
  return res.data;
};

export const updateExercise = async (id: string, exercise: Partial<Exercise>): Promise<Exercise> => {
  const res = await axios.patch(`${BASE_URL}/${id}`, exercise);
  return res.data;
};

export const deleteExercise = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
}; 