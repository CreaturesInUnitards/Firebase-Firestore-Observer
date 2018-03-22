const FBObserve = (collectionName, target, options) => {
	const targetObj = typeof target.FBLocalObject == 'undefined' ? target : target.FBLocalObject
	const prop = target.FBLocalProp
	if (target.FBLocalObject && !prop) throw new Error('FBObserver received FBLocalObject without FBLocalProp.')

	const redraw = (options && options.redrawFn) ? options.redrawFn : typeof m != 'undefined' ? m.redraw : () => { 
		throw new Error("FBObserver needs a valid redraw function")
	}
	
	const condition = options.condition
	const crudFn = options.crudFn || crud
	
	const coll = firebase.firestore().collection(collectionName)
	const ref = condition ? coll.where(condition[0], condition[1], condition[2]) : coll
	
	ref.onSnapshot((snap) => {
		snap.docChanges.forEach(change => {
			(new Promise(resolve => { (crudFn || crud)(change).then(resolve) }))
				.then(options.callback && options.callback.bind(null, change))
				.then(redraw)
				.catch((e) => console.log(e, 'Your CRUD function must return a promise.'))
		})
	})
	
	function crud(change) {
		const id = change.doc.id
		const data = change.doc.data()
		const isArray = Array.isArray(targetObj)
		const existing = isArray ? targetObj.find((obj) => obj.id === id) : targetObj[id]

		switch(change.type) {
			case 'added':
				const o = {id: id, data: data}
				if (isArray) targetObj.push(o)
				else targetObj[prop || id] = o
				break
			case 'modified': {
				if (existing) {
					existing.data = data
					break
				}
			}
			case 'removed': {
				if (existing) {
					if (isArray) targetObj.splice(targetObj.indexOf(existing), 1)
					else delete targetObj[prop || id]
				}
			}
		}
		return new Promise(r => { r() })
	}
}

if (typeof module === 'object') module.exports = FBObserve
else if (typeof window !== 'undefined') window.FBObserve = FBObserve
else global.FBObserve = FBObserve
