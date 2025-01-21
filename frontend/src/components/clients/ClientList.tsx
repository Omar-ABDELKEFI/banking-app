import { useState, useEffect } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Box, Card, CardContent, Chip, Typography, IconButton,
  Tooltip, TablePagination, Fade, Skeleton, LinearProgress, Avatar, ButtonGroup, Button // Added missing imports
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ClientService from '../../services/client.service';
import { Client, ClientFilters } from '../../types';
import ClientBasicFilters from './ClientBasicFilters';
import ClientAdvancedFilters from './ClientAdvancedFilters';
import ClientPreviewModal from './ClientPreviewModal';
import { styled } from '@mui/material/styles';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  '& .MuiTableHead-root': {
    backgroundColor: theme.palette.primary.main,
    '& .MuiTableCell-head': {
      color: theme.palette.primary.contrastText,
      fontWeight: 600
    }
  },
  '& .MuiTableBody-root .MuiTableRow-root:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  }
}));

const AnimatedTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.light} !important`,
    transform: 'scale(1.001)',
    '& .MuiTableCell-root': {
      color: theme.palette.primary.contrastText
    }
  }
}));

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  padding: theme.spacing(2),
  whiteSpace: 'nowrap',
  '&:first-of-type': {
    borderTopLeftRadius: theme.shape.borderRadius,
  },
  '&:last-of-type': {
    borderTopRightRadius: theme.shape.borderRadius,
  }
}));

// Add this interface near the top of the file
interface ActiveFilter {
  key: string;
  value: any;
  label: string;
}

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
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
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const navigate = useNavigate();

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    loadClients();
  }, [debouncedFilters]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await ClientService.getAllClients(debouncedFilters);
      setClients(response.data);
      setTotalElements(response.pageMetadata.totalElements);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof ClientFilters, value: any) => {
    const newFilters = { ...filters, [field]: value, page: 0 };
    setFilters(newFilters);
    
    // Automatically update active filters when any filter changes
    updateActiveFilters(newFilters);
  };

  const updateActiveFilters = (currentFilters: ClientFilters = filters) => {
    const active = Object.entries(currentFilters)
      .filter(([key, value]) => 
        value !== '' && 
        value !== undefined && 
        !['page', 'size', 'sortBy', 'sortDirection'].includes(key)
      )
      .map(([key, value]): ActiveFilter => ({
        key,
        value,
        label: `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
      }));
    setActiveFilters(active);
  };

  const handleRemoveFilter = (filterKey: string) => {
    handleFilterChange(filterKey as keyof ClientFilters, '');
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

  const handleRowClick = (client: Client) => {
    setSelectedClient(client);
    setPreviewOpen(true);
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/clients/new')}
          >
            Create Client
          </Button>
        </Box>

        <Card 
          elevation={3}
          sx={{ 
            mb: 3,
            backgroundColor: 'background.default',
            borderRadius: 2
          }}
        >
          <CardContent>
            <ClientBasicFilters
              filters={filters}
              onFilterChange={handleFilterChange}
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
                      key={filter.key}
                      label={filter.label}
                      onDelete={() => handleRemoveFilter(filter.key)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        <StyledTableContainer>
          {loading && (
            <Box sx={{ width: '100%', position: 'absolute', top: 0, zIndex: 1 }}>
              <LinearProgress />
            </Box>
          )}
          
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableHeaderCell width="5%">#</StyledTableHeaderCell>
                <StyledTableHeaderCell width="25%">Client Name</StyledTableHeaderCell>
                <StyledTableHeaderCell width="20%">Contact Info</StyledTableHeaderCell>
                <StyledTableHeaderCell width="15%">Location</StyledTableHeaderCell>
                <StyledTableHeaderCell width="10%" align="center">Age</StyledTableHeaderCell>
                <StyledTableHeaderCell width="10%" align="center">Status</StyledTableHeaderCell>
                <StyledTableHeaderCell width="15%" align="right">Actions</StyledTableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <LoadingRows rowsNum={filters.size || 10} colsNum={7} />
              ) : (
                clients.map((client) => (
                  <AnimatedTableRow
                    key={client.id}
                    onClick={() => handleRowClick(client)}
                  >
                    <TableCell>{client.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {client.name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{`${client.name} ${client.surname}`}</Typography>
                          
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{client.phone || 'N/A'}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {client.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{client.city || 'N/A'}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {client.region || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {client.dateOfBirth 
                        ? calculateAge(new Date(client.dateOfBirth)) 
                        : 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={client.accounts?.length ? 'Active' : 'No Accounts'}
                        color={client.accounts?.length ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <ButtonGroup size="small">
                        <Tooltip title="Edit Client">
                          <IconButton color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Client">
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ButtonGroup>
                    </TableCell>
                  </AnimatedTableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          <TablePagination
            component="div"
            count={totalElements}
            page={filters.page || 0} // Provide default value
            onPageChange={(_, newPage) => handleFilterChange('page', newPage)}
            rowsPerPage={filters.size || 10} // Provide default value
            onRowsPerPageChange={(e) => handleFilterChange('size', parseInt(e.target.value, 10))}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </StyledTableContainer>

        <ClientPreviewModal
          client={selectedClient}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      </Box>
    </Fade>
  );
}

const LoadingRows = ({ rowsNum, colsNum }: { rowsNum: number; colsNum: number }) => (
  <>
    {Array(rowsNum).fill(0).map((_, idx) => (
      <TableRow key={idx}>
        {Array(colsNum).fill(0).map((_, cellIdx) => (
          <TableCell key={cellIdx}>
            <Skeleton animation="wave" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);
