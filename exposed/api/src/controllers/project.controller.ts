import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, requestBody
} from '@loopback/rest';
import crypto from 'crypto';
import {GithubServiceBindings, WebSockerServiceBindings} from '../keys';
import {Project} from '../models';
import {ProjectRepository} from '../repositories';
import {GithubService} from '../services/github-service';
import {WebsocketService} from '../websocket';

export class ProjectController {
  constructor(
    @inject(GithubServiceBindings.GITHUB_SERVICE)
    protected githubService: GithubService,
    @inject(WebSockerServiceBindings.WEBSOCKET_SERVICE)
    protected websocket: WebsocketService,
    @repository(ProjectRepository)
    protected projectRepository: ProjectRepository,
  ) { }

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
            exclude: ['id', 'github_webhook', 'github_webhook_secret'],
          }),
        },
      },
    })
    project: Omit<Project, 'id'>,
  ): Promise<Project> {
    project.github_webhook = `/webhooks/github/${project.name}`;
    project.github_webhook_secret = `nxtwh_${crypto.randomBytes(6).toString('hex')}`;
    const projectDB = await this.projectRepository.create(project);
    try {
      await this.githubService.getProjectBranch({
        projectName: project.name,
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

  @get('/projects/count', {
    description: 'Get projects count',
    responses: {
      '200': {
        description: 'Project model count',
        content: {'application/json': {schema: CountSchema}},
      }
    }
  })
  async count(
    @param.where(Project) where?: Where<Project>,
  ): Promise<Count> {
    return this.projectRepository.count(where);
  }

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
    await this.projectRepository.delete(projectDB);
    return "Ok";
  }
}
