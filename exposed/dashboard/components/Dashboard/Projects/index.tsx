// External libs
// Types
import type {ModelProject} from '@nxtranet/headers';
import {NextRouter, withRouter} from 'next/router';
import React from 'react';
import FooterDefault from '~/components/Shared/FooterDefault';
import ModalForm from '~/components/Shared/ModalForm';
import PageTitle from '~/components/Shared/PageTitle';
import {ContainerWrapper} from '~/styles/global';
import {IconPlus, IconProject} from '~/styles/icons';
import PageWrapper from '../PageWrapper';
import ProjectCard from './ProjectCard';
import * as Style from './style';

type ProjectsProps = {
  data: ModelProject[];
  router: NextRouter;
  onSubmitForm: (data: ModelProject) => void | Promise<void>;
}

type ProjectsState = {
  isModalCreateOpen: boolean;
  createProjectFormErrors: Record<string, string>;
}

class Projects
  extends React.PureComponent<ProjectsProps, ProjectsState> {

  state: ProjectsState = {
    isModalCreateOpen: false,
    createProjectFormErrors: {},
  }

  onSubmit = async (data: ModelProject) => {
    try {
      await this.props.onSubmitForm(data);
      this.closeModalCreate();

    } catch (e: any) {
      console.dir(e);
      if (e.response.status !== 422) return;
      const {
        messages,
      } = e.response.data.error.details;
      const errorKeys = Object.keys(messages);
      this.setState({
        createProjectFormErrors: errorKeys.reduce((acc: Record<string, string>, errorKey: string) => {
          acc[errorKey] = messages[errorKey] as string;
          return acc;
        }, {}),
      });
      throw e;
    }
  }

  onOpenModalCreate = () => {
    this.setState({
      isModalCreateOpen: true,
    });
  }

  closeModalCreate = () => {
    this.setState({
      isModalCreateOpen: false,
    })
  }

  onClickProject = (data: ModelProject) => {
    this.props.router.push(`/dashboard/projects/${data.name}`);
  }

  render() {
    const {
      data,
    } = this.props;
    const {
      createProjectFormErrors,
      isModalCreateOpen,
    } = this.state;
    return (
      <React.Fragment>
        <ModalForm
          isVisible={isModalCreateOpen}
          title="New project"
          icon={(<IconProject size={40} />)}
          formProps={{
            schema: [{
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
            }],
            errors: createProjectFormErrors,
            isButtonCancelEnabled: true,
            onCancel: this.closeModalCreate,
            submitTitle: "Create",
            onSubmit: this.onSubmit,
          }}
        />
        <ContainerWrapper>
          <PageWrapper>
            <Style.Container>
              <PageTitle
                title="Projects"
                actions={[
                  {
                    title: 'New project',
                    icon: () => <IconPlus size={12} />,
                    fn: this.onOpenModalCreate,
                  }
                ]}
              />
              <Style.ProjectsContainer>
                {data.map((project) => (
                  <ProjectCard
                    key={project.id}
                    data={project}
                    isVisible={false}
                    onClick={this.onClickProject}
                  />
                ))}
              </Style.ProjectsContainer>
            </Style.Container>
          </PageWrapper>
          <FooterDefault />
        </ContainerWrapper>
      </React.Fragment>
    )
  }
}

export default withRouter(Projects);
