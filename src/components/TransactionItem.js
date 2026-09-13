import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatCurrency, formatDisplayDate } from '../utils/helpers';
import { CATEGORY_COLORS } from '../constants/categories';

const TransactionItem = ({ transaction, onDelete }) => {
  const color = transaction.type === 'income' ? '#4CAF50' : '#FF5252';
  const sign = transaction.type === 'income' ? '+' : '-';
  const categoryColor = CATEGORY_COLORS[transaction.category] || '#D3D3D3';

  return (
    <View style={styles.container}>
      <View style={[styles.categoryIcon, { backgroundColor: categoryColor }]}>
        <Text style={styles.categoryText}>{transaction.category[0]}</Text>
      </View>
      
      <View style={styles.content}>
        <View>
          <Text style={styles.category}>{transaction.category}</Text>
          {transaction.remark && <Text style={styles.remark}>{transaction.remark}</Text>}
        </View>
        <Text style={styles.date}>{formatDisplayDate(transaction.date)}</Text>
      </View>
      
      <Text style={[styles.amount, { color }]}>
        {sign}{formatCurrency(transaction.amount)}
      </Text>
      
      <TouchableOpacity 
        style={styles.deleteBtn}
        onPress={() => onDelete(transaction.id)}
      >
        <Text style={styles.deleteText}>删</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  categoryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  remark: {
    fontSize: 12,
    color: '#999',
    marginTop: 2
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginRight: 12
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 80,
    textAlign: 'right',
    marginRight: 8
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 4
  },
  deleteText: {
    color: '#FF5252',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default TransactionItem;
