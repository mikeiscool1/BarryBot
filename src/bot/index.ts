import 'dotenv/config';
import client from './client';
client.login(process.env.TOKEN!);