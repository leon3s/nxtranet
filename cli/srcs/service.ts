import execa from "execa";

const _exec = (cmd: string, args: string[], options?: execa.Options) => {
	const child = execa(cmd, args, options);
	return child;
}

const getUserInfo = async (username: string) => {
	const {stdout} = await _exec('id', [username]);
	const uid = +(stdout.replace(/(uid=)([0-9]{4})(.*)/g, '$2'));
	const gid = +(stdout.replace(/(.*gid=)([0-9]{4})(.*)/g, '$2'));
	return {
		uid,
		gid,
	};
}

export const start = async (username: string, commandLine: string) => {
	if (process.getuid() !== 0) {
		const err = new Error();
		err.message = `error you must be root to start a process as given user try:\nsudo nxtranet services start ${username} ${commandLine}`
		throw err;
	}
	const {uid, gid} = await getUserInfo(username);
	const [exe, ...args] = commandLine.split(' ');
	const res = _exec(exe, args, {
		uid,
		gid,
		env: {},
		detached: true,
	});
	res.unref();
	console.log(res);
}
