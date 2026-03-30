import LogoutFeedback from "../models/LogoutFeedback.js";

export const addLogoutFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    const userId = req.user.id;

    if (!feedback || !userId) {
      return res.json({
        data: null,
        success: false,
        message: "fields are missing",
      });
    }

    const feedBackData = await LogoutFeedback.create({
      userId,
      experience: feedback,
    });

    if (!feedBackData) {
      return res
        .status(400)
        .json({ data: null, success: false, message: "failed to add feeback" });
    }

    return res.status(200).json({
      data: feedBackData,
      success: true,
      message: "log out feedback added successfully",
    });

  } catch (err) {
    console.log(err.message);
    return res
      .status(400)
      .json({ data: null, success: false, message: err.message });
  }
};

export const getAllLogoutFeedback = async (req, res) => {
  try {
    const allLogoutFeedback = await LogoutFeedback.find();

    if (!allLogoutFeedback) {
      return res.status(400).json({
        data: null,
        success: false,
        message: "failed to find logOut feedback",
      });
    }

    return res.status(200).json({
      data: allLogoutFeedback,
      success: true,
      message: "all feedback found successfully",
    });

  } catch (err) {
    console.log(err.message);
    
    return res
      .status(200)
      .json({ data: null, success: false, message: err.message });
  }
};
