import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Fade,
  Alert,
  Snackbar
} from '@mui/material';
import ClientForm from '../../components/clients/ClientForm';
import ClientService from '../../services/client.service';
import { Client } from '../../types';

const CreateClient: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const handleSubmit = async (data: Partial<Client>) => {
    setIsLoading(true);
    setError(null);

    try {
      await ClientService.createClient(data as Client, profilePicture || undefined);
      navigate('/clients', { state: { message: 'Client created successfully' } });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while creating the client');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/clients');
  };

  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" color="primary">
              Create New Client
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Enter the client's information below
            </Typography>
          </Box>

          <ClientForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </Paper>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Fade>
  );
};

export default CreateClient;
