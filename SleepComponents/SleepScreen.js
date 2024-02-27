import { StyleSheet, Text, View, StatusBar, TextInput } from 'react-native';
import { SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AlarmClock from './AlarmClock';


export const SleepScreen = ({ navigation }) => {
  const [bedtime, editBedtime] = useState('22:00');
  const [editableBedtime, toggleBedtimeField] = useState(false);

  const BackButton = () => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={[styles.back, styles.boxShadowIOS, styles.boxShadowAndroid]}>Back to Home</Text>
      </TouchableOpacity>
    )
  }
  
  console.log('- sleep screen -');
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.headContainer}>
          <BackButton />
          <Text style={[styles.textHeader, styles.boxShadowIOS, styles.boxShadowAndroid]}>Sleep Target</Text>
        </View>
        <View style={styles.imgContainer}>
          <Image
            style={styles.homeLogo}
            source={require('../images/sleep_cat.png')}
            resizeMode='contain'
          />
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.bedtimeSection}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Current Bedtime:</Text>
              <TouchableOpacity onPress={() => toggleBedtimeField(!editableBedtime)}>
                {editableBedtime
                  ? <Text style={styles.headerEdit}>Save</Text>
                  : <Text style={styles.editBtn}>Change Bedtime</Text>
                }
              </TouchableOpacity>
            </View>
            <View style={styles.bedtimeContainer}>
              {editableBedtime
                ? <TextInput style={[styles.goalText, styles.bedtimeTextInput]} onChangeText={(text) => editBedtime(text)} placeholder={bedtime} />
                : <Text style={styles.bedtimeText}>{bedtime}</Text>
              }
            </View>
          </View>
          <View style={{ borderBottomColor: 'lightgrey', borderBottomWidth: 1 }} />
          <View style={styles.alarmSection}>
            <AlarmClock />
          </View>
        </View>
      </SafeAreaView >
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7E7F4',
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
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  homeLogo: {
    width: 400,
    height: 400,
  },
  imgContainer: {
    width: '90%',
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    padding: '5%',
    width: '90%',
    backgroundColor: 'white',
    flex: 4,
    borderRadius: 10,
  },
  headerContainer: {
    // borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bedtimeContainer: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
    marginBottom: '5%',
  },
  bedtimeText: {
    fontSize: 42,
    fontWeight: '200',
  },
  bedtimeTextInput: {
    fontSize: 42,
    textDecorationLine: 'underline',
    fontWeight: '200'
  },
  title: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 18,
  },
  editBtn: {
    textAlign: 'right',
    color: 'lightgrey',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  alarmSection: {
  }
});