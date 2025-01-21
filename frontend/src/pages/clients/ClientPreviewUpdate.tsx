import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Divider,
  Chip,
  Stack,
  Alert
} from '@mui/material';
import { Client, FieldChange } from '../../types';
import ClientService from '../../services/client.service';

export default function ClientPreviewUpdate() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we have the required state data
  if (!location.state) {
    return (
      <Container>
        <Alert severity="error">
          No changes to preview. Please return to the edit page.
        </Alert>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Container>
    );
  }

  const { changedData, originalData, changes } = location.state as {
    changedData: Partial<Client>;
    originalData: Client;
    changes: FieldChange[];
  };

  const handleConfirm = async () => {
    try {
      await ClientService.updateClient(originalData.id!, changedData);
      navigate('/clients', { 
        state: { message: 'Client updated successfully' }
      });
    } catch (error) {
      console.error('Error updating client:', error);
      // Handle error appropriately
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Confirm Changes</Typography>
        <Typography color="textSecondary" paragraph>
          Please review the changes before confirming
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Client Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Name:</Typography>
              <Typography>{originalData.name} {originalData.surname}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Email:</Typography>
              <Typography>{originalData.email}</Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Changes to be applied:</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {changes.map((change, index) => (
              <Chip
                key={index}
                label={`${change.field}: ${String(change.oldValue)} → ${String(change.newValue)}`}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate(-1)}
          >
            Back to Edit
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleConfirm}
          >
            Confirm Changes
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
