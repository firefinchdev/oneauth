const request = require('request-promise')
const { EventSubscription, User, Client } = require("../db/models");
const {
  createEventSubscriptionBulk,
  deleteEventSubscription,
  findAllEventSubscription
} = require ('../controllers/event_subscriptions');
const {
  findUserById,
  findUserByParams,
  createUserLocal,
  updateUser,
  findUserForTrustedClient,
  findAllUsersWithFilter
} = require ('../controllers/user');
const {
  createClient,
  updateClient,
  findClientById,
  findAllClients,
  findAllClientsByUserId
} = require ('../controllers/clients');

function getWebhooks(userId, model, type) {
  return findAllClientsByUserId(+userId)
    .then(clients => clients.map(async client => {
      return {
        client: client,
        eventSubscriptions: await findAllEventSubscription(client, {model: model, type: type})
      }
    }))
    .then(clientWrappers => clientWrappers.reduce((clientArr, acc) => [...clientArr, ...acc], []))
    .then(clientWrappers => clientWrappers.map(clientWrapper => clientWrapper.client.webhookURL))
}

function eventUserCreated (userId) {
  // find all EventSubscriptions that exist for {user, created}
  // make a POST request to all the webhookURL for all such clients
  getWebhooks(userId)
    .then((webhookURLs) => {
      webhookURLs.forEach((webhookURL => {
        console.log('MEOW', webhookURL);
        request({
          method: 'POST',
          uri: 'localhost:2929/',
          body: {
            type: "CREATED",
            model: "user",
            success: true,
            id: userId,
            userId: userId
          }
        }).then(parsedBody => {
          console.log(parsedBody)
        }).catch(err => {
          console.error(err)
        })
      }))
    })

}

function eventUserUpdated (userId) {

}

function eventUserDeleted (userId) {

}

module.exports = {
  eventUserCreated,
  eventUserUpdated,
  eventUserDeleted
}