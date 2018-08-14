const { User } = require("../db/models").models;

function findUserById(id, includes) {
  return User.findOne({
    where: { id },
    include: includes
  });
}

function updateUser(userid, newValues) {
  return User.update(newValues, {
    where: { id: userid },
    returning: true
  });
}

function findUserForTrustedClient(trustedClient, userId) {
  return User.findOne({
    attributes: trustedClient ? undefined : ["id", "username", "photo"],
    where: { id: userId }
  });
}

function findAllUsersWithFilter(trustedClient, filterArgs) {
  return User.findAll({
    attributes: trustedClient ? undefined : ["id", "username", "email", "firstname", "lastname", "mobile_number"],
    where: filterArgs || {},
  });
}

function generateFilter(query) {

  let whereObj = {}

  if (query.username) {
    whereObj.username = query.username
  }
  if (query.firstname) {
    whereObj.firstname = {
      $iLike: `${query.firstname}%`
    }
  }
  if (query.lastname) {
    whereObj.lastname = {
      $iLike: `${query.lastname}%`
    }
  }
  if (query.email) {
    let email = query.email
    email = email.split['@']
    email[0] = email[0].split('').filter(c => !(c === '.')).join('')
    email = email.join('@')
    whereObj.email = email
    // whereObj.email = sequelize.where(sequelize.fn('replace', sequelize.col('email'), '.', ''), sequelize.fn('replace', email, '.', ''))

  }
  if (query.contact) {
    let contact = query.contact
    if(/^\d+$/.test(contact)) {
      whereObj.contact = {
        like: `%${contact}`
      }
    } else {

    }
  }
  if (query.verified) {
    let verify = (query.verified === 'true')
    if (verify) {
      whereObj.verifiedemail = {
        $ne: null
      }
    } else {
      whereObj.verifiedemail = {
        $eq: null
      }
    }
  }
  return whereObj
}

module.exports = {
  findUserById,
  updateUser,
  findUserForTrustedClient,
  findAllUsersWithFilter,
  generateFilter
};
