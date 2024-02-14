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
  const { user, authenticated } = useAuthContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedOrg, setSelectedOrg] = useSelectedOrgContext();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (org: any) => {
    setAnchorEl(null);
    setSelectedOrg(org._id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    if (!authenticated) {
      setSelectedOrg(undefined);
    }
    if (!selectedOrg) {
      setSelectedOrg(user?.organizations[0]?._id);
    }
  }, [authenticated, user, selectedOrg, setSelectedOrg]);

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
        <div style={{ textAlign: 'center', flex: 1 }}>
          {selectedOrg ? selectedOrg.name : 'Välj organisation'}
        </div>
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
