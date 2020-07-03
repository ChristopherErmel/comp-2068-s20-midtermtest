// You need to complete this controller with the required 7 actions.
const viewPath = ('reservations');

const User = require('../models/user');
const Reservation = require('../models/reservation');


exports.index = async (req, res) => {
    try {
        //get all the reservations
        const reservations = await Reservation.find().populate('user').sort({updatedAt: 'desc'});
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
        const reservation = (await Reservation.findById(req.params.id).populate('user'));
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
        const roomTypes = Reservation.schema.paths.roomType.enumValues;
        res.render(`${viewPath}/edit`, {
            pageTitle: 'Edit!',
            roomTypes: roomTypes,
            formData: reservation
        });
    } catch (error) {
        console.log(error);
        req.flash('danger', 'Reservation could NOT be edited!');
    }
};

exports.update = async (req, res) => {
    try {
        const {user : email } = req.session.passport;
        const user = await User.findOne({email : email});
        let reservation = await Reservation.findById(req.body.id);
        if(!reservation) throw new Error('Reservation could not be found!');

        const attributes = {user: user._id, ...req.body}

        await Reservation.validate(attributes);
        await Reservation.updateOne({_id: req.body.id}, req.body);

        req.flash('success', 'The reservation was updated!');
        res.redirect(`/reservations/${req.body.id}`);

    } catch (error) {
        req.flash('danger', 'Reservation could NOT be updated!');
        res.redirect(`/reservations/${req.body.id}/edit`);
    }
};

exports.delete = async (req, res) => {
    try {
        await Reservation.deleteOne({_id: req.body.id});
        req.flash('success', 'Reservation Deleted!');
        res.redirect('/reservations');
    } catch (error) {
        console.log(error);
        req.flash('success', 'Reservation could NOT be deleted!');        
        res.redirect('/reservations');
    }
}