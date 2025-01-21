import { useState, useEffect } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Box, Card, CardContent, Chip, Typography, IconButton,
  Tooltip, TablePagination // Added missing imports
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ClientService from '../../services/client.service';
import { Client, ClientFilters } from '../../types';
import ClientBasicFilters from './ClientBasicFilters';
import ClientAdvancedFilters from './ClientAdvancedFilters';

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState<ClientFilters>({
    page: 0,  // Ensure this is always a number
    size: 10, // Ensure this is always a number
    sortBy: 'name',
    sortDirection: 'asc',
    name: '',
    city: '',
    region: '',
    regionCode: '',
    ageMin: undefined,
    ageMax: undefined,
  });

  useEffect(() => {
    loadClients();
  }, [filters.page, filters.size, filters.sortBy, filters.sortDirection]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await ClientService.getAllClients(filters);
      if (response.data) {
        setClients(response.data.content);
        setTotalElements(response.data.totalElements);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof ClientFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 0 }));
  };

  const handleSearch = () => {
    loadClients();
    updateActiveFilters();
  };

  const handleReset = () => {
    setFilters({
      page: 0,
      size: 10,
      sortBy: 'name',
      sortDirection: 'asc',
      name: '',
      city: '',
      region: '',
      regionCode: '',
      ageMin: undefined,
      ageMax: undefined,
    });
    setActiveFilters([]);
  };

  const updateActiveFilters = () => {
    const active = Object.entries(filters)
      .filter(([key, value]) => 
        value !== '' && value !== undefined && 
        !['page', 'size', 'sortBy', 'sortDirection'].includes(key))
      .map(([key, value]) => `${key}: ${value}`);
    setActiveFilters(active);
  };

  const handleRemoveFilter = (filterToRemove: string) => {
    const [field] = filterToRemove.split(':');
    handleFilterChange(field as keyof ClientFilters, '');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <ClientBasicFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onReset={handleReset}
            onToggleAdvanced={() => setShowAdvancedFilters(!showAdvancedFilters)}
            showAdvancedFilters={showAdvancedFilters}
          />

          <ClientAdvancedFilters
            show={showAdvancedFilters}
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {activeFilters.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Active Filters:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {activeFilters.map((filter) => (
                  <Chip
                    key={filter}
                    label={filter}
                    onDelete={() => handleRemoveFilter(filter)}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Rest of the table code remains the same */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.id}</TableCell>
                <TableCell>{`${client.name} ${client.surname}`}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.city}</TableCell>
                <TableCell>{client.region}</TableCell>
                <TableCell>
                  <Tooltip title="Edit Client">
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Client">
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        <TablePagination
          component="div"
          count={totalElements}
          page={filters.page || 0} // Provide default value
          onPageChange={(_, newPage) => handleFilterChange('page', newPage)}
          rowsPerPage={filters.size || 10} // Provide default value
          onRowsPerPageChange={(e) => handleFilterChange('size', parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>
    </Box>
  );
}
