import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { addTransaction } from '../database/db';
import { formatDate } from '../utils/helpers';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';

const AddTransactionScreen = ({ navigation }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(formatDate(new Date()));
  const [remark, setRemark] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleAddTransaction = async () => {
    if (!amount || !category || !date) {
      alert('请填写金额、分类和日期');
      return;
    }

    try {
      await addTransaction(type, parseFloat(amount), category, date, remark);
      alert('添加成功');
      navigation.goBack();
    } catch (error) {
      alert('添加失败: ' + error.message);
    }
  };

  const handleDateChange = (text) => {
    if (text.length === 10) {
      setDate(text);
      setShowDateModal(false);
    } else if (text.length <= 10) {
      setDate(text);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
          onPress={() => { setType('expense'); setCategory(''); }}
        >
          <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>支出</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
          onPress={() => { setType('income'); setCategory(''); }}
        >
          <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>收入</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>金额</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>分类</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={styles.selectText}>{category || '选择分类'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>日期</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={handleDateChange}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>备注（可选）</Text>
        <TextInput
          style={[styles.input, styles.remarkInput]}
          placeholder="添加备注..."
          value={remark}
          onChangeText={setRemark}
          multiline
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleAddTransaction}
      >
        <Text style={styles.saveButtonText}>保存</Text>
      </TouchableOpacity>

      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>选择分类</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Text style={styles.closeText}>关闭</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryOption}
                  onPress={() => {
                    setCategory(item);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={styles.categoryOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center'
  },
  typeButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3'
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999'
  },
  typeTextActive: {
    color: '#fff'
  },
  section: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16
  },
  remarkInput: {
    minHeight: 60,
    textAlignVertical: 'top',
    paddingTop: 10
  },
  selectButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  selectText: {
    fontSize: 16,
    color: '#333'
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  closeText: {
    fontSize: 16,
    color: '#2196F3'
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#333'
  }
});

export default AddTransactionScreen;
