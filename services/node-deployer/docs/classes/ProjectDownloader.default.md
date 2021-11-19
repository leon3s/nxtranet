[@nxthat/node-deployer](../README.md) / [Modules](../modules.md) / [ProjectDownloader](../modules/ProjectDownloader.md) / default

# Class: default

[ProjectDownloader](../modules/ProjectDownloader.md).default

## Table of contents

### Constructors

- [constructor](ProjectDownloader.default.md#constructor)

### Properties

- [tmpDirPath](ProjectDownloader.default.md#tmpdirpath)

### Methods

- [github](ProjectDownloader.default.md#github)

## Constructors

### constructor

• **new default**(`tmpDirPath`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tmpDirPath` | `string` |

#### Defined in

[ProjectDownloader.ts:18](https://github.com/leon3s/-nxtimg-node-deployer/blob/02cfb9c/srcs/ProjectDownloader.ts#L18)

## Properties

### tmpDirPath

• **tmpDirPath**: `string`

#### Defined in

[ProjectDownloader.ts:16](https://github.com/leon3s/-nxtimg-node-deployer/blob/02cfb9c/srcs/ProjectDownloader.ts#L16)

## Methods

### github

▸ **github**(`credentials`, `projectName`, `branch`): `Promise`<`Object`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `credentials` | `GithubCredential` |
| `projectName` | `string` |
| `branch` | `string` |

#### Returns

`Promise`<`Object`\>

#### Defined in

[ProjectDownloader.ts:22](https://github.com/leon3s/-nxtimg-node-deployer/blob/02cfb9c/srcs/ProjectDownloader.ts#L22)
