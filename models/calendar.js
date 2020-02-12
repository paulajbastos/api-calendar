import mongoose from "mongoose";

const Schema = mongoose.Schema;


const AppointmentSchema = new Schema({
  hour: {
    type: String,
    required: [true, 'A hora é obrigatória'],
    default: undefined
  },
  availabilityChecks: {type:[Number]},
  available: {
    type: Boolean,
    default: true
  }
});

// create calendar schema & model
const calendarSchema = new Schema({
  date: {
    type: String,
    required: [true, 'A data é obrigatória']
  },
  appointment: { type: [AppointmentSchema], default: [] }
});

const Calendar = mongoose.model('calendar', calendarSchema);
module.exports = Calendar;
