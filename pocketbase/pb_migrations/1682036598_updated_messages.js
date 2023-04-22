migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("like9k7pu3i4pjq")

  collection.createRule = "user = @request.auth.id && @request.auth.verified = true"
  collection.updateRule = "user = @request.auth.id && @request.auth.verified = true"
  collection.deleteRule = "user = @request.auth.id && @request.auth.verified = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("like9k7pu3i4pjq")

  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
