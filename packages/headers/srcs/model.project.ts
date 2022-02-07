import type { ModelPipeline } from "./model.pipeline";

export type         ModelProject = {
  id:               string;
  name:             string;
  github_project:   string;
  github_username:  string;
  github_password:  string;
  pipelines:        ModelPipeline[];
}
