[@nxtranet/headers](README.md) / Exports

# @nxtranet/headers

## Table of contents

### Type aliases

- [ModelCluster](modules.md#apicluster)
- [ModelContainer](modules.md#apicontainer)
- [ModelContainerOutput](modules.md#apicontaineroutput)
- [ModelEnvVar](modules.md#apienvvar)
- [ModelPipeline](modules.md#apipipeline)
- [ModelPipelineCmd](modules.md#apipipelinecmd)
- [ModelProject](modules.md#apiproject)

## Type aliases

### ModelCluster

Ƭ **ModelCluster**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `containers` | [`ModelContainer`](modules.md#apicontainer)[] |
| `envVars` | [`ModelEnvVar`](modules.md#apienvvar)[] |
| `environementNamespace` | `string` |
| `id` | `string` |
| `name` | `string` |
| `namespace` | `string` |
| `project` | [`ModelProject`](modules.md#apiproject) |
| `projectName` | `string` |

#### Defined in

cluster.ts:5

___

### ModelContainer

Ƭ **ModelContainer**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `appPort` | `number` |
| `cluster` | [`ModelCluster`](modules.md#apicluster) |
| `clusterNamespace` | `string` |
| `deployerPort` | `number` |
| `dockerID` | `string` |
| `id` | `string` |
| `name` | `string` |
| `namespace` | `string` |
| `outputs` | [`ModelContainerOutput`](modules.md#apicontaineroutput)[] |

#### Defined in

container.ts:4

___

### ModelContainerOutput

Ƭ **ModelContainerOutput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `args` | `string`[] |
| `exe` | `string` |
| `id` | `string` |
| `isFirstCommand` | `boolean` |
| `stderr?` | `string` |
| `stdout?` | `string` |

#### Defined in

containerOutput.ts:1

___

### ModelEnvVar

Ƭ **ModelEnvVar**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `clusterNamespace` | `string` |
| `id` | `string` |
| `key` | `string` |
| `namespace` | `string` |
| `value` | `string` |

#### Defined in

envVar.ts:1

___

### ModelPipeline

Ƭ **ModelPipeline**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `color` | `string` |
| `commands` | [`ModelPipelineCmd`](modules.md#apipipelinecmd)[] |
| `id` | `string` |
| `name` | `string` |
| `namespace` | `string` |
| `projectName` | `string` |

#### Defined in

pipeline.ts:3

___

### ModelPipelineCmd

Ƭ **ModelPipelineCmd**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `args` | `string`[] |
| `id` | `string` |
| `name` | `string` |
| `namespace` | `string` |
| `pipelineNamespace` | `string` |

#### Defined in

pipelineCmd.ts:1

___

### ModelProject

Ƭ **ModelProject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `github_password` | `string` |
| `github_project` | `string` |
| `github_username` | `string` |
| `id` | `string` |
| `name` | `string` |
| `pipelines` | [`ModelPipeline`](modules.md#apipipeline)[] |

#### Defined in

project.ts:3
