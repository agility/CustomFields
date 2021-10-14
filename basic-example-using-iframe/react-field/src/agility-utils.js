const initializeField = ({ fieldTypeName, onReady }) => {
    //get the field ready to wait for messages from the parent
    console.log(`${fieldTypeName} => Waiting for message from Agility CMS`)

    //open a channel to listen to messages from the CMS
    window.addEventListener("message", function (e) {
        //only care about these messages
        if(e.data.type === 'setInitialProps') {
            console.log(`${fieldTypeName} => auth, fieldValue received from Agility CMS, setting up field...`)
            onReady(e.data.message);
            
            // //(optional) auth object contains the websiteName and securityKey which can be used to initialize the Content Management API if needed
            // auth = e.data.message.auth;
            // //set the actual value of the field
            // setValue(e.data.message.fieldValue ? e.data.message.fieldValue : "");
            // //get the parent window URL 
            // parentTarget = e.data.message.origin;
        } else {
            //show us the unhandled message...
            console.log(`${fieldTypeName} => IGNORING MESSAGE FROM PARENT: `, e.data)
        }
    }, false);

    //let the CMS know we are NOW ready to receive messages
    if (window.parent) {
        console.log(`${fieldTypeName} => 😀 Notifying Agility CMS this field is ready to receive messages...`)
        window.parent.postMessage({
            message: "ready",
            type: 'fieldIsReady'
        }, "*")
    } else {
        console.log(`${fieldTypeName} => 😞 Parent window not found. You must load this within Agility CMS as an iFrame.`)
    }
}

const updateFieldValue = ({ value, fieldTypeName }) => {
    if (window.parent) {
        window.parent.postMessage({
            message: value,
            type: 'setNewValueFromCustomField'
        }, "*")
      } else {
        console.log(`${fieldTypeName} => 😞 Can't post message to parent.`)
      }
}

export {
    initializeField,
    updateFieldValue
}