import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export const Meal = (props) => {
  const [isSaved, saveDetails] = useState(false);
  const [mealName, setMeal] = useState('');
  const [mealTime, setTime] = useState('');
  const [mealKcal, setKcal] = useState('');

  // Saves data of meal added into the async storage.
  const saveData = async () => {
    let mealList = {
      mealName: mealName,
      mealTime: mealTime,
      mealKcal: mealKcal,
    };

    mealListString = JSON.stringify(mealList);
    await AsyncStorage.setItem(props.storageKey, mealListString);
    props.updateCalorieIntake(mealKcal)


    // Checks and updates the daily progress bar for the calorie feature
    const calorieProgressStr = await AsyncStorage.getItem('@calorieProgress')
    console.log('preparing to update prog : ', calorieProgressStr);
    var calorieProgress = JSON.parse(calorieProgressStr);

    if (props.sectionName == 'Breakfast') {
      calorieProgress.splice(0, 1, 1);
      await AsyncStorage.setItem('@calorieProgress', JSON.stringify(calorieProgress));
      console.log('updated prog', calorieProgress);
    }
    if (props.sectionName == 'Lunch') {
      calorieProgress.splice(1, 1, 1);
      await AsyncStorage.setItem('@calorieProgress', JSON.stringify(calorieProgress));
      console.log('updated prog', calorieProgress);
    }
    if (props.sectionName == 'Dinner') {
      calorieProgress.splice(2, 1, 1);
      await AsyncStorage.setItem('@calorieProgress', JSON.stringify(calorieProgress));
      console.log('updated prog', calorieProgress);
    }

    alert('Data successfully saved')
  }

  const readData = async () => {
    try {
      const list = await AsyncStorage.getItem(props.storageKey);
      if (list !== null) {
        updateMeal(JSON.parse(list));
      }
    } catch (e) {
      alert("List is empty or can't be retrieved!");
    }
  };

  const updateMeal = (list) => {
    setMeal(list.mealName);
    setTime(list.mealTime);
    setKcal(list.mealKcal);

    saveDetails(true);
  }

  useEffect(() => {
    readData();
  }, []);

  return (
    <View style={[props.color, styles.mealContainer]}>
      {isSaved
        ?
        <View>
          <View style={styles.mealHeaderContainer}>
            <Text style={styles.mealHeader}>{props.sectionName}</Text>
          </View>
          <View style={styles.mealTextContainer}>
            <Text style={styles.mealText}>Meal: {mealName}</Text>
            <Text style={styles.mealText}>Time Taken: {mealTime}</Text>
            <Text style={styles.mealText}>Calories: {mealKcal} Kcal</Text>
          </View>
        </View>
        :
        <View>
          <View style={styles.mealHeaderContainer}>
            <Text style={styles.mealHeader}>{props.sectionName}</Text>
          </View>
          <View style={styles.mealTextContainer}>
            <TextInput style={styles.mealText} onChangeText={(text) => setMeal(text)} placeholder='Meal' />
            <TextInput style={styles.mealText} onChangeText={(text) => setTime(text)} placeholder='Time taken' />
            <TextInput style={styles.mealText} onChangeText={(text) => setKcal(text)} placeholder='Calories Consumed' />
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={() => { saveData(); saveDetails(true); }}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  mealContainer: {
    padding: '3%',
    marginBottom: '5%',
    // width: '90%',
    borderRadius: 10,
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
  },
  saveBtn: {
    backgroundColor: 'green',
    width: '20%',
    padding: '6%',
    borderRadius: 10,
    position: 'absolute',
    bottom: '5%',
    right: '0%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: 'white',
  },
});