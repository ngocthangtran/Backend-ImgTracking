const fs = require('fs');
const db = require('../database/db');
const { query } = require('express');
const cn = db.createConnection();
const domain = 'http://localhost:3000'

function getImage(req, res) {
    const nameImg = req.params.name;
    res.sendFile(path.resolve(`./upload/image/${nameImg}`),{ 'Content-Type': 'image/jpeg' });
}

function getImgAsset(req, res){
    const sql = 'SELECT * FROM image';
    cn.query(sql, (err, result)=>{
        if(err) return res.status(400).send(err);
        res.status(200).send(result);
    })
}

function getVideo(req, res) {
    const nameVideo = req.params.name;
    const pathVideo = "./upload/videos/" + nameVideo;
    console.log(pathVideo); 
    fs.readFile(pathVideo, (err, dataVideo) => {
        if (err) return res.status(404).send(err);
        res.writeHead(200, { 'Content-Type': 'video/mp4' })
        res.end(dataVideo);
    })
}

function getVideoAsset(req, res){
    const sql = 'SELECT * FROM videos';
    cn.query(sql, (err, result)=>{
        if(err) return res.status(400).send(err);
        res.status(200).send(result);
    })
}

function getNftFile(req, res) {
    const pathImg = './upload/nftfile/' + req.params.name;
    console.log(pathImg);
    const file = pathImg;
    res.setHeader('Content-disposition', 'attachment; filename=' + file);
    res.download(file, (err) => {
        return res.status(404).send(err);
    }); // Se t disposition and send it.
}

function getLink(req, res) {
    const name = req.params.name;
    console.log(`./upload/nftfile/${name}.fset`)
    fs.exists(`./upload/nftfile/${name}.fset`, exit => {
        if (exit) {
            const api = {
                fset: `${domain}/getcontent/nftfile/${name}.fset`,
                fset3: `${domain}/getcontent/nftfile/${name}.fset3`,
                iset: `${domain}/getcontent/nftfile/${name}.iset`,
            }
            return res.status(200).send(api);
        }
        res.status(404).send({
            message: "Không có các file cần tìm"
        })
    })
}

module.exports = {
    getImage,
    getVideo,
    getNftFile,
    getLink,
    getImgAsset,
    getVideoAsset
}