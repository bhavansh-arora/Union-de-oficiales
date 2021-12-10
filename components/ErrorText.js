import React from 'react';
import {StyleSheet, Text} from 'react-native';

function ErrorText({error, visible, style}) {
  if (!visible || !error) {
    return null;
  }
  return <Text style={[styles.container, style]}>{error}</Text>;
}

const styles = StyleSheet.create({
  container: {
    color: 'red',
  },
});

export default ErrorText;
