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
    .catch(e => console.error('eventUserCreate', e))
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
    .catch(e => console.error('eventUserUpdate', e))
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
    .catch(e => console.error('eventUserDelete', e))
}

module.exports = {
  eventUserCreated,
  eventUserUpdated,
  eventUserDeleted
}