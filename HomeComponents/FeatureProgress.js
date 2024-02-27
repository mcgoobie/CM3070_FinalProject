import { Image, StyleSheet, Text, View, Animated } from 'react-native';
import { useState, useEffect } from 'react';

export default function FeatureProgress(props) {
  const [progress, setProgress] = useState(new Animated.Value(0));

  // Using fixed width of 320 
  useEffect(() => {
    Animated.timing(progress, {
      toValue: (props.width / 100) * 320,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [props.width]);
  return (
    <View style={styles.featureContainer}>
      <View style={styles.progSliderContainer}>
        <Text>{props.text}</Text>
        <Text>{props.width}%</Text>
      </View>
      <View style={styles.emptyBar}>
        <Animated.View
          style={
            ([StyleSheet.absoluteFill],
              { backgroundColor: '#8BED4F', borderRadius: 5, width: progress })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  featureContainer: {
    marginBottom: '2%',
  },
  progSliderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '1%',
  },
  emptyBar: {
    width: 320,
    height: 6,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: '#F5F5F5',
    borderColor: '#F5F5F5',
  },

});

