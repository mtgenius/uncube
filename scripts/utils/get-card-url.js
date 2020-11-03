module.exports = function getCardUrl({ name }) {
  return encodeURIComponent(
    name
      .toLowerCase()
      .replace(/['!.\(\)\?"]/g, '')
      .replace(/[^\w\d]+/g, '-'),
  );
};
