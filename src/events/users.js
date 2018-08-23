const Raven = require('raven')
const { webhookPOST, getWebhooks } = require("./eventHelper")

function eventUserCreated (userId) {
  getWebhooks(userId, 'user', 'create')
    .then((webhookURLs) => {
      webhookPOST(webhookURLs, {
        type: "CREATED",
        model: "user",
        success: true,
        id: userId,
        userId: userId
      })
    })
    .catch(e => Raven.captureException(e))
}

function eventUserUpdated (userId) {
  getWebhooks(userId, 'user', 'update')
    .then((webhookURLs) => {
      webhookPOST(webhookURLs, {
        type: "UPDATED",
        model: "user",
        success: true,
        id: userId,
        userId: userId
      })
    })
    .catch(e => Raven.captureException(e))
}

function eventUserDeleted (userId) {
  getWebhooks(userId, 'user', 'delete')
    .then((webhookURLs) => {
      webhookPOST(webhookURLs, {
        type: "DELETED",
        model: "user",
        success: true,
        id: userId,
        userId: userId
      })
    })
    .catch(e => Raven.captureException(e))
}

module.exports = {
  eventUserCreated,
  eventUserUpdated,
  eventUserDeleted
}