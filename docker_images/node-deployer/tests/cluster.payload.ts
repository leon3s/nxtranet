export default {
  "id": "618f1a871f8ca611d6a15f57",
  "creationDate": "2021-11-13T01:53:11.645Z",
  "namespace": "express-test-deploy.test",
  "projectName": "express-test-deploy",
  "name": "test",
  "envVars": [
    {
      "id": "618f1aa71f8ca611d6a15f58",
      "namespace": "express-test-deploy.test.NODE_ENV",
      "clusterNamespace": "express-test-deploy.test",
      "key": "NODE_ENV",
      "value": "production"
    },
    {
      "id": "618f1aac1f8ca611d6a15f59",
      "namespace": "express-test-deploy.test.CLUSTER",
      "clusterNamespace": "express-test-deploy.test",
      "key": "CLUSTER",
      "value": "test"
    }
  ],
  "project": {
    "id": "618f0f5471aaeb10ca27160a",
    "creationDate": "2021-11-13T01:05:24.838Z",
    "name": "express-test-deploy",
    "github_project": "express-test-deploy",
    "github_username": "leon3s",
    "github_password": process.env.GITHUB_PASSWORD,
    "pipelines": [
      {
        "id": "618f0f7f71aaeb10ca27160b",
        "projectName": "express-test-deploy",
        "namespace": "express-test-deploy.install",
        "color": "#da0b65",
        "name": "install",
        "commands": [
          {
            "id": "618f13ad20dadb112062daef",
            "pipelineNamespace": "express-test-deploy.install",
            "name": "npm",
            "args": [
              "install"
            ]
          }
        ]
      },
      {
        "id": "618f16961f8ca611d6a15f55",
        "projectName": "express-test-deploy",
        "namespace": "express-test-deploy.test",
        "color": "#e10ed0",
        "name": "test",
        "commands": [
          {
            "id": "618f16a51f8ca611d6a15f56",
            "pipelineNamespace": "express-test-deploy.test",
            "name": "npm",
            "args": [
              "run",
              "test"
            ]
          }
        ]
      }
    ]
  }
}
