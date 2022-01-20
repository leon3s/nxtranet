import {ModelClusterProduction} from '@nxtranet/headers';
import {NextRouter, withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Reform from '~/components/Shared/ReForm';
import {projectActions} from '~/redux/actions';
import type {State} from '~/redux/reducers';
import {Dispatch} from '~/utils/redux';
import * as Style from './style';

const actions = {
  createClusterProduction: projectActions.createClusterProduction,
};

const mapStateToProps = (state: State) => ({
  clusterProduction: state.project.target_clusterProduction,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch)

type ProductionProps = {
  projectName: string;
  clusterProduction: ModelClusterProduction;
  router: NextRouter;
}
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>;

type ProductionState = {
  clusterProdData: Partial<ModelClusterProduction>;
};

class Production extends
  React.PureComponent<ProductionProps, ProductionState> {

  state: ProductionState = {
    clusterProdData: this.props.clusterProduction || {
      domain: '',
      numberOfInstances: 1,
    }
  };

  componentDidMount() {
    console.log('production props', this.props);
  }

  onSubmit = async (clusterProduction: Partial<ModelClusterProduction>) => {
    await this.props.createClusterProduction(this.props.projectName, clusterProduction);
  }

  render() {
    const {
      projectName,
    } = this.props;
    const { } = this.state;
    return (
      <React.Fragment>
        <Style.Container>
          <Reform
            schema={[
              {title: 'Domain', key: 'domain', type: 'String'},
              {title: 'Number of instances', key: 'numberOfInstances', type: 'Number'},
              {
                title: 'Target cluster',
                key: 'clusterNamespace',
                type: 'Relation',
                description: `
                  Select cluster that will be used as settings to deploy in production
                `,
                isDescriptionEnabled: true,
                options: {
                  path: `/projects/${projectName}/clusters`,
                  displayKey: 'name',
                  returnKey: 'namespace',
                }
              }
            ]}
            onSubmit={this.onSubmit}
            data={this.state.clusterProdData}
            submitTitle="Update"
            isButtonCancelEnabled={false}
          />
        </Style.Container>
      </React.Fragment>
    )
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Production));
