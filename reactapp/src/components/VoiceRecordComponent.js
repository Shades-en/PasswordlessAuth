import React, { useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import AppNameComponent from './AppNameComponent';
import RecoveryComponent from './recoveryComponent';

const VoiceRcordComponent = () => {

    const navigate = useNavigate();

    const [id, setId] = useState('')
    const [recorder, setRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showComponent, setShowComponent] = useState(false);
    const [recMail, setRecMail] = useState('');
    const [recPhone, setRecPhone] = useState('');
    let [state, setState] = useState(useParams().state)
  
    window.appid = useParams().id

    useEffect(() => {
      const endpoint = process.env.REACT_APP_BASE_API + '/api/get_app/'.concat(window.appid)
      axios.get(endpoint)
      .then((res) => {
          window.appname = res.data.app_name
          console.log(window.appname)
          setId(window.appname)
      })
      .catch((err) => console.log(err))

      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        setRecorder(new MediaRecorder(stream));
      });
    },[])

  
    function goBack(){
      let link = '/'.concat(window.appid).concat('/').concat(state)
      navigate(link);
    }

    function recovery(e){
      e.preventDefault();
      setShowComponent(true);
    }

    const startRecording = () => {
      setIsRecording(true);
      setIsPlaying(false);
      recorder.start();
    };
  
    const stopRecording = () => {
      setIsRecording(false);
      recorder.stop();
    };
  
    const recordAgain = () => {
      setAudioBlob(null);
      setAudioUrl(null);
    };
  
    const handleDataAvailable = (event) => {
      setAudioBlob(event.data);
      setAudioUrl(URL.createObjectURL(event.data));
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('voice_image', audioBlob, "recording.wav");
      formData.append("recovery_email", recMail);
      formData.append("recovery_phone_number", recPhone);
      formData.append('username', localStorage.getItem('username'));
      try{
        let response = await fetch( process.env.REACT_APP_BASE_API + '/api/signup-voice-auth', {
        method: 'POST',
        body: formData,
        })
        let json = await response.json();
        console.log(json);
      }
      catch(err){
        console.log(err);
      }
    };
  
    useEffect(() => {
      if (recorder) {
        recorder.addEventListener('dataavailable', handleDataAvailable);
      }
      return () => {
        if (recorder) {
          recorder.removeEventListener('dataavailable', handleDataAvailable);
        }
      };
    }, [recorder]);
    
  
    return (
      <div className='h-screen bg-black overflow-auto'>
        <AppNameComponent />
        {state==='login' && <p className='font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>{ id }</p>}
        {localStorage.getItem('username') && <p className='font-bold leading-tight tracking-tight text-gray-400 mb-8 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>Username : {localStorage.getItem('username')}</p>}
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <div className="w-[22em] h-[25em] bg-gray-800 p-2 mb-2 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-center items-center">
            {state==='signup' && <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 pb-10 md:text-3xl dark:text-white'>Register your Voice</h1>}
            {state==='login' && <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 pb-10 md:text-3xl dark:text-white'>Verify your Voice</h1>}
            <form className='p-3 flex flex-col justify-center items-center'>
              {audioUrl && (
                <div>
                  <audio src={audioUrl} controls />
                </div>
              )}
              {!audioUrl && (
                <button 
                  onClick={startRecording}
                  disabled={isRecording}
                  type="button"
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
                  {isRecording ? 'Recording...' : 'Start Recording'}
                </button>
              )}
              {isRecording && (
                <button 
                  onClick={stopRecording}
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  className="inline-block rounded bg-gray-800 px-6 pt-2.5 mt-8 pb-2 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
                  Stop Recording</button>
              )}
              {audioUrl && (
                <button
                  onClick={recordAgain}
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  className="inline-block rounded bg-gray-800 px-6 pt-2.5 mt-6 pb-2 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
                  Record Again</button>
              )}
              {audioUrl && (
                <button 
                  type='submit'
                  onClick={recovery}
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 mt-6 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
                  Next</button>
              )}
            </form>
          </div>
          <div className='flex space-x-4'>
            <button type='button'
              onClick={goBack}
              data-te-ripple-init
              data-te-ripple-color="light"
              className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 mt-6 mb-4 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
              Back
            </button>
          </div>
        </div>
        {showComponent && <RecoveryComponent submission = {handleSubmit} setRecMail={setRecMail} setRecPhone={setRecPhone}/>}

      </div>
      
    );
  }
 
export default VoiceRcordComponent;
