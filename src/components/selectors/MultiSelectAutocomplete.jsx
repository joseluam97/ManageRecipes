import React from 'react';
import { Autocomplete, TextField, Chip, Box } from '@mui/material';

const MultiSelectAutocomplete = ({ options, selected, setSelected, label = "Select items" }) => {
    return (
        <Autocomplete
            multiple
            options={options}
            value={selected}
            onChange={(event, newValue) => setSelected(newValue)}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField {...params} label={label} placeholder="Type to search..." />
            )}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip
                        key={option.name}
                        label={option.name}
                        {...getTagProps({ index })}
                        sx={{
                            backgroundColor: option.color,
                            color: '#fff',
                            '& .MuiChip-deleteIcon': {
                                color: '#fff',
                            },
                        }}
                    />
                ))
            }
        />
    );
};

export default MultiSelectAutocomplete;
