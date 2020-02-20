import { config } from 'dotenv';
import Queue from './lib/Queue';

config();
Queue.processQueue();
