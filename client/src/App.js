import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState([])
  const [click, setClick] = useState()

  const handleChange = (e) => {
    setUrl(e.target.value)
  }

  const handleEnter = async (e) => {
    setClick(true)
    setSummary([])
    e.preventDefault()
    console.log(url)
    const {data} = await axios.post("http://localhost:2000/summarize",{url:url})
    console.log(data)
    setSummary(data)
  }
  return (
    <div className="App">
    <h2>Enter Youtube Url</h2>
    <h5>Get Summary</h5>
        <form>
          <textarea rows={1} cols={50} value={url} onChange={handleChange}/>
        </form>
          <button onClick={handleEnter}>Enter</button>
          {click?
          summary.length>0?summary.map((line)=><p>{line}</p>):<p>loading...</p>
          :""
          }
    </div>
  );
}

export default App;
