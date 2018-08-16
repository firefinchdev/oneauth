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
function eventUserCreated (userId) {
  // find all EventSubscriptions that exist for {user, created}
  // make a POST request to all the webhookURL for all such clients
  return findAllClientsByUserId(+userId)
    .then(clients => clients.map(client => {
      return {
        client: client,
        eventSubscriptions: findAllEventSubscription(client, {model: 'user'})
      }
    }))
    .then(clientWrappers => clientWrappers.reduce((clientArr, acc) => [...clientArr, ...acc], []))
    .then(clientWrappers => clientWrappers.filter((clientWrapper => {
      let flag = false
      clientWrapper.eventSubscriptions.map((eventSubscription => {
        if (eventSubscription.model === 'user' && eventSubscription.type === 'create') {
          flag = true
        }
      }))
      return flag
    })))
    .then((clientWrappers) => {
      clientWrappers.forEach((clientWrapper => {
        request({
          method: 'POST',
          uri: clientWrapper.client.webhookURL,
          body: {
            type: "CREATED",
            model: "user",
            success: true,
            id: userId,
            userId: userId
          }
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