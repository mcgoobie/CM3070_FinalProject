import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { HydrationForm } from './HydrationForm';

export const HydrationScreen = () => {
  const [angleValue, setAngleValue] = useState(0);
  const [defaultValue, setNewDefault] = useState(3.7);
  const [currentValue, updateCurrentValue] = useState(0.0);

  const [isGoalMet, updateGoalMet] = useState(false);
  const [drinkAddable, toggleDrinkAddable] = useState(false);

  const [drinksList, updateDrinksList] = useState([]);
  const [hasDrinks, toggleHasDrinks] = useState(false);

  const handleDrinkAdded = async () => {
    try {
      const liquidsJsonStr = await AsyncStorage.getItem('@drinks-list');

      if (liquidsJsonStr != null) {
        // Update current amount
        var liquidsJson = JSON.parse(liquidsJsonStr);
        var currentVol = 0;
        liquidsJson.forEach(drink => {
          currentVol += parseInt(drink.volume)
        });

        // convert volume from ML to L
        updateCurrentValue(currentVol / 1000)

        // Update current %
        var totalVol = defaultValue * 1000; // Recommended Daily amt in Litres
        var currentPercentage = (currentVol / totalVol) * 100


        // Continue tracking the progress in the dailies as long as its < 100%
        if (currentPercentage < 100) {
          console.log('hydration (%)', currentPercentage);
          setAngleValue(currentPercentage);
          await AsyncStorage.setItem('@hydrationProgress', (Math.round(currentPercentage)).toString());
        }
        // Check if 100% of the goal has been reached
        if (currentPercentage >= 100) {
          console.log('goal over 100%, defaulting to full');
          await AsyncStorage.setItem('@hydrationProgress', '100');
          setAngleValue(100);
          updateGoalMet(true);
        }

        // Check for Water Tank Goal (<5L drank)
        if ((currentVol / 1000) >= 5)
          checkWaterMedal();
      }
    } catch (error) {
      console.log("Something went wrong!", error);
    }

    return;
  }

  const checkWaterMedal = async () => {
    const achievementsString = await AsyncStorage.getItem('@achievementTrackers');
    var achievementsTracker = JSON.parse(achievementsString);

    // Only check if achievement is not yet completed
    if (achievementsTracker[6].completed !== true) {
      console.log('water medal earned');
      achievementsTracker[6].conditionTracker = 1;
      achievementsTracker[6].completed = true;

      // Update with new tracker JSON
      await AsyncStorage.setItem('@achievementTrackers', JSON.stringify(achievementsTracker));
    }
    return;
  }

  const fetchLiquidsList = async () => {
    try {
      const liquidsJsonStr = await AsyncStorage.getItem('@drinks-list');

      if (liquidsJsonStr != null) {
        var liquidsJson = JSON.parse(liquidsJsonStr);
        updateDrinksList(liquidsJson);
        toggleHasDrinks(true);

        handleDrinkAdded();
      }
    } catch {
      console.log("No drinks have been recorded for today!");
    }

    return;
  }

  useEffect(() => {
    fetchLiquidsList();
    // handleDrinkAdded();
  }, [drinkAddable]);

  const BackButton = () => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={[styles.back, styles.boxShadowIOS, styles.boxShadowAndroid]}>Back to Home</Text>
      </TouchableOpacity>
    )
  }

  console.log('- Hydration Screen -')
  console.log('Has goal been met? ', isGoalMet);
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.headContainer}>
          <BackButton />
          <Text style={[styles.textHeader, styles.boxShadowIOS, styles.boxShadowAndroid]}>Remember to stay hydrated</Text>
        </View>
        <View style={styles.imgContainer}>
          <Image
            style={styles.homeLogo}
            source={require('../images/drink_cat.png')}
            resizeMode='contain'
          />
        </View>
        <View style={styles.sectionContainer}>
          <ScrollView>
            <View style={styles.headerContainer}>
              <Text style={styles.header}>Daily Target:</Text>
            </View>
            <View style={styles.radialContainer}>
              <AnimatedCircularProgress
                style={styles.radialBar}
                size={250}
                width={15}
                fill={angleValue}
                backgroundColor="#EEEEEE"
                tintColor="#6699FF"
                arcSweepAngle={280}
                lineCap='round'
                rotation={220}
              >
                {(isGoalMet)
                  ?
                  (fill) => (
                    <View>
                      <Text style={[styles.valuesText]}>Good Job!</Text>
                      <Text style={[styles.valuesText, styles.goalText]}>You have reached the daily goal!</Text>
                    </View>
                  )
                  :
                  (angleValue) => (
                    <View style={styles.valuesContainer}>
                      <Text style={styles.valuesText}>{Math.round(angleValue)}%</Text>
                      <Text style={styles.valuesText}>{Math.round(currentValue * 100) / 100}L of {defaultValue}L</Text>
                    </View>
                  )
                }
              </AnimatedCircularProgress>
              <TouchableOpacity
                onPress={() => toggleDrinkAddable(!drinkAddable)}
                style={styles.addBtn}
              >
                <Text style={styles.addText}>Add Drink</Text>
              </TouchableOpacity>
            </View>
            <View style={{ borderBottomColor: 'lightgrey', borderBottomWidth: 1 }} />
            <View>
              {(hasDrinks)
                ?
                drinksList.map((drink, i) => {
                  return (
                    <View style={styles.recentsContainer} key={i}>
                      <Text>
                        {drink.volume}ML {drink.type}
                      </Text>
                      <Text>
                        {drink.timestamp}
                      </Text>
                    </View>
                  )
                })
                : <Text style={styles.noDrinksText}>No drinks have been recorded today..</Text>
              }
            </View>
          </ScrollView>
        </View>
      </SafeAreaView >
      {(drinkAddable) ?
        <View style={styles.hydrationFormContainer}>
          <HydrationForm
            drinkAdded={drinkAddable}
            updateForm={toggleDrinkAddable}
          />
        </View>
        :
        null
      }
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D7EDF0',
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
  editText: {
    fontSize: 16,
    color: 'lightgrey',
    textDecorationLine: 'underline',
  },
  radialContainer: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  radialBar: {
    width: 250,
    marginLeft: '10%',
  },
  valuesText: {
    textAlign: 'center',
    color: '#6699FF',
    fontSize: 24,
  },
  goalText: {
    fontSize: 18,
    padding: '5%',
  },
  addBtn: {
    top: -35,
  },
  addText: {
    textAlign: 'center',
    color: '#6699FF',
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  noDrinksText: {
    marginTop: '5%',
    color: 'grey',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  listContainer: {
    // borderWidth: 1,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '5%',
  },
  recentsContainer: {
    padding: '2%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  hydrationFormContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  }
});