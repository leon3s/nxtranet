import {ModelCluster, ModelContainer} from '@nxtranet/headers';
import crypto from 'crypto';
import type {Container} from 'dockerode';
import Docker from 'dockerode';
import {getFreePort} from './net';


type ContainerOpts = {
  name: string;
  appPort: number;
  deployerPort: number;
}

/** May need permission on linux to read this file. */
const socketPath = '/var/run/docker.sock';

export const docker = new Docker({
  socketPath,
});

export const getContainerById = (containerID: string) => {
  const container = docker.getContainer(containerID);
  return container;
}

export const getContainerInfo = (containerID: string) => {
  const container = getContainerById(containerID);
  return new Promise((resolve, reject) => {
    container.inspect((err, info) => {
      if (err) return reject(err);
      return resolve(info);
    });
  });
}

export const startContainer = async (containerID: string) => {
  const container = getContainerById(containerID);
  await container.start();
}

export const stopContainer = async (containerID: string) => {
  const container = getContainerById(containerID);
  await container.stop();
}

export const removeContainer = async (containerID: string) => {
  const container = getContainerById(containerID);
  await new Promise((resolve, reject) => {
    container.remove({force: true}, function (err, data) {
      console.log(err);
      if (err) return reject(err);
      return resolve(data);
    });
  });
}

const _createContainer = (opts: ContainerOpts): Promise<Container> => {
  const {name, appPort, deployerPort} = opts;
  return new Promise((resolve, reject) => {
    docker.createContainer({
      name,
      Image: 'nextranet-dp-service',
      HostConfig: {
        PortBindings: {
          "3000/tcp": [
            {
              "HostIp": "",
              "HostPort": `${appPort}/tcp`,
            }
          ],
          "1337/tcp": [
            {
              "HostIp": "",
              "HostPort": `${deployerPort}/tcp`,
            }
          ],
        }
      }
    }, (err, container) => {
      if (err) return reject(err);
      return resolve(container);
    });
  })
}

export const createContainer = async (cluster: ModelCluster, branch: string): Promise<{
  containerInstance: Container,
  containerApi: Partial<ModelContainer>,
}> => {
  const genID = crypto.randomBytes(4).toString('hex').toLowerCase();
  const name = `${branch}-${genID}`;
  const namespace = `${cluster.namespace}.${name}`;
  const appPort = await getFreePort();
  const deployerPort = await getFreePort();
  const container = await _createContainer({
    name,
    appPort,
    deployerPort,
  });
  return ({
    containerInstance: container,
    containerApi: {
      name,
      appPort,
      namespace,
      deployerPort,
      dockerID: container.id,
      clusterNamespace: cluster.namespace,
    }
  });
};

export const getContainersInfo = (): Promise<Docker.ContainerInfo[]> => {
  return new Promise((resolve, reject) => {
    docker.listContainers({all: true}, (err, containers) => {
      if (err) return reject(err);
      resolve(containers);
    });
  });
}
