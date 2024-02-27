import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Loading = () => {
  const [dots, updateDots] = useState('');

  const loadingSpinner = () => {
    updateDots(dots + '.')
    if(dots.length >= 3)
      updateDots('')
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadingSpinner()
    }, 500); // Adjust the interval duration as needed

    return () => clearInterval(intervalId);
  }, [dots]);

  return (
    <View style={styles.container}>
      <Text style={styles.loadText}>Loading{dots}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadText: {
    fontSize: 24,
    color: '#F6D7D2',
    fontWeight: 'bold',
  },
});