import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export const Badge = (props) => {
  const [isDone, toggleCompletion] = useState({ opacity: 0.4 });
  const badgeStatus = props.status;

  // Checks if the badge has been earned
  const checkCompletion = () => {
    const isCompleted = badgeStatus[props.id].completed;

    if (isCompleted)
      toggleCompletion({ opacity: 1 })
    else
      toggleCompletion({ opacity: 0.4 })
  }

  // If badge is not earned, what is the current condition of its status(?)
  const checkCondition = () => {

  }

  useEffect(() => {
    if(badgeStatus !== undefined)
      checkCompletion();
  }, [badgeStatus]);
  // console.log(props.status[props.id]);
  return (
    <View style={[styles.badgeContainer, isDone]}>
      <TouchableOpacity>
        <Image
          style={styles.badgeImg}
          source={props.imgSrc}
          resizeMode='contain'
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  // badgeContainer: {
  //   opacity: isDone,
  // },
  badgeImg: {
    width: 100,
    height: 100,
  }
})