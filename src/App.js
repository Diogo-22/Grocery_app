import Header from './Header';
import SearchItem from './SearchItem';
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import { useState, useEffect } from 'react';

function App() {
  const API_URL = 'https://axiomatic-marshy-galley.glitch.me/groceries'
 
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('')
  const [search, setSearch] = useState('')
  const [reqType, setReqType] = useState('')
  const bT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJ1c2VybmFtZSI6IkRpb2dvIiwicm9sZXMiOlsyMDAxLDE5ODQsNTE1MF19LCJpYXQiOjE2ODk0MjE1MjcsImV4cCI6MTcyMDk1NzUyN30.jZU3PeFgh-kTn7Gk_U5vjwijsfTVNVKHPHs-qWqohyw'
  useEffect(() => {
    const updateDB = async () => {
      if (reqType === ''){
        return console.log('nothing to send')
      }
      else if (reqType === 'PUT') {
        
         items.map(item => fetch("https://axiomatic-marshy-galley.glitch.me/groceries", {
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': 'Bearer ' + bT
          },
          body: JSON.stringify(
              {
                "name": item.name,
              "id": item.id,
              "checked": `${item.checked}`
            }
          )}))
        setReqType('')
      }
      else if (reqType === newItem) {
        setNewItem('');
        setReqType('') 
        
         fetch("https://axiomatic-marshy-galley.glitch.me/groceries", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            'Authorization': 'Bearer ' + bT
          },
          body: JSON.stringify(
              {
                "name": newItem.name,
              "id": newItem.id,
              "checked": `${newItem.checked}`
            }
          ) 
        }
       )  
      } 
      else  {
        console.log('Not sure why it reached this log..')
      }
   }
    updateDB()
  }, [items])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            'Authorization': 'Bearer ' + bT
          }
        });
          const Items = await response.json();
           if (Items) {
            console.log(Items)
          const items = Items
         
          setItems(items);    
        } else {
          setItems([])
        }
        
      } catch (err) {
        console.log(err.stack);
      }
    };
    fetchItems();
  }, []);

  const addItem = (item) => {    
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = {
      "name": item,
      "id": id,
      "checked": false
    } 
    setNewItem(myNewItem)
    const listItems = [...items, myNewItem];
    setReqType(myNewItem)
    setItems(listItems);
  }

  const handleCheck = (id) => {
    setReqType('PUT')
    const listItems = items.map(item => item.id === id ? {
      "name": item.name,
      "id": id,
      "checked": !item.checked
    }  : item);
    setItems(listItems);
  }

  const handleDelete = async (id) => {
    
    const listItems = items.filter(item => item.id !== id);
    
    await fetch("https://axiomatic-marshy-galley.glitch.me/groceries", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
       'Authorization': 'Bearer ' + bT
      },
      body: JSON.stringify({
         "id": id
      })
    }
    )
    //setReqType('PUT')
    setItems(listItems);

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    addItem(newItem);
  }
   

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
       
      />
      <SearchItem
        items={items}
        search={search}
        setSearch={setSearch}
      />
      <Content
        search={search}
        handleCheck={handleCheck}
        handleDelete={handleDelete}
        items={items}
        
      />
      <Footer length={items.length} />
    </div>
  );
}

export default App;
