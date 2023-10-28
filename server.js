const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3001;

app.use(cors()); 

//let items = loadItemsFromFile();

let items = [
    {
      "taskID": 1,
      "taskTitle": "Task 1",
      "taskDescription": "Description for Task 1",
      "isActive": false
    },
    {
      "taskID": 2,
      "taskTitle": "Task 2",
      "taskDescription": "Description for Task 2",
      "isActive": false
    },
    {
      "taskID": 3,
      "taskTitle": "Task 3",
      "taskDescription": "Description for Task 3",
      "isActive": false
    }
  ]

app.use(express.json());

app.get('/api/tasks', (req, res) => {
    const formattedItems = items.map(item => ({
        taskID: parseInt(item.taskID, 10), 
        taskTitle: item.taskTitle,
        taskDescription: item.taskDescription,
        isActive: item.isActive
    }));
    res.json(formattedItems);
    saveItemsToFile();
    loadItemsFromFile();
});

app.post('/api/tasks', (req, res) => {
    const newItem = req.body;
    newItem.taskID = parseInt(newItem.taskID, 10);
    items.push(newItem);
    res.json(newItem);
    saveItemsToFile();
    loadItemsFromFile();
});

app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const updatedItem = req.body;
    items = items.map(item => (item.taskID === taskId ? updatedItem : item));
    res.json(updatedItem);
    saveItemsToFile();
    loadItemsFromFile();
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const deletedItem = items.find(item => item.taskID === taskId);
    items = items.filter(item => item.taskID !== taskId);
    res.json(deletedItem);
    saveItemsToFile();
    loadItemsFromFile();
});

function saveItemsToFile() {
    const data = JSON.stringify(items, null, 2);
    fs.writeFileSync('items.json', data);
}

function loadItemsFromFile() {
    const data = fs.readFileSync('items.json', 'utf8');
    const items = JSON.parse(data);
   return items; 
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

console.log(items);