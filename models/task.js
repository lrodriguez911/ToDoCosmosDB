const CosmosClient = require('@azure/cosmos').CosmosClient;
const debug = require('debug')('todocosmos:task');

const partitionKey = undefined;

//THIS IS THE MODEL OF DATES
class Task {
    /**
     * Read, add and update taks in Cosmos DB
     * @param {CosmosClient} CosmosClient 
     * @param {string} databaseID 
     * @param {string} containerId 
     */
    constructor(CosmosClient, databaseID, containerId){
        this.client = CosmosClient;
        this.databaseID= databaseID;
        this.containerId = containerId

        this.database = null;
        this.container = null;
    }

    async init(){
        debug("Initializing DB")

        const dbResponse = await this.client.databases.createIfNotExists
        ({
            id: this.databaseID
        })

        this.database =dbResponse.database;
        debug("Initializing container")
        const contResponse = await this.database.containers.createIfNotExists({
            id: this.containerId
        })
        this.container = contResponse.container;
    }
    /**
     * Find a obj in DB
     * @param {string} querySpec 
     * @returns {resources} item find in DB
     */
    async find(querySpec) {
        debug("Finding in DB");
        if(!this.container){
            throw new Error("Container is not initialized");
        }
        const {resources} = await this.container.items.query(querySpec).fetchAll();

        return resources;
    }

    /**
     * Create the item in Cosmos DB
     * @param {*} item 
     * @returns {resource} item created in DB
     */ 
    async addItem(item){
        debug("Adding item to DB");
        item.date = Date.now();
        item.completed = false;
        const {resource: doc} = await this.container.items.create(item);

        return doc;
    }

    /**
     * Updating a item in Cosmos DB
     * @param {string} itemID 
     * @returns replaced
     */
    async updateItem(itemID){
        debug("Updating ITEM");
        const doc = await this.getItem(itemID);
        doc.completed = true;
        const {resource: replaced} = await this.container.item(itemID. partitionKey).replace(doc)

        return replaced;
    }
    /**
     * Get Item whit ID in Cosmos DB
     * @param {string} itemID 
     * @returns resource
     */
    async getItem(itemID){
        debug("Searching ITEM in DB");
        const { resource} = await this.container.item(itemID, partitionKey);
        return resource;
    }
}

module.exports = Task