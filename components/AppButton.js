import React from 'react';
import {Text, StyleSheet, TouchableNativeFeedback, View} from 'react-native';

function AppButton({
  title,
  onPress,
  backgroundColor,
  color,
  loading,
  style,
  textStyle,
}) {
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View
        style={[
          styles.constainer,
          {backgroundColor: backgroundColor, opacity: loading ? 0.5 : 1},
          style,
        ]}>
        <Text
          style={[styles.title, {color: color ? color : 'black'}, textStyle]}>
          {title}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  constainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
    borderRadius: 5,
    backgroundColor: 'grey',
    marginVertical: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'orange',
  },
  title: {
    fontSize: 18,
    textTransform: 'uppercase',
  },
  icon: {
    marginHorizontal: 5,
  },
});

export default AppButton;
