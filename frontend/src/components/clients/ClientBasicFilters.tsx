import { Grid, TextField, Button, Box, InputAdornment, Tooltip, Zoom } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterListIcon, Clear as ClearIcon } from '@mui/icons-material';
import { ClientFilters } from '../../types';

interface ClientBasicFiltersProps {
  filters: ClientFilters;
  onFilterChange: (field: keyof ClientFilters, value: any) => void;
  onReset: () => void;
  onToggleAdvanced: () => void;
  showAdvancedFilters: boolean;
}

export default function ClientBasicFilters({
  filters,
  onFilterChange,
  onReset,
  onToggleAdvanced,
  showAdvancedFilters,
}: ClientBasicFiltersProps) {
  return (
    <Box sx={{ 
      py: 2,
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '98%',
        height: '1px',
        backgroundColor: 'divider',
        opacity: 0.8,
      }
    }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <Tooltip title="Enter name to search" placement="top" TransitionComponent={Zoom}>
            <TextField
              fullWidth
              placeholder="Type to search..."
              value={filters.name}
              onChange={(e) => onFilterChange('name', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
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
        <Grid item xs={12} sm={6} md={8}>
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            flexWrap: 'wrap',
            justifyContent: 'flex-start'
          }}>
            <Button
              variant={showAdvancedFilters ? "contained" : "outlined"}
              onClick={onToggleAdvanced}
              startIcon={<FilterListIcon />}
              sx={{ 
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: 2,
                }
              }}
            >
              {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={onReset}
              startIcon={<ClearIcon />}
              sx={{ 
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: 2,
                }
              }}
            >
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
