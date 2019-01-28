const createDriver = require('tees-environment/createDriver');
const {
  isNil,
  isPlainobject
} = require('../utils/check');

function mergeTags(tags, supersetTags) {
  if (Array.isArray(tags) && tags.length === 0) {
    return supersetTags;
  }
  const mergedTags = [];
  tags.forEach(([project, tag]) => {
    const matchTag = supersetTags.find(([_project]) => _project === project);
    if (matchTag) {
      const [_project, _tag] = matchTag;
      mergedTags.push([_project, {
        ..._tag,
        ...tag
      }]);
    }
  });
  return mergedTags;
}

function flattenTags(tags) {
  const _tags = Object.entries(tags)
    .map(
      ([name, values]) => values
        .map(value => `${name}-${typeof value === 'object' ? Object.keys(value)[0] : value}`)
    );
  const groups = [];
  const group = [];
  const getGroups = (_tags, depth = 0) => {
    for (let i = 0; i < _tags[depth].length; i += 1) {
      group[depth] = _tags[depth][i];
      if (depth !== _tags.length - 1) {
        getGroups(_tags, depth + 1);
      } else {
        groups.push([...group]);
      }
    }
  };
  getGroups(_tags);
  return groups;
}

function restoreTags(group, project) {
  return group.reduce((_group, name) => {
    const [key, value] = name.split('-');
    return {
      ..._group,
      [key]: value,
    };
  }, {
    project
  });
}

function getTags({
  rawTags,
  defaultTestConfig,
  caseTags
}) {
  const isExistTags = rawTags.length === 0;
  const tags = isExistTags ? defaultTestConfig.map(([_project, _tags]) => [
    _project, { ..._tags, ...caseTags, }
  ]) : rawTags.map(([_project, _tags]) => [
    _project, { ...caseTags, ..._tags, }
  ]);
  return tags;
}

function checkSkippedCase({ project, ...execTag }, [, caseTag]) {
  if (!caseTag) return true;
  for (const [name, value] of Object.entries(execTag)) {
    if (!Array.isArray(caseTag[name])) return true;
    const currentCaseTag = caseTag[name].map(item => (
      Array.isArray(item) ? item[0] : item
    ));
    if (currentCaseTag.indexOf(value) === -1) return true;
  }
  return false;
}

function getCaseTags({ caseParams, params }) {
  return Object.entries(caseParams).reduce((_params, [name, _tag]) => {
    const isGeneralParam = Object.keys(params).indexOf(name) > -1;
    if (!isGeneralParam) return _params;
    return {
      ..._params,
      [name]: _tag
    };
  }, {});
}

function extendTagOption({
  option,
  caseTag,
  tag
}) {
  Object.entries(tag).forEach(([key, value]) => {
    if (!caseTag[1][key]) return;
    const tagOption = caseTag[1][key].find(item => Array.isArray(item) && item[0] === value);
    if (tagOption) {
      option = { ...tagOption[1] || {}, ...option };
    }
  });
  return option;
}

function getPattern(value) {
  let pattern;
  if (Array.isArray(value)) {
    pattern = value;
  } else if (isPlainobject(value)) {
    pattern = Object.keys(value);
  } else if (!isNil(value)) {
    pattern = [value];
  } else {
    pattern = null;
  }
  return pattern;
}

function flattenTestConfig(config) {
  const { tags = [], ..._tags } = config.defaults || {};
  const generalParams = Object.entries(config.params).filter(([key]) => key !== 'projects');
  return Object.entries(config.params.projects).reduce(
    (projects, [
      project,
      {
        params = []
      } = {}
    ]) => [
      ...projects,
      [
        project,
        {
          ...Object.entries(params).reduce((patterns, [name, pattern]) => {
            const values = getPattern(pattern);
            if (!values) return patterns;
            return ({
              ...patterns,
              [name]: values,
            });
          }, generalParams.reduce((generalParams, [name, values]) => ({
            ...generalParams,
            [name]: values
          }), {})),
          ..._tags,
          ...tags.reduce((tag, [_project, _tag]) => {
            if (_project !== project) return tag;
            return {
              ...tag,
              ..._tag
            };
          }, {})
        }
      ]
    ], []);
}

function getDriverInstance({
  drivers,
  driver,
  isSandbox,
}) {
  return isSandbox || driver === 'enzyme' ? createDriver(driver, {
    selectorLabel: global.execGlobal.selectorLabel
  }) : drivers[driver];
}

const types = [
  'error',
  'warn',
  'info',
  'log',
  'trace',
  'debug',
  'screenshot'
];
const originalInfoLog = global.console.info;

function generateLogger(caseTitle, hasReporter) {
  return types.reduce(
    (logger, type) => {
      logger[type] = (info) => {
        if (!hasReporter) return;
        const formatInfo = {
          type,
          info,
          caseTitle,
          time: Date.now(),
          reporterLogger: true,
        };
        originalInfoLog(JSON.stringify(formatInfo));
      }
      return logger;
    },
    {}
  )
};

module.exports = {
  mergeTags,
  flattenTags,
  restoreTags,
  getTags,
  checkSkippedCase,
  getCaseTags,
  extendTagOption,
  flattenTestConfig,
  getDriverInstance,
  generateLogger,
};
