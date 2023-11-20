const { HfInference,  } = require('@huggingface/inference')
const dotenv = require('dotenv')
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const cors = require('cors')
const { YoutubeTranscript } = require('youtube-transcript')
const fs = require('fs');


const app = express()
app.use(bodyParser.json({limit:'30mb', extended:true}))
app.use(bodyParser.urlencoded({limit:'30mb', extended:true}))

app.use(cors({origin:'*'}))

dotenv.config()

const hf = new HfInference(process.env.HF_KEY)


app.post('/summarize', async (req, res) => {
    try{
        const data = await YoutubeTranscript.fetchTranscript(req.body.url)
        let text = []
        j = 0
        const segmentCount = 5;
        const elementsPerSegment = Math.ceil(data.length / segmentCount);

        for (let i = 0; i < data.length; i++) {
            const segmentIndex = Math.floor(i / elementsPerSegment);

            if (text[segmentIndex] !== undefined) {
                text[segmentIndex] += data[i].text + ' ';
            } else {
                text[segmentIndex] = data[i].text + ' ';
            }
        }
        let summary = []
        console.log(text.length)
        for (i = 0 ; i < text.length; i++){
            input = text[i]
            input = input.replace(/\n/g, ' ')

            console.log(input.length)
            const response = await hf.summarization({
                model:'sshleifer/distilbart-cnn-12-6',
                inputs:input,
                parameters:{
                    max_length:250,
                    min_length:200
                }
            })
            //console.log(response)
            summary[i] = response.summary_text

        }
        res.status(200).json(summary)
    } catch (e) {
        console.log(e)
        res.status(500).json({msg:e?.message})
    }
})




let PORT = process.env.PORT || 2000
app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
})

