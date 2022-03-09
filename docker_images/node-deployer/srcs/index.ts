
import DeployerService from './DeployerService';

const port = +(process.env.DP_SERVICE_PORT) || 1337;

export const deployerService = new DeployerService();

deployerService.init();

if (require.main === module) {
  deployerService.listen(port);
}
