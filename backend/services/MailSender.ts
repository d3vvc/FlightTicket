import nodemailer from 'nodemailer';
import Users from '../models/Users';
import { Op } from 'sequelize';
import Seat from '../models/Seat';
import Flights from '../models/Flights';
import * as cron from 'node-cron';

const seatsNeedingNotification = async (): Promise<Seat[]> => {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const seats = await Seat.findAll({
        where: {
          locked_by: { [Op.not]: null }, 
          status: { [Op.in]: ['reserved'] }
        },
        include: [{
          model: Flights,
          as: 'flight',
          where: {
            departureTime: {
              [Op.between]: [today, sevenDaysFromNow]
            }
          }
        }, {
          model: Users,
          foreignKey: 'locked_by',
          as: 'user' ,
          attributes: ['email', 'username', 'id']
        }]
      });

    return seats
}


const sendNotificationEmail = async (seats: Seat[]): Promise<string> => {
     try{
            const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tlvanishq.234@gmail.com',
                pass: 'yqan bpev vemz hjco'
            }
        })

        
        for (const seat of seats) {
            const user = seat.user;
            const flight = seat.flight;

            if (!user || !flight) {
                console.log(`Skipping seat ${seat.seatNumber} due to missing user or flight information.`);
                continue;
            }

            const daysUntilFlight = Math.ceil(
                (flight.departureTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );

            const mailOptions = {
                from: process.env.EMAIL_USER || 'tlvanishq.234@gmail.com',
                to: user.email,
                subject: `Flight Reminder: ${daysUntilFlight} days until departure`,
                text: `Dear ${user.username}, your flight ${flight.flightNumber} from ${flight.origin} to ${flight.destination} is departing in ${daysUntilFlight} days on ${flight.departureTime.toDateString()}. Your seat is ${seat.seatNumber} (${seat.seat_class}). Please arrive at the airport 2-3 hours early. Have a great trip!`
            };

            await transporter.sendMail(mailOptions);
            }
            return `Successfully sent flight reminder emails`;

        
        } catch (err) {
            console.log(err);
            throw err
        }
}

const PollingService = async (): Promise<void> => {
    const seats = await seatsNeedingNotification();
    if (seats.length > 0) {
        const result = await sendNotificationEmail(seats);
        console.log(result);
    }
}

cron.schedule('0 9 * * *', PollingService, {
    timezone: "Asia/Kolkata"
  });

  export default PollingService;
  