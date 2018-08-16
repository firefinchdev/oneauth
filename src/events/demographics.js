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
    .catch(e => console.error('eventDemographicCreate', e))
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
    .catch(e => console.error('eventDemographicUpdate', e))
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
    .catch(e => console.error('eventDemographicDelete', e))
}

module.exports = {
  eventDemographicCreated,
  eventDemographicUpdated,
  eventDemographicDeleted
}