module.exports = function sortCardsByName(a, b) {
  const aName = a.name.toLowerCase();
  const bName = b.name.toLowerCase();
  if (aName < bName) {
    return -1;
  }
  if (aName > bName) {
    return 1;
  }
  if (a.premium && !b.premium) {
    return 1;
  }
  if (!a.premium && b.premium) {
    return -1;
  }
  return 0;
};
