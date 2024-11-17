import { useImperativeHandle, useRef } from "react";
import { Tools } from "./tools";
import { forwardRef } from "react";
import { createRef } from "react";
import { LegacyRef } from "react";
import { computed, makeObservable, observable } from "mobx";

export class VideoController {
    map: Map<string, Video> = new Map()
    get data() {
        return Array.from(this.map.values());
    }
    constructor() {
        makeObservable(this, {
            map: observable,
            data: computed
        })
    }
    create(key: string = "owner") {
        const video = new Video(key)
        this.map.set(key, video)
        return video
    }
}

export class Video {
    _list: any[] = []
    key: string = "";
    _ref: LegacyRef<any> = null;
    constructor(key) {
        this.key = key
    }
    get list() {
        return this._list
    }
    set list(value) {
        this._list = value
    }
    set ref(value) {
        this._ref = value
        console.log("set ref", value)
        console.log(this.list)
        while (this.list.length > 0) {
            const fn = this.list.pop()
            fn(value)
        }
    }
    async play() {
        console.log("play", this.ref)
        // return await this.ref?.current?.play()
    }
    setSrcObject(stream) {
        console.log("JK")
        console.log(this._ref)
        if (this._ref) {
            this._ref.setVideo(stream)
            return
        }
        this._list.push((ref) => {
            console.log("setSrcObject", ref)
            console.log("setSrcObject", stream)
            ref.setVideo(stream)
        })
    }
}