const generator = require("../utils/generator");
const { Client, Demographic, Address, User, EventSubscription } = require("../db/models").models;

function findEventSubscriptionById(id) {
  return EventSubscription.findOne({
    where: { id }
  });
}

function createEventSubscription(options) {

  try {
    if (options && !NaN(options.clientId) && ['create', 'update', 'delete'].includes(type)) {
      return EventSubscription.create({
        clientId: options.clientId,
        model: options.model,
        type: options.type
      })
    } else {
      throw new Error("Invalid Arguments")
    }
  } catch (e) {
    console.log(e)
  }
}

function updateEventSubscription(options, subscriptionId) {
  try {
    return EventSubscription.update({
      clientId: options.clientId,
      model: options.model,
      type: options.type
    })
  } catch (e) {
    console.log(e)
  }
}

function findAllEventSubsciptions() {
  return EventSubscription.findAll({});
}

/*function findAllEventSubscriptionsOfClientId(userId) {
  return Client.findAll({
    where: { userId }
  });
}*/

module.exports = {
  findEventSubscriptionById,
  createEventSubscription,
  updateEventSubscription,
  findAllEventSubsciptions
};
