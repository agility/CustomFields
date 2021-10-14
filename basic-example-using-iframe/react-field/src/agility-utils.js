const initializeField = ({ fieldTypeName, onReady }) => {
    //get the field ready to wait for messages from the parent
    console.log(`${fieldTypeName} => Waiting for message from Agility CMS`)

    //open a channel to listen to messages from the CMS
    window.addEventListener("message", function (e) {
        //only care about these messages
        if(e.data.type === 'setInitialProps') {
            console.log(`${fieldTypeName} => auth, fieldValue received from Agility CMS, setting up field...`)
            onReady(e.data.message);
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

const updateFieldHeight = ({ height }) => {
    if (window.parent) {
        window.parent.postMessage({
            message: height,
            type: 'setHeightCustomField'
        }, "*")
    }
}

const openFlyout = ({flyoutTitle, flyoutSize, iFrameUrl, iFrameWidth, iFrameHeight }) => {
    //todo: implement function to open a flyout in the CMS and load another iframe
}

const closeFlyout = ({ flyoutID }) => {
    //todo: implement function to close a flyout in the CMS
}

export {
    initializeField,
    updateFieldValue,
    updateFieldHeight
}