module.exports.getTimestamp = () => {
  const timestamp = new Date().getTime();
  return timestamp;
};

module.exports.getTrimmedText = (text) => {
  const noSpecialChars = text?.replace(/[^a-zA-Z0-9 ]/g, '');
  return noSpecialChars?.replace(/\s/g, "");
};

module.exports.getLowercaseText = (text) => {
  return text?.toLowerCase();
};

module.exports.getUniqueID = (text) => {
  const trimmedText = this.getTrimmedText(text);
  const uniqueID = `${this.getLowercaseText(trimmedText)}${this.getTimestamp()}`
  return `${uniqueID}`;
};
