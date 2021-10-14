import { useEffect, useState } from 'react';
import './App.css';
import { initializeField, updateFieldValue } from './agility-utils'

function App() {

  const fieldTypeName = 'Basic Custom Field';
  let auth = null;
  const [value, setValue] = useState("");

  useEffect(() => {
    initializeField({
      fieldTypeName,
      //when field is ready, get the params (i.e. value and auth) from the CMS
      onReady: (params) => {
          auth = params.auth;
          //set the actual value of the field
          setValue(params.fieldValue ? params.fieldValue : "");
      }
    })
  }, []);

  const updateValue = (newVal) => {
    //update the react state
    setValue(newVal);

    //notify Agility CMS of the new value
    updateFieldValue({ value: newVal, fieldTypeName });
  }

  return (
    <div className="App">
      <label>
        Basic Custom Field
        <input type="text" value={value} onChange={e => updateValue(e.target.value)} />
      </label>
    </div>
  );
}

export default App;
