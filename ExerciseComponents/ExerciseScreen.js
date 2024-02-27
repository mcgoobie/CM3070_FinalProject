import { ScrollView, StyleSheet, Text, View, StatusBar } from 'react-native';
import { SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from './Exercise';
import { Status } from './Status';


export const ExerciseScreen = () => {
  const [workoutDetails, setWorkoutDetails] = useState([]);

  const fetchWorkoutData = async () => {
    const workoutDetails = await AsyncStorage.getItem('@workout-details');
    setWorkoutDetails(JSON.parse(workoutDetails));
  };

  useEffect(() => {
    fetchWorkoutData();
  }, []);

  const BackButton = () => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={[styles.back, styles.boxShadowIOS, styles.boxShadowAndroid]}>Back to Home</Text>
      </TouchableOpacity>
    )
  }
  console.log('- Workout Screen -')
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.headContainer}>
          <BackButton />
          <Text style={[styles.textHeader, styles.boxShadowIOS, styles.boxShadowAndroid]}>Time to get active</Text>
        </View>
        <View style={styles.imgContainer}>
          <Image
            style={styles.homeLogo}
            source={require('../images/exercise_cat.png')}
            resizeMode='contain'
          />
        </View>
        <View style={styles.sectionContainer}>
          <ScrollView>
            <View style={styles.headerContainer}>
              <Text style={styles.header}>Workout Routine:</Text>
              <Text style={styles.headerStatus}>Status</Text>
            </View>
            <View style={styles.exercisesContainer}>
              <View style={styles.setContainer}>
                {workoutDetails == null
                  ?
                  <View>
                    <Text>Empty</Text>
                  </View>
                  :
                  <View>
                    {workoutDetails.map(exercise => (
                      <Exercise
                        key={exercise.exercise_id}
                        exercise={exercise}
                      />
                    ))}
                  </View>
                }
              </View>
              <View style={styles.statusContainer}>
                <Status
                  btnId={1}
                />
                <Status
                  btnId={2}
                />
                <Status
                  btnId={3}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView >
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6D7D2',
  },
  safeContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  back: {
    color: 'white',
    textAlign: 'left',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: '5%',
  },
  headContainer: {
    width: '90%',
    height: '10%',
    flex: 1,
  },
  boxShadowIOS: {
    //IOS Shadows
    shadowOffset: { width: 2, height: 2 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  boxShadowAndroid: {
    shadowColor: '#171717',
    elevation: 20,
  },
  textHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  homeLogo: {
    width: 350,
    height: 350,
  },
  imgContainer: {
    width: '90%',
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    width: '90%',
    backgroundColor: 'white',
    flex: 4,
    borderRadius: 10,
    padding: '5%',
  },
  headerContainer: {
    marginBottom: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerStatus: {
    fontSize: 16,
    color: 'lightgrey',
    textDecorationLine: 'underline',
  },
  exercisesContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  setContainer: {
    borderRightColor: 'lightgrey',
    paddingRight: '5%',
    height: 500,
    borderRightWidth: 1,
    flex: 4,
  },
  statusContainer: {
    borderLeftColor: 'lightgrey',
    paddingLeft: '5%',
    height: 500,
    borderLeftWidth: 1,
    flex: 1,
  }
});