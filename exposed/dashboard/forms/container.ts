import type {ReformSchema} from '~/components/Re/Form';

export const formContainerDeploy: ReformSchema[] = [
  {
    title: 'Branch',
    key: 'branch',
    type: 'Relation',
    description: `
      Select branch download inside container
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
