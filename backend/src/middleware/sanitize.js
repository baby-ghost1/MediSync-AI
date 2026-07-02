const MONGO_OP_REGEX = /^\$|\./;

function isObject(val) {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}

function sanitizeNosql(val) {
  if (isObject(val)) {
    return Object.keys(val).reduce((acc, key) => {
      if (MONGO_OP_REGEX.test(key)) return acc;
      acc[key] = sanitizeNosql(val[key]);
      return acc;
    }, {});
  }
  if (Array.isArray(val)) return val.map(sanitizeNosql);
  return val;
}

function sanitizeXss(val) {
  if (typeof val === "string") {
    return val.replace(/<[^>]*>/g, "").replace(/[<>"'`]/g, "");
  }
  if (isObject(val)) {
    Object.keys(val).forEach((k) => { val[k] = sanitizeXss(val[k]); });
    return val;
  }
  if (Array.isArray(val)) return val.map(sanitizeXss);
  return val;
}

function mutateObject(obj, fn) {
  if (!obj || typeof obj !== "object") return;
  Object.keys(obj).forEach((k) => {
    if (isObject(obj[k]) || Array.isArray(obj[k])) {
      mutateObject(obj[k], fn);
    } else if (typeof obj[k] === "string") {
      obj[k] = fn(obj[k]);
    }
  });
}

export default function sanitize(options = {}) {
  return (req, res, next) => {
    if (req.body) req.body = sanitizeNosql(sanitizeXss(req.body));
    if (req.params) {
      const p = req.params;
      Object.keys(p).forEach((k) => { p[k] = sanitizeXss(sanitizeNosql(p[k])); });
    }
    if (req.query) {
      const q = req.query;
      mutateObject(q, (v) => sanitizeXss(v));
    }
    next();
  };
}
