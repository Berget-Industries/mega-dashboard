import * as React from 'react';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IPlugin } from 'src/types/organization';
import { Container, Stack } from '@mui/system';
import { Typography, Switch, Grid } from '@mui/material';
import { usePlugin } from 'src/api/organization';
import { useSelectedOrgContext } from 'src/layouts/common/context/org-menu-context';

interface FormDialogProps {
  plugin: IPlugin | undefined;
  onClose: () => void;
}

export default function FormDialog({ plugin, onClose }: FormDialogProps) {
  const [selectedOrg] = useSelectedOrgContext();
  const { updatePluginConfig } = usePlugin();
  const [fullScreen, setFullScreen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pluginConfig, setPluginConfig] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    setPluginConfig(plugin?.config || {});
  }, [plugin]);

  React.useEffect(() => {
    if (!plugin) {
      setPluginConfig({});
      setFullScreen(false);
    } else {
      setPluginConfig(plugin.config);
    }
  }, [plugin]);

  if (!plugin) return null;

  return (
    <Dialog
      open={Boolean(plugin)}
      fullScreen={fullScreen}
      fullWidth
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          setIsLoading(true);
          await updatePluginConfig({
            config: pluginConfig,
            pluginId: plugin._id,
            organizationId: selectedOrg?._id || '',
          });
          setIsLoading(false);
          onClose();
        },
      }}
    >
      <DialogTitle>Ändra konfig</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Här byter du konfig till de som passar din organisation!
        </DialogContentText>

        {/*
            OBS
            INPUTS FÖR
            MEGA ASSISTANT ALEX
            OBS
         */}
        {plugin.name === 'mega-assistant-alex' && (
          <>
            <TextField
              id="_systemPrompt"
              label="System Prompt"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              multiline
              value={pluginConfig.systemPrompt}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({ ...pluginConfig, systemPrompt: event.target.value });
              }}
            />
            <TextField
              id="_abilities"
              label="Abilities"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              multiline
              value={pluginConfig.abilities}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({ ...pluginConfig, abilities: event.target.value });
              }}
            />

            {pluginConfig.plugins &&
              (pluginConfig.plugins as string[]).map((_, index) => (
                <span key={index}>
                  <TextField
                    id="_abilities"
                    label="Plugin"
                    margin="normal"
                    variant="outlined"
                    required
                    fullWidth
                    value={_}
                    onChange={(event) => {
                      event.preventDefault();
                      const newPluginConfig = { ...pluginConfig };
                      newPluginConfig.plugins[index] = event.target.value;
                      setPluginConfig(newPluginConfig);
                    }}
                  />
                  {index !== 0 && (
                    <Button
                      onClick={() => {
                        const newPluginConfig = { ...pluginConfig };
                        newPluginConfig.plugins.splice(index, 1);
                        setPluginConfig(newPluginConfig);
                      }}
                    >
                      Ta bort
                    </Button>
                  )}
                </span>
              ))}
            <Button
              onClick={() =>
                setPluginConfig({ ...pluginConfig, plugins: [...(pluginConfig.plugins || []), ''] })
              }
            >
              Lägg till plugin
            </Button>
          </>
        )}

        {/*
            OBS
            INPUTS FÖR
            MEGA ASSISTANT EVA
            OBS
         */}
        {plugin.name === 'mega-assistant-eva' && (
          <>
            <TextField
              id="_systemPrompt"
              label="System Prompt"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              multiline
              value={pluginConfig.systemPrompt}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({ ...pluginConfig, systemPrompt: event.target.value });
              }}
            />
            <TextField
              id="_model"
              label="Model Name"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              value={pluginConfig.model}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({ ...pluginConfig, model: event.target.value });
              }}
            />
          </>
        )}

        {/*
            OBS
            INPUTS FÖR
            MEGA AUTO FILTER
            OBS
         */}
        {plugin.name === 'auto-filter' && (
          <>
            {pluginConfig.rules &&
              Object.entries(pluginConfig.rules).map(([key, value], index) => (
                <Stack sx={{ pt: 4 }} key={index}>
                  <Typography variant="h6" color="text.secondary">
                    Regel {index + 1}
                  </Typography>
                  <TextField
                    id="_sortingPath"
                    label="Sorteringsväg"
                    margin="normal"
                    variant="outlined"
                    required
                    fullWidth
                    value={key}
                    onChange={(event) => {
                      event.preventDefault();
                      const newRules = Object.entries(pluginConfig.rules);

                      newRules[index] = [event.target.value, value];

                      setPluginConfig({
                        ...pluginConfig,
                        rules: Object.fromEntries(newRules),
                      });
                    }}
                  />
                  <TextField
                    id="_sortingRule"
                    label="Sorteringsregel"
                    margin="normal"
                    variant="outlined"
                    required
                    fullWidth
                    value={value}
                    onChange={(event) => {
                      event.preventDefault();
                      setPluginConfig({
                        ...pluginConfig,
                        rules: { ...pluginConfig.rules, [key]: event.target.value },
                      });
                    }}
                  />
                </Stack>
              ))}
            {pluginConfig.rules?.length !== 0 && (
              <Button
                sx={{ pt: 4 }}
                onClick={() => {
                  const newRules = { ...pluginConfig.rules };
                  newRules[''] = '';
                  setPluginConfig({ ...pluginConfig, rules: newRules });
                }}
              >
                Lägg till regel
              </Button>
            )}
          </>
        )}

        {/*
            OBS
            INPUTS FÖR
            CHAIN - STARTER
            OBS
         */}
        {plugin.name === 'chain-starter' && (
          <>
            <TextField
              id="_systemPrompt"
              label="System Prompt"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              multiline
              value={pluginConfig.systemPrompt || ''}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({ ...pluginConfig, systemPrompt: event.target.value });
              }}
            />
            <TextField
              id="_signature"
              label="Signatur"
              margin="normal"
              variant="outlined"
              multiline
              required
              fullWidth
              value={pluginConfig.signature || ''}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({ ...pluginConfig, signature: event.target.value });
              }}
            />
          </>
        )}

        {/*
            OBS
            INPUTS FÖR
            MEGA MAILER
            OBS
         */}

        {plugin.name === 'mailer' && (
          <>
            <TextField
              id="_imapUsername"
              label="IMAP Username"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              value={pluginConfig.imapConfig?.user || ''}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({
                  ...pluginConfig,
                  imapConfig: { ...pluginConfig.imapConfig, user: event.target.value },
                });
              }}
            />

            <TextField
              id="_imapPassword"
              label="IMAP Passwrord"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              type="password"
              value={pluginConfig.imapConfig?.password || ''}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({
                  ...pluginConfig,
                  imapConfig: { ...pluginConfig.imapConfig, password: event.target.value },
                });
              }}
            />

            <TextField
              id="_imapHost"
              label="IMAP Host"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              value={pluginConfig.imapConfig?.host || ''}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({
                  ...pluginConfig,
                  imapConfig: { ...pluginConfig.imapConfig, host: event.target.value },
                });
              }}
            />

            <TextField
              id="_imapPort"
              label="IMAP Port"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              value={pluginConfig.imapConfig?.port || ''}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({
                  ...pluginConfig,
                  imapConfig: { ...pluginConfig.imapConfig, port: event.target.value },
                });
              }}
            />

            <Stack spacing={2} justifyContent="space-between" alignItems="center" direction="row">
              <Typography sx={{ p: 1 }} variant="h6" color="text.secondary">
                TLS
              </Typography>
              <Switch
                checked={pluginConfig.imapConfig?.tls || false}
                onClick={(event) => {
                  event.preventDefault();
                  setPluginConfig({
                    ...pluginConfig,
                    imapConfig: {
                      ...pluginConfig.imapConfig,
                      tls:
                        pluginConfig.imapConfig !== undefined
                          ? !pluginConfig.imapConfig.tls
                          : false,
                    },
                  });
                }}
              />
            </Stack>

            <Stack spacing={2} justifyContent="space-between" alignItems="center" direction="row">
              <Typography sx={{ p: 1 }} variant="h6" color="text.secondary">
                Auto Filter
              </Typography>
              <Switch
                checked={pluginConfig.autoFilter || false}
                onClick={(event) => {
                  event.preventDefault();
                  setPluginConfig({ ...pluginConfig, autoFilter: !pluginConfig.autoFilter });
                }}
              />
            </Stack>

            <TextField
              id="_mainInbox"
              label="Main Inbox"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              multiline
              value={pluginConfig.mainInbox}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({ ...pluginConfig, mainInbox: event.target.value });
              }}
            />

            <TextField
              id="_imapFrom"
              label="IMAP From"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              value={pluginConfig.imapFrom}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({ ...pluginConfig, imapFrom: event.target.value });
              }}
            />

            <TextField
              id="_megaApiKey"
              label="MEGA API KEY"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              value={pluginConfig.apiKey}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({ ...pluginConfig, apiKey: event.target.value });
              }}
            />
          </>
        )}

        {/*
            OBS
            INPUTS FÖR
            MEGA ASSISTANT - WAITERAID
            OBS
          */}

        {plugin.name === 'mega-assistant-alex-waiteraid' && (
          <>
            <Stack spacing={2} justifyContent="space-between" alignItems="center" direction="row">
              <Typography sx={{ p: 1 }} variant="h6" color="text.secondary">
                Chamre
              </Typography>
              <Switch
                checked={pluginConfig.chambre}
                onClick={(event) => {
                  event.preventDefault();
                  setPluginConfig({
                    ...pluginConfig,
                    chambre: !pluginConfig.chambre,
                  });
                }}
              />
            </Stack>
            <TextField
              id="_waiterAidApiKey"
              label="WaiterAid API Key"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              value={pluginConfig.apiKey}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({ ...pluginConfig, apiKey: event.target.value });
              }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <span style={{ flexGrow: 1 }}>
          <Button variant="outlined" onClick={onClose}>
            Avbryt
          </Button>
        </span>
        <Button variant="outlined" onClick={() => setFullScreen(!fullScreen)}>
          Fullscreen
        </Button>
        <LoadingButton loading={isLoading} type="submit" variant="contained" color="primary">
          Spara
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
