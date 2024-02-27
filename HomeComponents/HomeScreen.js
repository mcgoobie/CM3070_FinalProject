import { StyleSheet, Text, View, Animated, ScrollView, SafeAreaView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LongButton from './LongButton';
import FeatureProgress from './FeatureProgress';
import { AchievementsScreen } from '../AchievementComponents/AchievementsScreen';

export const HomeScreen = ({ navigation, route }) => {
  // States for each feature and their progress trackers
  const [calorieState, setCalorieState] = useState([0, 0, 0]);
  const [calorieProg, updateCalorieProg] = useState(0);

  const [exerciseState, setExerciseState] = useState([0, 0, 0]);
  const [exerciseProg, updateExerciseProg] = useState(0);
  // isOnboarded: Checks if the exercise feature has been opened before
  const [isOnboarded, toggleOnboard] = useState(false);

  const [hydrationProg, setHydrationProg] = useState(0);

  const [sleepProg, setSleepProg] = useState(0);

  // States for toggling of the achievements sidebar
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    Animated.timing(animation, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const slideAnimation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -300],
  });

  // Debug
  const clearAsyncStorage = async () => {
    AsyncStorage.clear();
  }

  // Check for a new day, if true, daily progress will reset
  const isNewDay = async () => {
    var date = new Date();
    date = date.toJSON().slice(0, 10);
    date = JSON.stringify(date);
    const savedDate = await AsyncStorage.getItem('@daily-date');

    // Compare current date and saved date, reset AsyncStorage items if different day.
    if (date !== savedDate) {
      initAsyncDailyProg();
    } else {
      loadAsyncDailyProg();
    }
  }

  // Initialise a set of new async storage keys used to track daily progress
  const initAsyncDailyProg = async () => {
    try {
      await AsyncStorage.setItem('@calorieProgress', JSON.stringify(calorieState));
      await AsyncStorage.setItem('@exerciseProgress', JSON.stringify(exerciseState));
      await AsyncStorage.setItem('@hydrationProgress', JSON.stringify(hydrationProg));

      // Save date to track the daily progress.
      var date = new Date();
      date = date.toJSON().slice(0, 10);
      await AsyncStorage.setItem('@daily-date', JSON.stringify(date));

      console.log('Preparing new dailies..');
    } catch (error) {
      console.error('Error initializing async variable(s):', error);
    }
  };

  // If the day is not over, pick up where app state was left off
  const loadAsyncDailyProg = async () => {
    try {
      loadCalorieProg();
      loadExerciseProg();
      loadHydrationProg();
      loadSleepProg();
      // Check if it is the user's first time using Habits
      checkExerciseOnboarded();

      // Update medal trackers linked to the home screen.
      updateMedalTrackers();
      console.log('Retrieving existing dailies..');
    } catch (error) {
      console.error('Error initializing async variable(s):', error);
    }
  };

  // Update medal completion status and progress tracker.
  const updateMedalTrackers = () => {
    checkNewcomerMedal();
    // Streak medals for the weekly, monthly and yearly consistency badges.
    checkStreakMedal(1, 7); // Weekly
    checkStreakMedal(2, 31); // Monthly
    checkStreakMedal(3, 365); // Yearly
    // Both fitness and calorie medals are a 1 mth tracker.
    checkMonthlyMedal(5, '@fitnessStreakDate'); // Fitness medal id
    checkMonthlyMedal(7, '@calorieStreakDate'); // Calorie medal id

  }

  // Fetch async storage item for the exercise feature progress
  const loadExerciseProg = async () => {
    try {
      const exerciseProgressStr = await AsyncStorage.getItem('@exerciseProgress');
      var exerciseProgress = exerciseProgressStr ? JSON.parse(exerciseProgressStr) : [];
      // update current state of the progress
      setExerciseState(exerciseProgress);

      // Evaluate the sum out of 100%
      var sum = sumProgPercentage(exerciseProgress);
      updateExerciseProg(`${Math.round(33.3 * sum)}`);
    } catch (error) {
      console.error('Error loading async variable:', error);
    }
  }
  //  Check if WGER API has been saved
  const checkExerciseOnboarded = async () => {
    const onboardedHist = await AsyncStorage.getItem('@exerciseOnboarded');
    if (onboardedHist === 'true')
      toggleOnboard(true)
    else
      toggleOnboard(false)
  }

  // Fetch async storage item for the calorie feature progress
  const loadCalorieProg = async () => {
    try {
      const calorieProgressStr = await AsyncStorage.getItem('@calorieProgress');
      var calorieProgress = calorieProgressStr ? JSON.parse(calorieProgressStr) : [];
      // update current state of the progress
      setCalorieState(calorieProgress);

      // Evaluate the sum out of 100%
      var sum = sumProgPercentage(calorieProgress);
      updateCalorieProg(`${Math.round(33.3 * sum)}`);
    } catch (error) {
      console.error('Error loading async variable:', error);
    }
  }

  // Fetch async storage item for hydration feature progress
  const loadHydrationProg = async () => {
    try {
      const hydrationProgressStr = await AsyncStorage.getItem('@hydrationProgress');
      var hydrationProgress = JSON.parse(hydrationProgressStr);
      if (hydrationProgressStr == null)
        setHydrationProg(0);
      else
        setHydrationProg(`${hydrationProgress}`);
    } catch (error) {
      console.error('Error loading async variable:', error);
    }
  }

  // Fetch async storage item for sleep feature progress
  const loadSleepProg = async () => {
    try {
      const sleepProgressStr = await AsyncStorage.getItem('@sleepProgress');
      if (parseInt(sleepProgressStr) == 1)
        setSleepProg(100);
      else
        setSleepProg(0);
    } catch (error) {
      console.error('Error loading async variable:', error);
    }
  }

  // Find sum of progression landmarks for the feature
  const sumProgPercentage = (progress) => {
    var sum = 0;
    progress.forEach(num => {
      sum += num;
    })

    return sum;
  };

  // Tracker for newcomer medal
  const checkNewcomerMedal = async () => {
    const achievementsString = await AsyncStorage.getItem('@achievementTrackers');
    var achievementsTracker = JSON.parse(achievementsString);

    // Only check if achievement is not yet completed
    if (achievementsTracker[0].completed !== true) {
      if (calorieProg == 100 && sleepProg == 100 &&
        exerciseProg == 100 && hydrationProg == 100) {
        // Toggle condition to completed
        achievementsTracker[0].conditionTracker = 1;
        achievementsTracker[0].completed = true;

        // Update with new tracker JSON
        await AsyncStorage.setItem('@achievementTrackers', JSON.stringify(achievementsTracker));
      }
    } else {
      return;
    }
  }

  // Tracker for streaj Medals (7-day Streak, 1-month, 1 year etc.)
  const checkStreakMedal = async (id, targetNumber) => {
    const achievementsString = await AsyncStorage.getItem('@achievementTrackers');
    var achievementsTracker = JSON.parse(achievementsString);

    const savedDate = await AsyncStorage.getItem('@daily-date');

    if (achievementsTracker[id].completed !== true) {
      // get current streak of the medal
      var streak = achievementsTracker[id].conditionTracker;
      if (calorieProg == 100 && sleepProg == 100 &&
        exerciseProg == 100 && hydrationProg == 100) {
        // Toggle condition to completed
        const streakDate = await AsyncStorage.getItem('@loginStreak');
        // Condition triggers if it's the first day of the streak
        if (streakDate == null && streak == 0) {
          achievementsTracker = addToStreak(achievementsTracker, id, '@loginStreak');
        }
        // Check condition for subsequent days
        else if (streakDate !== savedDate && streak > 1) {
          achievementsTracker = addToStreak(achievementsTracker, id, '@loginStreak');
        }

        // Check if user has succeded in keeping consistency for X
        if (streak == targetNumber) {
          achievementsTracker[id].completed = true;
        }

        // Update with new tracker JSON
        await AsyncStorage.setItem('@achievementTrackers', JSON.stringify(achievementsTracker));
      }
    }
  }

  //  checks and updates the streak of a medal and its last recorded date 
  const addToStreak = async (tracker, id, keyValue) => {
    var streak = tracker[id].conditionTracker;
    tracker[id].conditionTracker = streak + 1;

    var date = new Date();
    date = date.toJSON().slice(0, 10);
    await AsyncStorage.setItem(keyValue, JSON.stringify(date)); // Break Out

    return tracker;
  }


  const checkMonthlyMedal = async (id, streakKey) => {
    const achievementsString = await AsyncStorage.getItem('@achievementTrackers');
    var achievementsTracker = JSON.parse(achievementsString);

    const savedDate = await AsyncStorage.getItem('@daily-date');

    if (achievementsTracker[id].completed !== true) {
      var streak = achievementsTracker[id].conditionTracker;
      const streakDate = await AsyncStorage.getItem(streakKey);
      if (calorieProg == 100) {

        if (streakDate == null && streak == 0) {
          achievementsTracker = addToStreak(achievementsTracker, id, streakKey);
        }
        // Check condition for subsequent days
        else if (streakDate !== savedDate && streak > 1) {
          achievementsTracker = addToStreak(achievementsTracker, id, streakKey);
        }

        // Check if user has succeded in keeping consistency for 1 mth
        if (streak == 31) {
          achievementsTracker[id].completed = true;
        }

        // Update with new tracker JSON
        await AsyncStorage.setItem('@achievementTrackers', JSON.stringify(achievementsTracker));
      }
    }
  }

  useEffect(() => {
    isNewDay();
    checkExerciseOnboarded();
    const fetchAsyncDailies = navigation.addListener('focus', () => {
      loadAsyncDailyProg();
    });
    return fetchAsyncDailies;
  }, [calorieProg, sleepProg, exerciseProg, hydrationProg]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.navContainer}>
          <TouchableOpacity style={styles.achievBtn} onPress={toggleSidebar}>
            <Text style={styles.achievText}>Achievements</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Image
            style={styles.homeLogo}
            source={require('../images/word_logo.png')}
            resizeMode='contain'
          />
        </View>
        <View style={[styles.progressContainer, styles.boxShadowAndroid, styles.boxShadowIOS]}>
          <ScrollView>
            <Text style={styles.progressTitle}>My Progress</Text>
            <Text style={styles.progressSubtitle}>Daily</Text>
            <FeatureProgress
              text={'Sleep'}
              width={sleepProg}
            />
            <FeatureProgress
              text={'Hydration'}
              width={hydrationProg}
            />
            <FeatureProgress
              text={'Exercise'}
              width={exerciseProg}
            />
            <FeatureProgress
              text={'Calories'}
              width={calorieProg}
            />
          </ScrollView>
        </View>
        <View style={styles.sectionContainer}>
          <LongButton
            text={'Sleep'}
            title={'Sleep'}
            color={{ backgroundColor: '#E7E7F4' }}
            imgSrc={require('../images/sleep_cat.png')}
            navigation={navigation}
          />
          <LongButton
            text={'Hydration'}
            title={'Hydration'}
            color={{ backgroundColor: '#D7EDF0' }}
            imgSrc={require('../images/drink_cat.png')}
            navigation={navigation}
          />
          <LongButton
            text={'Exercise'}
            title={'Exercise'}
            color={{ backgroundColor: '#F6D7D2' }}
            imgSrc={require('../images/exercise_cat.png')}
            navigation={navigation}
            onboarded={isOnboarded}
          />
          <LongButton
            text={'Calories'}
            title={'Calories'}
            color={{ backgroundColor: '#F0E1C3' }}
            imgSrc={require('../images/eat_cat.png')}
            navigation={navigation}
          />
          <TouchableOpacity onPress={() => clearAsyncStorage()}>
            <Text>(Debug) Clear Async Storage</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <AchievementsScreen
        slideAnimation={slideAnimation}
        toggleSidebar={toggleSidebar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F1F2',
  },
  safeContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  navContainer: {
    width: '90%',
    flex: 1,
    zIndex: 5,
  },
  achievText: {
    textAlign: 'right',
    fontSize: 16,
  },
  titleContainer: {
    width: '90%',
    // height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 3,
  },
  homeLogo: {
    width: '100%',
  },
  progressContainer: {
    backgroundColor: 'white',
    width: '90%',
    height: '20%',
    borderRadius: 10,
    padding: '3%',
    marginBottom: '3%',
  },
  progressTitle: {
    fontSize: 18,
    color: '#5F979E',
    marginBottom: '3%',
  },
  progressSubtitle: {
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: '6%',
  },
  sectionContainer: {
    width: '90%',
    height: '50%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
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
  achivementsContainer: {
    // position: 'absolute',
    // width: '100%',
    // height: '100%',
    // alignItems: 'center',
    // justifyContent: 'center',
    // // backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 3,
    borderWidth: 1,
    borderColor: 'blue',
  }
});