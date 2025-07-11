import axios from 'axios';
import { Workout } from '../models/workout';

const BASE_URL = 'http://localhost:3000/workouts';

export const getAllWorkouts = async (): Promise<Workout[]> => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const getWorkoutById = async (id: string): Promise<Workout> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const createWorkout = async (workout: Partial<Workout>): Promise<Workout> => {
  const res = await axios.post(BASE_URL, workout);
  return res.data;
};

export const updateWorkout = async (id: string, workout: Partial<Workout>): Promise<Workout> => {
  const res = await axios.patch(`${BASE_URL}/${id}`, workout);
  return res.data;
};

export const deleteWorkout = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
}; 