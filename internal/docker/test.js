const Docker = require('dockerode');

const socketPath = '/var/run/docker.sock';

const docker = new Docker({
  socketPath,
});

const getContainerById = (containerID) => {
  const container = docker.getContainer(containerID);
  return container;
};

(async function main() {
  const container = getContainerById('052ece84a8663d5dc7f4ddd5d4df6ad34ceb8045f56b3d6760c318c46b4b75b7');
  console.log(container);
  const stream = await container.stats();
  // stats are now streamed in real time
  stream.on('data', (d) => {
    console.log(d.toString());
  });
})().catch((err) => {
  console.error(err);
});
