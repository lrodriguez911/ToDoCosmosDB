const Task = require("../models/task");


// THIS IS THE CONTROLLER

class TaskList{
    /**
     * Handle APIs and deploy and handle the tasks
     * @param {Task} taskObj
     */
    constructor(taskObj){
        this.taskObj = taskObj
    }

    async showTasks(req, res){
        const querySpec = {
            query: "SELECT * FROM root r WHERE r.completed=@completed",
            parameter: {
                name: "@completed",
                value: false
            }

        }

        const items =await this.taskObj.find(querySpec);
        res.render("index", {
            title: "My to-do list",
            tasks: items
        });
    }

    async addTask(req, res){
        const item = req.body;

        await this,this.taskObj.addItem(item);
        res.redirect('/');
    }

    async completeTask(req, res){
        const completedTasks = Object.keys(req.body);
        const tasks = [];
        completedTasks.forEach(task => {
            tasks.push(this.taskObj.updateItem(task));
        });

        await Promise.all(tasks);

        res.redirect("/");
    }
}

module.exports = TaskList;