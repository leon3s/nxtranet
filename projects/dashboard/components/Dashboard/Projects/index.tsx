// External libs
import React from 'react';
import Link from 'next/link';

// Local components
import Modal from '~/components/Shared/Modal';
import Reform from '~/components/Shared/ReForm';
import FooterDefault from '~/components/Shared/FooterDefault';

// Types
import type {ModelProject} from '@nxtranet/headers';

// Local Style
import * as StyleLink from '~/styles/link';
import * as ProjectStyle from '~/styles/project';
import { ContainerWrapper } from '~/styles/global';
import * as HeaderSearchStyle from '~/styles/headerSearch';

import * as Style from './style';

type              ProjectsProps = {
  data:           ModelProject[];
  onSubmitForm:   (data: ModelProject) => void | Promise<void>;
}

type              ProjectsState = {
  isModalCreateOpen: boolean;
}

export default class Projects
  extends React.PureComponent<ProjectsProps, ProjectsState> {

  state: ProjectsState = {
    isModalCreateOpen: false,
  }

  onSubmit = async (data: ModelProject) => {
    await this.props.onSubmitForm(data);
    this.closeModalCreate();
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

  render() {
    const {
      data,
    } = this.props;
    const {
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
              onSubmit={this.onSubmit}
              onCancel={this.closeModalCreate}
              isButtonCancelEnabled={true}
              submitTitle="Create"
            />
          </Style.ModalContent>
        </Modal>
        <ContainerWrapper>
          <Style.Container>
            <HeaderSearchStyle.Header>
              <HeaderSearchStyle.SearchBar
                placeholder="Search.."
              />
              <HeaderSearchStyle.CreateButton onClick={this.onOpenModalCreate}>
                Create
              </HeaderSearchStyle.CreateButton>
            </HeaderSearchStyle.Header>
            <Style.ProjectsWrap>
              {data.map((project) => (
                <ProjectStyle.Line
                  key={project.id}
                >
                  <ProjectStyle.Title>
                    {project.name}
                  </ProjectStyle.Title>
                  <Link
                    href={`/dashboard/projects/${project.name}`}
                  >
                    <StyleLink.A>
                      Show
                    </StyleLink.A>
                  </Link>
                </ProjectStyle.Line>
              ))}
            </Style.ProjectsWrap>
          </Style.Container>
          <FooterDefault />
        </ContainerWrapper>
      </React.Fragment>
    )
  }

}