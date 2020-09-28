var stringname = "\"role\":1,\"cmd\":2,\"data_size\":2,\"data\":[\"Client0\",\"Rev 1.0\"]";
var communicationFrame = null;
var regex = /:|\"|,/;
communicationFrame = stringname.split(regex);
console.log(communicationFrame);