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
import { useSettingsContext } from 'src/components/settings';
import FormDialog from './formDialog';

// ----------------------------------------------------------------------
type plugin = {
  name: string;
  type: 'input' | 'chain' | 'tool';
  isActivated: boolean;
  config: object;
};
const pluginss: plugin[] = [
  {
    name: 'mega-assistant-eva',
    type: 'chain',
    isActivated: true,
    config: {
      systemPrompt: '',
      model: 'gpt-4-1106-preview',
    },
  },
  {
    name: 'mega-assistant-alex',
    type: 'chain',
    isActivated: false,
    config: {
      systemPrompt: '',
      tools: ['waiteraid'],
    },
  },
  {
    name: 'mega-assistant-waiteraid',
    type: 'tool',
    isActivated: false,
    config: {
      chambre: true,
      apiKey: 'some-key',
    },
  },
  {
    name: 'chat-client',
    type: 'input',
    isActivated: false,
    config: {
      systemPrompt: '',
      tools: ['waiteraid'],
    },
  },
  {
    name: 'mailer',
    type: 'input',
    isActivated: false,
    config: {
      systemPrompt: '',
      tools: ['waiteraid'],
    },
  },
];

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();
  const theme = useTheme();

  const [plugins, setPlugins] = useState(pluginss);

  const [actionTypesInput, setActionTypesInput] = useState<plugin[]>([]);
  const [actionTypesChain, setActionTypesChain] = useState<plugin[]>([]);
  const [actionTypesTool, setActionTypesTool] = useState<plugin[]>([]);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const typeInput = plugins.filter((_) => _.type === 'input');
    const typeChain = plugins.filter((_) => _.type === 'chain');
    const typeTool = plugins.filter((_) => _.type === 'tool');

    setActionTypesInput(typeInput);
    setActionTypesChain(typeChain);
    setActionTypesTool(typeTool);
  }, []);

  useEffect(() => {
    // const response = useApi();
    // setPlugins(response.plugins)
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Inställningar 🚀 ⚙️
      </Typography>

      {[actionTypesInput, actionTypesChain, actionTypesTool].map((plugins) => (
        <Grid
          container
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          {plugins.map((plugin) => (
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
                  <Switch checked={plugin.isActivated} />
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
