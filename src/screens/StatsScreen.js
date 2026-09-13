import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { getCategoryStats, getMonthStats } from '../database/db';
import { formatCurrency, getMonthName } from '../utils/helpers';
import StatCard from '../components/StatCard';
import { BarChart } from 'victory-native';

const StatsScreen = () => {
  const [categoryStats, setCategoryStats] = useState([]);
  const [monthStats, setMonthStats] = useState({ income: 0, expense: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const categories = await getCategoryStats(year, month);
    setCategoryStats(categories);

    const stats = await getMonthStats(year, month);
    const income = stats.find(s => s.type === 'income')?.total || 0;
    const expense = stats.find(s => s.type === 'expense')?.total || 0;
    
    setMonthStats({ income, expense });

    const data = categories.map(cat => ({
      x: cat.category,
      y: cat.total
    })).slice(0, 6);
    setChartData(data);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>本月统计</Text>
        <Text style={styles.headerSubtitle}>{getMonthName(new Date().getMonth() + 1)}</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard title="收入" amount={monthStats.income} color="#4CAF50" />
        <StatCard title="支出" amount={monthStats.expense} color="#FF5252" />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>支出分类</Text>
        {chartData.length > 0 && (
          <BarChart
            data={chartData}
            width={350}
            height={200}
            style={{ flex: 1 }}
          />
        )}
      </View>

      <View style={styles.categoryListContainer}>
        <Text style={styles.sectionTitle}>分类明细</Text>
        {categoryStats.length > 0 ? (
          <FlatList
            data={categoryStats}
            keyExtractor={(item) => item.category}
            renderItem={({ item }) => (
              <View style={styles.categoryItem}>
                <Text style={styles.categoryName}>{item.category}</Text>
                <Text style={styles.categoryAmount}>{formatCurrency(item.total)}</Text>
              </View>
            )}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>暂无数据</Text>
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
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
    opacity: 0.8
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 8
  },
  chartContainer: {
    marginTop: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center'
  },
  categoryListContainer: {
    marginTop: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 12
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600'
  },
  categoryAmount: {
    fontSize: 14,
    color: '#FF5252',
    fontWeight: 'bold'
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 24
  }
});

export default StatsScreen;
