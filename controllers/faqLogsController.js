import Faq from "../models/Faq.js";
import User from "../models/User.js";

export const createFaqLog = async (req, res) => {
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

    // update faq logs
    const updated = await User.updateOne(
      { _id: userId, "faq.faqId": faqId },
      {
        $set: {
          "faq.$.duration": duration,
          "faq.$.videoLength": videoLength,
          "faq.$.isWatched": duration >= videoLength,
        },
        $inc: {
          "faq.$.count": 1,
        },
      },
    );

    //create faq logs
    if (updated.modifiedCount === 0) {
      await User.findByIdAndUpdate(userId, {
        $push: {
          faq: {
            faqId,
            duration,
            videoLength,
            count: 1,
            isWatched: duration >= videoLength,
          },
        },
      });
    }

    // to increase total_seen in faq section
    await Faq.updateOne({ _id: faqId }, { $inc: { total_seen: 1 } });

    return res
      .status(200)
      .json({ success: true, message: "FAQ logs maintained successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getUserFaqs = async (req, res) => {
  try {
    const userId = req.params;

    // validate user id
    if (!userId) {
      return res
        .status(400)
        .json({ data: null, message: "userid not found", success: false });
    }

    // get user faq data
    const user = await User.findById(userId).select("faq").populate({
      path: "faq.faqId",
      select: "title video_url category videoLength duration ",
    });

    return res.status(200).json({
      success: true,
      count: user.faq.length,
      data: user.faq,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
