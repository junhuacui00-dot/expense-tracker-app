import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency } from '../utils/helpers';

const StatCard = ({ title, amount, color = '#333' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.amount, { color }]}>{formatCurrency(amount)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  title: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default StatCard;
