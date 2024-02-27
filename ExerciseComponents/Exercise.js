import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native';

export const Exercise = (props) => {
  // Parse and remove `"` double-quotes to allow for url reading.
  let imgSrc = props.exercise.imgSrc;
  imgSrc = imgSrc.replace(/"/g, '');
  return (
    <View style={styles.exerciseContainer}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.exerciseImg}
          source={{uri: `${imgSrc}`}}
          resizeMode='contain'
        />
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.textHeader}>{props.exercise.exerciseInfo.name}</Text>
        <Text style={styles.subText}>{props.exercise.reps} Reps</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  exerciseContainer: {
    width: '100%',
    height: '30%',
    flexDirection: 'row',
    alignContent: 'center',
    marginTop: '5%',
    marginBottom: '5%',
  },
  imageContainer: {
    width: '40%',
    height: '80%',
  },
  exerciseImg: {
    width: '100%',
    height: '100%',
  },
  bodyContainer: {
    marginLeft: '5%',
  },
  textHeader: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
  }
});