let a = {
	a: "apple",
	value: "apple"
}

b = { ...a }

b.a = "ball"

console.log(a)
console.log(b)
let { value } = a
console.log({ value })


// return {
// 	req.operationDoc.parameters.body,
// 	req.operationDoc.parameters.query,
// 	req.operationDoc.parameters.params,
// }