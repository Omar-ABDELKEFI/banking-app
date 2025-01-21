import { Grid, TextField, Button, Box } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterListIcon, Clear as ClearIcon } from '@mui/icons-material';
import { ClientFilters } from '../../types';

interface ClientBasicFiltersProps {
  filters: ClientFilters;
  onFilterChange: (field: keyof ClientFilters, value: any) => void;
  onSearch: () => void;
  onReset: () => void;
  onToggleAdvanced: () => void;
  showAdvancedFilters: boolean;
}

export default function ClientBasicFilters({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  onToggleAdvanced,
  showAdvancedFilters,
}: ClientBasicFiltersProps) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Search by name"
          value={filters.name}
          onChange={(e) => onFilterChange('name', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={onSearch}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={onToggleAdvanced}
          >
            {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={onReset}
          >
            Reset
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
