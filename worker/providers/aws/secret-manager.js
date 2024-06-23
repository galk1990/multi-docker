// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

async function getSecretKey(secretName, region, verstionStage = "AWSCURRENT") {
  const client = new SecretsManagerClient({
    region,
  });

  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: verstionStage, // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
    const secret = response.SecretString;

    return secret;
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }
}

module.exports = {
  getSecretKey,
};
