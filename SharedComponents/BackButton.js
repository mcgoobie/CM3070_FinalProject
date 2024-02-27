import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const BackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
      <Text style={[styles.back, styles.boxShadowIOS, styles.boxShadowAndroid]}>Back to Home</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  back: {
    color: 'white',
    textAlign: 'left',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: '5%',
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
})