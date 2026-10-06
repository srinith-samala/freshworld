import React, { useState, useEffect, useMemo } from 'react';
import { API } from '../config';
import Header from '../components/Header';

const money = (n) => `₹${Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function PandL() {
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  });

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/dailysales`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${API}/api/expenses`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${API}/api/payroll`, { headers: authHeaders() }).then(r => r.json())
    ]).then(([s, e, p]) => {
      setSales(Array.isArray(s) ? s : []);
      setExpenses(Array.isArray(e) ? e : []);
      setPayroll(Array.isArray(p) ? p : []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => {
    const totalSales = sales.reduce((acc, s) => acc + (s.cash + s.card + s.upi + s.zomato), 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const totalPayroll = payroll.reduce((acc, p) => acc + p.netPay, 0);
    
    // Purchases are part of expenses if grouped correctly, or we can just sum them
    const netProfit = totalSales - totalExpenses - totalPayroll;
    
    return { totalSales, totalExpenses, totalPayroll, netProfit };
  }, [sales, expenses, payroll]);

  if (loading) return <div style={{ padding: 24 }}>Loading P&L Data...</div>;

  const isProfit = summary.netProfit >= 0;

  return (
    <div className="page-fade" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header title="Monthly P&L Overview" subtitle="High-level profit and loss tracking" />
      <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
        <div className="card" style={{ marginBottom: 24, background: isProfit ? '#D6F5E3' : '#FEE2E2', borderLeft: `5px solid ${isProfit ? '#16A34A' : '#EF4444'}` }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#8A94A6', textTransform: 'uppercase' }}>Net Profit / Loss</p>
          <p style={{ fontSize: 40, fontWeight: 800, color: isProfit ? '#16A34A' : '#EF4444' }}>
            {isProfit ? '+' : '-'}{money(summary.netProfit)}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, color: '#8A94A6', marginBottom: 10 }}>Total Sales (All Channels)</h3>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#16A34A' }}>{money(summary.totalSales)}</p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: 16, color: '#8A94A6', marginBottom: 10 }}>Total Expenses & Purchases</h3>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#F59E0B' }}>{money(summary.totalExpenses)}</p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: 16, color: '#8A94A6', marginBottom: 10 }}>Total Payroll</h3>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#EF4444' }}>{money(summary.totalPayroll)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
