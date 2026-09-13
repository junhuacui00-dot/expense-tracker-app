import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { getRecentTransactions } from '../database/db';
import { calculateStats, formatCurrency, getMonthName } from '../utils/helpers';
import TransactionItem from '../components/TransactionItem';
import StatCard from '../components/StatCard';

const BillsScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const allTransactions = await getRecentTransactions(1000);
    setTransactions(allTransactions);
    
    const calculatedStats = calculateStats(allTransactions);
    setStats(calculatedStats);
  };

  const handleDelete = async (id) => {
    // TODO: implement delete
    loadData();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>账单列表</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard title="总收入" amount={stats.income} color="#4CAF50" />
        <StatCard title="总支出" amount={stats.expense} color="#FF5252" />
        <StatCard title="结余" amount={stats.balance} color="#2196F3" />
      </View>

      <View style={styles.listContainer}>
        {transactions.length > 0 ? (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TransactionItem transaction={item} onDelete={handleDelete} />
            )}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>暂无账单</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  header: {
    backgroundColor: '#2196F3',
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 8
  },
  listContainer: {
    marginTop: 8,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 40,
    fontSize: 16
  }
});

export default BillsScreen;
