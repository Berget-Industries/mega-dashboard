import React, { FC, useEffect, useState } from 'react';
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  TextField,
  Avatar,
  Stack,
} from '@mui/material';

interface DropdownItem {
  value: string;
  label: string;
  avatar?: string;
}

interface DropdownItemGroup {
  label: string;
  items: DropdownItem[];
}

interface CustomDropdownProps {
  items: (DropdownItem | DropdownItemGroup)[];
  value: string[];
  label: string;
  onChange: (value: string[]) => void;
}

const CustomDropdown: FC<CustomDropdownProps> = ({ items, value, label, onChange }) => {
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState<(DropdownItem | DropdownItemGroup)[]>(
    items as DropdownItem[]
  );

  useEffect(() => {
    if (search === '') {
      setFilteredItems(items);
      return;
    }

    const newFilter = items.filter((item) =>
      'items' in item
        ? (item as DropdownItemGroup).items.filter((_) =>
            _.label.toLowerCase().includes(search.toLowerCase())
          )
        : (item as DropdownItem).label.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredItems(newFilter);
  }, [items, search]);

  const handleClick =
    (clickedValue: string) => (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      event.preventDefault();

      if (value.includes(clickedValue)) {
        onChange(value.filter((_) => _ !== clickedValue));
        return;
      }

      onChange([...value, clickedValue]);
    };

  const renderMenyItem = (item: DropdownItem) => (
    <MenuItem key={item.value} onClick={handleClick(item.value)} disableGutters dense>
      <Checkbox checked={value.includes(item.value)} />
      <Avatar sx={{ width: 24, height: 24, mr: 2, ml: 1 }} alt={item.label} src={item.avatar} />
      {item.label}
    </MenuItem>
  );

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel id="ustom-dropdown-label">{label}</InputLabel>

      <Select
        fullWidth
        labelId="custom-dropdown-label"
        id="custom-dropdown"
        value={value}
        style={{ maxHeight: 300, overflowY: 'auto' }}
        multiple
        input={<OutlinedInput label={label} />}
        renderValue={(selected) =>
          (selected as string[])
            .map((_value) => {
              const foundItem = items.find((_) => {
                if ('items' in _) {
                  return _.items.find((__) => __.value === _value);
                }

                return _.value === _value;
              });

              return foundItem ? foundItem.label : '';
            })
            .join(', ')
        }
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 400,
            },
          },
        }}
      >
        <Stack gap={0} sx={{ m: 2 }}>
          <TextField
            size="small"
            id="search-field"
            label="Search"
            variant="outlined"
            sx={{ flexGrow: 1, mb: 1 }}
            autoFocus={false}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {Array.isArray(filteredItems) && filteredItems.length > 0 && 'items' in filteredItems[0]
            ? (filteredItems as DropdownItemGroup[]).map((group) => (
                <>
                  <MenuItem key={group.label}>{group.label}</MenuItem>
                  {group.items.map(renderMenyItem)}
                </>
              ))
            : (filteredItems as DropdownItem[]).map(renderMenyItem)}
        </Stack>
      </Select>
    </FormControl>
  );
};

export default CustomDropdown;
