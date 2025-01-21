import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Card,
  CardContent,
  Button,
  Typography,
  Divider,
  Avatar,
  IconButton,
  LinearProgress
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Client, FieldChange } from '../../types'; // Add FieldChange import
import { PhotoCamera, Delete } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import clientService from '../../services/client.service';
import axios from 'axios';

interface ClientFormProps {
  initialData?: Partial<Client>;
  onSubmit: (data: Partial<Client>) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit'; // Add this line
  onFieldChange?: (changes: FieldChange[]) => void;
}

interface ValidationErrors {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
}

const ClientForm: React.FC<ClientFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  mode, // Add this line
  onFieldChange
}) => {
  // Convert dateOfBirth string to Date object if it exists
  const initialDateOfBirth = initialData.dateOfBirth 
    ? new Date(initialData.dateOfBirth) 
    : null;

  const [formData, setFormData] = React.useState<Partial<Client>>({
    name: '',
    surname: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    region: '',
    regionCode: '',
    dateOfBirth: initialDateOfBirth,
    ...initialData,
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [position, setPosition] = useState<[number, number]>([
    formData.latitude || 31.7917, // Default to Morocco coordinates
    formData.longitude || -7.0926
  ]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [changedFields, setChangedFields] = useState<FieldChange[]>([]);
  const [originalData] = useState(initialData); // Store initial data for comparison

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const oldValue = originalData[name as keyof Client];
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (value !== oldValue) {
      updateChangedFields(name as keyof Client, oldValue, value);
    }
  };

  const updateChangedFields = (field: keyof Client, oldValue: any, newValue: any) => {
    const existingChangeIndex = changedFields.findIndex(change => change.field === field);
    
    if (existingChangeIndex >= 0) {
      // If value is back to original, remove the change
      if (newValue === originalData[field]) {
        const newChanges = changedFields.filter((_, index) => index !== existingChangeIndex);
        setChangedFields(newChanges);
        onFieldChange?.(newChanges);
      } else {
        // Update existing change
        const newChanges = [...changedFields];
        newChanges[existingChangeIndex] = { field, oldValue, newValue };
        setChangedFields(newChanges);
        onFieldChange?.(newChanges);
      }
    } else {
      // Add new change
      const newChanges = [...changedFields, { field, oldValue, newValue }];
      setChangedFields(newChanges);
      onFieldChange?.(newChanges);
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const now = new Date();
      if (date > now) {
        // Show error using your preferred method (toast, alert, etc.)
        return;
      }
      
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(now.getFullYear() - 18);
      
      if (date > eighteenYearsAgo) {
        // Show error for minimum age
        return;
      }
    }
    
    // Ensure we're working with a valid Date object
    const validDate = date ? new Date(date) : null;
    setFormData(prev => ({ ...prev, dateOfBirth: validDate }));
    
    // Track date change
    updateChangedFields(
      'dateOfBirth',
      originalData.dateOfBirth,
      validDate
    );
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setUploadError('');
    setUploadProgress(0);

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    // Store the file for later upload during form submission
    setUploadedFile(file);
    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
        ...prev,
        profilePictureUrl: previewUrl
    }));
  };

  const handleRemoveProfilePicture = () => {
    setFormData(prev => ({
      ...prev,
      profilePictureUrl: ''
    }));
    setUploadProgress(0);
  };

  const MapMarker: React.FC<{ position: [number, number] }> = ({ position }) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            setFormData(prev => ({
                ...prev,
                latitude: lat,
                longitude: lng
            }));
        },
    });
    return <Marker position={position} />;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Name validation
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    // Surname validation
    if (!formData.surname?.trim()) {
      newErrors.surname = "Surname is required";
    }

    // Email validation
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone validation (if provided)
    if (formData.phone && !/^[2459]\d{7}$/.test(formData.phone)) {
      newErrors.phone = "Invalid Tunisian phone number (should start with 2, 4, 5, or 9 and have 8 digits)";
    }

    // Date of birth validation
    if (formData.dateOfBirth) {
      const now = new Date();
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(now.getFullYear() - 18);
      
      if (formData.dateOfBirth > now) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
      } else if (formData.dateOfBirth > eighteenYearsAgo) {
        newErrors.dateOfBirth = "Client must be at least 18 years old";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // If there's a file to upload, upload it first
        let profilePictureUrl = formData.profilePictureUrl;
      
        // In edit mode, only send changed fields
        if (mode === 'edit') {
          const changedData = changedFields.reduce((acc, change) => {
            acc[change.field as keyof Client] = change.newValue;
            return acc;
          }, {} as Partial<Client>);
          
          // Always include ID in edit mode
          if ('id' in initialData) {
            changedData.id = initialData.id;
          }
          
          await onSubmit(changedData);
        } else {
          await onSubmit(formData);
        }
      } catch (error) {
        console.error('Error during form submission:', error);
        setUploadError('Failed to process the form. Please try again.');
      }
    }
  };

  const renderProfilePictureSection = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" color="primary">
        Profile Picture
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={formData.profilePictureUrl}
          sx={{ 
            width: 100, 
            height: 100,
            border: theme => `2px solid ${theme.palette.primary.main}`
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture-upload"
              type="file"
              onChange={handleProfilePictureUpload}
            />
            <label htmlFor="profile-picture-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                disabled={!!uploadProgress && uploadProgress < 100}
              >
                Upload Photo
              </Button>
            </label>
            {formData.profilePictureUrl && (
              <IconButton
                color="error"
                onClick={handleRemoveProfilePicture}
                sx={{ ml: 1 }}
              >
                <Delete />
              </IconButton>
            )}
          </Box>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <LinearProgress 
              variant="determinate" 
              value={uploadProgress}
              sx={{ width: 200 }}
            />
          )}
          {uploadError && (
            <Typography color="error" variant="caption">
              {uploadError}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          {renderProfilePictureSection()}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" color="primary">
              Personal Information
            </Typography>
            <Divider />
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                error={!!errors.surname}
                helperText={errors.surname}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                  onChange={handleDateChange}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      error: !!errors.dateOfBirth,
                      helperText: errors.dateOfBirth || "Must be 18 years or older"
                    } 
                  }}
                  maxDate={new Date()}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h6" color="primary">
              Address Information
            </Typography>
            <Divider />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State/Province"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Region"
                name="region"
                value={formData.region}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Region Code"
                name="regionCode"
                value={formData.regionCode}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Location Selection Section */}
          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h6" color="primary">
              Location
            </Typography>
            <Divider />
            <Box sx={{ mt: 2, height: 400 }}>
                <MapContainer
                    center={position}
                    zoom={6}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapMarker position={position} />
                </MapContainer>
            </Box>
            <Typography variant="caption" color="textSecondary">
                Click on the map to set the location
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : mode === 'create' ? 'Create Client' : 'Update Client'}
        </Button>
      </Box>
    </form>
  );
};

export default ClientForm;
