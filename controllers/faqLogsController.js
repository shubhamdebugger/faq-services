import Faq from "../models/Faq.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const createFaqLog = async (req, res) => {
  try {
    const { faqId, duration } = req.body;
    const userId = req.user.id;

    // validation
    if (!faqId || !userId || duration === undefined) {
      return res.status(400).json({
        data: null,
        success: false,
        message: "fields missing or user unauthorised",
      });
    }

    // validate faq id
    if (!mongoose.Types.ObjectId.isValid(faqId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ id",
      });
    }

    // check faq exists
    const faq = await Faq.findById(faqId);
    if (!faq) {
      return res.status(400).json({
        data: null,
        success: false,
        message: "faq not found",
      });
    }

    // convert to whole seconds
    const durationInSec = Math.floor(duration);
    const videoLengthInSec = Math.floor(faq.videoLength);

    // buffer logic (5 sec)
    const buffer = 5;
    const isFullyWatched = durationInSec >= videoLengthInSec - buffer;

    // get existing faq logs
    const user = await User.findOne(
      { _id: userId, "faq.faqId": faqId },
      { "faq.$": 1 },
    );

    const existingFaqLogs = user?.faq?.[0];

    let updateQuery = {
      $set: {
        "faq.$.duration": durationInSec,
        "faq.$.videoLength": videoLengthInSec,
      },
    };

    // CASE 1: Already exists

    if (existingFaqLogs) {
      const alreadyWatched = existingFaqLogs.isWatched;

      // once true  always true
      updateQuery.$set["faq.$.isWatched"] = alreadyWatched || isFullyWatched;

      // increment count ONLY when fully watched
      if (isFullyWatched) {
        updateQuery.$inc = {
          "faq.$.count": 1,
        };
      }

      await User.updateOne({ _id: userId, "faq.faqId": faqId }, updateQuery);
    }

    //  First time
    else {
      await User.findByIdAndUpdate(userId, {
        $push: {
          faq: {
            faqId,
            duration: durationInSec,
            videoLength: videoLengthInSec,
            count: isFullyWatched ? 1 : 0,
            isWatched: isFullyWatched,
          },
        },
      });

      // increase total seen only first time
      await Faq.updateOne({ _id: faqId }, { $inc: { total_seen: 1 } });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ logs maintained successfully",
    });
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
    const { userId } = req.params;

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
      message: err.message,
    });
  }
};
