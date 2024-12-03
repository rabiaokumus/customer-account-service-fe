import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
const { v4: uuidv4 } = require('uuid');

const App = () => {
  // States
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [identityNo, setIdentityNo] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [amount, setAmount] = useState('');
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  // Create Customer
  const handleCreateCustomer = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${REACT_APP_API_URL}/customer`, {
        name,
        surname,
        identityNo,
        birthDate,
      });

      setCustomers([...customers, response.data]);
      setName('');
      setSurname('');
      setIdentityNo('');
      setBirthDate('');
    } catch (error) {
      console.error('Customer creation failed', error);
    }
  };

  // Create Account
  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (!selectedCustomerId || !amount) {
      alert('Please select a customer and enter a valid amount');
      return;
    }

    try {
      const response = await axios.post(`${REACT_APP_API_URL}/account`, {
        customerId: selectedCustomerId,
        initialCredit: amount,
        transactionId: uuidv4(),
      });

      setAccounts([...accounts, response.data]);
      setAmount('');
    } catch (error) {
      console.error('Account creation failed', error);
    }
  };

  // Show customer's account
  const handleViewAccounts = (customerId) => {
    setSelectedCustomerId(customerId);

    const customerAccounts = accounts.filter(
      (account) => account.customerId === customerId
    );

    setAccounts(customerAccounts);
  };

  // View Transactions for selected Account
  const handleViewTransactions = async (accountId) => {
    setSelectedAccountId(accountId);

    try {
      const response = await axios.get(
        `${REACT_APP_API_URL}/transaction/account/${accountId}`
      );
      setTransactions(response.data?.transactions); // API'den dönen transaction verisini alıyoruz
    } catch (error) {
      console.error('Failed to load transactions', error);
    }
  };

  return (
    <div className="App">
      <h1>Customer Account System</h1>

      {/* Create Customer */}
      <h2>Create Customer</h2>
      <form onSubmit={handleCreateCustomer}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Surname:</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Personal Id:</label>
          <input
            type="text"
            value={identityNo}
            onChange={(e) => setIdentityNo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Birthdate:</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Customer</button>
      </form>

      {/* List Customer */}
      <h2>Customers</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.name} {customer.surname} - {customer.identityNo} - {customer.birthDate}
            <button onClick={() => handleViewAccounts(customer.id)}>
              View Accounts
            </button>
          </li>
        ))}
      </ul>

      {/* Create Account */}
      {selectedCustomerId && (
        <>
          <h2>Create Account for Customer</h2>
          <form onSubmit={handleCreateAccount}>
            <div>
              <label>Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit">Create Account</button>
          </form>
        </>
      )}

      {/* Show accounts */}
      {selectedCustomerId && (
        <>
          <h2>Accounts for Customer</h2>
          <ul>
            {accounts.map((account) => (
              <li key={account.id}>
                Account Id: {account.id} - Balance: {account.balance}
                <button onClick={() => handleViewTransactions(account.id)}>
                  View Transactions
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Show transactions */}
      {selectedAccountId && (
        <>
          <h2>Transactions for Account {selectedAccountId}</h2>
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.id}>
                Transaction Id: {transaction.id} - Amount: {transaction.amount} - ExternalId: {transaction.externalId} - Direction : {transaction.direction === 0 ? 'IN' : 'OUT'}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
