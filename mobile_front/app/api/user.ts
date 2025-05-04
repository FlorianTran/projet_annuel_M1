import { User } from '../models/user';

const API_URL = 'http://localhost:3000'; // Ton backend local

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des utilisateurs');
  }
  return response.json();
}
