const eventModel = require( "../models/eventModel" );
const fs = require( "fs" );

// create event
const createEvent = async ( req, res ) => {
    try {
        const { eventTitle, eventContent } = req.body;
        const titleImage = req.file.filename;
        const event = new eventModel( {
        eventTitle,
        eventContent,
        titleImage
    } );
    
    const savedEvent = await event.save();
    if ( !savedEvent ) {
        res.status( 400 ).json( {
            message: "Error saving event."
        })
    } else {
        res.status( 201 ).json( {
            data: savedEvent
        })
    }
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

// get all events
const getEvents = async ( req, res ) => {
    try {
        const events = await eventModel.find();
        if ( events === null ) {
            res.status( 200 ).json( {
                message: "No event available."
            })
        } else {
            res.status( 200 ).json( {
                data: events
            })
        }
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

// get an events
const getEvent = async ( req, res ) => {
    try {
        const { id } = req.params;
        const event = await eventModel.findById( id );
        if ( !event ) {
            res.status( 404 ).json( {
                message: `No event with id: ${id}`
            })
        } else {
            res.status( 200 ).json( {
                data: event
            })
        }
    } catch {
        
    }
}

// update an event
const updateEvent = async ( req, res ) => {
    try {
        const { id } = req.params;
        const event = await eventModel.findById( id );
        const { eventTitle, eventContent } = req.body;
        const data = {
                eventTitle: eventTitle || event.eventTitle,
                eventContent: eventContent || event.eventContent,
                titleImage: event.titleImage
        }

        // while trying to update
        if ( req.file && req.file.filename ) {
            const oldTitleImagePath = `uploads/${ event.titleImage}`;
            await fs.unlinkSync( oldTitleImagePath )
            data.titleImage = req.file.filename
        }
        
        const updatedData = await eventModel.findByIdAndUpdate( id, data, { new: true} )
        if ( !updatedData ) {
            res.status( 400 ).json( {
                message: `Unable to update event.`
            })
        } else {
            res.status( 200 ).json( {
                data: updatedData
            })
        }
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

// delete event
const removeEvent = async ( req, res ) => {
    try {
        const { id } = req.params;
        const event = await eventModel.findById( id );
        if ( !event ) {
            res.status( 404 ).json( {
                message: `No event with id: ${id}`
            })
        } else {
            const oldTitleImagePath = `uploads/${ event.titleImage}`;
            await fs.unlinkSync( oldTitleImagePath )
            await eventModel.findByIdAndDelete( id );
            return res.status( 200 ).json( {
                message: `Event with id: ${id} has been deleted successfully.`
            })
        }
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}


module.exports = {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    removeEvent,
}