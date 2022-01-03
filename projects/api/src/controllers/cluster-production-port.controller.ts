import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
ClusterProduction,
PortMapping,
Port,
} from '../models';
import {ClusterProductionRepository} from '../repositories';

export class ClusterProductionPortController {
  constructor(
    @repository(ClusterProductionRepository) protected clusterProductionRepository: ClusterProductionRepository,
  ) { }

  @get('/cluster-productions/{id}/ports', {
    responses: {
      '200': {
        description: 'Array of ClusterProduction has many Port through PortMapping',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Port)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Port>,
  ): Promise<Port[]> {
    return this.clusterProductionRepository.ports(id).find(filter);
  }

  @post('/cluster-productions/{id}/ports', {
    responses: {
      '200': {
        description: 'create a Port model instance',
        content: {'application/json': {schema: getModelSchemaRef(Port)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof ClusterProduction.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Port, {
            title: 'NewPortInClusterProduction',
            exclude: ['id'],
          }),
        },
      },
    }) port: Omit<Port, 'id'>,
  ): Promise<Port> {
    return this.clusterProductionRepository.ports(id).create(port);
  }

  @patch('/cluster-productions/{id}/ports', {
    responses: {
      '200': {
        description: 'ClusterProduction.Port PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Port, {partial: true}),
        },
      },
    })
    port: Partial<Port>,
    @param.query.object('where', getWhereSchemaFor(Port)) where?: Where<Port>,
  ): Promise<Count> {
    return this.clusterProductionRepository.ports(id).patch(port, where);
  }

  @del('/cluster-productions/{id}/ports', {
    responses: {
      '200': {
        description: 'ClusterProduction.Port DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Port)) where?: Where<Port>,
  ): Promise<Count> {
    return this.clusterProductionRepository.ports(id).delete(where);
  }
}
