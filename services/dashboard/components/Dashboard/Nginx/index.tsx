import type {NginxSiteAvaible} from '@nxtranet/headers';
import React from 'react';
import api from '~/api';
import ModalActionFetcher from '~/components/Shared/ModalActionFetcher';
import {ContainerWrapper} from '~/styles/global';
import NginxCard from './NginxCard';
import * as Style from './style';





type NginxProps = {
  data: NginxSiteAvaible[];
}

type NginxState = {
  site: NginxSiteAvaible | null;
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
              fn: () => new Promise(async (resolve, reject) => {
                try {
                  await api.get('/nginx/reload');
                } catch (e) {
                  e;
                  setTimeout(() => {
                    api.get('/ping').then(() => resolve()).catch(reject);
                  }, 5000);
                }
              })
            },
          ]}
        />
        <ContainerWrapper>
          <Style.Container>
            <Style.NginxCards>
              {this.props.data.map((siteAvaible) => (
                <Style.NginxCardContainer
                  key={siteAvaible.name}
                >
                  <NginxCard
                    data={siteAvaible}
                    onClick={() => { }}
                    onUpdateNginxSiteAvaible={this.openUpdateNginxModal}
                  />
                </Style.NginxCardContainer>
              ))}
            </Style.NginxCards>
          </Style.Container>
        </ContainerWrapper>
      </React.Fragment>
    )
  }
}
