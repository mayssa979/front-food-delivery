import { Role } from './role';

export class User {
  id: number;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  avatar: string;
  role: Role;
}
