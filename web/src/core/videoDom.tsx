import { createElement, forwardRef, useImperativeHandle, useRef } from "react";

const VideoDom = ()=>{
    const ref = useRef<HTMLVideoElement|null>(null)
    useImperativeHandle(ref,()=>({
        play:()=>{
            ref.current?.play()
            return void
        }
    }))
    return <video ref={ref}/>
}

export default forwardRef(VideoDom);
