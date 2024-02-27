import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export const Status = (props) => {
  const [isDone, updateDoneStatus] = useState(false);

  // Checks and updates the daily progress bar for the exercise feature
  const handleExerciseDoneClick = async () => {
    const exerciseProgStr = await AsyncStorage.getItem('@exerciseProgress')
    var exerciseProgArr = JSON.parse(exerciseProgStr);

    if (props.btnId == 1) {
      exerciseProgArr.splice(0, 1, 1);
      await AsyncStorage.setItem('@exerciseProgress', JSON.stringify(exerciseProgArr));
    }
    if (props.btnId == 2) {
      exerciseProgArr.splice(1, 1, 1);
      await AsyncStorage.setItem('@exerciseProgress', JSON.stringify(exerciseProgArr));
    }
    if (props.btnId == 3) {
      exerciseProgArr.splice(2, 1, 1);
      await AsyncStorage.setItem('@exerciseProgress', JSON.stringify(exerciseProgArr));
    }
  }

  // Check for the default state of the button (Done/ Not Done)
  const isExerciseDone = async (btnId) => {
    const exerciseProgress = await AsyncStorage.getItem('@exerciseProgress');
    const progressArr = JSON.parse(exerciseProgress);

    if (progressArr[btnId - 1] == 1)
      updateDoneStatus(true)
  }

  useEffect(() => {
    isExerciseDone(props.btnId)
  }, [])
  return (
    <View style={styles.statusContainer}>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => { handleExerciseDoneClick(); updateDoneStatus(true) }}>
          {(isDone == true)
            ?
            <Image
              style={styles.taskIcon}
              source={require('../images/task_2.png')}
              resizeMode='contain'
            />
            :
            <Image
              style={styles.taskIcon}
              source={require('../images/task_1.png')}
              resizeMode='contain'
            />
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  statusContainer: {
    width: '100%',
    height: '30%',
    marginTop: '5%',
    marginBottom: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskIcon: {
    width: 50,
    height: 50,
  }
});