"use strict"

class Webpack{
    constructor(){
        this.webpack=require('webpack')
        this.commonsPlugin = new this.webpack.optimize.CommonsChunkPlugin('common.js');
    }
    start(){
        return this.webpack({
            entry:{

            }
        })
    }
}

module.exports=Webpack
