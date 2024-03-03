const Agent = require("../model/agent");
const User = require("../model/user");
const UserAccount = require("../model/userAccount");
const Lob = require("../model/lob");
const Carrier = require("../model/carrier");
const Policy = require("../model/policy");
const Message = require("../model/message");
const fs = require("fs");
const { Worker } = require("worker_threads");

async function updateIds(
  result,
  insertedUsers,
  insertedCarriers,
  insertedPolicyCategory
) {
  const updatedPolicy = [];
  for (let i = 0; i < result.users.length; i++) {
    const policyObj = {
      policyNumber: result.policy[i].policyNumber,
      policyStartDate: result.policy[i].policyStartDate,
      policyEndDate: result.policy[i].policyEndDate,
      policyCategory: result.policy[i].policyCategory,
      collectionId: insertedPolicyCategory[i]._id,
      companyCollectionId: insertedCarriers[i]._id,
      userId: insertedUsers[i]._id,
    };
    updatedPolicy.push(policyObj);
  }
  return updatedPolicy;
}

// 1.Create API to upload the attached XLSX/CSV data into MongoDB.
const uploadCsv = async (req, res) => {
  try {
    const worker = new Worker("./controller/worker.js", {
      workerData: { path: req.file.path },
    });

    worker.on("message", async (result) => {
      const insertedUsers = await User.insertMany(result.users);
      const insertedCarriers = await Carrier.insertMany(result.carriers);
      const insertedPolicyCategory = await Lob.insertMany(
        result.policyCategory
      );

      const updatedPolicy = await updateIds(
        result,
        insertedUsers,
        insertedCarriers,
        insertedPolicyCategory
      );

      await Agent.insertMany(result.agents);
      await UserAccount.insertMany(result.userAccounts);
      await Policy.insertMany(updatedPolicy);

      fs.unlinkSync(req.file.path);

      res.status(200).send({
        message: "Successfully Uploaded!",
      });
    });

    worker.on("error", (error) => {
      console.error("Worker Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "failure",
      error,
    });
  }
};

// 2. Search API to find policy info with the help of the username.
const serachPolicyByUsername = async (req, res) => {
  try {
    // Find the user by username
    const user = await User.findOne({ firstname: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find policies associated with the user
    const policies = await Policy.find({ user: user._id });

    res.status(200).json({
      user: user,
      policies: policies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 3.  API to provide aggregated policy by each user.
const aggregatedPoliciesByUser = async (req, res) => {
  try {
    const aggregatedPolicies = await Policy.aggregate([
      {
        $group: {
          _id: "$userId",
          totalPolicies: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          userName: "$userDetails.firstname",
          totalPolicies: 1,
        },
      },
    ]);

    res.status(200).json(aggregatedPolicies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a post-service that takes the message, day, and time in body parameters and it inserts that message into DB at that particular day and time.
const scheduleMessage = async (req, res) => {
  try {
    const { message, day, time } = req.body;

    // Save the message to the database
    const scheduledMessage = await Message.create({
      message,
      day,
      time,
    });

    res
      .status(201)
      .json({ message: "Message scheduled successfully", scheduledMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  uploadCsv,
  serachPolicyByUsername,
  aggregatedPoliciesByUser,
  scheduleMessage,
};
