import {inject} from '@loopback/core';
import {
  Filter,
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import crypto from 'crypto';
import {
  GithubServiceBindings,
  NginxServiceBindings,
  ProjectServiceBindings,
  WebSockerServiceBindings
} from '../keys';
import {Project} from '../models';
import {ProjectRepository} from '../repositories';
import {GithubService} from '../services/github-service';
import {NginxService} from '../services/nginx-service';
import ProjectService from '../services/project-service';
import {WebsocketService} from '../websocket';

export class ProjectController {
  constructor(
    @inject(NginxServiceBindings.NGINX_SERVICE)
    protected nginxService: NginxService,
    @inject(ProjectServiceBindings.PROJECT_SERVICE)
    protected projectService: ProjectService,
    @inject(GithubServiceBindings.GITHUB_SERVICE)
    protected githubService: GithubService,
    @inject(WebSockerServiceBindings.WEBSOCKET_SERVICE)
    protected websocket: WebsocketService,
    @repository(ProjectRepository)
    protected projectRepository: ProjectRepository,
  ) { }

  /** DASHBOARD_IN_USE */
  @post('/projects', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(Project)}},
      }
    }
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {
            title: 'NewProject',
            exclude: ['id', 'creationDate', 'github_webhook', 'github_webhook_secret'],
            optional: ['github_password'],
            partial: true,
          }),
        },
      },
    })
    project: Omit<Project, 'id'>,
  ): Promise<Project> {
    if (!project.github_password) {
      project.github_password = '';
    }
    project.github_webhook = `/webhooks/github/${project.name}`;
    project.github_webhook_secret = `nxtwh_${crypto.randomBytes(6).toString('hex')}`;
    let projectDB = null;
    try {
      projectDB = await this.projectRepository.create(project);
    } catch (error) {
      if (error.code === 11000) {
        if (error.errmsg.includes('index: uniqueName')) {
          const err = new HttpErrors.UnprocessableEntity('Project name already taken.');
          err.details = {
            messages: {},
          };
          err.details.messages.name = ['already taken must be unique.'];
          throw err;
        }
      }
      throw error;
    }
    try {
      await this.githubService.getProjectBranch({
        projectName: project.github_project,
        username: project.github_username,
        password: project.github_password,
      });
    } catch (e) {
      const err = new HttpErrors.UnprocessableEntity('github username or password incorrect unable to sync branches.');
      err.details = {
        messages: {},
      };
      err.details.messages.github_username = ['unable to sync branch with these credential'];
      err.details.messages.github_password = ['unable to sync branch with these credential'];
      await this.projectRepository.deleteById(projectDB.id);
      throw err;
    }
    await this.githubService.syncProjectBranch(projectDB);
    return projectDB;
  }

  /** DASHBOARD_IN_USE */
  @get('/projects', {
    description: 'Get list of projects',
    responses: {
      '200': {
        description: 'Array of Project model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Project, {includeRelations: true}),
            },
          },
        },
      }
    }
  })
  async find(
    @param.filter(Project) filter?: Filter<Project>,
  ): Promise<Project[]> {
    return this.projectRepository.find(filter);
  }

  /** DASHBOARD_IN_USE */
  @get('/projects/{name}', {
    description: 'Get project by his name',
    responses: {
      '200': {
        description: 'Project model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Project, {includeRelations: true}),
          },
        },
      }
    }
  })
  async findByName(
    @param.path.string('name') name: string,
    @param.filter(Project, {exclude: 'where'}) filter?: FilterExcludingWhere<Project>
  ): Promise<Project> {
    const projectDB = await this.projectRepository.findOne({
      ...filter,
      where: {
        name,
      },
    });
    if (!projectDB) throw new HttpErrors.NotFound('Project not found');
    return projectDB;
  }

  @patch('/projects/{name}', {
    description: 'Update project for given name',
    responses: {
      '204': {
        content: {
          'application/json': {
            description: 'Project updated',
            schema: getModelSchemaRef(Project),
          }
        }
      }
    }
  })
  async updateByName(
    @param.path.string('name') name: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {partial: true}),
        },
      },
    })
    project: Project,
  ): Promise<void> {
    const projectDB = await this.projectRepository.findOne({
      where: {
        name,
      },
    });
    if (!projectDB) throw new HttpErrors.NotFound('Project not found');
    await this.githubService.syncProjectBranch(projectDB);
    await this.projectRepository.updateById(projectDB.id, project);
  }

  /** DASHBOARD_IN_USE */
  @del('/projects/{name}', {
    description: 'Delete project by his name',
    responses: {
      '204': {
        description: '"Ok" if success',
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              example: "Ok",
            }
          }
        }
      },
    }
  })
  async deleteById(@param.path.string('name') name: string): Promise<string> {
    const projectDB = await this.projectRepository.findOne({
      where: {
        name,
      },
    });
    if (!projectDB) throw new HttpErrors.NotFound('Project not found');
    await this.projectService.deleteProject(projectDB);
    await this.nginxService.reloadService();
    return "Ok";
  }
}
