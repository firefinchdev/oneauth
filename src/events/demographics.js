const Raven = require('raven')
const { webhookPOST, getWebhooks } = require("./eventHelper")

function eventDemographicCreated (demoId, userId) {
  getWebhooks(userId, 'demographic', 'create')
    .then((webhookURLs) => {
      webhookPOST(webhookURLs, {
        type: "CREATED",
        model: "user",
        success: true,
        id: demoId,
        userId: userId
      })
    })
    .catch(e => Raven.captureException(e))
}

function eventDemographicUpdated (demoId, userId) {
  getWebhooks(userId, 'demographic', 'update')
    .then((webhookURLs) => {
      webhookPOST(webhookURLs, {
        type: "UPDATED",
        model: "user",
        success: true,
        id: demoId,
        userId: userId
      })
    })
    .catch(e => Raven.captureException(e))
}

function eventDemographicDeleted (demoId, userId) {
  getWebhooks(userId, 'demographic', 'delete')
    .then((webhookURLs) => {
      webhookPOST(webhookURLs, {
        type: "DELETED",
        model: "user",
        success: true,
        id: demoId,
        userId: userId
      })
    })
    .catch(e => Raven.captureException(e))
}

module.exports = {
  eventDemographicCreated,
  eventDemographicUpdated,
  eventDemographicDeleted
}