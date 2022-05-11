import express ,{ Application,Request,Response,NextFunction} from "express";
import axios from 'axios';
import * as crypto from "crypto-js";
import config from "./config";

const app:Application = express()




app.post('/api/market/ticker',express.json(),async(req:Request,res:Response)=>{
    const ret = await axios.get('https://api.bitkub.com/api/market/ticker',{params:{sym:req.body.sym}})
    const sym = Object.keys(ret.data)
    const {change,prevClose,prevOpen,...other}= ret.data[sym[0]]
    other.sym = sym[0]
    res.send(other)
    
})
app.post('/api/market/place-bid/test',express.json(),async(req:Request,res:Response)=>{
    const {sym,amt,rat,} = req.body
    
    const ts = await axios.get('https://api.bitkub.com/api/servertime')
    const data ={sym,amt,rat,typ:"limit",ts:ts.data}
    const sig = crypto.HmacSHA256(JSON.stringify(data),config.apiSecret).toString(crypto.enc.Hex)
    const finalData = {...data, sig}
    try{
        const ret = await axios ({
            method:"post",
            url: 'https://api.bitkub.com/api/market/place-bid/test',
            data:{...finalData},
            headers:{"X-BTK-APIKEY":config.apiKey,"Accept": "application/json","Content-type": "application/json"}
        })
        res.send(ret.data)
        return
    }
    catch(err){
        console.log(err)
        res.send(err)
        
    }
   



    
})
app.listen(8080, ()=> console.log("server up at 6969"))