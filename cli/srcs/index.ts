#!/usr/local/bin/node
import execa from 'execa';
import fs from 'fs';
import path from 'path';

const help = fs.readFileSync(path.join(__dirname, '../README.md'));

const scriptDir = path.join(__dirname, './scripts');

const printHelp = () => {
  process.stdout.write(help);
}

const execScript = async (scriptPath: string, args: string[]) => {
  await execa('node', [scriptPath, ...args], {
    cwd: __dirname,
    stdio: ['ignore', process.stdout, process.stdin],
  });
}

(async function main() {
  const [{ }, { }, scriptName, ...args] = process.argv;
  if (!scriptName || scriptName === 'help') {
    printHelp();
    process.exit(0);
  }
  const scriptPath = path.join(scriptDir, `${scriptName}.js`);
  if (!fs.existsSync(scriptPath)) {
    console.error(`Command ${scriptName} not found`);
    console.error(`Run \`nxtranet help\` to print help.`);
    process.exit(1);
  }
  await execScript(scriptPath, args);
  process.exit(0);
})().catch((err) => {
  console.error(err.message);
});
