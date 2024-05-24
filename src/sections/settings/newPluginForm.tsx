import * as React from 'react';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ListSubheader from '@mui/material/ListSubheader';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IPlugin } from 'src/types/organization';
import { Container, Stack } from '@mui/system';
import { alpha, useTheme } from '@mui/material/styles';
import { usePlugin } from 'src/api/organization';
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  Switch,
  Grid,
} from '@mui/material';
import { useSelectedOrgContext } from 'src/layouts/common/context/org-menu-context';
import { useRef } from 'react';

const CustomListSubheader = (props: any) => {
  const theme = useTheme();
  return (
    <ListSubheader
      {...props}
      sx={{
        fontSize: '1rem',
        fontWeight: 'bold',
        lineHeight: '2rem',
        mt: 2,
        borderRadius: theme.shape.borderRadius / 10,
      }}
    />
  );
};

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
}

type availablePlugin = {
  name: string;
  type: string;
  defaultConfig: Record<string, any>;
  dependencies: string[] | string[][];
};

type newPlugin = {
  name: string;
  type: string;
  config: Record<string, any>;
  organization: string;
};

export default function FormDialog({ onClose, open }: FormDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedOrg] = useSelectedOrgContext();
  const { getAvailablePlugins, createNewPlugin, importPlugin } = usePlugin();
  const [fullScreen, setFullScreen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [pluginConfig, setPluginConfig] = React.useState<Record<string, any>>({});
  const [defaultPlugin, setDefaultPlugin] = React.useState<availablePlugin | null>(null);
  const [availablePlugins, setAvailablePlugins] = React.useState<availablePlugin[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        try {
          const jsonData = JSON.parse(text as string);

          // Antag att jsonData innehåller de nycklar vi är intresserade av: name och config
          // Se till att dessa fält faktiskt finns i filen du importerar
          if (jsonData.name && jsonData.config) {
            const dataToImport = {
              organizationId: selectedOrg?._id ?? '', // Hämta organizationId från selectedOrg och tilldela en tom sträng som standardvärde om det är undefined
              name: jsonData.name, // Namnet på pluginet extraherat från filen
              config: jsonData.config, // Konfigurationsdata för pluginet extraherat från filen
            };

            console.log('Importerar filen:', dataToImport);

            await importPlugin(dataToImport); // Anropa importPlugin med det strukturerade objektet
            console.log('Filen har importerats!');
            handleClose(); // Antagligen stänger du ett modalfönster eller liknande här
          } else {
            console.error('JSON-filen saknar nödvändiga nycklar: name eller config');
          }
        } catch (error) {
          console.error('Ett fel inträffade vid import av filen:', error);
        }
      };
      reader.readAsText(file);
    } else {
      console.error('Vänligen välj en JSON-fil.');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  React.useEffect(() => {
    if (!selectedOrg?._id) return;
    getAvailablePlugins({ organizationId: selectedOrg._id }).then((data) => {
      console.log(data);
      setAvailablePlugins(data.availablePlugins);
      // setInstalledPlugins(data.installed);
    });
  }, [getAvailablePlugins, selectedOrg]);

  const handleClose = () => {
    onClose();
    setPluginConfig({});
    setDefaultPlugin(null);
  };

  return (
    <Dialog
      open={open}
      fullScreen={fullScreen}
      fullWidth
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          setIsLoading(true);
          await createNewPlugin({
            organizationId: selectedOrg?._id as string,
            config: pluginConfig as Record<string, any>,
            name: defaultPlugin?.name as string,
          });
          setIsLoading(false);
          handleClose();
        },
      }}
    >
      <DialogTitle>Skapa nytt plugin</DialogTitle>
      <DialogContent>
        <DialogContentText>Här kan du lägga till ett plugin för organisationen.</DialogContentText>
        <FormControl fullWidth margin="normal">
          <InputLabel id="org-select-label">Välj en eller flera organisationer</InputLabel>
          <Select
            style={{ overflowY: 'scroll' }}
            labelId="org-select-label"
            id="org-select"
            value={defaultPlugin?.name}
            onChange={(event) => {
              event.preventDefault();
              const foundPlugin = availablePlugins.find(
                (availablePlugin) => availablePlugin.name === event.target.value
              );
              if (foundPlugin) {
                setDefaultPlugin(foundPlugin);
                setPluginConfig(foundPlugin.defaultConfig);
              }
            }}
            input={<OutlinedInput label="Välj en eller flera organisationer" />}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
          >
            {availablePlugins.filter((_) => _.type === 'input').length !== 0 && (
              <CustomListSubheader>Inputs</CustomListSubheader>
            )}
            {availablePlugins
              .filter((_) => _.type === 'input')
              .map((availablePlugin, index) => (
                <MenuItem
                  key={`input-${index}`}
                  value={availablePlugin.name}
                  sx={{ padding: '10px 16px' }}
                >
                  {availablePlugin.name}
                </MenuItem>
              ))}

            {availablePlugins.filter((_) => _.type === 'chain').length !== 0 && (
              <CustomListSubheader>Chains</CustomListSubheader>
            )}
            {availablePlugins
              .filter((_) => _.type === 'chain')
              .map((availablePlugin, index) => (
                <MenuItem
                  key={`chain-${index}`}
                  value={availablePlugin.name}
                  sx={{ padding: '10px 16px' }}
                >
                  {availablePlugin.name}
                </MenuItem>
              ))}

            {availablePlugins.filter((_) => _.type === 'tool').length !== 0 && (
              <CustomListSubheader>Tools</CustomListSubheader>
            )}
            {availablePlugins
              .filter((_) => _.type === 'tool')
              .map((availablePlugin, index) => (
                <MenuItem
                  key={`tool-${index}`}
                  value={availablePlugin.name}
                  sx={{ padding: '10px 16px' }}
                >
                  {availablePlugin.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        {/*
            OBS
            INPUTS FÖR
            MEGA ASSISTANT ALEX
            OBS
         */}
        {defaultPlugin?.name === 'mega-assistant-alex' && (
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
        {defaultPlugin?.name === 'mega-assistant-eva' && (
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
        {defaultPlugin?.name === 'auto-filter' && (
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
                sx={{ mt: 4 }}
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
        {defaultPlugin?.name === 'chain-starter' && (
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

        {defaultPlugin?.name === 'mailer' && (
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
          </>
        )}

        {/*
            OBS
            INPUTS FÖR
            MEGA ASSISTANT - WAITERAID
            OBS
          */}

        {defaultPlugin?.name === 'mega-assistant-alex-waiteraid' && (
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

        {/*
            OBS
            INPUTS FÖR
            MEGA ASSISTANT - mailE
            OBS
          */}

        {defaultPlugin?.name === 'mega-assistant-alex-mailE-sendToHuman' && (
          <>
            <Typography variant="h6" color="text.secondary">
              Kontakuppgifter till människa.
            </Typography>

            <TextField
              id="_mailESendTo"
              label="Mottagare"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              value={pluginConfig?.sendTo || ''}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({
                  ...pluginConfig,
                  sendTo: event.target.value,
                });
              }}
            />
            <TextField
              id="_mailESubject"
              label="Ämne"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              value={pluginConfig?.subject || ''}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({
                  ...pluginConfig,
                  subject: event.target.value,
                });
              }}
            />
            <TextField
              id="_mailENameOfHuman"
              label="Namn på människa"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              value={pluginConfig?.nameOfHuman || ''}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({
                  ...pluginConfig,
                  nameOfHuman: event.target.value,
                });
              }}
            />
            <TextField
              id="_mailEDescription"
              label="Beskrivning"
              margin="normal"
              variant="outlined"
              required
              multiline
              fullWidth
              value={pluginConfig?.description || ''}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({
                  ...pluginConfig,
                  description: event.target.value,
                });
              }}
            />
            <TextField
              id="_mailEOnSuccess"
              label="Vid lyckad kontakt"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              value={pluginConfig?.onSuccess || ''}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({
                  ...pluginConfig,
                  onSuccess: event.target.value,
                });
              }}
            />
          </>
        )}

        {/*
            OBS
            INPUTS FÖR
            MEGA ASSISTANT - KNOWLEDGE
            OBS
          */}

        {defaultPlugin?.name === 'mega-assistant-alex-knowledge' && (
          <>
            <Typography variant="h6" color="text.secondary">
              Kunskap till Alex
            </Typography>

            <TextField
              id="_knowledgeCollection"
              label="Kollektion"
              margin="normal"
              variant="outlined"
              required
              fullWidth
              value={pluginConfig?.collection || ''}
              onChange={(event) => {
                event.preventDefault();
                setPluginConfig({
                  ...pluginConfig,
                  collection: event.target.value,
                });
              }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <span style={{ flexGrow: 1 }}>
          <Button variant="outlined" onClick={handleClose}>
            Avbryt
          </Button>
        </span>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".json"
          onChange={handleFileSelect}
        />
        <Button variant="outlined" onClick={handleImportClick}>
          Importera
        </Button>
        <Button variant="outlined" onClick={() => setFullScreen(!fullScreen)}>
          Fullscreen
        </Button>
        <LoadingButton loading={isLoading} type="submit" variant="contained" color="primary">
          Skapa
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
