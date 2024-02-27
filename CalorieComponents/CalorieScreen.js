import { ScrollView, StyleSheet, Text, View, StatusBar } from 'react-native';
import { SafeAreaView, Image, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Meal } from './Meal';


export const CalorieScreen = (navigation) => {
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [editGoal, updateEditGoal] = useState(false);

  const [isBkfastEditable, isBkfastEdited] = useState(false);
  const [isLunchEditable, isLunchEdited] = useState(false);
  const [isDinnerEditable, isDinnerEdited] = useState(false);

  const updateCalorieIntake = (calories) => {
    let newCalories = calorieGoal - calories;
    setCalorieGoal(newCalories);
    saveData(newCalories);
  }

  const saveData = async (newCalories) => {
    await AsyncStorage.setItem('@calorie-goal', newCalories.toString());

    var date = new Date();
    date = date.toJSON().slice(0, 10);

    await AsyncStorage.setItem('@today-date', JSON.stringify(date));
  }

  const checkNewDay = async () => {
    var date = new Date();
    date = date.toJSON().slice(0, 10);
    date = JSON.stringify(date);
    const savedDate = await AsyncStorage.getItem('@today-date');

    if (date !== savedDate) {
      let listOfItems = ['@calorie-goal', '@bkfast-json', '@lunch-json', '@dinner-json'];

      await AsyncStorage.multiRemove(listOfItems).then(() => {
        alert("A new day has started, time to record your next 3 meals again. ");
      });
    }
  }

  const checkData = async () => {
    try {
      const storageGoalItem = await AsyncStorage.getItem('@calorie-goal');
      const storageBkfastItem = await AsyncStorage.getItem('@bkfast-json');
      const storageLunchItem = await AsyncStorage.getItem('@lunch-json');
      const storageDinnerItem = await AsyncStorage.getItem('@dinner-json');

      if (storageGoalItem !== null) {
        setCalorieGoal(storageGoalItem);
        if (Math.sign(storageGoalItem) === -1) {
          const surplus = Math.abs(storageGoalItem);
          alert(`Your daily intake has a calorie surplus of ${surplus} kcals. \n\n Consider proper meal planning to hit your target! `);
        }
      }
      if (storageBkfastItem !== null) {
        isBkfastEdited(true);
      }
      if (storageLunchItem !== null) {
        isLunchEdited(true);
      }
      if (storageDinnerItem !== null) {
        isDinnerEdited(true);
      }
    } catch (e) {
      alert("No data has been added for today!");
    }
  };

  useEffect(() => {
    checkNewDay();
    checkData();
  }, []);

  const BackButton = () => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={[styles.back, styles.boxShadowIOS, styles.boxShadowAndroid]}>Back to Home</Text>
      </TouchableOpacity>
    )
  }
  console.log('- Calorie Screen -')
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.headContainer}>
          <BackButton />
          <Text style={[styles.textHeader, styles.boxShadowIOS, styles.boxShadowAndroid]}>Calorie Tracker</Text>
        </View>
        <View style={styles.imgContainer}>
          <Image
            style={styles.homeLogo}
            source={require('../images/eat_cat.png')}
            resizeMode='contain'
          />
        </View>
        <View style={styles.sectionContainer}>
          <ScrollView>
            <View style={styles.headerContainer}>
              <Text style={styles.header}>Daily Target:</Text>
              <TouchableOpacity onPress={() => updateEditGoal(!editGoal)}>
                {editGoal
                  ? <Text style={styles.headerEdit}>Save</Text>
                  : <Text style={styles.headerEdit}>Edit</Text>
                }
              </TouchableOpacity>
            </View>
            <View style={styles.goalContainer}>
              {editGoal
                ? <TextInput style={[styles.goalText, styles.goalTextInput]} onChangeText={(text) => setCalorieGoal(text)} placeholder='0' />
                : <Text style={styles.goalText}>{calorieGoal}</Text>
              }

              <Text style={styles.goalHeader}>CALS LEFT</Text>
            </View>
            <View style={styles.mealsContainer}>
              <Text style={styles.mealsHeader}>Foods</Text>
              {isBkfastEditable
                ? <Meal
                  sectionName={'Breakfast'}
                  storageKey={'@bkfast-json'}
                  updateCalorieIntake={updateCalorieIntake}
                  color={{ backgroundColor: '#F0E1C3' }}
                />
                : <View style={[styles.mealContainer, styles.emptyEvenContainer]}>
                  <Text style={styles.mealHeader}>Breakfast</Text>
                  <TouchableOpacity style={styles.addBtn} onPress={() => isBkfastEdited(true)}>
                    <Text style={styles.addText}>Nothing recorded yet.</Text>
                  </TouchableOpacity>
                </View>
              }
              {isLunchEditable
                ? <Meal
                  sectionName={'Lunch'}
                  storageKey={'@lunch-json'}
                  updateCalorieIntake={updateCalorieIntake}
                  color={{ backgroundColor: '#F6F6F6' }}
                />
                : <View style={[styles.mealContainer, styles.emptyOddContainer]}>
                  <Text style={styles.mealHeader}>Lunch</Text>
                  <TouchableOpacity style={styles.addBtn} onPress={() => isLunchEdited(true)}>
                    <Text style={styles.addText}>Nothing recorded yet.</Text>
                  </TouchableOpacity>
                </View>
              }
              {isDinnerEditable
                ? <Meal
                  sectionName={'Dinner'}
                  storageKey={'@dinner-json'}
                  updateCalorieIntake={updateCalorieIntake}
                  color={{ backgroundColor: '#F0E1C3' }}
                />
                : <View style={[styles.mealContainer, styles.emptyEvenContainer]}>
                  <Text style={styles.mealHeader}>Dinner</Text>
                  <TouchableOpacity style={styles.addBtn} onPress={() => isDinnerEdited(true)}>
                    <Text style={styles.addText}>Nothing recorded yet.</Text>
                  </TouchableOpacity>
                </View>
              }
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0E1C3',
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
  headerEdit: {
    fontSize: 16,
    color: 'lightgrey',
    textDecorationLine: 'underline',
  },
  goalContainer: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '5%',
  },
  goalText: {
    fontSize: 42,
    fontWeight: '200',
  },
  goalTextInput: {
    textDecorationLine: 'underline'
  },
  goalHeader: {
    fontSize: 24,
  },
  mealsHeader: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: '5%',
  },
  mealContainer: {
    padding: '3%',
    backgroundColor: 'white',
    marginBottom: '5%',
    width: '100%',
    borderRadius: 10,
  },
  emptyOddContainer: {
    backgroundColor: '#F6F6F6',
  },
  emptyEvenContainer: {
    backgroundColor: '#F0E1C3',
  },
  boxShadowIOS: {
    //IOS Shadows
    shadowOffset: { width: 2, height: 6 },
    shadowColor: '#171717',
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  boxShadowAndroid: {
    shadowColor: '#171717',
    elevation: 20,
  },
  mealHeaderContainer: {
    flexDirection: 'row',
    marginBottom: '5%',
  },
  mealHeader: {
    fontWeight: 'bold',
  },
  mealDate: {
    fontWeight: '200',
    fontStyle: 'italic',
  },
  addBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4%',
  },
  addText: {
    color: 'grey',
    textDecorationLine: 'underline',
  }
});