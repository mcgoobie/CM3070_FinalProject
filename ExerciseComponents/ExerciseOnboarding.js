import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, Image, TouchableOpacity, StatusBar, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { BackButton } from '../SharedComponents/BackButton';
import { Loading } from '../SharedComponents/Loading';

export const ExerciseOnboarding = () => {
  const navigation = useNavigation();
  const apiKey = '3bdcd3f369235f877246924603f3e0774a0d5082';
  const [workoutDetails, setWorkoutDetails] = useState([]);
  const [isLoading, toggleLoaded] = useState(true);

  // Will be used to store json results needed to pull information of each exercise
  let rowResults = []

  // On first time, wger api will be called to pull information on a basic workout,
  // subsequent times will have the workout stored to the async storage and loaded.
  const fetchWorkoutData = async () => {
    try {
      const workoutDetails = await AsyncStorage.getItem('@workout-details');
      setWorkoutDetails(JSON.parse(workoutDetails));
      if (workoutDetails == null) {
        // Fetch workout details
        const workoutResponse = await fetch(
          // Fetch workout details
          `https://wger.de/api/v2/setting/`,
          {
            method: 'GET',
            // Private route requires the use of the api key.
            headers: {
              Accept: 'application/json',
              Authorization: `Token ${apiKey}`,
            },
          }
        );

        // Save Json results for further manipulation
        const workoutData = await workoutResponse.json();
        const workoutDataResults = workoutData.results;

        // For each row of json result, extract the indiv. id and reps of the exercise
        // and fetch info regarding the name and desc of the exercise.
        workoutDataResults.forEach(row => {
          fetchExerciseImages(row);
        });
      }
      else {
        return;
      }
      // Log error if api data could not be fetched.
    } catch (error) {
      console.error('Error fetching workout and exercises:', error);
    }
  };

  // Fetch image of the exercise from the wger api.
  const fetchExerciseImages = async (row) => {
    try {
      // Fetch workout details
      const exerciseImgResponse = await fetch(
        // Fetch all images of each exercise in the workout
        `https://wger.de/api/v2/exerciseimage/?exercise_base=${row.exercise_base}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      );
      // Save Json results for further manipulation
      const imageData = await exerciseImgResponse.json();
      const imageDataResults = imageData.results[0];
      // Save image link and return it
      const imgSrc = JSON.stringify(imageDataResults.image);
      // Fetch exercise name and desc
      fetchExerciseData(row, imgSrc);
    } catch (error) {
      console.error('Error fetching workout and exercises:', error);
    }
  }

  // Fetch name and description of each individual exercise and saves it
  // alongside the id, reps and img src of the exercise.
  const fetchExerciseData = async (row, imgSrc) => {
    try {
      // Fetch workout details
      const exerciseResponse = await fetch(
        // Fetch all exercises of workout
        `https://wger.de/api/v2/exercise/?language=2&exercise_base=${row.exercise_base}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      );

      // Save json results
      const exerciseData = await exerciseResponse.json();
      const exerciseDataResults = exerciseData.results[0];

      // Prepare and save name and description of exercise to json Array obj.
      var exerciseInfo = {
        name: exerciseDataResults.name,
        desc: exerciseDataResults.description,
      }
      rowResults.push({
        exercise_id: row.exercise_base,
        reps: row.reps,
        imgSrc: imgSrc,
        exerciseInfo: exerciseInfo,
      })
      // Save name and workout description
      await AsyncStorage.setItem('@workout-details', JSON.stringify(rowResults));
      setWorkoutDetails(rowResults);
      doneLoading();
      // Log error if api data could not be fetched.
    } catch (error) {
      console.error('Error fetching workout and exercises:', error);
    }
  }

  const doneLoading = async () => {
    toggleLoaded(false);
    await AsyncStorage.setItem('@exerciseOnboarded', 'true');
    console.log('done paging', isLoading);
  }

  useEffect(() => {
    if (isLoading) {
      fetchWorkoutData();
    }
  }, [isLoading]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        {/* <View style={styles.headContainer}>
          <BackButton />
        </View> */}
        {/* <View style={styles.imageContainer}>
          <Image
            style={styles.onboardImg}
            source={require('../images/onboard_img.png')}
            resizeMode='contain'
          />
        </View> */}
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Simpler Workouts</Text>
          <View>
            <Text style={styles.textContent}>
              WGER is a community-driven, free and open-source fitness tracker.
              With this API, a simple workout plan has been crafted for you.
            </Text>
            <Text style={styles.textContent}>
              Please give WGER a moment if this is your first time, 
            </Text>
          </View>
          <View style={styles.outcomeContainer}>
            {(isLoading)
              ?
              <Loading />
              :
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigation.navigate('Exercise')}
              >
                <Text style={styles.continueBtn}>Continue</Text>
              </TouchableOpacity>
            }
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  safeContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headContainer: {
    width: '90%',
    height: '10%',
    flex: 1,
  },
  imageContainer: {
    flex: 4,
  },
  onboardImg: {
    width: 250,
    height: 250,
  },
  sectionContainer: {
    width: '100%',
    padding: '5%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#F6D7D2',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  textContent: {
    color: '#F6D7D2',
    textAlign: 'center',
    fontSize: 18,
  },
  outcomeContainer: {
    marginTop: 20,
  },
  buttonContainer: {
    padding: '3%',
    borderRadius: 50,
    backgroundColor: '#F6D7D2',
  },
  continueBtn: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  }
});