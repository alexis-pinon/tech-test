#! /usr/bin/env node
import {pipeline} from '@xenova/transformers'
import promptSync from 'prompt-sync'
import _ from 'lodash'
 
let classifier = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english')
const prompt = promptSync();
let checkedInput, input

while(1){
    input = prompt("What's your mood? ")

    checkedInput = input ? input : ""
    if(checkedInput==="") break

    var output = await classifier(checkedInput)

    console.log(`This seems ${output[0].label} with a ${ _.round(output[0].score * 100, 2)}% trust score`)
} 