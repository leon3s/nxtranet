import {execSync} from 'child_process';
import execa from 'execa';

type WlsOptions = {
  username?: string;
  windowTitle?: string;
} & execa.Options;

/** Windows only */
export async function execaWsl(cmd: string, args: string[], options?: WlsOptions) {
  return execSync(`wt.exe -w 0 nt ${options?.windowTitle ? `--title ${options?.windowTitle} ` : ''}powershell.exe -NoExit -Command "& {"wsl -u ${options?.username} ${cmd} ${args.join(' ')}}"`, {
    cwd: options?.cwd,
    env: options?.env,
  });
}

/** Verify if the script is run as root */
export async function ensureRoot() {
  if (process.getuid() !== 0) {
    console.log("Install commande have to be run as root");
    process.exit(0);
  }
}

/** UNIX only */
export async function getUserInfo(username: string): Promise<{uid: number, gid: number}> {
  const {stdout} = await execa('id', [username]);
  const uid = +(stdout.replace(/(uid=)([0-9]{4})(.*)/g, '$2'));
  const gid = +(stdout.replace(/(.*gid=)([0-9]{4})(.*)/g, '$2'));
  return {
    uid,
    gid,
  };
}

/** Unix only */
export async function ensureUser(user: string): Promise<void> {
  const res = await execa('whoami', []);
  if (res.stdout !== user) {
    throw new Error('User not matching.');
  }
}
