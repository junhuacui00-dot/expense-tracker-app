export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

export const formatCurrency = (amount) => {
  return `¥${parseFloat(amount).toFixed(2)}`;
};

export const getMonthName = (month) => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  return months[month - 1] || '';
};

export const calculateStats = (transactions) => {
  let income = 0;
  let expense = 0;
  
  transactions.forEach(t => {
    if (t.type === 'income') {
      income += t.amount;
    } else if (t.type === 'expense') {
      expense += t.amount;
    }
  });
  
  return {
    income,
    expense,
    balance: income - expense
  };
};

export const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${month}/${day}`;
};
