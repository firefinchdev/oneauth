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
    .then(clients => clients.map(client => client.get()))
    .then(clients => Promise.all(clients.map(async client => {
      /*return {
        client: client,
        eventSubscriptions: await findAllEventSubscription(client, {model: model, type: type})
      }*/
      let arr = []
      await findAllEventSubscription(client.id, {model: model, type: type})
        .then(c => arr = c.map(x => {
          return {client: client,
          eventSubscription: x.get()}
        }))
      console.log('vvv',arr)
      return arr
    })))
    .then(c => {
      console.log('bbb',c)
      return c
    })
    .then(clientWrappers => clientWrappers.reduce((acc, clientArr) => [...clientArr, ...acc], []))
    .then(clientWrappers => clientWrappers.map(clientWrapper => clientWrapper.client.webhookURL))
    .catch(e => console.error('FUCK', e))
}

function eventUserCreated (userId) {
  // find all EventSubscriptions that exist for {user, created}
  // make a POST request to all the webhookURL for all such clients
  getWebhooks(userId, 'user', 'create')
    .then((webhookURLs) => {
      webhookURLs.forEach((webhookURL => {
        console.log('' +
          'MEOW', webhookURL);
        request({
          method: 'POST',
          uri: 'http://localhost:2929',
          body: {
            type: "CREATED",
            model: "user",
            success: true,
            id: userId,
            userId: userId
          },
          json: true
        }).then(parsedBody => {
          console.log(parsedBody)
        }).catch(err => {
          console.error('HOO',err)
        })
      }))
    })
    .catch(e => console.error('FUCKx', e))

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