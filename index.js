const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');

app.use(cors()); // use CORS for all requests and all routes

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

let currentStepIndex = 0;

const integSteps = ['INITIALIZATION','ORGANIZATION_ADDRESS',  'SYNC_RULES', 'COMPLETED', 'MANAGE_PREFERENCE' ]


let turbojarPayload = {
        totalNexusConfigured: 0,
        isTaxjarPlus: false,
        featureVal: 3310,
        isFeatureAllowed: true,
        steps: integSteps,
        status: false,
        isDraft: false,
        thirdPartyTaxType: 'TURBOJAR',	
        allowProceed: false,
        integrationName: 'turbojar',
        isUnlinkAllowed: true,
        allowProceed:true,
        commitInvCn:{
        	isDraft:false,
        	isOverridable:true,
        	value:true
        },
        syncInvCn:{
        	isDraft:false,
        	isOverridable:true,
        	value:true
        }
}

/* home route */
app.get('/', (req, res, next) => {
    res.send('hello there');
});

app.get('/third_party/ui/turbojar', (req, res) => {
    res.send({...turbojarPayload, step: integSteps[currentStepIndex]});
});


app.post('/third_party/ui/turbojar/connect', (req, res) => {
    const invalidApiKeyPayload = {"errors":[{"message":"There were errors while submitting"},{"param":"token","message":"Invalid API token"}]}
	    if(req.body.token !== "API_KEY") {
	    	res.status(400).send(invalidApiKeyPayload)
	    } 
    currentStepIndex = currentStepIndex + 1;

    res.send({...turbojarPayload,step: integSteps[currentStepIndex]})

});


app.post('/third_party/ui/turbojar/stage', (req, res) => {
	currentStepIndex = currentStepIndex + 1;
    res.send({...turbojarPayload,step: integSteps[currentStepIndex]})

});


app.post('/site_preferences/:pref_name/add_publish_rule', (req, res) => {
    res.send({...turbojarPayload,step: integSteps[currentStepIndex]})

});

/* start the app */
const port = process.env.PORT || 7777;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
