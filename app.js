const fs = require('fs')
const express = require('express');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    console.log('hello form the middleware')
    next();
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        requestTime: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    })
}

const createTour = (req, res) => {
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

const getTour = (req, res) => {
    const tourId = req.params.id * 1;
    const tour = tours.find(item => item.id === tourId);

    if (!tour) {

        return res.status(404).json({
            status: "fail",
            message: `Tour by id ${tourId} was not found`
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            tour: tour
        }
    })
}

const updateTour = (req, res) => {
    const tour = req.body;

    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: `Tour was not patched`
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    })

}

const deleteTour = (req, res) => {
    const tourId = req.params.id * 1;
    const tour = tours.find(item => item.id === tourId);

    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: `Tour has not been deleted`
        })
    }

    res.status(204).json({
        status: 'success',
        data: null
    })

}

app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour)

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
})