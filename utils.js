const areEqual = (...objects) => {
  let firstObject = JSON.stringify(objects[0]);
  return objects.every(obj => JSON.stringify(obj) === firstObject);
};