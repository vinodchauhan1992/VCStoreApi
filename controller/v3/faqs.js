const FaqsUtility = require("../../utilities/v3/faqsUtility");

module.exports.getAllFaqs = async (req, res) => {
  const foundFaqObj = await FaqsUtility.getAllFaqsUtil({ req });
  res.json(foundFaqObj);
};

module.exports.getFaqByFaqID = async (req, res) => {
  const foundFaqObj = await FaqsUtility.getFaqByFaqIDUtil({ req });
  res.json(foundFaqObj);
};

module.exports.getFaqsByProductID = async (req, res) => {
  const foundFaqObj = await FaqsUtility.getFaqsByProductIDUtil({ req });
  res.json(foundFaqObj);
};

module.exports.addNewQuestion = async (req, res) => {
  const foundFaqObj = await FaqsUtility.addNewQuestionUtil({ req });
  res.json(foundFaqObj);
};

module.exports.addAnswer = async (req, res) => {
  const foundFaqObj = await FaqsUtility.addAnswerUtil({ req });
  res.json(foundFaqObj);
};

module.exports.deleteQuestion = async (req, res) => {
  const foundFaqObj = await FaqsUtility.deleteQuestionUtil({ req });
  res.json(foundFaqObj);
};

module.exports.deleteAnswer = async (req, res) => {
  const foundFaqObj = await FaqsUtility.deleteAnswerUtil({ req });
  res.json(foundFaqObj);
};

module.exports.updateLikeToFaqAnswer = async (req, res) => {
  const foundFaqObj = await FaqsUtility.updateLikeToFaqAnswerUtil({ req });
  res.json(foundFaqObj);
};

module.exports.updateDislikeToFaqAnswer = async (req, res) => {
  const foundFaqObj = await FaqsUtility.updateDislikeToFaqAnswerUtil({ req });
  res.json(foundFaqObj);
};
