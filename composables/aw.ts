import { Client } from 'appwrite';
export const useAw = () => {
  const client = new Client();

  client
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('65ba5911b0a714ddaadf');

  return client;
}
