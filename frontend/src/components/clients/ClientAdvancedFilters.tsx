import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Collapse } from '@mui/material';
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
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="City"
            value={filters.city}
            onChange={(e) => onFilterChange('city', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Region"
            value={filters.region}
            onChange={(e) => onFilterChange('region', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Region Code"
            value={filters.regionCode}
            onChange={(e) => onFilterChange('regionCode', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="dateOfBirth">Date of Birth</MenuItem>
              <MenuItem value="createdAt">Created At</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            type="number"
            label="Minimum Age"
            value={filters.ageMin || ''}
            onChange={(e) => onFilterChange('ageMin', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            type="number"
            label="Maximum Age"
            value={filters.ageMax || ''}
            onChange={(e) => onFilterChange('ageMax', e.target.value)}
          />
        </Grid>
      </Grid>
    </Collapse>
  );
}
