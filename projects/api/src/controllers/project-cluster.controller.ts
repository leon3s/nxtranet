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
import {
  Cluster, Project
} from '../models';
import {ProjectRepository} from '../repositories';

export class ProjectClusterController {
  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
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
    console.log('im called !!');
    const project = await this.projectRepository.findOne({
      where: {
        name,
      }
    });
    if (!project) throw new HttpErrors.NotFound('Project name not found');
    cluster.projectName = name;
    cluster.namespace = `${cluster.projectName}.${cluster.name}`;
    console.log(cluster);
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
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('name') name: string,
    @param.query.object('where', getWhereSchemaFor(Cluster)) where?: Where<Cluster>,
  ): Promise<Count> {
    const project = await this.projectRepository.findOne({
      where: {
        name,
      }
    });
    if (!project) throw new HttpErrors.NotFound('Project name not found');
    return this.projectRepository.clusters(name).delete(where);
  }
}
