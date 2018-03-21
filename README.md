# Firebase-Firestore-Observer
Framework/Library-agnostic convenience for setting listeners on a collection, defaulting to Mithril

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

## Basic Example

If you're using Mithril, this is all you need to do:

```js

const myLocalArray = [] // could instead be an object

FBObserve('myFirebaseCollectionName', myLocalArray)

```

In this case, `myLocalArray` will be populated with the documents in the firebase collection, normalized to the format

`{ id: doc.id, data: doc.data() }`

Modifications to the remote collection will be automatically reflected locally.

## Custom Example

If the out-of-the-box configuration doesn't fit your needs, you have several options:

1. If you want to overwrite a specific property of a local object, instead of a local collection you pass an object in the form `{ FBLocalObject: myTargetObject, FBLocalProp: myPropName }`
2. If you're not using Mithril, pass a different `redrawFn` to the `options` argument
3. If you want a `condition` on your query, you'll need to pass it to `options` as `[ prop, comparison, value ]`
4. If you want to perform custom operations with the raw firebase data, pass a custom `crudFn` to `options`
5. You can also pass a nullary callback which will fire after each `crud` operation

```js
const myBigStateObject = { user: someUser }

// set up a crud function which will handle 'added', 'modified', and 'removed', e.g.
const crud = (change) => {
    const id = change.doc.id
    const data = change.doc.data()
    
    switch(change.type) {
        case 'added':
            doMyCustomItemAddedThings(data)
            break
        case 'modified': 
            doMyCustomItemModifiedThings(data)
            break
        case 'removed': {
            doMyCustomItemRemovedThings(data)
        }
    }
    
    // must return a promise
    return new Promise((r) => r()).then(myCustomCallback)
}

FBObserve(
    'myRemoteCollectionName',
    { FBLocalObject: myBigStateObject, FBLocalProp: 'user' },
    {
        redrawFn: myNonMithrilRedrawFn,
        condition: [ 'id', '==', myAlreadyKnownIdOrWhatever ],
        crudFn: crud,
        callback: () => { console.log("Ok, crud's done, I'm OUTTA HERE.") }
    }
)

```

## API

#### Signature

`FBObserve(collectionName, target, options)`

| Argument | Type                 | Required | Description |
| :---------- | :-------------------- | :---------- | :---------- |
| collectionName  | String | Yes | Name of Firebase Collection |
| target | Array \| Object | Yes | Either the target object for results, or `{ FBLocalObject, FBLocalProp }` |
| options | Object  | No | _see table below_  |

#### Options

| Property | Type | Description |
| :-------- | :-------- | :---------- |
| redrawFn | Function | non-Mithril redraw function |
| condition | Array | query condition arguments, e.g.`[ 'id', '==', myUserId  ]` |
| crudFn | Function | custom CRUD operations, see "Custom Example" above |
| callback | Function | deferred operation to run after CRUD |

## DEMO

[Firebase-Firestore-Observer at flems.io](https://tinyurl.com/ycyxrzo5)

A single dataset is used in 3 different approaches: MithrilJS, ReactJS, and VanillaJS. Each features its own implementations of view and redraw, and has its own local datastore, and each is updated properly when anything happens in the cloud. I'm not gonna host your data, so if you want to see this working you need to set yourself up a firebase-firestore project and enter your own firebase initialization values.
