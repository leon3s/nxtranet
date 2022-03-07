import type {ReformSchema} from '~/components/Re/Form';

export const formCluster: ReformSchema[] = [
  {
    title: 'Type',
    type: 'Relation',
    key: 'type',
    isDescriptionEnabled: true,
    description: `
      Select type of your cluster
      TESTING will allow multiple instance with different version
      where SINGLE will deploy a single instance of a version
      and SCALING will scale and deploy multiple instance of a version.
    `,
    options: {
      path: '/clusters/types',
      displayKey: 'value',
      returnKey: 'value',
      key: 'key',
    }
  },
  {
    title: 'Name',
    key: 'name',
    type: 'String',
    description: 'Name of your cluster \`development\` for example.',
    isDescriptionEnabled: true,
  },
  {
    title: 'Host name',
    key: 'hostname',
    type: 'String',
    description: `
      Choose host name aka domain name that container and cluster will use
    `,
    isDescriptionEnabled: true,
  },
  {
    title: 'Host',
    key: 'host',
    type: 'String',
    description: `
      Choose host used for listen nginx property
    `,
    isDescriptionEnabled: true,
  },
  {
    title: 'Target branch',
    key: 'gitBranchNamespace',
    type: 'Relation',
    description: `
      Select a target branch for your cluster.
      If any cluster will deploy on pull request,
      unless it will deploy when target branch receive a commit.
    `,
    isDescriptionEnabled: true,
    options: {
      path: `/projects/{{projectName}}/git-branches`,
      displayKey: 'name',
      returnKey: 'namespace',
      isAnyEnabled: true,
      key: 'namespace',
    }
  }
];
