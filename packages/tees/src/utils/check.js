function isPlainobject(value) {
  // eslint-disable-next-line
  return value && Object.prototype === value.__proto__;
}

function isNil(value) {
  return typeof value === 'undefined' || value === null;
}

function checkValidity(dir) {
  if (isNil(dir) || (Array.isArray(dir) && dir.length === 0)) {
    return ['./'];
  }
  return dir;
}

module.exports = {
  isPlainobject,
  isNil,
  checkValidity,
};
