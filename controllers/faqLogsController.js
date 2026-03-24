import Faq from "../models/Faq";

export const createFaqLogs = async (req, res) => {
  try {
    const { faqId, duration } = req.body;
    const userId = req.user._id;

    // validaion
    if (!faqId || !userId || !duration) {
      return res.status(400).json({
        data: null,
        success: false,
        message: "fields missing or user unauthorised",
      });
    }

    // validation of faq
    if (!mongoose.Types.ObjectId.isValid(faqId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ id",
      });
    }

    // to check faq is valid or not
    const faq = await Faq.findById(faqId);
    if (!faq) {
      return res
        .status(400)
        .json({ data: null, success: false, message: "faq not found" });
    }

    const videoLength = faq.videoLength;



    // to increase total_seen in faq section
    faq.total_seen = faq.total_seen + 1;
    // to save updates
    faq.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
