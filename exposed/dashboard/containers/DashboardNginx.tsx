import type {NextRouter} from 'next/router';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DashboardContent from '~/components/DashboardContent';
import DashboardTitle from '~/components/DashboardTitle';
import MenuNav from '~/components/MenuNav';
import NginxFile from '~/components/NginxFile';
import NginxFileCard from '~/components/NginxFileCard';
import {openModalConfirm, openModalForm} from '~/redux/actions/modal';
import {getNginxSitesAvailable, setNginxSiteAvaible} from '~/redux/actions/nginx';
import type {State} from '~/redux/reducers';
import {IconFiles, IconMetrix} from '~/styles/icons';
import {Dispatch} from '~/utils/redux';
import * as Style from './DashboardNginx.s';

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

class DashboardNginxContainer extends
  React.PureComponent<DashboardNginxContainerProps> {

  render() {
    const {tab, files, current} = this.props;
    return (
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
              data={current}
            />
            : null
        }
      </DashboardContent >
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardNginxContainer));
