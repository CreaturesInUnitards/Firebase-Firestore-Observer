# Firebase-Firestore-Observer
Framework/Library-agnostic convenience for setting listeners on a collection

## USAGE

If you haven't already, [get yourself a Firebase account and set up a Cloud Firestore project.](https://console.firebase.google.com/)

You'll need to have firebase installed and your firebase app initialized, e.g.
```html
<script src="https://www.gstatic.com/firebasejs/4.9.0/firebase.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.9.0/firebase-firestore.js"></script>
<script>
    firebase.initializeApp({
        apiKey: YOUR_API_KEY,
        authDomain: YOUR_AUTH_DOMAIN,
        projectId: YOUR_PROJECT_ID
    })
</script>
```

Then you just need:
1. FBObserve somewhere
2. A local container to hold your collection data
3. A CRUD function which accepts a firebase ```change``` object and returns a Promise. This function must feature the branching logic for handling the 3 mutation types: 'added', 'modified', and 'removed'.


## EXAMPLE

```js
const FBObserve = require('./FBObserve')
const myLocalArray = []

// set up a crud function which will handle 'added', 'modified', and 'removed', e.g.
const crud = (change) => {
    const id = change.do.id
    const data = change.doc.data()
    const type = change.type
    const existing = myLocalArray.find((obj) => obj.id === id)
    
    switch(type) {
        case 'added':
            myLocalArray.push({id: id, data: data})
            break
        case 'modified': {
            if (existing) {
                existing.data = data
                break
            }
        }
        case 'removed': {
            if (existing) myLocalArray.splice(myLocalArray.indexOf(existing), 1)
        }
    }
    // chain here if you're doing any further async operations
    return new Promise((r) => r())
}

// call FBObserve on page load, or component mount, or whenever makes sense
// pass in collection name, crud function, and the appropriate method for redrawing your view
const myComponentIsAvailableCallback = () => {
    FBObserve( 'Name_of_My_Collection', myCrudFunction, myRedrawFunction )
}

```

## DEMO

A single dataset is used in 3 different approaches: MithrilJS, ReactJS, and VanillaJS. Each features its own implementations of view and redraw, and thusly each is updated when anything happens to the data. I'm not gonna host your data, so if you want to see this working just download (or copy/paste) index.html and enter your own firebase initialization values.
