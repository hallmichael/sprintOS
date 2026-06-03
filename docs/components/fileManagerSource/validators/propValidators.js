export const dateStringValidator = (props, propName, componentName) => {
  const value = props[propName];

  if (value && isNaN(Date.parse(value))) {
    return new Error(
      `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected a valid date string (ISO 8601) but received \`${value}\`.`
    );
  }
};

export const urlValidator = (props, propName, componentName) => {
  const url = props[propName];

  try {
    new URL(url);
    return;
  } catch (error) {
    return new Error(
      `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected a valid URL but received \`${url}\`.`
    );
  }
};

/** Same as urlValidator, but allows empty string / null / undefined (e.g. when file preview is off). */
export const optionalUrlValidator = (props, propName, componentName) => {
  const url = props[propName];
  if (url == null || url === "") {
    return;
  }
  return urlValidator(props, propName, componentName);
};
