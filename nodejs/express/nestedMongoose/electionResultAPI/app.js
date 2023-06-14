const express = require( 'express' );
const mongoose = require( 'mongoose' );
const PORT = 2023;

const url = 'mongodb://localhost/resultDB';
mongoose.connect( url ).then( () => {
    console.log(`Database connection was established.`)
}).catch( ( error ) => {
    console.log( `Error connecting to ${url}` );
} );

// overall schema
const overallResultSchema = new mongoose.Schema( {
    party: {
        type: String
    },
    totalVotes: {
        type: Number
    }
});
const electionSchema = new mongoose.Schema( {
    state: {
        type: String
    },
    parties: [
        {
            type: String
        }
    ],
    // result: {
    //     type: Map,
    //     of: Number
    // },
    result: [
        {
            type: Number
        }
    ],
    collationOfficer: {
        type: String
    },
    isRigged: {
        type: Boolean
    },
    totalLg: {
        type: Number
    },
    winner: {
        type: String
    },
    overallResult: {
        type: [overallResultSchema],
    },
    // statics: {
    //     async findWinnerByState ( state ) {
    //         const election = await this.findOne( { state } );
    //         if ( !election ) {
    //             throw new Error( 'Election not found.' );
    //         }
    //         const maxVotes = Math.max( ...election.result );
    //         const winnerPartyIndex = election.result.indexOf( maxVotes );
    //         const winner = election.parties[ winnerPartyIndex ];
    //         return winner;
    //     }
    // }
} );
electionSchema.statics.findWinnerByState = async function ( state ) {
            const election = await this.findOne( { state } );
            if ( !election ) {
                throw new Error( 'Election not found.' );
            }
            const maxVotes = Math.max( ...election.result );
            const winnerPartyIndex = election.result.indexOf( maxVotes );
            const winner = election.parties[ winnerPartyIndex ];
            return winner;
        }

const electionModel = mongoose.model( 'electionresult', electionSchema );


const app = express();
app.use( express() );
app.use( express.json() );

app.post( "/results", async ( req, res ) => {
    const data = req.body;
    const result = await electionModel.create( data );
    if ( !result ) {
        res.status(400).json({
            Error: "Unable to create election result."
        })
    } else {
        res.status( 201 ).json( {
            message: "Created successfully.",
            data: result
        })
    }
} );

app.get( '/results', async ( req, res ) => {
    const results = await electionModel.find( {} );
    if ( results === null ) {
        res.status( 404 ).json( {
            Error: "No results for this election."
        })
    } else {
        res.status( 200 ).json( {
            message: "Results",
            data: results
        })
    }
} )

app.get( '/results/:stateId', async ( req, res ) => {
    const stateId = req.params.stateId;
    const result = await electionModel.findById(stateId);
    if ( !result ) {
        res.status( 404 ).json( {
            Error: "No result found for this state."
        })
    } else {
        res.status( 200 ).json( {
            message: "Results",
            data: result
        })
    }
} )

app.put( '/results/:stateId', async ( req, res ) => {
    const stateId = req.params.stateId;
    const data = req.body;
    const updatedResult = await electionModel.findByIdAndUpdate( stateId, data, { new: true } );
    if ( !updatedResult ) {
        res.status( 400 ).json( {
            Error: `Unable to update election result for ${data.state}`
        })
    } else {
        res.status( 200 ).json( {
            message: "Successfully updated.",
            data: updatedResult
        })
    }
} )

app.delete( '/results/:stateId', async ( req, res ) => {
    const stateId = req.params.stateId;
    const data = req.body;
    const updatedResult = await electionModel.findByIdAndDelete( stateId, data, { new: true } );
    if ( !updatedResult ) {
        res.status( 400 ).json( {
            Error: `Unable to delete election result for ${data.state}`
        })
    } else {
        res.status( 200 ).json( {
            message: "Successfully deleted.",
            data: updatedResult
        })
    }
} )

app.get( '/winner/:state', async ( req, res ) => {
    try {
        const { state } = req.params;
        const winner = await electionModel.findWinnerByState( state );
        res.status( 200 ).json( {
            Message: `${winner} won the election in ${state}`,
            State: state,
            Winner: winner
        })
    } catch ( e ) {
        res.status( 404 ).json( {
            Error: e.message
        })
    }
} )

app.get( '/overall-result', async ( req, res ) => {
    try {
        const allResult = await electionModel.aggregate( [
            {
                $unwind: '$parties',
            },
            {
                $group: {
                    _id: '$parties',
                    totalVotes: { $sum: '$result' },
                },
            },
            {
                $sort: { totalVotes: -1 },
            },
            // {
            //     $group: {
            //         _id: "$parties",
            //         totalVotes: {
            //             $sum: {
            //                 $reduce: {
            //                     input: "$result",
            //                     initialValue: 0,
            //                     in: {$add: ["$$value", "$$this"]},
            //                 },
            //             },
            //         },
            //     },
            // },
            // {
            //     $project: {
            //         party: "$_id",
            //         totalVotes: 2,
            //         _id: 0,
            //     },
            // },
            // {
            //     $sort: {totalVotes: -1},
            // }
        ] );

        const overallWinner = allResult.length > 0 ? allResult[ 0 ]._id : null;
        // const overallWinner = allResult.length > 0 ? allResult[0].party : null;
        res.status( 200 ).json( {
            TotalResult: allResult,
            Winner: overallWinner
        } );
    } catch ( e ) {
        res.status( 500 ).json( {
            Error: e.message
        })
    }
})

app.listen( PORT, () => {
    console.log( `Server is listening to port ${PORT}` );
})