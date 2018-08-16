const request = require('request-promise')
const {
  findAllEventSubscription
} = require ('../controllers/event_subscriptions');
const {
  findAllClientsByUserId
} = require ('../controllers/clients');

function getWebhooks(userId, model, type) {
  // find all EventSubscriptions that exist for {model, type}
  // Eg: find all EventSubscriptions that exist for {user, created}

  return findAllClientsByUserId(+userId)
    .then(clients => clients.map(client => client.get()))
    .then(clients => Promise.all(clients.map(async client => {
      return findAllEventSubscription(client.id, {model: model, type: type})
        .then(c => c.map(x => {
          return {
            client: client,
            eventSubscription: x.get()
          }
        }))
    })))
    .then(clientWrappers => clientWrappers.reduce((acc, clientArr) => [...clientArr, ...acc], []))
    .then(clientWrappers => clientWrappers.map(clientWrapper => clientWrapper.client.webhookURL))
    .catch(e => console.error('getWebhooks', e))
}

function webhookPOST(webhookURLs, options) {

  //POST request on all webhook URLs
  webhookURLs.forEach((webhookURL => {
    request({
      method: 'POST',
      uri: webhookURL,
      body: options,
      json: true
    }).then(parsedBody => {
      console.log(parsedBody)
    }).catch(err => {
      console.error('webhookPOST', err)
    })
  }))
}

module.exports = {
  webhookPOST, getWebhooks
}