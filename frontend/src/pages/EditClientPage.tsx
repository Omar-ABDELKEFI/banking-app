import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Alert, Fade, Chip, Stack } from '@mui/material';
import ClientForm from '../components/clients/ClientForm';
import ClientService from '../services/client.service';
import { Client, EditStats, FieldChange } from '../types';

export default function EditClientPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [editStats, setEditStats] = useState<EditStats>({ totalChanges: 0, changes: [] });

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      setLoading(true);
      const response = await ClientService.getAllClients({ 
        id: Number(id),
        page: 0,
        size: 1
      });
      if (response.data.length > 0) {
        const clientData = response.data[0];
        // Ensure dateOfBirth is a proper Date object
        if (clientData.dateOfBirth) {
          clientData.dateOfBirth = new Date(clientData.dateOfBirth);
        }
        setClient(clientData);
      } else {
        setError('Client not found');
      }
    } catch (error) {
      console.error('Error loading client:', error);
      setError('Error loading client details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Partial<Client>) => {
    try {
      if (!id || !client) throw new Error('No client ID provided');

      const changedData = editStats.changes.reduce((acc, change) => {
        acc[change.field] = change.newValue;
        return acc;
      }, {} as Partial<Client>);

      // Always include ID and essential information
      changedData.id = Number(id);

      // Navigate to preview with all necessary data
      navigate('/clients/preview-update', {
        state: {
          changedData,
          originalData: client,
          changes: editStats.changes
        }
      });
    } catch (error) {
      console.error('Error preparing update:', error);
      setError('Error preparing update');
    }
  };

  const handleFieldChange = (changes: FieldChange[]) => {
    setEditStats({
      totalChanges: changes.length,
      changes
    });
  };

  if (loading) {
    return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Edit Client</Typography>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Changes made: {editStats.totalChanges}
              </Typography>
            </Box>
          </Box>

          {editStats.changes.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Modified Fields:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {editStats.changes.map((change, index) => (
                  <Chip
                    key={index}
                    label={`${change.field}: ${change.oldValue} → ${change.newValue}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}

          {client && (
            <ClientForm
              initialData={client}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/clients')}
              isLoading={loading}
              mode="edit"
              onFieldChange={handleFieldChange}
            />
          )}
        </Paper>
      </Box>
    </Fade>
  );
}
