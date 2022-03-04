import type {
  ModelCluster,
  ModelContainer,
  ModelEnvVar
} from '@nxtranet/headers';
import type {NextRouter} from 'next/router';
import {withRouter} from 'next/router';
import React from 'react';
import {AiOutlinePlus} from 'react-icons/ai';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ActionBar, {ActionWrapper} from '~/components/Shared/ActionBar';
import ModalConfirm from '~/components/Shared/ModalConfirm';
import ModalForm from '~/components/Shared/ModalForm';
import {bindPathOptions} from '~/forms/utils';
import {projectActions} from '~/redux/actions';
import type {State} from '~/redux/reducers';
import {
  IconCluster,
  IconContainer,
  IconEnvVar
} from '~/styles/icons';
import type {Dispatch} from '~/utils/redux';
import ClusterCard from './ClusterCard';
import * as Style from './style';

const actions = {
  createCluster: projectActions.postClusters,
  clusterDeploy: projectActions.clusterDeploy,
  deleteContainer: projectActions.deleteContainer,
  createEnvVar: projectActions.createEnvVar,
  deleteEnvVar: projectActions.deleteEnvVar,
  patchEnvVar: projectActions.patchEnvVar,
}

const mapStateToProps = (state: State) => ({
  clusters: state.project.target_clusters,
  formEnvVar: state.project.form_env_var,
  formCluster: state.project.form_cluster,
  formContainerDeploy: state.project.form_container_deploy,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(actions, dispatch);

type ClustersProps = {
  projectName: string;
  router: NextRouter;
  clusterName: string | null;
}
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>;

type ClustersState = {
  isModalDeployOpen: boolean;
  isModalCreateClusterOpen: boolean;
  isModalDeleteEnvVarOpen: boolean;
  isModalDeleteContainerOpen: boolean;
  containerToDelete?: ModelContainer | null;
  envVarToDelete?: ModelEnvVar | null;
  envVarToEdit?: Partial<ModelEnvVar> | null;
  isModalEditEnvVarOpen: boolean;
  clusterFormErrors: Record<string, string>;
  envVarFormErrors: Record<string, string>;
  targetClusterNamespace: string | null;
}

class Clusters extends
  React.PureComponent<ClustersProps, ClustersState> {

  state: ClustersState = {
    isModalDeployOpen: false,
    isModalCreateClusterOpen: false,
    isModalDeleteEnvVarOpen: false,
    isModalDeleteContainerOpen: false,
    isModalEditEnvVarOpen: false,
    containerToDelete: null,
    envVarToDelete: null,
    envVarToEdit: null,
    envVarFormErrors: {},
    clusterFormErrors: {},
    targetClusterNamespace: null,
  };

  deploySubmitForm = async (data: {branch: string}) => {
    const {
      router,
      clusters,
      projectName,
    } = this.props;
    const [cluster] = clusters;
    const res = await this.props.clusterDeploy(cluster.namespace, data);
    this.setState({
      isModalDeployOpen: false,
    }, () => {
      router.push(`/dashboard/projects/${projectName}/containers/${res.value.data[0].name}`);
    });
  }

  closeModalDeploy = () => {
    this.setState({
      isModalDeployOpen: false,
    })
  }

  openModalDeploy = () => {
    this.setState({
      isModalDeployOpen: true,
    })
  }

  onClickCard = (cluster: ModelCluster) => {
    const {
      clusterName,
      projectName,
      router
    } = this.props;
    if (cluster.name === clusterName) {
      router.push(`/dashboard/projects/${projectName}/clusters`);
    } else {
      router.push(`/dashboard/projects/${projectName}/clusters/${cluster.name}`);
    }
  }

  onClickShowContainer = (container: ModelContainer) => {
    const {
      router,
      projectName,
    } = this.props;
    router.push(`/dashboard/projects/${projectName}/containers/${container.name}`);
  }

  onOpenModalCreateCluster = () => {
    this.setState({
      isModalCreateClusterOpen: true,
    })
  }

  onCreateCluster = async (data: ModelCluster) => {
    const {
      projectName,
    } = this.props;
    try {
      await this.props.createCluster(projectName, data);
      setTimeout(() => {
        this.closeModalCreateCluster();
      }, 200);
    } catch (e: any) {
      console.dir(e);
      if (e.response.status !== 422) return;
      const {
        messages
      } = e.response.data.error.details;
      const errorKeys = Object.keys(messages);
      this.setState({
        clusterFormErrors: errorKeys.reduce((acc: Record<string, string>, errorKey: string) => {
          acc[errorKey] = messages[errorKey] as string;
          return acc;
        }, {}),
      });
      throw e;
    }
  }

  closeModalCreateCluster = () => {
    this.setState({
      isModalCreateClusterOpen: false,
    })
  }

  openModalDeleteContainer = (data: ModelContainer) => {
    this.setState({
      containerToDelete: data,
      isModalDeleteContainerOpen: true,
    });
  }

  onConfirmDeleteContainer = async () => {
    const {containerToDelete} = this.state;
    if (containerToDelete) {
      await this.props.deleteContainer(containerToDelete);
      this.closeModalContainerDelete();
    }
  }

  onConfirmDeleteEnvVar = async () => {
    const {envVarToDelete} = this.state;
    if (envVarToDelete) {
      await this.props.deleteEnvVar(envVarToDelete);
      this.closeModalDeleteEnvVar();
    }
  }

  closeModalContainerDelete = () => {
    this.setState({
      containerToDelete: null,
      isModalDeleteContainerOpen: false,
    });
  }

  openModalDeleteEnvVar = (envVar: ModelEnvVar) => {
    this.setState({
      isModalDeleteEnvVarOpen: true,
      envVarToDelete: envVar,
    });
  }

  closeModalDeleteEnvVar = () => {
    this.setState({
      envVarToDelete: null,
      isModalDeleteEnvVarOpen: false,
    });
  }

  closeModalEditEnvVar = () => {
    this.setState({
      envVarFormErrors: {},
      envVarToEdit: null,
      targetClusterNamespace: null,
      isModalEditEnvVarOpen: false,
    });
  }

  createEnvVar = async (data: ModelEnvVar) => {
    const dataCpy = {...data};
    const {targetClusterNamespace} = this.state;
    if (!targetClusterNamespace) {
      throw new Error('Unexpected Error target clusterNamespace not found..');
    }
    try {
      await this.props.createEnvVar(targetClusterNamespace, dataCpy);
      setTimeout(() => {
        this.closeModalEditEnvVar();
      }, 200);
    } catch (e: any) {
      let envVarFormErrors: Record<string, string> = {};
      if (e.response.status === 422) {
        const {
          messages
        } = e.response.data.error.details;
        const errorKeys = Object.keys(messages);
        envVarFormErrors = errorKeys.reduce((acc: Record<string, string>, errorKey: string) => {
          acc[errorKey] = messages[errorKey] as string;
          return acc;
        }, {});
      }
      if (e.response.status === 409) {
        envVarFormErrors[e.response.data.error.name] = e.response.data.error.message;
      }
      this.setState({
        envVarToEdit: dataCpy,
        envVarFormErrors,
      });
      throw e;
    }
  }

  updateEnvVar = async (envVar: ModelEnvVar) => {
    console.log(envVar);
    await this.props.patchEnvVar(envVar);
    this.closeModalEditEnvVar();
  }

  onClickEditEnvVar = (data: ModelEnvVar) => {
    this.setState({
      envVarToEdit: data,
      isModalEditEnvVarOpen: true,
    });
  }

  onClickCreateEnvVar = (namespace: string) => {
    this.setState({
      isModalEditEnvVarOpen: true,
      targetClusterNamespace: namespace,
      envVarToEdit: {
        key: "",
        value: "",
      },
    })
  }

  render() {
    const {
      clusters,
      clusterName,
      projectName,
      formCluster,
      formEnvVar,
      formContainerDeploy,
    } = this.props;
    const {
      envVarToEdit,
      envVarToDelete,
      containerToDelete,
      envVarFormErrors,
      clusterFormErrors,
      isModalDeployOpen,
      isModalEditEnvVarOpen,
      isModalDeleteEnvVarOpen,
      isModalCreateClusterOpen,
      isModalDeleteContainerOpen,
    } = this.state;
    console.log({envVarToEdit});
    return (
      <React.Fragment>
        {containerToDelete ?
          <ModalConfirm
            title="Warning"
            isVisible={isModalDeleteContainerOpen}
            onCancel={this.closeModalContainerDelete}
            onConfirm={this.onConfirmDeleteContainer}
            description={`Are you sure to delete \`${containerToDelete.name}\``}
          />
          : null}
        {envVarToDelete ?
          <ModalConfirm
            title="Warning"
            isVisible={isModalDeleteEnvVarOpen}
            onCancel={this.closeModalDeleteEnvVar}
            onConfirm={this.onConfirmDeleteEnvVar}
            description={`Are you sure to delete \`${envVarToDelete.key}\``}
          />
          : null}
        <ModalForm
          isVisible={isModalEditEnvVarOpen}
          title="New environement variable"
          icon={(<IconEnvVar size={40} />)}
          formProps={{
            schema: formEnvVar,
            errors: envVarFormErrors,
            data: envVarToEdit,
            isButtonCancelEnabled: true,
            onCancel: this.closeModalEditEnvVar,
            submitTitle: envVarToEdit?.id ? "Update" : "Create",
            onSubmit: envVarToEdit?.id ? this.updateEnvVar : this.createEnvVar,
          }}
        />
        <ModalForm
          isVisible={isModalDeployOpen}
          title="New container"
          icon={<IconContainer size={40} />}
          formProps={{
            onSubmit: this.deploySubmitForm,
            onCancel: this.closeModalDeploy,
            isButtonCancelEnabled: true,
            submitTitle: "Deploy",
            schema: bindPathOptions(formContainerDeploy, {
              projectName,
            }),
          }}
        />
        <ModalForm
          title="New cluster"
          icon={<IconCluster size={40} />}
          isVisible={isModalCreateClusterOpen}
          formProps={{
            errors: clusterFormErrors,
            isButtonCancelEnabled: true,
            submitTitle: 'Create',
            onCancel: this.closeModalCreateCluster,
            onSubmit: this.onCreateCluster,
            schema: bindPathOptions(formCluster, {
              projectName
            }),
          }}
        />
        <Style.Container>
          <ActionWrapper>
            <ActionBar actions={[
              {
                title: 'Create',
                icon: () => <AiOutlinePlus size={12} />,
                fn: this.onOpenModalCreateCluster,
              }
            ]} />
          </ActionWrapper>
          <Style.ClustersContainer>
            {clusters.map((cluster) => (
              <ClusterCard
                data={cluster}
                key={cluster.id}
                onClick={this.onClickCard}
                isVisible={clusterName === cluster.name}
                onClickEditEnvVar={this.onClickEditEnvVar}
                onClickCreateContainer={this.openModalDeploy}
                onClickCreateEnvVar={this.onClickCreateEnvVar}
                onClickDeleteEnvVar={this.openModalDeleteEnvVar}
                onClickShowContainer={this.onClickShowContainer}
                onClickDeleteContainer={this.openModalDeleteContainer}
                onClicClusterDeploy={this.openModalDeploy}
              />
            ))}
          </Style.ClustersContainer>
        </Style.Container>
      </React.Fragment>
    )
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Clusters));
