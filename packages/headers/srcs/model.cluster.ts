import type { ModelEnvVar } from './model.envVar';
import type { ModelProject } from './model.project';
import type { ModelContainer } from './model.container'

export type               ModelCluster = {
  id:                     string;
  name:                   string;
  namespace:              string;
  projectName:            string;
  environementNamespace:  string;
  project:                ModelProject;
  envVars:                ModelEnvVar[];
  containers:             ModelContainer[];
};
