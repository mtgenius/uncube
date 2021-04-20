module.exports = function mapStringToUrl(str) {
  return encodeURIComponent(
    str
      .toLowerCase()
      .replace(/['!.\(\)\?"]/g, '')
      .replace(/[^\w\d]+/g, '-'),
  );
};
