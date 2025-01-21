import { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
} from '@mui/material';
import AccountService from '../../services/account.service';
import { Account } from '../../types';

export default function AccountList() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const response = await AccountService.getAllAccounts();
    if (response.data) {
      setAccounts(response.data);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button variant="contained" color="primary">
          Create New Account
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>RIB</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.rib}>
                <TableCell>{account.rib}</TableCell>
                <TableCell>${account.balance.toFixed(2)}</TableCell>
                <TableCell>
                  {account.client ? `${account.client.name} ${account.client.surname}` : 'N/A'}
                </TableCell>
                <TableCell>
                  <Button size="small" color="primary">Edit</Button>
                  <Button size="small" color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
