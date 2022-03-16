import type {NextRouter} from 'next/router';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DashboardContent from '~/components/DashboardContent';
import DashboardTitle from '~/components/DashboardTitle';
import MenuNav from '~/components/MenuNav';
import ModalActionFetcher from '~/components/ModalActionFetcher';
import NginxFile from '~/components/NginxFile';
import NginxFileCard from '~/components/NginxFileCard';
import {openModalConfirm, openModalForm} from '~/redux/actions/modal';
import {getNginxSitesAvailable, setNginxSiteAvaible} from '~/redux/actions/nginx';
import type {State} from '~/redux/reducers';
import {IconFiles, IconMetrix} from '~/styles/icons';
import {Dispatch} from '~/utils/redux';
import * as Style from './DashboardNginx.s';
import api from '~/api';
import type {NginxSiteAvailable} from '@nxtranet/headers';

const navItems = [
  {
    displayName: 'Files',
    name: 'files',
    href: '/files',
    icon: () => <IconFiles
      size={16}
    />,
  },
  {
    displayName: 'Metrix',
    name: 'metrix',
    href: '/metrix',
    icon: () => <IconMetrix
      size={16}
    />,
  },
];

const actions = {
  openModalForm,
  openModalConfirm,
  getNginxSitesAvailable,
  setNginxSiteAvaible,
};

const mapStateToProps = (state: State) => ({
  files: state.nginx.files,
  current: state.nginx.current,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

export type DashboardNginxContainerProps = {
  tab: string;
  router: NextRouter;
  name?: string | null;
} & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>;

export type DashboardNginxContainerState = {
  currentNginxFile: NginxSiteAvailable | null;
}

class DashboardNginxContainer extends
  React.PureComponent<DashboardNginxContainerProps, DashboardNginxContainerState> {

  state: DashboardNginxContainerState = {
    currentNginxFile: null,
  };

  actions = [{
    title: 'write file',
    fn: async () => {
      const {currentNginxFile} = this.state;
      if (!currentNginxFile) return;
      await api.post(`/nginx/sites-avaible/${currentNginxFile.name}/write`, currentNginxFile.content, {
        headers: {
          'content-type': 'text/plain',
        },
      });
    }
  },
  {
    title: 'test',
    fn: async () => {
      await api.get('/nginx/test');
    },
  },
  {
    title: 'reload',
    fn: async () => {
      await api.get('/nginx/reload');
    }
  }
  ];

  onSaveNginxFile = (nginxFile: NginxSiteAvailable) => {
    this.setState({
      currentNginxFile: nginxFile,
    });
  };

  onCancelSaveNginxFile = () => {
    this.setState({
      currentNginxFile: null,
    });
  };

  render() {
    const {tab, files, current} = this.props;
    const {currentNginxFile} = this.state;
    return (
      <React.Fragment>
        <ModalActionFetcher
          isVisible={!!currentNginxFile}
          onClose={this.onCancelSaveNginxFile}
          actions={this.actions}
        />
        <DashboardContent>
          <DashboardTitle
            title={`Nginx`}
          />
          <Style.MenuNavContainer>
            <MenuNav
              current={tab}
              data={navItems}
              baseUrl="/dashboard/nginx"
            />
          </Style.MenuNavContainer>
          {
            tab === 'files' && !current ?
              < Style.FilesCardContainer >
                {
                  files.map((file) => (
                    <NginxFileCard
                      key={file.name}
                      data={file}
                    />
                  ))}
              </Style.FilesCardContainer>
              : null}
          {
            tab === 'files' && current ?
              <NginxFile
                onSave={this.onSaveNginxFile}
                data={current}
              />
              : null
          }
        </DashboardContent >
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardNginxContainer));
