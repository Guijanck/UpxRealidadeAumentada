import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  label: string;
  placeholder: string;
}

export const InputField = ({ label, placeholder, ...props }: Props) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} placeholder={placeholder}  placeholderTextColor="#ADB5BD" {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: {
    fontSize: 12,
    marginBottom: 6,
    color: '#495057',
  },
  input: {
    height: 50, borderWidth: 1, borderColor: '#CED4DA',
    borderRadius: 8, paddingHorizontal: 14, marginBottom: 16,
    color: '#495057'
  },
});

