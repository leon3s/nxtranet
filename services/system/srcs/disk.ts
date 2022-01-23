import {ModelDisk} from '@nxtranet/headers';
import execa from 'execa';

type DfIndexFormat = (item: string) => {key: string, value: string | number};

const dfIndexFormat: DfIndexFormat[] = [
  (item) => {
    return {
      key: 'filesystem',
      value: item,
    }
  },
  (item) => {
    return {
      key: 'size',
      value: Number(item),
    }
  },
  (item) => {
    return {
      key: 'used',
      value: Number(item),
    }
  },
  (item) => {
    return {
      key: 'available',
      value: Number(item),
    }
  },
  (item) => {
    return {
      key: 'use',
      value: Number(item.replace('%', '')),
    }
  },
  (item) => {
    return {
      key: 'mountedOn',
      value: item,
    }
  },
];

export const getDiskInfo = async (): Promise<ModelDisk[]> => {
  const res = await execa('df');
  return res.stdout.split('\n').reduce((acc, line, i) => {
    if (!i) return acc;
    acc.push(line.replace(/  +/g, ' ').split(' ').reduce((acc, item, i) => {
      const format = dfIndexFormat[i](item);
      acc[format.key] = format.value;
      return acc;
    }, {} as Partial<ModelDisk>));
    return acc;
  }, []);
}

getDiskInfo().then((res) => {
  console.log(res);
}).catch((err) => {
  console.error(err);
});
