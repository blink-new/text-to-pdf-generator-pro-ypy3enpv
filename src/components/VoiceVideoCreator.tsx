import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Square, Download, Upload, Video, FileText, Volume2, Settings, Radio } from 'lucide-react';
import { openRouterService } from '../services/openRouterService';

interface VoiceRecording {
  id: string;
  name: string;
  duration: number;
  audioBlob: Blob;
  transcript: string;
  createdAt: string;
}

interface VideoScript {
  id: string;
  title: string;
  script: string;
  duration: string;
  scenes: ScriptScene[];
  createdAt: string;
}

interface ScriptScene {
  id: string;
  type: 'intro' | 'main' | 'outro';
  content: string;
  duration: number;
  visualCues: string[];
}

const VoiceVideoCreator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'voice' | 'video'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [videoScripts, setVideoScripts] = useState<VideoScript[]>([]);
  const [currentPlayback, setCurrentPlayback] = useState<string | null>(null);
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);
  
  // Video Script Generator
  const [scriptTopic, setScriptTopic] = useState('');
  const [scriptDuration, setScriptDuration] = useState('60');
  const [scriptStyle, setScriptStyle] = useState('educational');
  const [scriptAudience, setScriptAudience] = useState('general');
  const [generatingScript, setGeneratingScript] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const transcribeRecording = async (recording: VoiceRecording) => {
    setTranscriptionLoading(true);
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const base64Data = dataUrl.split(',')[1];
        
        try {
          const transcript = await openRouterService.transcribeAudio(base64Data);
          
          // Update recording with transcript
          setRecordings(prev => 
            prev.map(r => 
              r.id === recording.id 
                ? { ...r, transcript } 
                : r
            )
          );
        } catch (error) {
          console.error('Transcription error:', error);
          // Fallback transcript
          setRecordings(prev => 
            prev.map(r => 
              r.id === recording.id 
                ? { ...r, transcript: 'Transcription failed. Please try again.' } 
                : r
            )
          );
        }
      };
      reader.readAsDataURL(recording.audioBlob);
    } catch (error) {
      console.error('Error transcribing:', error);
    } finally {
      setTranscriptionLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const recording: VoiceRecording = {
          id: Date.now().toString(),
          name: `Recording ${recordings.length + 1}`,
          duration: recordingTime,
          audioBlob,
          transcript: '',
          createdAt: new Date().toISOString()
        };

        setRecordings(prev => [...prev, recording]);
        
        // Auto-transcribe
        await transcribeRecording(recording);
        
        // Reset
        setRecordingTime(0);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const playRecording = (recording: VoiceRecording) => {
    if (currentPlayback === recording.id) {
      // Stop current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setCurrentPlayback(null);
    } else {
      // Start new playback
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(URL.createObjectURL(recording.audioBlob));
      audioRef.current = audio;
      
      audio.onended = () => {
        setCurrentPlayback(null);
      };
      
      audio.play();
      setCurrentPlayback(recording.id);
    }
  };

  const downloadRecording = (recording: VoiceRecording) => {
    const url = URL.createObjectURL(recording.audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.name}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateVideoScript = async () => {
    if (!scriptTopic.trim()) return;
    
    setGeneratingScript(true);
    try {
      const prompt = `Create a ${scriptDuration}-second ${scriptStyle} video script about "${scriptTopic}" for ${scriptAudience} audience. Include:
      1. Engaging hook (first 5 seconds)
      2. Main content with clear structure
      3. Strong call-to-action
      4. Visual cues and scene descriptions
      5. Estimated timing for each section
      
      Format as a professional video script with scene breaks and visual directions.`;

      const scriptContent = await openRouterService.generateContent(prompt, 'qwen/qwen3-235b-a22b');
      
      const newScript: VideoScript = {
        id: Date.now().toString(),
        title: scriptTopic,
        script: scriptContent,
        duration: `${scriptDuration}s`,
        scenes: [
          {
            id: '1',
            type: 'intro',
            content: 'Hook and introduction',
            duration: 5,
            visualCues: ['Close-up shot', 'Engaging background']
          },
          {
            id: '2',
            type: 'main',
            content: 'Main content delivery',
            duration: parseInt(scriptDuration) - 10,
            visualCues: ['Medium shot', 'Supporting graphics']
          },
          {
            id: '3',
            type: 'outro',
            content: 'Call-to-action and closing',
            duration: 5,
            visualCues: ['Call-to-action overlay', 'Subscribe button']
          }
        ],
        createdAt: new Date().toISOString()
      };
      
      setVideoScripts(prev => [...prev, newScript]);
      setScriptTopic('');
    } catch (error) {
      console.error('Error generating script:', error);
      alert('Failed to generate script. Please try again.');
    } finally {
      setGeneratingScript(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Voice & Video Creator
          </h1>
          <p className="text-gray-600">Record voice content and generate video scripts with AI</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8 w-fit">
          <button
            onClick={() => setActiveTab('voice')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'voice'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Mic className="w-5 h-5" />
              <span>Voice Recorder</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'video'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5" />
              <span>Video Scripts</span>
            </div>
          </button>
        </div>

        {activeTab === 'voice' && (
          <div className="space-y-8">
            {/* Voice Recorder */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="text-center">
                <div className="mb-8">
                  <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    isRecording 
                      ? 'bg-red-100 animate-pulse' 
                      : 'bg-gray-100'
                  }`}>
                    {isRecording ? (
                      <Radio className={`w-16 h-16 ${isPaused ? 'text-orange-500' : 'text-red-500'}`} />
                    ) : (
                      <Mic className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
                    {formatTime(recordingTime)}
                  </div>
                  
                  <div className="text-gray-600">
                    {isRecording 
                      ? (isPaused ? 'Recording Paused' : 'Recording...') 
                      : 'Ready to Record'
                    }
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex items-center space-x-2 bg-red-500 text-white px-8 py-4 rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <Mic className="w-6 h-6" />
                      <span className="font-medium">Start Recording</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={pauseRecording}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-colors shadow-lg ${
                          isPaused 
                            ? 'bg-green-500 text-white hover:bg-green-600' 
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                      >
                        {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                        <span>{isPaused ? 'Resume' : 'Pause'}</span>
                      </button>
                      
                      <button
                        onClick={stopRecording}
                        className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors shadow-lg"
                      >
                        <Square className="w-5 h-5" />
                        <span>Stop</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Recordings List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Your Recordings</h3>
              </div>
              <div className="p-6">
                {recordings.length === 0 ? (
                  <div className="text-center py-12">
                    <Volume2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No recordings yet. Start recording to see them here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recordings.map(recording => (
                      <div key={recording.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{recording.name}</h4>
                            <p className="text-sm text-gray-600">
                              {formatTime(recording.duration)} • {new Date(recording.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => playRecording(recording)}
                              className={`p-2 rounded-lg transition-colors ${
                                currentPlayback === recording.id
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {currentPlayback === recording.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                            </button>
                            <button
                              onClick={() => downloadRecording(recording)}
                              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        
                        {recording.transcript && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h5 className="font-medium text-gray-900 mb-2">Transcript:</h5>
                            <p className="text-sm text-gray-700">{recording.transcript}</p>
                          </div>
                        )}
                        
                        {transcriptionLoading && !recording.transcript && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">Transcribing audio...</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="space-y-8">
            {/* Video Script Generator */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Generate Video Script</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Topic</label>
                  <input
                    type="text"
                    value={scriptTopic}
                    onChange={(e) => setScriptTopic(e.target.value)}
                    placeholder="e.g., How to start a successful online business"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
                  <select
                    value={scriptDuration}
                    onChange={(e) => setScriptDuration(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="30">30 seconds</option>
                    <option value="60">60 seconds</option>
                    <option value="90">90 seconds</option>
                    <option value="120">2 minutes</option>
                    <option value="300">5 minutes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                  <select
                    value={scriptStyle}
                    onChange={(e) => setScriptStyle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="educational">Educational</option>
                    <option value="entertaining">entertaining</option>
                    <option value="promotional">Promotional</option>
                    <option value="storytelling">Storytelling</option>
                    <option value="tutorial">Tutorial</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <select
                    value={scriptAudience}
                    onChange={(e) => setScriptAudience(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="general">General Audience</option>
                    <option value="business">Business Professionals</option>
                    <option value="students">Students</option>
                    <option value="entrepreneurs">Entrepreneurs</option>
                    <option value="creators">Content Creators</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={generateVideoScript}
                disabled={generatingScript || !scriptTopic.trim()}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingScript ? 'Generating Script...' : 'Generate Video Script'}
              </button>
            </div>

            {/* Generated Scripts */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Your Video Scripts</h3>
              </div>
              <div className="p-6">
                {videoScripts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No scripts generated yet. Create your first video script above.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {videoScripts.map(script => (
                      <div key={script.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{script.title}</h4>
                            <p className="text-sm text-gray-600">
                              {script.duration} • {new Date(script.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-gray-900 mb-2">Script:</h5>
                          <div className="text-sm text-gray-700 whitespace-pre-wrap">{script.script}</div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {script.scenes.map(scene => (
                            <div key={scene.id} className="border border-gray-200 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-indigo-600 uppercase">{scene.type}</span>
                                <span className="text-xs text-gray-500">{scene.duration}s</span>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{scene.content}</p>
                              <div className="flex flex-wrap gap-1">
                                {scene.visualCues.map((cue, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                    {cue}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceVideoCreator;