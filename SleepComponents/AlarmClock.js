import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AlarmClock = () => {
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [sound, setSound] = useState();
  const [alarmDate, updateAlarmTime] = useState(new Date());

  const [showPicker, setShowPicker] = useState(false);

  const tuneAlarmDate = () => {
    const currentDate = new Date();
    // Create a copy of the current date
    const nextDayDate = new Date(currentDate);
    // Update to the following day.
    nextDayDate.setUTCDate(nextDayDate.getUTCDate() + 1);
    updateAlarmTime(nextDayDate);
  }

  const checkAlarm = () => {
    const currentDate = new Date();
    if (currentDate >= alarmDate) {
      playAlarmSound();
    }
  };

  const playAlarmSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/alarm_sound.mp3'),
        { shouldPlay: true, allowsBackgroundPlayback: true }
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('Error playing sound: ', error);
    }
  };

  const stopAlarmSound = async () => {
    if (sound) {
      await sound.stopAsync();
      sound.unloadAsync();
    }
  };

  const handleSetAlarm = async () => {
    setIsAlarmSet(true);
    await AsyncStorage.setItem('@sleepProgress', '1');
  };

  const handleCancelAlarm = async () => {
    setIsAlarmSet(false);
    stopAlarmSound();
    await AsyncStorage.setItem('@sleepProgress', '0');
  };

  // Date Time Picker Functions
  const toggleTimePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = (event, selectedTime) => {
    const currentTime = selectedTime;
    updateAlarmTime(currentTime);

    checkSleepMedal(selectedTime);
  };

  checkSleepMedal = async (time) => {
    const sixAmTime = new Date();

    sixAmTime.setHours(6);
    sixAmTime.setMinutes(0);
    sixAmTime.setSeconds(0);
    sixAmTime.setMilliseconds(0);

    const sevenAmTime = new Date();

    sixAmTime.setHours(7);
    sixAmTime.setMinutes(0);
    sixAmTime.setSeconds(0);
    sixAmTime.setMilliseconds(0);

    if (time >= sixAmTime && time <= sevenAmTime) {
      const achievementsString = await AsyncStorage.getItem('@achievementTrackers');
      var achievementsTracker = JSON.parse(achievementsString);

      // Only check if achievement is not yet completed
      if (achievementsTracker[4].completed !== true) {
        console.log('sleep medal earned');
        achievementsTracker[4].conditionTracker = 1;
        achievementsTracker[4].completed = true;

        // Update with new tracker JSON
        await AsyncStorage.setItem('@achievementTrackers', JSON.stringify(achievementsTracker));
      }
      return;
    }
  }

  useEffect(() => {
    if (isAlarmSet) {
      const intervalId = setInterval(() => {
        checkAlarm();
      }, 1000);

      return () => clearInterval(intervalId);
    }
    tuneAlarmDate();
  }, [isAlarmSet]);

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>
        Set your alarm:
      </Text>
      <View style={styles.alarmContainer}>
        {/* {showPicker && ( */}
        <DateTimePicker
          style={{ marginTop: '5%', marginBottom: '5%' }}
          value={alarmDate}
          mode={'time'}
          is24Hour={true}
          onChange={onChange}
        />
        {/* )} */}
        {/* <View>
          <TouchableOpacity onPress={() => toggleTimePicker()}>
            <Text style={styles.confirmBtn}>Open Alarm</Text>
          </TouchableOpacity>
        </View> */}
        {isAlarmSet ? (
          <View>
            <Text>Alarm will ring at: {alarmDate.toLocaleString()}</Text>
            <TouchableOpacity
              onPress={() => handleCancelAlarm()}
            >
              <Text style={styles.confirmBtn}>Cancel Alarm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              onPress={() => handleSetAlarm()}
            >
              <Text style={styles.confirmBtn}>Set Alarm</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: '5%',
  },
  alarmContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textHeader: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 18,
  },
  confirmBtn: {
    color: '#c5c5db',
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});

export default AlarmClock;