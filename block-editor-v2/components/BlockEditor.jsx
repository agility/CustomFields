import React, { useState, useEffect, useRef } from "react"
import EditorJS from '@editorjs/editorjs'
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Paragraph from '@editorjs/paragraph'
import Warning from '@editorjs/warning'
import Code from '@editorjs/code'

import Image from '@editorjs/image'
import Raw from '@editorjs/raw'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import NestedList from '@editorjs/nested-list';
import DragDrop from 'editorjs-drag-drop';

const BlockEditor = () => {

	const [value, setValue] = useState("")
	const [height, setHeight] = useState(500)
	const containerRef = useRef()
    let auth = null;
    let editor = null;

    useEffect(() => {
        console.log('Block Editor => Waiting for message from Agility CMS')
        window.addEventListener("message", function (e) {
            
            //only care about these messages
            if(e.data.type === 'setAuthForCustomField') {
                console.log('Block Editor => Auth received from Agility CMS, setting up editor...')
                auth = e.data.message;
                editor = setupEditor(auth, height, value, setValue, setHeight, containerRef);
            } else if (e.data.type === 'setInitialValueForCustomField') {
                if (value !== e.data.message) {
                    setValue(e.data.message)

                    editor.isReady.then(() => {
                        console.log('Block Editor => Editor initialized, setting content, syncing height...')
                        //wait for the editor to be ready...
                        if (e.data.message && e.data.message.length > 0) {
                            const blocks = JSON.parse(e.data.message)
                            editor.render(blocks)

                            //wait 200ms for initial height-sync
                             this.setTimeout(function() {
                                 heightChanged(containerRef.current.offsetHeight, height, setHeight)
                             }, 200)

                            //sync height every second
                            this.setInterval(function () {
                                heightChanged(containerRef.current.offsetHeight, height, setHeight)
                            }, 500)
                        }

                    })
                }
            } else {
                //show us the unhandled message...
                console.log("Block Editor => UNHANDLED MESSAGE FROM PARENT: ", e.data)
            }
        }, false);

        if (window.parent) {
            console.log("Block Editor => Notifying CMS this field is ready to receive messages...")
            window.parent.postMessage({
                message: "😀",
                type: 'fieldIsReady'
            }, "*")
        } else {
            console.log("can't post message to parent :(")
        }

    }, []);

	return (
		<div style={{ background: "#fff", padding: '0 10px' }}>
            <span style={{ 'font-size': '12px', background: '#fbe6ab', color: '#fb8b00', 'border-radius': '5px', padding: '3px 4px', display: 'inline-block', 'font-weight': '500'}}>Block Editor (Experimental) | <a href="https://github.com/agility/CustomFields/issues" style={{ 'text-decoration': 'underline'}}>Submit issue</a> 🐛</span>
			<div id="editorjs" ref={containerRef}>

			</div>
		</div>

	);

}

const setupEditor = (auth, height, value, setValue, setHeight, containerRef) => {
    
    const tools = {
        //autofocus: true - //doesn't work
        table: Table,
        paragraph: {
            class: Paragraph,
            inlineToolbar: true,
        },
        list: {
            class: NestedList,
            inlineToolbar: true
        },
        warning: Warning,
        code: Code,
        image: {
            class: Image,
            config: {
                endpoints: {
                    byFile: '/api/uploadFile',
                    byUrl: '/api/fecthUrl'
                },
                additionalRequestData: auth
            }
        },
        raw: Raw,
        header: Header,
        quote: Quote,
        marker: Marker,
        checklist: CheckList,
        delimiter: Delimiter,
        inlineCode: InlineCode,
        embed: Embed
        
    }


    const editor = new EditorJS({
        /**
         * Id of Element that should contain Editor instance
         */
        autofocus: true,
        placeholder: "Enter your Rich Text here",
        holder: 'editorjs',
        tools,
        onChange: () => {

            editor.save().then(outputValue => {
                const v = JSON.stringify(outputValue)
                valueChanged(v, value, setValue)
                heightChanged(containerRef.current.offsetHeight, height, setHeight)

            })

        },
        onReady: () => {
            new DragDrop(editor);
        }

    });

    return editor;
}

const heightChanged = (h, height, setHeight) => {
    if (h === height) return

    setHeight(h)

    if (window.parent) {
        window.parent.postMessage({
            message: h,
            type: 'setHeightCustomField'
        }, "*")
    }

}

const valueChanged = (val, value, setValue) => {

    if (val === value) return

    setValue(val)
    if (window.parent) {
        console.log("posting message to parent...")
        window.parent.postMessage({
            message: val,
            type: 'setNewValueFromCustomField'
        }, "*")
    } else {
        console.log("can't post message to parent :(")
    }
}

export default BlockEditor