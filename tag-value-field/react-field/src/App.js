import { useEffect, useState, useRef } from 'react';
import './App.css';
import { initializeField, updateFieldValue } from './agility-utils';
import agility from '@agility/content-fetch';

function App() {
  const [tags, setTags] = useState([]);
  const [auth, setAuth] = useState({});
  const [value, setValue] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldID, setFieldID] = useState("");
  const [tagOptions, setTagOptions] = useState([]);
  const containerRef = useRef();


  useEffect(() => {
    initializeField({
      containerRef,
      //when field is ready, get the params (i.e. value and auth) from the CMS
      onReady: (params) => {
          const value = params.fieldValue ? params.fieldValue : '[]';
          setAuth(params.auth);
          setTags(JSON.parse(value));
          setFieldID(params.fieldID);
          setFieldName(params.fieldName);
          setFieldLabel(params.fieldLabel);
          getSetTagOptions({ 
            guid: params.auth.guid,
            apiKey: params.customProps.apiKey,
            contentReferenceName: params.customProps.tagsContentReferenceName,
            languageCode: params.auth.languageCode
           });
      }
    })
  }, []);

  //when tags change, update our field value
  useEffect(() => {
    updateValue();
  }, [tags])

  const getSetTagOptions = async ({ guid, apiKey, languageCode, contentReferenceName}) => {
    const api = agility.getApi({
      guid,
      apiKey,
      isPreview: true
    })

    const tagOptionsResp = await api.getContentList({
      referenceName: contentReferenceName,
      languageCode
    })

    setTagOptions(tagOptionsResp.items);
  }

  const updateValue = () => {
    const newVal = JSON.stringify(tags);
    //update the react state
    setValue(newVal);
    //notify Agility CMS of the new value
    updateFieldValue({ value: newVal, fieldName, fieldID });

    console.log(newVal);
  }

  const updateTagValue = (index, tagValue) => {
    let updatedTags = [...tags];
    let updatedTag = {...updatedTags[index]};
    updatedTag.tagValue = tagValue;
    updatedTags[index] = updatedTag;

    //update react state
    setTags(updatedTags);
    
  }

  const updateTagOption = (index, tagOptValue) => {
    let updatedTags = [...tags];
    let updatedTag = {...updatedTags[index]};
    updatedTag.tagID = parseInt(tagOptValue);
    updatedTags[index] = updatedTag;

    //update react state
    setTags(updatedTags);
  }

  const addTag = () => {
    const newTag = {
      tagID: -1,
      tagValue: ""
    }
    //update react state
    setTags(arr => [...arr, newTag]);
  }

  const removeTag = (index) => {
    let updatedTags = [...tags];
    updatedTags.splice(index, 1);

    //update react state
    setTags(updatedTags);
  }
  

  return (
    <div className="App" ref={containerRef}>
      <label>{fieldLabel}</label>
      <div className="App_table__heading">
        <div className="App_table__heading__col">Value</div>
        <div className="App_table__heading__col">Tag</div>
        <div className="App_table__heading__col">Actions</div>
      </div>
      {tags.map((tag, index) => (
        <div className="App_table__row" key={index}>
          <div className="App_table__row__col">
            <input style={{display: 'block'}} type="text" value={tag.tagValue} onChange={e => updateTagValue(index, e.target.value)} />
          </div>
          <div className="App_table__row__col">
            <select value={tag.tagID} onChange={e => updateTagOption(index, e.currentTarget.value)}>
              {tagOptions.map(opt => (
                <option key={opt.contentID} value={opt.contentID}>
                  {opt.fields.title}
                </option>
                )
              )}
            </select>
          </div>
          <div className="App_table__row__col">
            <button onClick={e => removeTag(index)}>Remove</button>
          </div>
        </div>
        )
      )}
      <button type="button" onClick={addTag}>Add</button>
    </div>
  );
}

export default App;
