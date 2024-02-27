import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { useEffect } from 'react';

import { HomeScreen } from './HomeComponents/HomeScreen';
import { SleepScreen } from './SleepComponents/SleepScreen';
import { CalorieScreen } from './CalorieComponents/CalorieScreen';
import { ExerciseScreen } from './ExerciseComponents/ExerciseScreen';
import { HydrationScreen } from './HydrationComponents/HydrationScreen';
import { ExerciseOnboarding } from './ExerciseComponents/ExerciseOnboarding';

import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();

export default function App() {

  // request the token
  useEffect(() => {
    (async () => {
      let token;
      // check, is this a device or a simulator
      if (Constants.isDevice) {
        // see if we haven't already been granted access
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        // ask for the token
        token = (await Notifications.getDevicePushTokenAsync()).data;
        console.log('Expo Token: ', token);

      } else {
        alert('You are running this app on a simulator, you must use a real device to use push notifications');
      }

      // make modifcations to android
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      if (token != undefined) {
        console.log(`Our token is ${token}`);
      } else {
        console.log(`We are unable to get the token`);
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          options={{
            headerTitle: "",
            headerTransparent: true,
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen
          name='Sleep'
          component={SleepScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='Calories'
          component={CalorieScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='ExerciseOnboard'
          component={ExerciseOnboarding}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='Exercise'
          component={ExerciseScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='Hydration'
          component={HydrationScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
