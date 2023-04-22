migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("like9k7pu3i4pjq")

  collection.createRule = "user = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("like9k7pu3i4pjq")

  collection.createRule = null

  return dao.saveCollection(collection)
})
