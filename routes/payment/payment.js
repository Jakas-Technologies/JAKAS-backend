const { Router } = require('express');
const qrCode = require('qrcode');
const midtrans = require('./midtrans')
const { jwtHandler } = require('../../utils/jwtHandler')
const db = require('../../models');
const paymentRouter = Router();

//Driver
paymentRouter.get('/driver/qr', jwtHandler.verifyToken, async (req, res) => {
    try {
        const driverId = req.user.id;

        if (!driverId) {
            return res.status(400).json({status: 'BAD_REQUEST', error: 'Missing driverId' });
        }

        const driver = await db.Driver.findByPk(driverId);

        if (!driver) {
            return res.status(404).json({ status: 'DATA_NOT_FOUND', message: 'Driver not found for the provided driverId' });
        }

        const data = {
            id: driver.id,
            name: driver.name,
            licensePlate: driver.licensePlate,
            routeName: driver.routeName,
            routeId: driver.routeId,
        };

        const dataJSON = JSON.stringify(data)
        console.log(dataJSON)

        const qrCodeImage = await qrCode.toDataURL(`${dataJSON}`);

        res.status(200).json({ qr_code: qrCodeImage })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

paymentRouter.get('/driver/trip', jwtHandler.verifyToken, async (req, res) => {
    try {
        const driverId = req.user.id;

        if (!driverId) {
            return res.status(400).json({status: 'BAD_REQUEST', error: 'Missing driverId' });
        }

        const driver = await db.Driver.findByPk(driverId);

        if (!driver) {
            return res.status(404).json({ status: 'DATA_NOT_FOUND', message: 'Driver not found for the provided driverId' });
        }

        const trips = await db.Trip.findAll({
            where: {
                driverID: driverId,
            },
            include: [{
                model: User,
                attributes: ['name']
            }]
        });

        const totalFareResult = await db.TripHistory.findOne({
            attributes: [[db.fn('COALESCE', db.fn('SUM', db.col('fare')), 0), 'totalFare']],
            where: {
                driverID: driverId,
            }
        });

        const totalFare = totalFareResult ? totalFareResult.dataValues.totalFare : 0;

        const passengers = trips.map(trip => {
            return {
                tripID: trip.id,
                userID: trip.userID,
                driverID: trip.driverID,
                fare: trip.fare,
                onProgress: trip.onProgress,
                isPaid: trip.isPaid,
                transactionID: trip.transactionID,
                passengerName: trip.User ? trip.User.name : null
            };
        });

        res.status(200).json({
            status: 'OK',
            trips: passengers,
            totalFare: totalFare
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', err_message: error.message })
    }
});


//User
const endTrip = async (trip) => {
    await db.TripHistory.create({
        userID: trip.userID,
        driverID: trip.driverID,
        fare: trip.fare,
        transactionID: trip.transactionID,
    });

    await trip.destroy();
}

paymentRouter.post('/start-trip', jwtHandler.verifyToken, async (req, res) => {
    try {
        const { driverId, tripCost } = req.body;
        const userId = req.user.id;

        if (!driverId || !tripCost) {
            return res.status(400).json({ status: "BAD_REQUEST", error: "Missing driverId or tripCost value" });
        }

        const existingTrip = await db.Trip.findOne({
            where: {
                userID: userId,
                onProgress: true, 
            },
        });

        if (existingTrip) {
            return res.status(400).json({ status: "BAD_REQUEST", error: "User is currently on a trip" });
        }

        const newTrip = await db.Trip.create({
            userID: userId,
            driverID: driverId,
            fare: tripCost,
        });

        res.status(201).json({ status: 'Created', trip: newTrip });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
});

paymentRouter.post('/end-trip', jwtHandler.verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const trip = await db.Trip.findOne({
            where: {
                userID: userId,
            },
        });

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found for the provided userId' });
        }

        if (!trip.isPaid) {
            return res.status(400).json({ error: 'Payment is not completed for this trip' });
        }

        await endTrip(trip);

        res.status(200).json({ status: 'OK' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

paymentRouter.delete('/cancel-trip', jwtHandler.verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const trip = await db.Trip.findOne({
            where: {
                userID: userId,
            },
        });

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found for the provided userId' });
        }

        await trip.destroy();
        res.status(200).json({ status: 'OK' })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//Midtrans
paymentRouter.post('/payment', jwtHandler.verifyToken, async (req, res) => {
    try {
        let data;
        let { payment_type, items } = req.body;
        const userId = req.user.id;

        const user = await db.User.findByPk(userId);

        let customer = {
            email: user.email,
            first_name: user.name,
            last_name: "",
            phone: "",
        }

        switch (payment_type) {
            case 'gopay':
                data = midtrans.goPay(items, customer);
                break;
            case 'shopeepay':
                data = midtrans.shopeePay(items, customer);
                break;
            default:
                return res.status(400).json({ error: 'Invalid payment type' });
        }

        //return res.status(200).json(data);

        const result = await midtrans.charge(data);
        //return res.status(200).json(result);

        if (result.status_code !== "201") {
            return res.status(parseInt(result.status_code)).json(result);
        }

        const trip = await db.Trip.findOne({
            where: {
                userID: userId,
            },
        });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found for the User' });
        }

        await trip.update({
            transactionID: result.transaction_id,
        });

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({
            status: "INTERNAL_SERVER_ERROR",
            message: err.message,
        });
    }
});

paymentRouter.post('/midtrans/notification', async (req, res) => {
    try {
        const { status_code, transaction_id } = req.body;

        if (status_code === '201' || status_code === '202') {
            return res.status(200).json({ message: 'OK' });
        }

        if (status_code !== '200') {
            return res.status(400).json({ message: 'Failed' });
        }

        const trip = await db.Trip.findOne({
            where: {
                transactionID: transaction_id,
            },
        });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found for the provided transactionID' });
        }

        console.log({ trip: trip })

        await trip.update({
            isPaid: true,
        });

        await endTrip(trip)

        return res.status(200).send('OK');
    } catch (error) {
        console.error({error:error.message})
        res.status(500).json({ error: 'Internal Server Error' })
    }

});

module.exports = { route: paymentRouter, name: "payment" };
