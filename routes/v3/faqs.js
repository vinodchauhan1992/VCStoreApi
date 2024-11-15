const express = require("express");
const router = express.Router();
const faqs = require("../../controller/v3/faqs");

router.post("/allFaqs", faqs.getAllFaqs);
router.post("/faqByFaqID", faqs.getFaqByFaqID);
router.post("/faqsByProductID", faqs.getFaqsByProductID);
router.post("/addNewQuestion", faqs.addNewQuestion);
router.post("/addAnswer", faqs.addAnswer);
router.post("/deleteQuestion", faqs.deleteQuestion);
router.post("/deleteAnswer", faqs.deleteAnswer);
router.post("/updateLikeToFaqAnswer", faqs.updateLikeToFaqAnswer);
router.post("/updateDislikeToFaqAnswer", faqs.updateDislikeToFaqAnswer);

module.exports = router;
