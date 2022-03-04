import type {NginxSiteAvailable} from '@nxtranet/headers';
import React from 'react';
import api from '~/api';
import FooterDefault from '~/components/Shared/FooterDefault';
import ModalActionFetcher from '~/components/Shared/ModalActionFetcher';
import PageTitle from '~/components/Shared/PageTitle';
import {ContainerWrapper} from '~/styles/global';
import PageWrapper from '../PageWrapper';
import NginxCard from './NginxCard';
import * as Style from './style';

type NginxProps = {
  data: NginxSiteAvailable[];
}

type NginxState = {
  site: NginxSiteAvailable | null;
  isUpdateNginxModalOpen: boolean;
}

export default class Nginx extends React.PureComponent<NginxProps, NginxState> {
  state: NginxState = {
    site: null,
    isUpdateNginxModalOpen: false,
  }

  openUpdateNginxModal = (name: string, content: string) => {
    this.setState({
      site: {
        name,
        content,
      },
      isUpdateNginxModalOpen: true,
    });
  }

  closeUpdateNginxModel = () => {
    this.setState({
      site: null,
      isUpdateNginxModalOpen: false,
    })
  }

  render() {
    const {
      isUpdateNginxModalOpen
    } = this.state;
    return (
      <React.Fragment>
        <ModalActionFetcher
          isVisible={isUpdateNginxModalOpen}
          onClose={this.closeUpdateNginxModel}
          actions={[
            {
              title: 'Writing file',
              fn: async () => {
                const {site} = this.state;
                if (!site) return;
                await api.post(`/nginx/sites-avaible/${site.name}/write`, site.content, {
                  headers: {
                    'content-type': 'text/plain',
                  },
                });
              }
            },
            {
              title: 'Testing config',
              fn: async () => {
                await api.get('/nginx/test');
              }
            },
            {
              title: 'Reloading service',
              fn: () => api.get('/nginx/reload'),
            },
          ]}
        />
        <ContainerWrapper>
          <PageWrapper>
            <Style.Container>
              <PageTitle
                title="Nginx"
              />
              <Style.NginxCards>
                {this.props.data.map((siteAvaible) => (
                  <Style.NginxCardContainer
                    key={siteAvaible.name}
                  >
                    <NginxCard
                      data={siteAvaible}
                      onClick={() => { }}
                      onUpdateNginxSiteAvailable={this.openUpdateNginxModal}
                    />
                  </Style.NginxCardContainer>
                ))}
              </Style.NginxCards>
            </Style.Container>
          </PageWrapper>
          <FooterDefault />
        </ContainerWrapper>
      </React.Fragment>
    )
  }
}
