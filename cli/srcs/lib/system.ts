import {execSync} from 'child_process';
import execa from 'execa';

type WlsOptions = {
  username?: string;
  windowTitle?: string;
} & execa.Options;

// Start-Process powershell -ArgumentList "-noexit", "-noprofile", "-command wsl ls"
/** Windows only */
export const execaWsl = async (cmd: string, args: string[], options?: WlsOptions) => {
  return execSync(`wt.exe -w 0 nt ${options?.windowTitle ? `--title ${options?.windowTitle} ` : ''}powershell.exe -NoExit -Command "& {"wsl -u ${options?.username} ${cmd} ${args.join(' ')}}"`, {
    cwd: options?.cwd,
  });
}

export const ensureRoot = () => {
  if (process.getuid() !== 0) {
    console.log("Install commande have to be run as root");
    process.exit(0);
  }
}

/** UNIX only */
export const getUserInfo = async (username: string): Promise<{uid: number, gid: number}> => {
  const {stdout} = await execa('id', [username]);
  const uid = +(stdout.replace(/(uid=)([0-9]{4})(.*)/g, '$2'));
  const gid = +(stdout.replace(/(.*gid=)([0-9]{4})(.*)/g, '$2'));
  return {
    uid,
    gid,
  };
}
