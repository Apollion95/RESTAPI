const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3001;
const json5 = require('json5');
app.use(express.json());

app.use(cors()); 

let items = loadItemsFromFile();
app.use(express.json());

app.get('/api/tasks/', (req, res) => {
  const formattedItems = items.map(item => ({
      taskID: parseInt(item.taskID,10),
      taskTitle: item.taskTitle,
      taskDescription: item.taskDescription,
      isActive: item.isActive
  }));
  res.json(formattedItems);
});

//read
app.get('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const task = items.find(item => item.taskID === taskId);
    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }

});

//create
app.post('/api/tasks/', (req, res) => {
  const jsonString = JSON.stringify(req.body);
  const newItem = JSON.parse(jsonString);
  const isTaskIDUnique = items.every(item => item.taskID !== newItem.taskID);
  if (!isTaskIDUnique) {
      return res.status(400).json({ error: 'TaskID must be unique' });
  }else{
    items.push(newItem);
    saveItemsToFile();
    res.json(newItem);
    console.log(newItem);
  }
});

//update/replace
app.put('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const updatedItem = req.body;
  const itemIndex = items.findIndex(item => item.taskID === taskId);
  items[itemIndex] = updatedItem;
  saveItemsToFile();
  res.json(updatedItem);
  console.log(updatedItem);
});

//delete
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const deletedItem = items.find(item => item.taskID === taskId);
  items = items.filter(item => item.taskID !== taskId);
  saveItemsToFile();
  res.json(deletedItem);
  console.log(deletedItem);
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
