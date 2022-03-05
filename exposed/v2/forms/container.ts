import type {ReformSchema} from '~/components/ReForm';

export const formContainerDeploy: ReformSchema[] = [
  {
    title: 'Branch',
    key: 'branch',
    type: 'Relation',
    description: `
      Select branch to deploy inside this cluster
    `,
    isDescriptionEnabled: true,
    options: {
      path: `/projects/{{projectName}}/git-branches`,
      displayKey: 'name',
      returnKey: 'name',
      key: 'namespace',
    }
  }
];
