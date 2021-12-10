import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Formik} from 'formik';
function FormikForm({validationSchema, initialValues, onSubmit, children}) {
  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}>
        {() => <>{children}</>}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default FormikForm;
