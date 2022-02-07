const fs = require('fs');
const path = require('path');
const axios = require('axios');

type GithubCredential = {
  username:     string;
  password:     string;
}

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
});

export default class ProjectDownloader {
  tmpDirPath: string;

  constructor(tmpDirPath: string) {
    this.tmpDirPath = tmpDirPath;
  }

  github = async (credentials: GithubCredential, projectName: string, branch: string) => {
    const response = await githubApi.get(
      `/repos/${credentials.username}/${projectName}/tarball/${branch}`, {
        responseType: 'stream',
        auth: credentials,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      },
    );
    /* is empty sometime for some reason ? */
    // const fileSize = parseInt(response.headers['content-length']);
    const fileName = response.headers['content-disposition'].replace(/\&*.*filename=/g, '');
    const filePath = path.join(this.tmpDirPath, fileName);
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    await new Promise<void>((resolve, reject) => {
      writer.once('finish', resolve);
      writer.once('error', reject);
    });
    return {
      fileName,
      filePath,
    };
  }
}
