let db;

const request = indexedDB.open('budget-boss', 1);


request.onupgradeneeded = function(event) {

    const db = event.target.result;

    db.createObjectStore('new_input', { autoIncrement: true });
  };


request.onsuccess = function(event) {

    db = event.target.result;
  

    if (navigator.onLine) {
      // we haven't created this yet, but we will soon, so let's comment it out for now
      // uploadPizza();
    }
  };
  
  request.onerror = function(event) {

    console.log(event.target.errorCode);
  };


function saveRecord(record) {

    const transaction = db.transaction(['new_input'], 'readwrite');
  

    const bossObjectStore = transaction.objectStore('new_input');
  

    inputObjectStore.add(record);
  }

  function uploadTransaction() {

    const transaction = db.transaction(['new_input'], 'readwrite');
  

    const bossObjectStore = transaction.objectStore('new_input');
  

    const getAll = bossObjectStore.getAll();
  

getAll.onsuccess = function() {

    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(['new_input'], 'readwrite');

          const bossObjectStore = transaction.objectStore('new_input');

          bossObjectStore.clear();

        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  }

  // listen for app
  window.addEventListener('online', uploadTransaction);