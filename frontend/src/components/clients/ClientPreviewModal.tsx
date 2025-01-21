import { Modal, Box, Typography, Grid, Paper, Divider, IconButton } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Close as CloseIcon } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import { Client } from '../../types';
import { format } from 'date-fns';
import L from 'leaflet';

// Fix leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface ClientPreviewModalProps {
  client: Client | null;
  open: boolean;
  onClose: () => void;
}

export default function ClientPreviewModal({ client, open, onClose }: ClientPreviewModalProps) {
  if (!client) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="client-preview-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${open ? 1 : 0.5})`,
        width: {
          xs: '95%',
          sm: '80%',
          md: '80%',
        },
        maxWidth: 900,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: { xs: 2, sm: 3, md: 4 },
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: 1,
        opacity: open ? 1 : 0,
        transition: 'all 0.3s ease-in-out',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '4px',
        },
      }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">Client Details</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Personal Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Full Name</Typography>
                  <Typography>{`${client.name} ${client.surname}`}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography>{client.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Phone</Typography>
                  <Typography>{client.phone || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Date of Birth</Typography>
                  <Typography>
                    {client.dateOfBirth ? format(new Date(client.dateOfBirth), 'dd/MM/yyyy') : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Accounts</Typography>
                  <Typography>
                    {client.accounts?.length ? `${client.accounts.length} account(s)` : 'No accounts'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Address Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Address Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Street Address</Typography>
                  <Typography>{client.streetAddress || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">City</Typography>
                  <Typography>{client.city || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">State</Typography>
                  <Typography>{client.state || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Country</Typography>
                  <Typography>{client.country || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Postal Code</Typography>
                  <Typography>{client.postalCode || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Region</Typography>
                  <Typography>{client.region || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Region Code</Typography>
                  <Typography>{client.regionCode || 'N/A'}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Map Section */}
          {client.latitude && client.longitude && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Location</Typography>
                <Box sx={{ height: 400, width: '100%', position: 'relative' }}>
                  <MapContainer
                    center={[client.latitude, client.longitude]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[client.latitude, client.longitude]}>
                      <Popup>
                        <Typography variant="body2" component="div">
                          <strong>{`${client.name} ${client.surname}`}</strong><br />
                          {client.streetAddress}<br />
                          {client.city}, {client.region} {client.postalCode}<br />
                          {client.country}
                        </Typography>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </Box>
              </Paper>
            </Grid>
          )}

          {/* Created/Updated Information */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Created At</Typography>
                  <Typography>
                    {client.createdAt ? format(new Date(client.createdAt), 'dd/MM/yyyy HH:mm:ss') : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Last Updated</Typography>
                  <Typography>
                    {client.updatedAt ? format(new Date(client.updatedAt), 'dd/MM/yyyy HH:mm:ss') : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
