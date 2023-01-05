const mongoose = require('mongoose');
const { Schema } = mongoose;

const CarTreatmentSchema = new mongoose.Schema(
  {
    Treatment_Number: {
      type: Schema.Types.ObjectId,
    },
    Treatment_Information: {
      type: String,
      required: true,
    },
    Date: {
      type: Date,
      required: true,
    },
    Worker_email: { type: String, required: true },
    Car_Number: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

CarTreatmentSchema.pre('save', (next) => {
  this.Treatment_Number = this._id;
  next();
});

module.exports = mongoose.model(
  'carTreatments',
  CarTreatmentSchema,
  'car_treatments'
);
