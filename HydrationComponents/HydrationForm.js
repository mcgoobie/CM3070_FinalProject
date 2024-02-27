import { StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';

import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HydrationForm = (props) => {
  // Default values needed for the dropdown picker package
  const [isOpen, toggleOpen] = useState(false);
  const [drinkValue, setDrinkValue] = useState(null);
  const [list, setList] = useState([
    { label: 'Water', value: 'Water' },
    { label: 'Coffee', value: 'Coffee' },
    { label: 'Tea', value: 'Tea' },
    { label: 'Others', value: 'Others' }
  ]);

  // State for toggling highlight color of the textinput
  const [borderBottomColor, toggleHighlight] = useState('white');
  const [textValue, updateTextValue] = useState('');

  // Get timestamp when drink is added
  const getTimeStamp = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
  
    return `${hours}:${minutes}`;
  }

  // Append the new drink item to an array list that is stored
  // in the asyncstorage
  const handleFormSubmission = async () => {
    var timeSaved = getTimeStamp();
    var liquidsJsonStr = await AsyncStorage.getItem('@drinks-list')
    var newRow = {
      volume: textValue,
      type: drinkValue,
      timestamp: timeSaved
    }

    // prepare a new array obj IF one is not found in the asyncstorage
    if (liquidsJsonStr == null) {
      var newList = [];

      // append drink entry to the list and save to asyncstorage
      newList.push(newRow);
      await AsyncStorage.setItem('@drinks-list', JSON.stringify(newList));
      console.log('drink added');
    } 
    // Else get existing from storage and append then save to it
    else {
      var liquidsJson = JSON.parse(liquidsJsonStr);
      liquidsJson.push(newRow);
      await AsyncStorage.setItem('@drinks-list', JSON.stringify(liquidsJson));

    }

    // Close the form and return
    props.updateForm(!props.drinkAdded);
    return;
  }

  // Changes color of Volume text input
  const onFocus = (focused) => {
    if (focused)
      toggleHighlight('#6699FF');
    else
      toggleHighlight('white');
  }


  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>What did you drink?</Text>
      <View style={styles.fieldContainer}>
        <View style={styles.formHeadersContainer}>
          <View style={styles.formLeftContainer}>
            <Text style={styles.formHeaders}>Volume</Text>
            <TextInput
              style={[styles.volInput, { borderBottomColor }]}
              onFocus={() => onFocus(true)}
              onBlur={() => onFocus(false)}
              placeholder='Vol. in ML'
              keyboardType='numeric'
              onChangeText={(value) => updateTextValue(value)}
            />
          </View>
          <View style={styles.formRightContainer}>
            <Text style={styles.formHeaders}>Type</Text>
            <DropDownPicker
              style={styles.dropDownBox}
              open={isOpen}
              value={drinkValue}
              items={list}
              setOpen={toggleOpen}
              setValue={setDrinkValue}
              setItems={setList}
              selectedItemContainerStyle={{
                // textDecorationLine: 'underline',
                backgroundColor: '#DEDEDE',
              }}
              dropDownContainerStyle={{
                // backgroundColor: 'red',
                zIndex: 1,
                borderColor: '#DEDEDE',
              }}
            />
          </View>
        </View>
        <View style={styles.btnsContainer}>
          <TouchableOpacity
            onPress={() => handleFormSubmission()}>
            <Text style={styles.confirmBtn}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.updateForm(!props.drinkAdded)}>
            <Text style={styles.cancelBtn}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    width: '90%',
    height: '40%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: '5%',
  },
  formTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  fieldContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  formHeadersContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  formHeaders: {
    fontSize: 21,
    // textAlign: 'center',
  },
  formLeftContainer: {
    width: '50%',
    height: 200,
    padding: '5%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    // borderWidth: 1,
  },
  formRightContainer: {
    width: '50%',
    height: 200,
    padding: '5%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  volInput: {
    padding: '11%',
    fontSize: 18,
    borderBottomWidth: 1,
  },
  dropDownBox: {
    borderWidth: 0,
  },
  btnsContainer: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: -1,
  },
  confirmBtn: {
    fontSize: 21,
    marginRight: '10%',
    color: '#6699FF',
  },
  cancelBtn: {
    fontSize: 21,
    marginLeft: '10%',
    color: '#FF5252'
  },
})