import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageHelper {
  static async saveItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log('Error', err);
    }
  }
  static async removeToken(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      console.log('Error', err);
    }
  }
  static async getItem(key) {
    try {
      const result = await AsyncStorage.getItem(key);
      // console.log('result before', result);
      if (result != null) {
        // setData(result);
        return result
      }
    } catch (err) {
      return {
        error: err,
      };
    }
  }
}
