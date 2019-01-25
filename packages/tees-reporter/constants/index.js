const TOKEN = 'token';
const END_POINT = 'endpoint';
const PROJECT = 'project';
const LAUNCH_NAME = 'launchname';
const TAGS = 'tags';

module.exports = {
  ENVIRONMENT_CONFIG_MAP: {
    REPORTER_TOKEN: TOKEN,
    REPORTER_END_POINT: END_POINT,
    REPORTER_PROJECT_NAME: PROJECT,
    REPORTER_LAUNCH_NAME: LAUNCH_NAME,
    REPORTER_TAGS: TAGS
  },
  DEFAULT_OPTIONS: {
    [TOKEN]: '',
    [END_POINT]: '',
    [PROJECT]: '',
    [LAUNCH_NAME]: '',
    [TAGS]: '',
  },
};
