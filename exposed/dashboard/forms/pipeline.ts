import type {ReformSchema} from '~/components/Re/Form';

export const formPipeline: ReformSchema[] = [
  {
    title: 'Color',
    key: 'color',
    type: 'Color',
    isDescriptionEnabled: true,
    description: 'Color of your pipepine',
  },
  {
    title: 'Name',
    key: 'name',
    type: 'String',
    isDescriptionEnabled: true,
    description: 'Name of your pipepine',
  },
];

export const formPipelineCmd: ReformSchema[] = [
  {
    title: 'Command',
    key: 'cmd',
    type: 'ArrayString',
    isDescriptionEnabled: true,
    description: 'Press `enter` for each arguments where the first one is the command name.',
  }
];
