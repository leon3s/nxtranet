import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {NginxServiceBindings, ProjectServiceBindings} from '../keys';
import {
  Cluster,
  Project
} from '../models';
import {ProjectRepository} from '../repositories';
import {NginxService} from '../services/nginx-service';
import ProjectService from '../services/project-service';

export class ProjectClusterController {
  constructor(
    @inject(NginxServiceBindings.NGINX_SERVICE)
    protected nginxService: NginxService,
    @inject(ProjectServiceBindings.PROJECT_SERVICE)
    protected projectService: ProjectService,
    @repository(ProjectRepository)
    protected projectRepository: ProjectRepository,
  ) { }

  @get('/projects/{name}/clusters', {
    responses: {
      '200': {
        description: 'Array of Project has many Cluster',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Cluster)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('name') name: string,
    @param.query.object('filter') filter?: Filter<Cluster>,
  ): Promise<Cluster[]> {
    return this.projectRepository.clusters(name).find(filter);
  }

  @post('/projects/{name}/clusters', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(Cluster)}},
      },
    },
  })
  async create(
    @param.path.string('name') name: typeof Project.prototype.name,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cluster, {
            title: 'NewClusterInProject',
            exclude: ['id', 'projectName', 'namespace'],
          }),
        },
      },
    }) cluster: Omit<Cluster, 'id'>,
  ): Promise<Cluster> {
    const project = await this.projectRepository.findOne({
      where: {
        name,
      }
    });
    if (!project) throw new HttpErrors.NotFound('Project name not found');
    cluster.name = cluster.name.toLowerCase();
    cluster.projectName = name;
    cluster.host = '127.0.0.1';
    cluster.namespace = `${name}.${cluster.name}`;
    return this.projectRepository.clusters(name).create(cluster);
  }

  @patch('/projects/{name}/clusters', {
    responses: {
      '200': {
        description: 'Project.Cluster PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('name') name: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cluster, {
            partial: true,
            exclude: ['id', 'namespace', 'projectName'],
          }),
        },
      },
    })
    environement: Partial<Cluster>,
    @param.query.object('where', getWhereSchemaFor(Cluster)) where?: Where<Cluster>,
  ): Promise<Count> {
    const project = await this.projectRepository.findOne({
      where: {
        name,
      }
    });
    if (!project) throw new HttpErrors.NotFound('Project name not found');
    environement.namespace = `${environement.name}.${environement.projectName}`;
    return this.projectRepository.clusters(name).patch(environement, where);
  }

  @del('/projects/{name}/clusters', {
    responses: {
      '200': {
        description: 'Project.Cluster DELETE success count',
      },
    },
  })
  async delete(
    @param.path.string('name') name: string,
    @param.query.object('where', getWhereSchemaFor(Cluster)) where?: Where<Cluster>,
  ): Promise<void> {
    const project = await this.projectRepository.findOne({
      where: {
        name,
      }
    });
    if (!project) throw new HttpErrors.NotFound('Project name not found');
    const clusters = await this.projectRepository.clusters(name).find({where});
    await Promise.all(clusters.map((cluster) => {
      return this.projectService.deleteCluster(cluster);
    }));
    await this.nginxService.reloadService();
  }
}
