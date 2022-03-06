import type {ReformSchema} from '~/components/Shared/ReForm';

export const formEnvVar: ReformSchema[] = [
  {
    title: 'Key',
    key: 'key',
    type: 'String',
    isDescriptionEnabled: true,
    description: 'Key of your environement variable',
  },
  {
    title: 'Value',
    key: 'value',
    type: 'String',
    isDescriptionEnabled: true,
    description: 'Value for your environement variable',
  },
];
