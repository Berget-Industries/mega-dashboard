import React, { useState, useEffect } from 'react';

import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { Stack } from '@mui/system';
import Paper from '@mui/material/Paper';

import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';

import { IPlugin } from 'src/types/organization';
import { usePlugin, useGetOrganizationPlugins } from 'src/api/organization';
import { useSettingsContext } from 'src/components/settings';
import { useSelectedOrgContext } from 'src/layouts/common/context/org-menu-context';

import FormDialog from './formDialog';
import NewPluginFrom from './newPluginForm';

// ----------------------------------------------------------------------

export default function OverviewAnalyticsView() {
  const { activatePlugin, deactivatePlugin, removePlugin } = usePlugin();
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

  const [openPluginConfigId, setOpenPluginConfigId] = React.useState<string | null>(null);
  const [newPluginOpen, setNewPluginOpen] = React.useState<boolean>(false);

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
      console.log(plugins);
      setAllPlugins(plugins);
    }
  }, [plugins]);

  const handleTogglePlugin = async (plugin: IPlugin) => {
    const funcToRun = plugin.isActivated ? deactivatePlugin : activatePlugin;
    await funcToRun({ pluginId: plugin._id, organizationId: selectedOrg?._id as string });
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'md'}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Typography variant="h4">Anpassning 🚀 ⚙️</Typography>
        <Button variant="outlined" onClick={() => setNewPluginOpen(true)}>
          Lägg till plugin
        </Button>
      </Stack>

      {[actionTypesInput, actionTypesChain, actionTypesTool].map((_plugins) => (
        <Container sx={{ pt: 2 }}>
          <Typography variant="h6" color="text.primary">
            {`${_plugins[0]?.type.toUpperCase()}:s` || `Inga plugins av denna typ. 🤷‍♂️ `}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {_plugins[0]?.type === 'input' && (
              <span>
                Här finner du alla organisationen input plugins.
                <br />
                Det är som bryggan mellan användare och chain plugins.
                <br />
                Känn dig fri att lägga till hur många input plugins som du vill. 😎
              </span>
            )}
            {_plugins[0]?.type === 'chain' && (
              <span>
                Detta är alla organisationenens kedjor.
                <br />
                Varje kedja kan tolkas dem som en {`"ai"`} med egana instruktioner och kunskaper.
                <br />
                En organisation kan MAX ha en instans av varje chain plugin.
              </span>
            )}
            {_plugins[0]?.type === 'tool' && (
              <span>
                Detta är verktygen som är tillgängliga för en assistent att använda.
                <br />
                Lägg till dem egenskaper du vill att Mega Assistant ska kunna använda.
                <br />
                En organisation kan MAX ha en instans av varje tool plugin.
              </span>
            )}
          </Typography>

          {_plugins.map((plugin) => (
            <Paper variant="outlined" sx={{ mb: 3 }}>
              <Stack direction="row" justifyContent="center" alignItems="center">
                <Container sx={{ flexGrow: 1, p: 1 }} maxWidth="md">
                  <Typography variant="h5">{plugin.name}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {plugin.name === 'mailer' && plugin.config.imapConfig.user}
                    {plugin.name === 'mega-assistant-alex' && plugin.config.plugins.join(', ')}
                    {plugin.name === 'mega-assistant-eva' && plugin.config.model}
                    {plugin.name === 'auto-filter' &&
                      `${Object.keys(plugin.config.rules).length} aktiverade sorterings regler.`}
                  </Typography>
                </Container>
                <>
                  <Switch
                    checked={plugin.isActivated}
                    onClick={() => {
                      handleTogglePlugin(plugin);
                    }}
                  />
                  <IconButton
                    aria-labelledby="settings"
                    onClick={() => setOpenPluginConfigId(plugin._id)}
                    aria-label="settings"
                  >
                    <SettingsIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      removePlugin({ pluginId: plugin._id, organizationId: selectedOrg?._id || '' })
                    }
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              </Stack>
            </Paper>
          ))}
        </Container>
      ))}
      <FormDialog
        plugin={plugins.find((_) => _._id === openPluginConfigId)}
        onClose={() => setOpenPluginConfigId(null)}
      />
      <NewPluginFrom open={newPluginOpen} onClose={() => setNewPluginOpen(false)} />
    </Container>
  );
}
