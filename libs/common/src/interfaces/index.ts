import { Socket } from 'socket.io';
import { User } from '../database';

export interface ClientSocket extends Socket {
  user: User;
}
