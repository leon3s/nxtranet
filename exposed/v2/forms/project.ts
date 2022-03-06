import type {ReformSchema} from '~/components/ReForm';

export const formProject: ReformSchema[] = [{
  title: 'Name',
  key: 'name',
  type: 'String',
  isDescriptionEnabled: true,
  description: 'Display name of your project',
},
{
  title: 'Github Project',
  key: 'github_project',
  type: 'String',
  isDescriptionEnabled: true,
  description: 'Github project name you want to be abble to deploy'
},
{
  title: 'Github Username',
  key: 'github_username',
  type: 'String',
  isDescriptionEnabled: true,
  description: 'Github username or organization name that host the repository',
},
{
  title: 'Github Password',
  key: 'github_password',
  type: 'String',
  isDescriptionEnabled: true,
  description: 'A generated access token with read right on the repository',
}];
