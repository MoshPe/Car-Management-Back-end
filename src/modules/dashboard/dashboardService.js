require('console-stamp')(console, {
  format: ':date(yyyy/mm/dd HH:MM:ss.l) :label',
});
const CarTreatments = require('../../models/car_treatment');
const { ObjectId } = require('mongodb');

const getAllTreatments = async (req, res) => {
  const allTreatments = await CarTreatments.find()
    .select({ _id: 0, __v: 0 })
    .exec();

  return res.status(200).json({
    success: true,
    message: 'All treatments data has been fetched',
    data: allTreatments,
  });
};

const editTreatment = async (req, res) => {
  const treatment = req.body;
  const treatmentNumber = req.query['treatmentNumber'];

  if (!treatment || !treatmentNumber) {
    return res.status(400).json({
      success: false,
      message: 'You must provide a treatment',
    });
  }

  let isExist = await CarTreatments.findOne({
    Treatment_Number: ObjectId(treatmentNumber),
  }).exec();

  if (!isExist) {
    return res.status(404).json({
      success: false,
      message: `Treatment doesn't exist`,
    });
  }

  await CarTreatments.updateOne(
    { _id: ObjectId(treatmentNumber) },
    { $set: treatment }
  )
    .exec()
    .then((result) => {
      if (result.modifiedCount === 1)
        return res.status(200).json({
          success: true,
          message: `Treatment with Treatment Number ${treatmentNumber} has been successfully updated`,
        });
      return res.status(500).json({
        success: false,
        message: `Treatment with Treatment Number ${treatmentNumber} couldn't be updated`,
      });
    })
    .catch((e) => {
      return res.status(500).json({
        success: false,
        message: `Couldn't update treatment with Treatment Number ${treatmentNumber}`,
        error: e,
      });
    });
};

const deleteTreatment = async (req, res) => {
  const treatmentNumber = req.query['treatmentNumber'];

  if (!treatmentNumber)
    return res
      .status(400)
      .json({ 'Treatment Number': 'Treatment Number required' });

  const treatment = await CarTreatments.findOne({
    Treatment_Number: ObjectId(treatmentNumber),
  }).exec();

  if (!treatment) {
    return res.status(404).json({
      success: false,
      message: `Treatment with number ${treatmentNumber} doesn't exist`,
    });
  }

  const result = await treatment.deleteOne();
  return res.status(200).json({
    success: true,
    message: `Successfully deleted treatment with Treatment Number ${treatmentNumber}`,
    result,
  });
};

const addTreatment = async (req, res) => {
  const treatment = req.body;

  if (!treatment) {
    return res.status(404).json({
      success: false,
      message: 'You must provide a treatment',
    });
  }

  const isExist = await CarTreatments.findOne({
    Treatment_Information: treatment.Treatment_Information,
    Date: treatment.Date,
    Worker_email: treatment.Worker_email,
    Car_Number: treatment.Car_Number,
  });

  if (isExist) {
    return res.status(409).json({
      success: false,
      message: 'Treatment already exist',
    });
  }
  treatment.Treatment_Number = new ObjectId();
  try {
    const result = await CarTreatments.create(treatment);
    return res.status(201).json({
      success: true,
      message: 'A new treatment has been registered',
      result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Couldn't insert new treatment`,
      treatment: treatment,
      error,
    });
  }
};

module.exports = {
  getAllTreatments,
  editTreatment,
  addTreatment,
  deleteTreatment,
};
