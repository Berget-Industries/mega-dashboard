import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { alpha, useTheme } from '@mui/material/styles';

import { usePlugin, useGetOrganizationPlugins } from 'src/api/organization';
import { useSettingsContext } from 'src/components/settings';
import { useAuthContext } from 'src/auth/hooks';
import { useSelectedOrgContext } from 'src/layouts/common/context/org-menu-context';

import FormDialog from './formDialog';
import { IPlugin } from '../organizations/table-row';

// ----------------------------------------------------------------------

export default function OverviewAnalyticsView() {
  const { activatePlugin, deactivatePlugin } = usePlugin();
  const [selectedOrg] = useSelectedOrgContext();
  const settings = useSettingsContext();
  const theme = useTheme();

  const { plugins, pluginsLoading, pluginsError, pluginsValidating } = useGetOrganizationPlugins({
    organizationId: selectedOrg?._id,
  });

  const [allPlugins, setAllPlugins] = useState<IPlugin[]>([]);
  const [actionTypesInput, setActionTypesInput] = useState<IPlugin[]>([]);
  const [actionTypesChain, setActionTypesChain] = useState<IPlugin[]>([]);
  const [actionTypesTool, setActionTypesTool] = useState<IPlugin[]>([]);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const typeInput = allPlugins.filter((_) => _.type === 'input');
    const typeChain = allPlugins.filter((_) => _.type === 'chain');
    const typeTool = allPlugins.filter((_) => _.type === 'tool');

    setActionTypesInput(typeInput);
    setActionTypesChain(typeChain);
    setActionTypesTool(typeTool);
  }, [allPlugins]);

  useEffect(() => {
    if (plugins) {
      setAllPlugins(plugins);
    }
  }, [plugins]);

  const handleTogglePlugin = (plugin: IPlugin) => {
    const funcToRun = plugin.isActivated ? deactivatePlugin : activatePlugin;
    funcToRun({ organizationId: selectedOrg?._id as string, name: plugin.name });

    const newPlugins = allPlugins.map((_) =>
      _._id === plugin._id ? { ..._, isActivated: !_.isActivated } : _
    );
    setAllPlugins(newPlugins);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Anpassning 🚀 ⚙️
      </Typography>

      {[actionTypesInput, actionTypesChain, actionTypesTool].map((_plugins) => (
        <Grid
          container
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          {_plugins.length === 0 && (
            <Typography variant="h6" color="text.secondary">
              Inga plugins av denna typ.
            </Typography>
          )}
          {_plugins.map((plugin) => (
            <Grid xs={2.5}>
              <Card variant="elevation">
                <CardContent>
                  <Typography variant="h5">{plugin.name}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {plugin.type}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', padding: 3 }}>
                  <Button onClick={() => setOpen(true)} variant="outlined">
                    Ändra konfig
                  </Button>
                  <Switch
                    checked={plugin.isActivated}
                    onClick={() => {
                      handleTogglePlugin(plugin);
                    }}
                  />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ))}
      <FormDialog open={open} setOpen={setOpen} />
    </Container>
  );
}
