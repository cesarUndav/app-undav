import AsyncStorage from '@react-native-async-storage/async-storage';
import * as apiRequest from "@/app/lib/apiRequest"  // adjust path as needed

export async function getData() {
  try {
    const [personaId, token] = await Promise.all([
      AsyncStorage.getItem('personaId'),
      AsyncStorage.getItem('token'),
    ]);

    if (!personaId || !token) {
      throw new Error('Missing personaId or token from AsyncStorage');
    }

    //const route = `http://172.16.1.43/api/appundav/persona/${personaId}`;
    const route = `https://guargestinf.undav.edu.ar/api/appundav/persona/${personaId}`;
    const data = await apiRequest.apiRequest('GET', route, {}, token);

    console.log('Fetched persona data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching persona:', error);
    throw error;
  }
}
