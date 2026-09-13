import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { getRecentTransactions, getMonthStats } from '../database/db';
import { calculateStats, formatCurrency, getMonthName } from '../utils/helpers';
import StatCard from '../components/StatCard';
import TransactionItem from '../components/TransactionItem';

const HomeScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    
    const allTransactions = await getRecentTransactions(100);
    const monthTransactions = allTransactions.filter(t => t.date >= startDate && t.date <= endDate);
    
    const calculatedStats = calculateStats(monthTransactions);
    setStats(calculatedStats);
    setRecentTransactions(monthTransactions.slice(0, 5));
  };

  const handleDelete = async (id) => {
    // TODO: implement delete
    loadData();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.monthTitle}>{new Date().getFullYear()}年 {getMonthName(new Date().getMonth() + 1)}</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard title="收入" amount={stats.income} color="#4CAF50" />
        <StatCard title="支出" amount={stats.expense} color="#FF5252" />
        <StatCard title="结余" amount={stats.balance} color="#2196F3" />
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Text style={styles.addButtonText}>+ 记一笔</Text>
      </TouchableOpacity>

      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>最近账单</Text>
        {recentTransactions.length > 0 ? (
          <FlatList
            data={recentTransactions}
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
  monthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 8
  },
  addButton: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  recentContainer: {
    marginTop: 8,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 12,
    color: '#333'
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 24
  }
});

export default HomeScreen;
