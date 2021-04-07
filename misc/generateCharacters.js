let strings = []
let i = 33
while (i < 126) {
	strings.push(String.fromCharCode(i))
	i++
}

i = 161
while (i < 255) {
	strings.push(String.fromCharCode(i))
	i++
}

console.log(strings.length)
console.log(JSON.stringify(strings))