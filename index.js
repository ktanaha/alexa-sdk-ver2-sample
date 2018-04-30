const Alexa = require('ask-sdk');
 
let skill;
exports.handler = async function (event, context) {
    if (!skill) {
      skill = Alexa.SkillBuilders.custom()
        .addRequestHandlers(MyHandler)
        .create();
    }
    return skill.invoke(event);
}
 
const MyHandler = {
    canHandle(handlerInput) {
        return true;
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('こんにちは')
            .getResponse();
    }
};