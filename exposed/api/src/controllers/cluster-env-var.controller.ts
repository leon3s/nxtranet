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
  Cluster,
  EnvVar
} from '../models';
import {ClusterRepository} from '../repositories';

export class ClusterEnvVarController {
  constructor(
    @repository(ClusterRepository) protected clusterRepository: ClusterRepository,
  ) { }

  @get('/clusters/{namespace}/env-vars', {
    responses: {
      '200': {
        description: 'Array of Cluster has many EnvVar',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(EnvVar)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('namespace') namespace: string,
    @param.query.object('filter') filter?: Filter<EnvVar>,
  ): Promise<EnvVar[]> {
    return this.clusterRepository.envVars(namespace).find(filter);
  }

  @post('/clusters/{namespace}/env-vars', {
    responses: {
      '200': {
        description: 'Cluster model instance',
        content: {'application/json': {schema: getModelSchemaRef(EnvVar)}},
      },
    },
  })
  async create(
    @param.path.string('namespace') namespace: typeof Cluster.prototype.namespace,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EnvVar, {
            title: 'NewEnvVarInCluster',
            exclude: ['namespace', 'clusterNamespace', 'id'],
          }),
        },
      },
    }) envVar: Partial<EnvVar>,
  ): Promise<EnvVar> {
    const cluster = await this.clusterRepository.findOne({
      where: {
        namespace,
      }
    });
    if (!cluster) throw new HttpErrors.NotFound('Cluster not found, namespace not valid.');
    envVar.clusterNamespace = namespace;
    envVar.namespace = `${namespace}.${envVar.key}`;
    try {
      const envVarDB = await this.clusterRepository.envVars(namespace).create(envVar);
      return envVarDB;
    } catch (error) {
      // MongoError 11000 duplicate key
      if (error.code === 11000) {
        if (error.errmsg.includes('index: uniqueNamespace')) {
          const err = new HttpErrors.Conflict('Key is already taken');
          err.name = 'key';
          throw err;
        }
      }
      throw error;
    }
  }

  @patch('/clusters/{namespace}/env-vars', {
    responses: {
      '200': {
        description: 'Cluster.EnvVar PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('namespace') namespace: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EnvVar, {partial: true}),
        },
      },
    })
    envVar: Partial<EnvVar>,
    @param.query.object('where', getWhereSchemaFor(EnvVar)) where?: Where<EnvVar>,
  ): Promise<Count> {
    return this.clusterRepository.envVars(namespace).patch(envVar, where);
  }

  @del('/clusters/{namespace}/env-vars', {
    responses: {
      '200': {
        description: 'Cluster.EnvVar DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('namespace') namespace: string,
    @param.query.object('where', getWhereSchemaFor(EnvVar)) where?: Where<EnvVar>,
  ): Promise<Count> {
    return this.clusterRepository.envVars(namespace).delete(where);
  }
}
