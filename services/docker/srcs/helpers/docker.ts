import crypto from 'crypto';
import type {Container} from 'dockerode';
import Docker from 'dockerode';
import {getFreePort} from './net';



/** May need permission on linux to read this file. */
const socketPath = '/var/run/docker.sock';

export const docker = new Docker({
  socketPath,
});

export const stopContainer = async (containerID: string) => {
  const container = docker.getContainer(containerID);
  await container.stop();
}

export const removeContainer = async (containerID: string) => {
  const container = docker.getContainer(containerID);
  await container.stop();
  await new Promise((resolve, reject) => {
    container.remove(function (err, data) {
      console.log(err);
      if (err) return reject(err);
      resolve(data);
    });
  });
}

export const createContainer = async (cluster, branch): Promise<{
  containerInstance: Container,
  containerApi: {
    namespace: string;
    name: string;
    appPort: number;
    dockerID: string;
    deployerPort: number;
    projectName: string;
    clusterNamespace: string;
  }
}> => new Promise(async (resolve, reject) => {
  const genID = crypto.randomBytes(8).toString('hex').toLowerCase();
  const name = `${branch}-${genID}`;
  const namespace = `${cluster.namespace}.${name}`;
  const appPort = await getFreePort();
  const deployerPort = await getFreePort();
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
  }, function (err, container) {
    if (err) return reject(err);
    resolve({
      containerInstance: container,
      containerApi: {
        namespace,
        name,
        appPort,
        deployerPort,
        dockerID: container.id,
        projectName: cluster.projectName,
        clusterNamespace: cluster.namespace,
      }
    });
  });
});
