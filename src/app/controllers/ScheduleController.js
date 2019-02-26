const { Appointment, User } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')

class ScheduleController {
  async index (req, res) {
    const appointments = await Appointment.findAll({
      include: [{ model: User, as: 'user' }],
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            moment()
              .startOf('day')
              .format(),
            moment()
              .endOf('day')
              .format()
          ]
        }
      }
    })

    const formatedAppointments = appointments.map(a => ({
      ...a,
      date: moment(a.date).format('HH:mm')
    }))

    return res.render('schedule/index', { appointments: formatedAppointments })
  }
}

module.exports = new ScheduleController()
