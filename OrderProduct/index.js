var uuid = require('uuid').v4;
var msRestAzure = require('ms-rest-azure');
var eventGrid = require("azure-eventgrid");
var url = require('url');

module.exports = function (context, req) {
    context.log('New ice cream order made.');

    if (req.body) {
        // TODO: Enter value for topicKey
        let topicKey = 'gCvywoVnqD2iYnOp3752i594bI1zq9xr/2uADZvozG8=';
        // TODO: Enter value for topic-endpoint
        let topicEndPoint = 'https://icecreamorder.centralus-1.eventgrid.azure.net/api/events';

        let topicCreds = new msRestAzure.TopicCredentials(topicKey);
        let egClient = new eventGrid(topicCreds);
        let topicUrl = url.parse(topicEndPoint, true);
        let topicHostName = topicUrl.host;
        let currentDate = new Date();

        let events = [{
            id: uuid(),
            subject: 'BFYOC/stores/serverlessWorkshop/orders',
            dataVersion: '2.0',
            eventType: 'BFYOC.IceCream.Order',
            data: req.body,
            eventTime: currentDate
        }];
        egClient.publishEvents(topicHostName, events).then((result) => {
            return Promise.resolve(console.log('Published events successfully.'));
        }).catch((err) => {
            console.log('An error ocurred ' + err);
        });
    } else {
        context.res = {
            status: 400,
            body: "Please pass an ice cream order in the request body"
        };
    }
    context.done();
};