migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("like9k7pu3i4pjq")

  collection.updateRule = "user = @request.auth.id"
  collection.deleteRule = "user = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("like9k7pu3i4pjq")

  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
