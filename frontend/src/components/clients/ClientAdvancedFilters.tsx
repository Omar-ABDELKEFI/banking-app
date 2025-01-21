import { Grid, TextField, FormControl, Typography ,InputLabel, Select, MenuItem, Collapse, Box, Paper, InputAdornment, Tooltip, Zoom, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { LocationCity, Public, Badge, Sort, CalendarToday, ArrowUpward, ArrowDownward, Sort as SortIcon } from '@mui/icons-material';
import { ClientFilters } from '../../types';

interface ClientAdvancedFiltersProps {
  show: boolean;
  filters: ClientFilters;
  onFilterChange: (field: keyof ClientFilters, value: any) => void;
}

export default function ClientAdvancedFilters({
  show,
  filters,
  onFilterChange,
}: ClientAdvancedFiltersProps) {
  return (
    <Collapse in={show}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3,
          bgcolor: 'background.default',
          borderRadius: 2,
          mt: 2,
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            boxShadow: 1,
          }
        }}
      >
        <Grid container spacing={3}>
          {[
            {
              label: "City",
              field: "city",
              icon: <LocationCity />,
              tooltip: "Filter by city name"
            },
            {
              label: "Region",
              field: "region",
              icon: <Public />,
              tooltip: "Filter by region name"
            },
            {
              label: "Region Code",
              field: "regionCode",
              icon: <Badge />,
              tooltip: "Filter by region code"
            }
          ].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.field}>
              <Tooltip title={item.tooltip} placement="top" TransitionComponent={Zoom}>
                <TextField
                  fullWidth
                  label={item.label}
                  value={filters[item.field as keyof ClientFilters]}
                  onChange={(e) => onFilterChange(item.field as keyof ClientFilters, e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {item.icon}
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: 1,
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-1px)',
                        boxShadow: 2,
                      }
                    },
                  }}
                />
              </Tooltip>
            </Grid>
          ))}

          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={(e) => onFilterChange('sortBy', e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon color="action" />
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: 1,
                    }
                  }}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="dateOfBirth">Date of Birth</MenuItem>
                  <MenuItem value="createdAt">Created At</MenuItem>
                </Select>
              </FormControl>
              
              <ToggleButtonGroup
                exclusive
                value={filters.sortDirection}
                onChange={(_, value) => {
                  if (value) onFilterChange('sortDirection', value);
                }}
                size="small"
                sx={{ 
                  alignSelf: 'stretch',
                  '& .MuiToggleButton-root': {
                    flex: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transform: 'translateY(-1px)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                        transform: 'translateY(-1px)',
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="asc">
                  <Tooltip title="Sort Ascending" placement="top" arrow>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      py: 0.5 
                    }}>
                      <ArrowUpward fontSize="small" />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: filters.sortDirection === 'asc' ? 600 : 400
                        }}
                      >
                        Ascending
                      </Typography>
                    </Box>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="desc">
                  <Tooltip title="Sort Descending" placement="top" arrow>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      py: 0.5
                    }}>
                      <ArrowDownward fontSize="small" />
                      <Typography 
                        variant="body2"
                        sx={{ 
                          fontWeight: filters.sortDirection === 'desc' ? 600 : 400
                        }}
                      >
                        Descending
                      </Typography>
                    </Box>
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Tooltip title="Minimum age for filtering" placement="top" TransitionComponent={Zoom}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Age"
                value={filters.ageMin || ''}
                onChange={(e) => onFilterChange('ageMin', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: 1,
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-1px)',
                      boxShadow: 2,
                    }
                  },
                }}
              />
            </Tooltip>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Tooltip title="Maximum age for filtering" placement="top" TransitionComponent={Zoom}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Age"
                value={filters.ageMax || ''}
                onChange={(e) => onFilterChange('ageMax', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: 1,
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-1px)',
                      boxShadow: 2,
                    }
                  },
                }}
              />
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
    </Collapse>
  );
}
