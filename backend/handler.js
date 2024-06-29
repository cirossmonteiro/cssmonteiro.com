module.exports.connectionHandler = (e) => {
    console.log("2 connected");
    return;
}

module.exports.defaultHandler = () => {
    console.log("6 send");
}

module.exports.fooHandler = () => {
    console.log("10 send");
}