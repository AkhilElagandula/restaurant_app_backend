export const sendResponse = (res, status, responseMsg, additionalProps = {}) => {
  const apiResponse = {
    status: status,
    responseMsg: responseMsg,
    ...additionalProps,
  };
  res.status(status).send(apiResponse);
};

module.exports = { sendResponse };