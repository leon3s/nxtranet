// External libs
// Types
import type {ModelProject} from '@nxtranet/headers';
import {NextRouter, withRouter} from 'next/router';
import React from 'react';
import {AiOutlinePlus} from 'react-icons/ai';
import ActionBar, {ActionWrapper} from '~/components/Shared/ActionBar';
import FooterDefault from '~/components/Shared/FooterDefault';
// Local components
import Modal from '~/components/Shared/Modal';
import Reform from '~/components/Shared/ReForm';
import {ContainerWrapper} from '~/styles/global';
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
        <Modal
          isVisible={isModalCreateOpen}
        >
          <Style.ModalContent>
            <Reform
              schema={[
                {title: 'Name', key: 'name', type: 'String'},
                {title: 'Github Project', key: 'github_project', type: 'String'},
                {title: 'Github Username', key: 'github_username', type: 'String'},
                {title: 'Github Password', key: 'github_password', type: 'String'},
              ]}
              errors={createProjectFormErrors}
              onSubmit={this.onSubmit}
              onCancel={this.closeModalCreate}
              isButtonCancelEnabled={true}
              submitTitle="Create"
            />
          </Style.ModalContent>
        </Modal>
        <ContainerWrapper>
          <Style.Container>
            <ActionWrapper>
              <ActionBar actions={[
                {
                  title: 'Create',
                  icon: () => <AiOutlinePlus size={12} />,
                  fn: this.onOpenModalCreate,
                }
              ]} />
            </ActionWrapper>
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
          <FooterDefault />
        </ContainerWrapper>
      </React.Fragment>
    )
  }

}

export default withRouter(Projects);
