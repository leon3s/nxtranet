import execa from "execa";
import {getUserInfo} from '../lib/system';

export const start = async (username: string, commandLine: string) => {
	if (process.getuid() !== 0) {
		const err = new Error();
		err.message = `error you must be root to start a process as given user try:\nsudo nxtranet services start ${username} ${commandLine}`
		throw err;
	}
	const {uid, gid} = await getUserInfo(username);
	const [exe, ...args] = commandLine.split(' ');
	const res = execa(exe, args, {
		uid,
		gid,
		env: {},
		detached: true,
	});
	res.unref();
}
