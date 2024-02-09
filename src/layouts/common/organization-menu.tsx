import * as React from 'react';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { useAuthContext } from 'src/auth/hooks';

import { useSelectedOrgContext } from './context/org-menu-context';

interface Organization {
  _id: string;
  name: string;
}

export default function OrganizationMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = React.useState<string>('Välj organisation');
  const [selectedOrg, setSelectedOrg] = useSelectedOrgContext();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (org: any) => {
    setAnchorEl(null);
    setSelectedItem(org.name);
    setSelectedOrg(org._id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const { user } = useAuthContext();

  React.useEffect(() => {
    try {
      const storedSelectedOrg = localStorage.getItem('selectedOrg');
      if (storedSelectedOrg) {
        const org: any = JSON.parse(storedSelectedOrg);
        setSelectedItem(org.name);
        setSelectedOrg(org._id);
      }
    } catch (error) {
      console.error('Fel vid läsning från localStorage', error);
    }
  }, [setSelectedOrg]);

  React.useEffect(() => {
    if (selectedOrg) {
      try {
        localStorage.setItem('selectedOrg', JSON.stringify(selectedOrg));
        setSelectedItem(selectedOrg.name);
      } catch (error) {
        console.error('Fel vid sparande till localStorage', error);
      }
    }
  }, [selectedOrg]);

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{
          width: '220px',
          display: 'flex',
          justifyContent: 'center',
        }}
        variant="outlined"
      >
        <ArrowDropDownIcon />
        <div style={{ textAlign: 'center', flex: 1 }}>{selectedItem}</div>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        PaperProps={{
          style: {
            minWidth: '220px',
            overflow: 'auto',
          },
        }}
      >
        {user?.organizations.map((org: any) => (
          <MenuItem key={org._id} onClick={() => handleClose(org)}>
            {org.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
