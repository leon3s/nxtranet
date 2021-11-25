import {execSync} from 'child_process';
import execa from 'execa';

type WlsOptions = {
  username?: string;
  windowTitle?: string;
} & execa.Options;

// Start-Process powershell -ArgumentList "-noexit", "-noprofile", "-command wsl ls"

export const execaWsl = async (cmd: string, args: string[], options?: WlsOptions) => {
  return execSync(`wt.exe ${options?.windowTitle ? `--title ${options?.windowTitle} ` : ''}powershell.exe -NoExit -Command "& {"wsl -u ${options?.username} ${cmd} ${args.join(' ')}}"`, {
    cwd: options?.cwd,
  });
}

export const getUserInfo = async (username: string) => {
  const {stdout} = await execa('id', [username]);
  const uid = +(stdout.replace(/(uid=)([0-9]{4})(.*)/g, '$2'));
  const gid = +(stdout.replace(/(.*gid=)([0-9]{4})(.*)/g, '$2'));
  return {
    uid,
    gid,
  };
}
