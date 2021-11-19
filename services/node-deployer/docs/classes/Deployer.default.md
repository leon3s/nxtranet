[@nxthat/node-deployer](../README.md) / [Modules](../modules.md) / [Deployer](../modules/Deployer.md) / default

# Class: default

[Deployer](../modules/Deployer.md).default

## Table of contents

### Constructors

- [constructor](Deployer.default.md#constructor)

### Properties

- [projectDownloader](Deployer.default.md#projectdownloader)
- [socketEmiter](Deployer.default.md#socketemiter)
- [tmpDir](Deployer.default.md#tmpdir)

### Methods

- [deploy](Deployer.default.md#deploy)
- [launchPipeline](Deployer.default.md#launchpipeline)
- [spawnCmd](Deployer.default.md#spawncmd)
- [startDeploy](Deployer.default.md#startdeploy)

## Constructors

### constructor

• **new default**(`tmpDirPath`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tmpDirPath` | `string` |

#### Defined in

[Deployer.ts:37](https://github.com/leon3s/-nxtimg-node-deployer/blob/02cfb9c/srcs/Deployer.ts#L37)

## Properties

### projectDownloader

• **projectDownloader**: [`default`](ProjectDownloader.default.md)

#### Defined in

[Deployer.ts:35](https://github.com/leon3s/-nxtimg-node-deployer/blob/02cfb9c/srcs/Deployer.ts#L35)

___

### socketEmiter

• **socketEmiter**: `SocketEmiter`

#### Defined in

[Deployer.ts:34](https://github.com/leon3s/-nxtimg-node-deployer/blob/02cfb9c/srcs/Deployer.ts#L34)

___

### tmpDir

• **tmpDir**: `string`

#### Defined in

[Deployer.ts:33](https://github.com/leon3s/-nxtimg-node-deployer/blob/02cfb9c/srcs/Deployer.ts#L33)

## Methods

### deploy

▸ **deploy**(`socket`, `cluster`, `branch`): `Promise`<`Object`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `socket` | `Socket`<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`\> |
| `cluster` | `ModelCluster` |
| `branch` | `string` |

#### Returns

`Promise`<`Object`\>

#### Defined in

[Deployer.ts:128](https://github.com/leon3s/-nxtimg-node-deployer/blob/02cfb9c/srcs/Deployer.ts#L128)

___

### launchPipeline

▸ **launchPipeline**(`projectDir`, `pipelines`, `envVars`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `projectDir` | `string` |
| `pipelines` | `ModelPipeline`[] |
| `envVars` | `ModelEnvVar`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[Deployer.ts:77](https://github.com/leon3s/-nxtimg-node-deployer/blob/02cfb9c/srcs/Deployer.ts#L77)

___

### spawnCmd

▸ **spawnCmd**(`cmd`): `Promise`<`ExecaReturnValue`<`string`\>\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cmd` | `Cmd` | Command to execute |

#### Returns

`Promise`<`ExecaReturnValue`<`string`\>\>

child process

#### Defined in

[Deployer.ts:47](https://github.com/leon3s/-nxtimg-node-deployer/blob/02cfb9c/srcs/Deployer.ts#L47)

___

### startDeploy

▸ **startDeploy**(`cluster`, `branch`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cluster` | `ModelCluster` |
| `branch` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[Deployer.ts:107](https://github.com/leon3s/-nxtimg-node-deployer/blob/02cfb9c/srcs/Deployer.ts#L107)
