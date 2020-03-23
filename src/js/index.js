let test = str => {
    return str.split('').reverse().join('')
}

let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(321)
    }, 1000)
})
promise.then(res => {
    console.log(res);
})

module.exports = {
    test
}