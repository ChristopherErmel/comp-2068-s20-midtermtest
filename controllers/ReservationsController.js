// You need to complete this controller with the required 7 actions
const viewPath = ('reservations');

const User = require('../models/user');
const Reservation = require('../models/reservation');


exports.index = async (req, res) => {
    try {
        //get all the reservations
        const reservations = await Reservation.find().sort({updatedAt: 'desc'});
        res.render(`${viewPath}/index`, {
            pageTitle: 'Reservations',
            reservations: reservations
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
};

exports.show = async (req, res) => {
    try {
        const reservation = await (await Reservation.findById(req.params.id)).populate('user');
        res.render(`${viewPath}/show`, {
            pageTitle: 'Show!',
            reservation: reservation
        })
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
};

exports.new = async (req, res) => {
    const roomTypes = Reservation.schema.paths.roomType.enumValues;
    res.render(`${viewPath}/new`, {
        pageTitle: 'New!',
        roomTypes: roomTypes
    });
};

exports.create = async (req, res) => {
    try {
        const {user : email} = req.session.passport;
        const user = await User.findOne({email : email});
        const reservation = await Reservation.create({user : user._id, ...req.body});
        req.flash('success', 'Reservation created successfully!');
        res.redirect(`/reservations/${reservation.id}`);
    } catch (error) {
        req.flash('danger', `Error: ${error}`);
        req.session.formData = req.body;
    }
};

exports.edit = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        res.render(`${viewPath}/edit`, {
            pageTitle: 'Edit!',
            formData: reservation
        });
    } catch (error) {
        console.log(error);
    }
};

exports.update = async (req, res) => {

};

exports.delete = async (req, res) => {
    try {
        await Reservation.deleteOne({_id: req.body.id});

        res.redirect('/reservations');
    } catch (error) {
        console.log(error);
    }
}