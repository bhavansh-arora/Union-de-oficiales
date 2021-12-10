import React, {useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

function AppTextInput({onBlur, error, ...otherPerameters}) {
  const [focus, setFocus] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor="green"
        style={styles.textInput}
        {...otherPerameters}
        onFocus={() => setFocus(true)}
        onBlur={() => {
          setFocus(false);
          onBlur();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',

    alignItems: 'center',
    paddingHorizontal: 15,
    marginVertical: 7,

    borderBottomWidth: 2,
    borderBottomColor: 'orange',
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    paddingRight: 25,
  },
});

export default AppTextInput;
