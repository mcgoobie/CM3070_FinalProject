import { Image, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

export default function LongButton(props) {
  const navigateSection = () => {
    if (!props.onboarded && props.text == 'Exercise') {
      props.navigation.navigate('ExerciseOnboard');
    } else {
      props.navigation.navigate(props.text);
    }
  }
  return (
    <TouchableOpacity
      style={[props.color, styles.sectionBtn, styles.boxShadowIOS, styles.boxShadowAndroid]}
      onPress={navigateSection}
    >
      <Text style={styles.btnTitle}>{props.title}</Text>
      <Image
        style={styles.buttonImg}
        source={props.imgSrc}
        resizeMode='cover'
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sectionBtn: {
    borderRadius: 10,
    width: '47%',
    height: '40%',
    padding: '3%',
    marginBottom: '3%',
    flexDirection: 'column',
  },
  btnTitle: {
    fontSize: 18,
  },
  buttonImg: {
    width: 150,
    height: 150,
    position: 'absolute',
    bottom: -25,
    right: -25,
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

