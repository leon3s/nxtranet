// TODO NOT WORKING //
// SCRIPT TO AUTOMATICALY INSTALL DNS AND EVERYTHING ON WINDOWS //
import execa from 'execa';

const getVEthernetInterfaceIds = async (): Promise<number[]> => {
  const ids: number[] = [];
  const res = await execa('powershell.exe', ['Get-NetAdapter', '-Name', '"vEthernet*"']);
  const lines = res.stdout.trim().split('\n');
  // Ignore the first line //
  lines.splice(0, 2);
  for (const line of lines) {
    const id = line.replace(/(.*?)([0-9]{2})(.*\s*.)/gm, '$2');
    ids.push(+id);
  }
  return ids;
}

export const getWslIp = async (): Promise<string> => {
  const res = await execa('powershell.exe', ['wsl', 'hostname', '-I']);
  return res.stdout.trim();
}

export const dev = async () => {
  const wslIP = await getWslIp();
  const res = await getVEthernetInterfaceIds();
  console.log({
    wslIP,
    res,
  });
}
