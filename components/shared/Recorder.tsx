"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
export const mimeType = "audio/webm";
interface Props {
  uploadAudio: (blob: Blob) => void;
}

const Recorder = ({ uploadAudio }: Props) => {
  const [permission, setPermission] = useState(false);
  const [streamData, setStreamData] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { pending } = useFormStatus();
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob[]>([]);
  useEffect(() => {
    getHandlePermmision();
  }, []);

  const getHandlePermmision = async () => {
    try {
      if ("MediaRecorder" in window) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setStreamData(stream);
        setPermission(true);
      } else {
        alert("MediaRecorder not supported");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const startRecording = async () => {
    try {
      if (!streamData || pending || mediaRecorder === null) return;

      setIsRecording(true);
      const media = new MediaRecorder(streamData, { mimeType });
      mediaRecorder.current = media;
      mediaRecorder.current.start();

      let localChunks: Blob[] = [];

      mediaRecorder.current.ondataavailable = (evt) => {
        if (evt.data.size === 0) return;
        if (typeof evt.data === "undefined") return;

        localChunks.push(evt.data);
      };
      setAudioBlob(localChunks);
    } catch (error) {
      console.log(error);
    }
  };

  const stopVideo = async () => {
    try {
      if (mediaRecorder.current === null || pending) return;
      setIsRecording(false);
      mediaRecorder.current.stop();
      mediaRecorder.current.onstop = () => {
        const blobAudio = new Blob(audioBlob, { type: mimeType });
        uploadAudio(blobAudio);
        setAudioBlob([]);
      };
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {!permission && <div>Please allow audio recorder</div>}

      {pending && (
        <Image
          src="/assets/images/notactive.png"
          width={150}
          height={150}
          priority
          alt="Siri"
          className="grayscale assistant hover:scale-110 duration-150 transition-all ease-in-out object-contain cursor-pointer"
        />
      )}

      {permission && !isRecording && !pending && (
        <Image
          src="/assets/images/notactive.png"
          width={150}
          height={150}
          priority
          alt="Siri"
          onClick={startRecording}
          className="assistant hover:scale-110 duration-150 transition-all ease-in-out object-contain cursor-pointer"
        />
      )}

      {isRecording && !pending && (
        <Image
          src="/assets/images/active.gif"
          width={150}
          height={150}
          priority
          alt="Siri"
          onClick={stopVideo}
          className="assistant hover:scale-110 duration-150 transition-all ease-in-out object-contain cursor-pointer"
        />
      )}
    </div>
  );
};

export default Recorder;
