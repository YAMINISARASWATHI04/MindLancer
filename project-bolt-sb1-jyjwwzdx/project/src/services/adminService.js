import { useState, useEffect } from 'react';

const useAdminService = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    setAccounts(storedAccounts);
    setLoading(false);
  }, []);

  const updateAccountStatus = (accountId, status) => {
    const updatedAccounts = accounts.map(account => 
      account.id === accountId ? {...account, status} : account
    );
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    setAccounts(updatedAccounts);
  };

  return {
    accounts,
    loading,
    updateAccountStatus
  };
};

export default useAdminService;
