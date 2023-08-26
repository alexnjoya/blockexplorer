export function formatValue(value) {
  const type = typeof value;
  return value && type === "object"
    ? value.toString()
    : Array.isArray()
      ? value.map(JSON.stringify())
      : value
}

export function formatObject(object, params = { transactions: true }) {
  const excludeFields = ["accessList", "creates"]
  for (const key in object) {
    if (key.charAt(0) === '_'
      || (key === "transactions" && !params.transactions)
      || (excludeFields.includes(key))
      ) {
      delete object[key];
    } else {
      object[key] = key === "transactions"
        ? object[key].map(formatObject)
        : formatValue(object[key]);
    }
  }
  return object;
}

export function fromStorage(storageObject) {
  return storageObject ? JSON.parse(storageObject) : {};
}

export function toRender(storageObject) {
  return Object.entries(fromStorage(storageObject));
}

export function truncate(text) {
  return typeof text === "string" && text.length > 25 ? text.slice(0, 5) + "..." + text.slice(-3) : text;
}

// How to make the range function in js?
export function range(start, end, step) {
  var range = [];
  var typeofStart = typeof start;
  var typeofEnd = typeof end;

  if (step === 0) {
    throw TypeError("Step cannot be zero.");
  }

  if (typeofStart === "undefined" || typeofEnd === "undefined") {
    throw TypeError("Must pass start and end arguments.");
  } else if (typeofStart !== typeofEnd) {
    throw TypeError("Start and end arguments must be of same type.");
  }

  typeof step === "undefined" && (step = 1);

  if (end < start) {
    step = -step;
  }

  if (typeofStart === "number") {

    while (step > 0 ? end >= start : end <= start) {
      range.push(start);
      start += step;
    }

  } else if (typeofStart === "string") {

    if (start.length !== 1 || end.length !== 1) {
      throw TypeError("Only strings with one character are supported.");
    }

    start = start.charCodeAt(0);
    end = end.charCodeAt(0);

    while (step > 0 ? end >= start : end <= start) {
      range.push(String.fromCharCode(start));
      start += step;
    }

  } else {
    throw TypeError("Only string and number types are supported");
  }

  return range;

}

export function camelCaseToTitle(text) {
  const title = text.replace(/([A-Z])/g, " $1").toLowerCase();
  return title.charAt(0).toUpperCase() + title.slice(1);
}


