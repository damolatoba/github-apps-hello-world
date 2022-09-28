#!/usr/bin/env node
const logger = require('pino')({ level: process.env.LOG_LEVEL || 'info' });

const { Octokit } = require('@octokit/core');
const { createAppAuth } = require('@octokit/auth-app');

const appCredentials = require('./lib/app-credentials');

async function main() {
  try {
    // Instantiate new Octokit client
    const octokit = new Octokit({
      baseUrl: `https://${process.env.GHE_HOST}/api/v3`,
      authStrategy: createAppAuth,
      auth: {
        ...appCredentials
      }
    });

    // Create issue in demo-days/Spoon-Knife
    // https://docs.github.com/en/rest/reference/issues#create-an-issue
    const issue = await octokit.request('POST /repos/:owner/:repo/issues', {
      owner: 'damolatoba',
      repo: 'github-apps-hello-world',
      title: 'Hello world',
      body:
        ':wave: :earth_americas:\n\n![fellowshipoftheclaps](https://user-images.githubusercontent.com/27806/91333726-91c46f00-e793-11ea-9724-dc2e18ca28d0.gif)'
    });
    logger.trace(issue);

    process.stdout.write(`${issue.data.html_url} 🚀\n`);
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
}

main();
