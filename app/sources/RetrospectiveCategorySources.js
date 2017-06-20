import RetrospectiveCreativeListAction from '../actions/RetrospectiveListActions';

// This just gives us the fake data until the CRUD is created
let mockRetrospectiveDdata = {
    id: 1,
    title: String,
    categories: {
        type: Array,
        default: ["What went well?",
            "What didn't go well?",
            "What did we learn?",
            "What still puzzles us?"]
    },
    isVotable: { type: Boolean, default: false },
    isTimeboxed: { type: Boolean, default: false },
    displayThoughtPreference: { type: "String", default: "personal"},
    stage: { type: "String", default: "initial" }
};


// Created a similated API request to mimic a call to the server 
let RestrospectiveSource = {
    fetchRetrospective() {
        return{
            remote() {
                return new Promise(function (resolve, reject) {
                    setTimeout(function() {
                        // change this to `false` to see the error action being handled.
                        if(true) {
                            resolve(mockRetrospectiveDdata);
                        }else{
                            reject('Something went wrong with the retrospective');
                        }
                    }, 250);
                });
            },
            local(){
                //Never check locally, always fetch remotely
                return null;
            },

            success: RetrospectiveCreativeListAction.updateRetrospectives,
            error: RetrospectiveCreativeListAction.retrospectiveFailed,
            loading: RetrospectiveCreativeListAction.fetchRetrospective
        }
    }
};

export default RestrospectiveSource;