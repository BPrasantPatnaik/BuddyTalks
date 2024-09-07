import {useState, useEffect, useRef} from 'react'
// this is to take the permission from the user to access the media devices

const useMediaStream = () => {
    const [state, setState] = useState(null)
    const isStreamSet = useRef(false)

    useEffect(() => {
        if (isStreamSet.current) return;
        isStreamSet.current = true;
        (async function initStream() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                })
                console.log("setting your stream and taking the permissions")
                setState(stream)
            } catch (e) {
                console.log("Error in media navigator", e)
            }
        })()
    }, [])

    return {
        stream: state
    }
}

export default useMediaStream