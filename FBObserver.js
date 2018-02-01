;(() => {
    const FBObserve = (collectionName, crudFn, redrawFn) => firebase.firestore().collection(collectionName)
        .onSnapshot((snap) => {
            snap.docChanges.forEach((change) => {
                (new Promise((resolve) => { crudFn(change).then(resolve) }))
                .then(redrawFn).catch((e) => console.log(e, 'Your CRUD function must return a promise.'))
            })
        })

    if (typeof module === 'object') module.exports = FBObserve
    else if (typeof window !== 'undefined') window.FBObserve = FBObserve
    else global.FBObserve = FBObserve
})()
