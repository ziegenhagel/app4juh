import { Client } from 'appwrite';
export const useAppwriteClient = () => {
  const client = new Client();

  client
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('65ba5911b0a714ddaadf');

  return client;
}
