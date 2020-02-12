import express from 'express'
import Calendar from '../models/calendar';
const Router = express.Router();

//get calendar from database
Router.get('/calendar', (req, res) => {
  console.log('GET calendar from database');
  Calendar.find({}).then((calendar) => {
    res.send(calendar);
  });
});

//add calendar in database
Router.post('/calendar', (req, res, next) => {
  // console.log('POST calendar from database');
  // console.log(req.body.availabilityChecks);
  Calendar.create(req.body).then((calendar) => {
    res.send(calendar)
  }).catch(next);
});


//receive appointment from client
Router.post('/calendar-update', (req, res, next) => {
  // console.log(req.body)

  let totalLigacoesPorHora = 50;
  let _id = req.body.id;
  let _hour = req.body.appointment[0].hour;

  Calendar.findOne(
    { _id : _id },
    { appointment : { $elemMatch : { hour : _hour } } }
  ).exec((err, calendar) => {

    // console.log('calendar >>>>> ', calendar);

    let totalChecked = calendar.appointment[0].availabilityChecks.length;
    let appointmentId = calendar.appointment[0].id;
    // console.log('calendar totalChecked >>>>> ', totalChecked);
    // console.log('calendar appointmentId >>>>> ', appointmentId);

    let arr = [];
    var update = {};
    var options = {upsert: false};

    if(totalChecked < totalLigacoesPorHora) {
      if(totalChecked === totalLigacoesPorHora - 1) {
        update = {
          $set: {'appointment.$.available': false},
          $push: {'appointment.$.availabilityChecks': arr.push(1)}
        }
      } else {
        update = {
          $push: {'appointment.$.availabilityChecks': arr.push(1)}
        };
      }
      options = {upsert: false};
    }

    Calendar.updateOne({'appointment._id': appointmentId}, update, options).exec((err, calendar) => {
      // console.log('UPDATE err from database', err);
      // console.log('UPDATE calendar from database', calendar);
      res.send(calendar);
    });

  });

});


//update calendar in database
Router.put('/calendar/:id', (req, res) => {
  console.log('UPDATE calendar from database');
  Calendar.findByIdAndUpdate({_id: req.params.id}, req.body).then(() => {
    Calendar.findOne({_id: req.params.id}).then((calendar) => {
      res.send(calendar);
    })
  });
});


//delete calendar in database
Router.delete('/calendar/:id', (req, res) => {
  console.log('DELETE calendar from database');
  Calendar.findByIdAndRemove({_id: req.params.id}).then((calendar) => {
    res.send(calendar);
  });
});


module.exports = Router;
