const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}'/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
    const tourId = val * 1;
    const tour = tours.find(item => item.id === tourId);

    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: `Tour by id ${tourId} was not found`
        })
    }
    next()
}

exports.checkBody = (req, res, next) => {
    const body = req.body;

    if (!body.name || !body.price) {
        return res.status(400).json({
            status: "fail",
            message: `Bad request, missing name or price`
        })
    }

    next();
}

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        requestTime: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    })
}

exports.createTour = (req, res) => {
    const body = req.body;

    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({ id: newId }, body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            message: "success",
            data: {
                tour: newTour
            }
        })
    })
}

exports.getTour = (req, res) => {
    const tourId = req.params.id * 1;
    const tour = tours.find(item => item.id === tourId);

    res.status(200).json({
        status: "success",
        data: {
            tour: tour
        }
    })
}

exports.updateTour = (req, res) => {
    const tour = req.body;

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    })

}

exports.deleteTour = (req, res) => {
    const tourId = req.params.id * 1;

    res.status(204).json({
        status: 'success',
        data: null
    })

}