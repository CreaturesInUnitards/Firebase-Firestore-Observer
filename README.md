# Firebase-Firestore-Observer
Framework/Library-agnostic convenience for setting listeners on a collection

## USAGE

[Set yourself up a Firebase Cloud Firestore project.](https://console.firebase.google.com/)

You'll need to have your firebase app initialized, e.g.
```js

firebase.initializeApp({
    apiKey: YOUR_API_KEY,
    authDomain: YOUR_AUTH_DOMAIN,
    projectId: YOUR_PROJECT_ID
})


```

Then you just need:
1. a local container to hold your collection data
2. a CRUD function which accepts object id, object data, and change type

```js

const myLocalArray = []

// set up a crud function which will handle 'added', 'modified', and 'removed', e.g.
const crud = (id, data, type) => {
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
}

// call FBObserve on page load, or component mount, or whenever makes sense
// pass in collection name, crud function, and the appropriate method for redrawing your view
const myComponentIsAvailableCallback = () => {
    FBObserve( 'Name_of_My_Collection', myCrudFunction, myRedrawFunction )
}

```

## DEMO

A single dataset is used in 3 different approaches: MithrilJS, ReactJS, and VanillaJS. Each features is own implementations of view, crud and redraw. Each is updated when anything happens do the data.
