import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { AccountBalance, People, TrendingUp } from '@mui/icons-material';
import ClientService from '../services/client.service';
import AccountService from '../services/account.service';
import { Client, Account } from '../types';

export default function Dashboard() {
  const [totalClients, setTotalClients] = useState<number>(0);
  const [totalAccounts, setTotalAccounts] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState<number>(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const clientsResponse = await ClientService.getAllClients();
      const accountsResponse = await AccountService.getAllAccounts();

      if (clientsResponse.data) {
        setTotalClients(clientsResponse.pageMetadata.totalElements);
      }
      
      if (accountsResponse.data) {
        setTotalAccounts(accountsResponse.data.length);
        const total = accountsResponse.data.reduce((sum, account) => sum + account.balance, 0);
        setTotalBalance(total);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const DashboardCard = ({ title, value, icon }: { title: string; value: string | number; icon: JSX.Element }) => (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography color="textSecondary" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </Box>
      <Box sx={{ color: 'primary.main' }}>
        {icon}
      </Box>
    </Paper>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <DashboardCard
            title="Total Clients"
            value={totalClients}
            icon={<People sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard
            title="Total Accounts"
            value={totalAccounts}
            icon={<AccountBalance sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard
            title="Total Balance"
            value={`$${totalBalance.toLocaleString()}`}
            icon={<TrendingUp sx={{ fontSize: 40 }} />}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
