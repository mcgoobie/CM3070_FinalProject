import { StyleSheet, Text, View, Animated, ScrollView, SafeAreaView, Image, TouchableOpacity, StatusBar, FlatList, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Badge } from '../SharedComponents/Badge';

const achievementJson =
  [
    {
      id: 0,
      name: "Newcomer",
      badge: require('../images/Medal_Icons/Bronze_Medal.png'),
      desc: "Complete all daily tasks on your first day.",
    },
    {
      id: 1,
      name: "Tenacious Individual",
      badge: require('../images/Medal_Icons/Silver_Medal.png'),
      desc: "Complete all daily tasks for a week .",
    },
    {
      id: 2,
      name: "Seasoned Veteran",
      badge: require('../images/Medal_Icons/Gold_Medal.png'),
      desc: "Stay consistent and complete all daily tasks for a month.",
    },
    {
      id: 3,
      name: "The Summit",
      badge: require('../images/Medal_Icons/Top_Medal.png'),
      desc: "Consistency was kept and all daily tasks was comepleted for a year.",
    },
    {
      id: 4,
      name: "Early Bird",
      badge: require('../images/Medal_Icons/Sleep_Medal.png'),
      desc: "Wake up when the world is still sleeping, set an alarm for 6-7 AM.",
    },
    {
      id: 5,
      name: "Fitness Junkie",
      badge: require('../images/Medal_Icons/Fitness_Medal.png'),
      desc: "You stayed active and had a consistent workout for a month.",
    },
    {
      id: 6,
      name: "Water Tank",
      badge: require('../images/Medal_Icons/Water_Medal.png'),
      desc: "Consume up to 5L of water in a single day.",
    },
    {
      id: 7,
      name: "Temple Body",
      badge: require('../images/Medal_Icons/Food_Medal.png'),
      desc: "Your body is a temple, you ate right and did not skip a single meal for a month.",
    }
  ]

const statusTracker =
  [
    {
      id: 0,
      conditionTracker: 0,
      completed: false
    },
    {
      id: 1,
      conditionTracker: 0,
      completed: false
    },
    {
      id: 2,
      conditionTracker: 0,
      completed: false
    },
    {
      id: 3,
      conditionTracker: 0,
      completed: false
    },
    {
      id: 4,
      conditionTracker: 0,
      completed: false
    },
    {
      id: 5,
      conditionTracker: 0,
      completed: false
    },
    {
      id: 6,
      conditionTracker: 0,
      completed: false
    },
    {
      id: 7,
      conditionTracker: 0,
      completed: false
    }
  ]

const windowHeight = Dimensions.get('window').height;

export const AchievementsScreen = (props) => {
  // Store Achivements Tracker JSON
  const [achievementTrackers, updateTrackers] = useState();
  const [trackersLoaded, toggleTrackers] = useState(false);

  const navigation = useNavigation();

  const loadTrackers = async () => {
    console.log('acheivement trackers loading');
    const achievementsString = await AsyncStorage.getItem('@achievementTrackers');

    // If List not generate/new user
    if (achievementsString == null) {
      await AsyncStorage.setItem('@achievementTrackers', JSON.stringify(statusTracker));
      updateTrackers(achievementJson)
    } else {
      updateTrackers(JSON.parse(achievementsString));
    }
    toggleTrackers(true);
  }

  useEffect(() => {
    const checkTrackers = navigation.addListener('focus', () => {
      loadTrackers();
    });
    return checkTrackers;
  }, []);
  return (
    <Animated.View style={[styles.container, styles.boxShadowAndroid, styles.boxShadowIOS, { transform: [{ translateX: props.slideAnimation }] }]}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.achievementsContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Achievements</Text>
            <TouchableOpacity onPress={props.toggleSidebar}>
              <Text style={styles.headerBack}>Back</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.badgesContainer}>
            {trackersLoaded
              ?
              <FlatList
                data={achievementJson}
                numColumns={2}
                columnWrapperStyle={styles.badgesColumn}
                keyExtractor={item => item.id}
                renderItem={({ item }) =>
                  <Badge
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    imgSrc={item.badge}
                    status={achievementTrackers}
                  />
                }
              />
              :
              <Text>Loading Trackers</Text>
            }
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: 'white',
    position: 'absolute',
    height: windowHeight,
    width: 300,
    right: -300,
    zIndex: 10,
  },
  safeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  achievementsContainer: {
    width: '100%',
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
  headerBack: {
    fontSize: 18,
    color: 'lightgrey',
    textDecorationLine: 'underline',
  },
  badgesContainer: {

  },
  badgesColumn: {
    marginBottom: '5%',
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
  }
});