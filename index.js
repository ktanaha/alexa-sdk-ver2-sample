'use-strict';

const Core = require('ask-sdk-core');

/* Intent Handlers */
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = '炊きたいお米の量を合数で教えてください。';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('お米のお水', speechText)
            .getResponse();
    }
};

const RiceIntentProgressHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'RiceIntent'
            && request.dialogState !== 'COMPLETED';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        let rice = request.intent.slots.Rice;
        let amount = request.intent.slots.Amount;
        
        return handlerInput.responseBuilder
            .speak(rice + 'の' + amount + '合の水の量は' + measureWater(rice, amount) + 'ccです')
            .withSimpleCard('Hello World', '白米')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
               handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'これはヘルプです';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    }
};

const ExitIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = '了解しました。終了します。';

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle(handlerInput, error) {
        return error.name.startsWith('AskSdk');
    },
    handle(handlerInput, error) {
        return handlerInput.responseBuilder
            .speak('エラーになっているのでやめます')
            .getResponse();
    }
};

function measureWater(rice, amount) {
    let result;
    if (rice === '白米') {
        result = amount * 1.1;
    } else if (rice === '玄米') {
        result = amount * 1.2;
    } else if (rice === 'もち米') {
        result = amount * 1.3;
    }
    return Math.floor(result * Math.pow(10, 1)) / Math.pow(10, 1);
};

const skillBuilders = Core.SkillBuilders.custom();
exports.handler = skillBuilders
    .addRequestHandlers(
        LaunchRequestHandler,
        RiceIntentProgressHandler,
        HelpIntentHandler,
        ExitIntentHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();