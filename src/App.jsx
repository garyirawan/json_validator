import React, { useState, useEffect, useRef } from 'react';

// Fungsi enkripsi SHA-256 untuk verifikasi integritas berkas murni
async function generateSHA256(text) {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Template bawaan Carousel Arqé untuk inisialisasi awal (Lottie JSON Sederhana)
const defaultLottieJSON = {
  "comment": "contoh json: ", 
  "v":"5.12.1","fr":60,"ip":361,"op":892,"w":1400,"h":1867,"nm":"Pre-comp 1","ddd":0,"assets":[{"id":"image_0","w":3500,"h":2489,"u":"images/","p":"img_0.png","e":0},{"id":"image_1","w":3500,"h":2489,"u":"images/","p":"img_1.png","e":0},{"id":"image_2","w":3500,"h":2489,"u":"images/","p":"img_2.png","e":0},{"id":"image_3","w":3500,"h":2489,"u":"images/","p":"img_3.png","e":0},{"id":"image_4","w":3500,"h":2489,"u":"images/","p":"img_4.png","e":0},{"id":"image_5","w":3500,"h":2489,"u":"images/","p":"img_5.png","e":0},{"id":"image_6","w":3500,"h":2489,"u":"images/","p":"img_6.png","e":0}],"layers":[{"ddd":0,"ind":1,"ty":3,"nm":"NULL Frame 15","sr":1,"ks":{"o":{"a":0,"k":0,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.18,"y":1},"o":{"x":0.9,"y":0},"t":780,"s":[2780,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.28,"y":1},"o":{"x":0.9,"y":0},"t":900,"s":[1736,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.4,"y":1},"o":{"x":0.9,"y":0},"t":1022,"s":[692,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.28,"y":1},"o":{"x":0.62,"y":0},"t":1143,"s":[-352,934,0],"to":[0,0,0],"ti":[0,0,0]},{"t":1263,"s":[-629,934,0]}],"ix":2,"l":2},"a":{"a":0,"k":[50,50,0],"ix":1,"l":2},"s":{"a":0,"k":[100,100,100],"ix":6,"l":2}},"ao":0,"ip":780,"op":4380,"st":780,"bm":0},{"ddd":0,"ind":2,"ty":3,"nm":"NULL Frame 14","sr":1,"ks":{"o":{"a":0,"k":0,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.18,"y":1},"o":{"x":0.9,"y":0},"t":650,"s":[2780,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.28,"y":1},"o":{"x":0.9,"y":0},"t":770,"s":[1736,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.4,"y":1},"o":{"x":0.9,"y":0},"t":892,"s":[692,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.28,"y":1},"o":{"x":0.62,"y":0},"t":1013,"s":[-352,934,0],"to":[0,0,0],"ti":[0,0,0]},{"t":1133,"s":[-629,934,0]}],"ix":2,"l":2},"a":{"a":0,"k":[50,50,0],"ix":1,"l":2},"s":{"a":0,"k":[100,100,100],"ix":6,"l":2}},"ao":0,"ip":650,"op":4250,"st":650,"bm":0},{"ddd":0,"ind":3,"ty":3,"nm":"NULL Frame 13","sr":1,"ks":{"o":{"a":0,"k":0,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.18,"y":1},"o":{"x":0.9,"y":0},"t":520,"s":[2780,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.28,"y":1},"o":{"x":0.9,"y":0},"t":640,"s":[1736,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.4,"y":1},"o":{"x":0.9,"y":0},"t":762,"s":[692,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.28,"y":1},"o":{"x":0.62,"y":0},"t":883,"s":[-352,934,0],"to":[0,0,0],"ti":[0,0,0]},{"t":1003,"s":[-629,934,0]}],"ix":2,"l":2},"a":{"a":0,"k":[50,50,0],"ix":1,"l":2},"s":{"a":0,"k":[100,100,100],"ix":6,"l":2}},"ao":0,"ip":520,"op":4120,"st":520,"bm":0},{"ddd":0,"ind":4,"ty":3,"nm":"NULL Frame 12","sr":1,"ks":{"o":{"a":0,"k":0,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.18,"y":1},"o":{"x":0.9,"y":0},"t":390,"s":[2780,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.28,"y":1},"o":{"x":0.9,"y":0},"t":510,"s":[1736,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.4,"y":1},"o":{"x":0.9,"y":0},"t":632,"s":[692,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.28,"y":1},"o":{"x":0.62,"y":0},"t":753,"s":[-352,934,0],"to":[0,0,0],"ti":[0,0,0]},{"t":873,"s":[-629,934,0]}],"ix":2,"l":2},"a":{"a":0,"k":[50,50,0],"ix":1,"l":2},"s":{"a":0,"k":[100,100,100],"ix":6,"l":2}},"ao":0,"ip":390,"op":3990,"st":390,"bm":0},{"ddd":0,"ind":5,"ty":3,"nm":"NULL Frame 11","sr":1,"ks":{"o":{"a":0,"k":0,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.18,"y":1},"o":{"x":0.9,"y":0},"t":260,"s":[2780,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.28,"y":1},"o":{"x":0.9,"y":0},"t":380,"s":[1736,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.4,"y":1},"o":{"x":0.9,"y":0},"t":502,"s":[692,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.28,"y":1},"o":{"x":0.62,"y":0},"t":623,"s":[-352,934,0],"to":[0,0,0],"ti":[0,0,0]},{"t":743,"s":[-629,934,0]}],"ix":2,"l":2},"a":{"a":0,"k":[50,50,0],"ix":1,"l":2},"s":{"a":0,"k":[100,100,100],"ix":6,"l":2}},"ao":0,"ip":260,"op":3860,"st":260,"bm":0},{"ddd":0,"ind":6,"ty":3,"nm":"NULL Frame 10","sr":1,"ks":{"o":{"a":0,"k":0,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.18,"y":1},"o":{"x":0.9,"y":0},"t":130,"s":[2780,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.28,"y":1},"o":{"x":0.9,"y":0},"t":250,"s":[1736,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.4,"y":1},"o":{"x":0.9,"y":0},"t":372,"s":[692,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.28,"y":1},"o":{"x":0.62,"y":0},"t":493,"s":[-352,934,0],"to":[0,0,0],"ti":[0,0,0]},{"t":613,"s":[-629,934,0]}],"ix":2,"l":2},"a":{"a":0,"k":[50,50,0],"ix":1,"l":2},"s":{"a":0,"k":[100,100,100],"ix":6,"l":2}},"ao":0,"ip":130,"op":3730,"st":130,"bm":0},{"ddd":0,"ind":7,"ty":3,"nm":"NULL Frame 1","sr":1,"ks":{"o":{"a":0,"k":0,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.08,"y":1},"o":{"x":0.9,"y":0},"t":0,"s":[2780,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.28,"y":1},"o":{"x":0.9,"y":0},"t":120,"s":[1736,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.4,"y":1},"o":{"x":0.9,"y":0},"t":242,"s":[692,934,0],"to":[0,0,0],"ti":[0,0,0]},{"i":{"x":0.28,"y":1},"o":{"x":0.62,"y":0},"t":363,"s":[-352,934,0],"to":[0,0,0],"ti":[0,0,0]},{"t":483,"s":[-629,934,0]}],"ix":2,"l":2},"a":{"a":0,"k":[50,50,0],"ix":1,"l":2},"s":{"a":0,"k":[100,100,100],"ix":6,"l":2}},"ao":0,"ip":0,"op":3600,"st":0,"bm":0},{"ddd":0,"ind":8,"ty":2,"nm":"image_7","parent":1,"refId":"image_0","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[50,50,0],"ix":2,"l":2},"a":{"a":0,"k":[1750,1244.5,0],"ix":1,"l":2},"s":{"a":0,"k":[27.141,27.141,100],"ix":6,"l":2}},"ao":0,"ip":0,"op":3600,"st":0,"bm":0},{"ddd":0,"ind":9,"ty":2,"nm":"image_6","parent":2,"refId":"image_1","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[50,50,0],"ix":2,"l":2},"a":{"a":0,"k":[1750,1244.5,0],"ix":1,"l":2},"s":{"a":0,"k":[27.141,27.141,100],"ix":6,"l":2}},"ao":0,"ip":0,"op":3600,"st":0,"bm":0},{"ddd":0,"ind":10,"ty":2,"nm":"image_5","parent":3,"refId":"image_2","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[50,50,0],"ix":2,"l":2},"a":{"a":0,"k":[1750,1244.5,0],"ix":1,"l":2},"s":{"a":0,"k":[27.141,27.141,100],"ix":6,"l":2}},"ao":0,"ip":0,"op":3600,"st":0,"bm":0},{"ddd":0,"ind":11,"ty":2,"nm":"image_4","parent":4,"refId":"image_3","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[50,50,0],"ix":2,"l":2},"a":{"a":0,"k":[1750,1244.5,0],"ix":1,"l":2},"s":{"a":0,"k":[27.141,27.141,100],"ix":6,"l":2}},"ao":0,"ip":0,"op":3600,"st":0,"bm":0},{"ddd":0,"ind":12,"ty":2,"nm":"image_3","parent":5,"refId":"image_4","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[50,50,0],"ix":2,"l":2},"a":{"a":0,"k":[1750,1244.5,0],"ix":1,"l":2},"s":{"a":0,"k":[27.141,27.141,100],"ix":6,"l":2}},"ao":0,"ip":0,"op":3600,"st":0,"bm":0},{"ddd":0,"ind":13,"ty":2,"nm":"image_2","parent":6,"refId":"image_5","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[50,50,0],"ix":2,"l":2},"a":{"a":0,"k":[1750,1244.5,0],"ix":1,"l":2},"s":{"a":0,"k":[27.141,27.141,100],"ix":6,"l":2}},"ao":0,"ip":0,"op":3600,"st":0,"bm":0},{"ddd":0,"ind":14,"ty":2,"nm":"image_1","parent":7,"refId":"image_6","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[50,50,0],"ix":2,"l":2},"a":{"a":0,"k":[1750,1244.5,0],"ix":1,"l":2},"s":{"a":0,"k":[27.141,27.141,100],"ix":6,"l":2}},"ao":0,"ip":0,"op":3600,"st":0,"bm":0},{"ddd":0,"ind":15,"ty":1,"nm":"Dark Gray Solid 1","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[700,933.5,0],"ix":2,"l":2},"a":{"a":0,"k":[960,540,0],"ix":1,"l":2},"s":{"a":0,"k":[188,188,100],"ix":6,"l":2}},"ao":0,"sw":1920,"sh":1080,"sc":"#0a0a0a","ip":0,"op":3600,"st":0,"bm":0}],"markers":[{"tm":781,"cm":"2","dr":0},{"tm":902,"cm":"1","dr":0}],"props":{}
};

// Penjelasan metadata Lottie untuk hover tooltip
const lottieMetadataTooltips = {
  v: {
    letter: "V",
    title: "Versi Lottie (v)",
    description: "Versi spesifikasi parser JSON Lottie yang digunakan After Effects Bodymovin untuk mengekspor animasi vektor."
  },
  fr: {
    letter: "F",
    title: "Frame Rate (fr)",
    description: "Jumlah bingkai per detik (fps) murni yang didefinisikan desainer di After Effects."
  },
  w: {
    letter: "W",
    title: "Width (Lebar Kanvas)",
    description: "Ukuran lebar kanvas visual murni di After Effects dalam satuan piksel."
  },
  h: {
    letter: "H",
    title: "Height (Tinggi Kanvas)",
    description: "Ukuran tinggi kanvas visual murni di After Effects dalam satuan piksel."
  },
  op: {
    letter: "T",
    title: "Total Frames (op)",
    description: "Jumlah total bingkai/frame dari titik awal hingga titik akhir animasi Lottie."
  }
};

export default function App() {
  // --- STATE SYSTEM TOAST NOTIFIKASI SINKRON & AUTO-DISMISS ---
  const [toast, setToast] = useState({
    show: false,
    visible: false, // Digunakan untuk memicu animasi masuk & keluar (fade/slide)
    type: 'info', // 'success' | 'error' | 'warning' | 'info'
    title: '',
    message: '',
    recommendation: ''
  });

  const toastTimerRef = useRef(null);
  const toastExitTimerRef = useRef(null);

  // Fungsi pemicu Toast dengan animasi mulus dan auto-dismiss 5 detik
  const triggerNotification = (title, message, recommendation = '', type = 'info') => {
    // Bersihkan sisa timer sebelumnya jika ada pemicuan beruntun
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (toastExitTimerRef.current) clearTimeout(toastExitTimerRef.current);

    // Render komponen Latar
    setToast({
      show: true,
      visible: false,
      type,
      title,
      message,
      recommendation
    });

    // Jalankan efek transisi Masuk (Slide-In) di frame berikutnya
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: true }));
    }, 50);

    // Memicu animasi Keluar (Slide-Out) pada detik 4.5 (menyisakan 500ms untuk transisi keluar)
    toastExitTimerRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 9500);

    // Menghapus komponen secara penuh dari DOM pada detik ke-5
    toastTimerRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 10000);
  };

  // --- STATE BAGIAN 1 (ATAS): INPUT & EDITING REAL-TIME ---
  const [rawInput, setRawInput] = useState(JSON.stringify(defaultLottieJSON));
  const [refactoredOutput, setRefactoredOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [fileName, setFileName] = useState('carousel_design.json');
  const [inputTab, setInputTab] = useState('paste'); // 'paste', 'upload', 'drive'
  const [driveUrl, setDriveUrl] = useState('');
  
  // State untuk penyeretan berkas utama
  const [isDragging, setIsDragging] = useState(false);
  const [isRefactoring, setIsRefactoring] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false); // State loading untuk Upload & GDrive
  const [copySuccess, setCopySuccess] = useState(false);

  // Validasi sintaksis JSON Real-time
  const [isValidJson, setIsValidJson] = useState(true);
  const [jsonError, setJsonError] = useState('');

  // --- STATE BAGIAN 2 (TENGAH): KOMPARASI INTEGRITAS ---
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [originalHash, setOriginalHash] = useState('');
  const [refactoredHash, setRefactoredHash] = useState('');

  // --- STATE BAGIAN 3 (BAWAH): MULTI PREVIEWS ---
  const [isPlaying, setIsPlaying] = useState(true);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [lottieLoaded, setLottieLoaded] = useState(false);
  
  // State drag and drop Video Referensi (.mp4)
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isVideoDragging, setIsVideoDragging] = useState(false);

  // Refs untuk 2 Container Lottie (Preview Sampingan & Preview Komparasi)
  const lottieContainerRef1 = useRef(null); // Di sebelah Editor
  const lottieContainerRef2 = useRef(null); // Di sebelah Video head-to-head
  const lottieInstance1Ref = useRef(null);
  const lottieInstance2Ref = useRef(null);
  const videoPlayerRef = useRef(null);

  // Load awal format pretty-print saat aplikasi pertama kali dimuat
  useEffect(() => {
    doRefactor(JSON.stringify(defaultLottieJSON), indentSize);
  }, []);

  // Memuat CDN Library Lottie-Web secara dinamis agar aman
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
    script.async = true;
    script.onload = () => setLottieLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Efek Pembangunan & Sinkronisasi DUA Preview Lottie sekaligus dari Editor Real-time
  useEffect(() => {
    if (!lottieLoaded || !isValidJson) return;

    // Hapus instansi lama terlebih dahulu agar tidak tumpang tindih
    if (lottieInstance1Ref.current) lottieInstance1Ref.current.destroy();
    if (lottieInstance2Ref.current) lottieInstance2Ref.current.destroy();

    try {
      const parsedLottie = JSON.parse(refactoredOutput);
      
      if (parsedLottie.layers || parsedLottie.assets) {
        // Render Preview 1 (Sampingan Editor)
        if (lottieContainerRef1.current) {
          lottieInstance1Ref.current = window.lottie.loadAnimation({
            container: lottieContainerRef1.current,
            renderer: 'svg',
            loop: true,
            autoplay: isPlaying,
            animationData: parsedLottie
          });
          lottieInstance1Ref.current.setSpeed(playbackSpeed);
        }

        // Render Preview 2 (Komparasi Video)
        if (lottieContainerRef2.current) {
          lottieInstance2Ref.current = window.lottie.loadAnimation({
            container: lottieContainerRef2.current,
            renderer: 'svg',
            loop: true,
            autoplay: isPlaying,
            animationData: parsedLottie
          });
          lottieInstance2Ref.current.setSpeed(playbackSpeed);
        }
      }
    } catch (e) {
      console.warn("Lottie render skipped: Kode JSON tidak lengkap saat proses pengetikan.");
    }

    return () => {
      if (lottieInstance1Ref.current) lottieInstance1Ref.current.destroy();
      if (lottieInstance2Ref.current) lottieInstance2Ref.current.destroy();
    };
  }, [lottieLoaded, refactoredOutput, isValidJson, isPlaying, playbackSpeed]);

  // Sinkronisasi tombol Play/Pause global
  useEffect(() => {
    const playAll = () => {
      if (lottieInstance1Ref.current) lottieInstance1Ref.current.play();
      if (lottieInstance2Ref.current) lottieInstance2Ref.current.play();
      if (videoPlayerRef.current) videoPlayerRef.current.play().catch(() => {});
    };

    const pauseAll = () => {
      if (lottieInstance1Ref.current) lottieInstance1Ref.current.pause();
      if (lottieInstance2Ref.current) lottieInstance2Ref.current.pause();
      if (videoPlayerRef.current) videoPlayerRef.current.pause();
    };

    if (isPlaying) {
      playAll();
    } else {
      pauseAll();
    }
  }, [isPlaying]);

  // Sinkronisasi tombol playbackSpeed global
  useEffect(() => {
    if (lottieInstance1Ref.current) lottieInstance1Ref.current.setSpeed(playbackSpeed);
    if (lottieInstance2Ref.current) lottieInstance2Ref.current.setSpeed(playbackSpeed);
    if (videoPlayerRef.current) videoPlayerRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // Fungsi Proses 1: Refactoring / Formatting dengan loading tunda visual
  const doRefactor = (sourceText, indent) => {
    setIsRefactoring(true);
    setTimeout(() => {
      try {
        const parsed = JSON.parse(sourceText);
        const formatted = JSON.stringify(parsed, null, parseInt(indent));
        setRefactoredOutput(formatted);
        setIsValidJson(true);
        setJsonError('');
        setComparisonResult(null); // Reset hasil komparasi karena data berubah
      } catch (err) {
        setRefactoredOutput(sourceText); // Tetap tampilkan jika gagal parsing
        setIsValidJson(false);
        setJsonError(err.message);
      } finally {
        setIsRefactoring(false);
      }
    }, 750); // Delay tunda visual sengaja dibuat agar efek rendering Lottie terasa mantap
  };

  const handleStartRefactor = () => {
    doRefactor(rawInput, indentSize);
  };

  // Handler pengetikan manual real-time langsung di editor hasil refactor
  const handleJsonEditorChange = (e) => {
    const value = e.target.value;
    setRefactoredOutput(value);
    
    // Validasi sintaksis real-time untuk memperbarui preview Lottie tanpa merusak player
    try {
      JSON.parse(value);
      setIsValidJson(true);
      setJsonError('');
    } catch (err) {
      setIsValidJson(false);
      setJsonError(err.message);
    }
  };

  // Handler Upload berkas lokal dan drag drop
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) processUploadedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processUploadedFile(file);
  };

  const processUploadedFile = (file) => {
    if (!file.name.endsWith('.json')) {
      triggerNotification(
        "Format Berkas Salah",
        "Ekstensi file bukan merupakan .json",
        "Unggah ulang berkas format Lottie .json After Effects yang valid.",
        "error"
      );
      return;
    }
    setIsFileLoading(true);
    setFileName(file.name);
    
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRawInput(event.target.result);
        doRefactor(event.target.result, indentSize);
        setIsFileLoading(false);
        triggerNotification(
          "Berkas Dimuat",
          `Berkas Lottie "${file.name}" sukses diunggah ke workspace.`,
          "Cek visual rendering real-time pada panel kanan.",
          "success"
        );
      };
      reader.readAsText(file);
    }, 800); // Penundaan visual rendering yang nyaman
  };

  // Drag and drop khusus Video Referensi (.mp4) ke panel Head-to-Head
  const handleVideoDragOver = (e) => {
    e.preventDefault();
    setIsVideoDragging(true);
  };

  const handleVideoDragLeave = (e) => {
    e.preventDefault();
    setIsVideoDragging(false);
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    setIsVideoDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      triggerNotification(
        "Video Referensi Terpasang",
        `Berkas video "${file.name}" siap dibandingkan berdampingan.`,
        "Tekan play/pause di bawah untuk menguji sinkronisasi putaran.",
        "success"
      );
    } else {
      triggerNotification(
        "Format Video Salah",
        "Sistem menolak tipe berkas yang dimasukkan.",
        "Pastikan menyeret berkas video standar dengan format ekstensi .mp4.",
        "error"
      );
    }
  };

  // Upload Video Referensi secara manual via button
  const handleVideoUploadButton = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      triggerNotification(
        "Video Dimuat",
        `Berkas "${file.name}" sukses dipasang ke area pembanding.`,
        "Gunakan drag & drop langsung ke layar untuk mempermudah penggantian berkas.",
        "success"
      );
    }
  };

  // Fetch dari Google Drive menggunakan proxy fallback
  const handleDriveFetch = async () => {
    if (!driveUrl) return;
    setIsFileLoading(true);
    setComparisonResult(null);

    let fileId = '';
    try {
      const match = driveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) fileId = match[1];
    } catch (e) {}

    if (!fileId) {
      triggerNotification(
        "Tautan Rusak",
        "Parser gagal membaca pola link Google Drive.",
        "Pastikan URL mengandung ID unik seperti '/file/d/[FILE_ID]/view'.",
        "error"
      );
      setIsFileLoading(false);
      return;
    }

    setFileName(`gdrive_${fileId.substring(0, 6)}.json`);
    const directUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(directUrl)}`;

    setTimeout(async () => {
      try {
        const res = await fetch(proxyUrl);
        if (res.ok) {
          const text = await res.text();
          JSON.parse(text); // Tes validitas JSON sebelum disimpan
          setRawInput(text);
          doRefactor(text, indentSize);
          triggerNotification(
            "Koneksi Sukses",
            "File Lottie JSON sukses diunduh murni dari Google Drive.",
            "Cek integritas berkas di Proses 2 untuk validitas final.",
            "success"
          );
        } else {
          throw new Error();
        }
      } catch (err) {
        triggerNotification(
          "Akses Gagal",
          "Server proxy gagal mengunduh otomatis file terkait.",
          "Unduh manual file json nya, lalu gunakan tab 'Unggah Berkas'.",
          "warning"
        );
      } finally {
        setIsFileLoading(false);
      }
    }, 1000); // Memberikan efek loading sinkronisasi drive yang rapi
  };

  // Menyalin ke clipboard
  const handleCopyToClipboard = () => {
    const textarea = document.createElement('textarea');
    textarea.value = refactoredOutput;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    triggerNotification(
      "Salin Clipboard",
      "Seluruh baris kode JSON telah sukses tersalin.",
      "Gunakan kombinasi tombol Ctrl + V untuk langsung paste di teks editor anda.",
      "success"
    );
  };

  // Unduh berkas format otomatis
  const handleDownloadFile = () => {
    if (!refactoredOutput || refactoredOutput.startsWith('[ERROR]')) return;
    const baseName = fileName.endsWith('.json') ? fileName.slice(0, -5) : fileName;
    const finalDownloadName = `${baseName}_refactoring.json`;

    const blob = new Blob([refactoredOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = finalDownloadName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    
    triggerNotification(
      "Ekspor Sukses",
      `Berkas "${finalDownloadName}" siap disimpan.`,
      "Simpan file ini langsung ke dalam repositori website produksi utama.",
      "success"
    );
  };

  // Fungsi Proses 2: Uji Integritas Mutlak SHA-256
  const handleCompareIntegritas = async () => {
    setIsComparing(true);
    setComparisonResult(null);

    setTimeout(async () => {
      try {
        const cleanOriginal = rawInput.replace(/\s+/g, '');
        const cleanRefactored = refactoredOutput.replace(/\s+/g, '');

        const hashOrig = await generateSHA256(cleanOriginal);
        const hashRefac = await generateSHA256(cleanRefactored);

        setOriginalHash(hashOrig);
        setRefactoredHash(hashRefac);

        const objOriginal = JSON.parse(rawInput);
        const objRefactored = JSON.parse(refactoredOutput);

        const isStructuralMatch = JSON.stringify(objOriginal) === JSON.stringify(objRefactored);
        const isHashMatch = hashOrig === hashRefac;

        if (isHashMatch && isStructuralMatch) {
          const report = {
            status: 'PASS',
            message: 'INTEGRITAS AMAN (100% Cocok Sempurna!)',
            detail: 'Tidak ada satu pun karakter murni atau parameter dari After Effects yang terlewat atau berubah.'
          };
          setComparisonResult(report);
          triggerNotification("Integritas Lolos", "Sidik jari SHA-256 terverifikasi aman.", "Berkas siap untuk diserahkan ke Tim Dev.", "success");
        } else {
          const diffCount = Math.abs(cleanOriginal.length - cleanRefactored.length);
          const report = {
            status: 'FAIL',
            message: 'INTEGRITAS TERGANGGU! (Data Berbeda)',
            detail: `Terdeteksi perbedaan struktural. Terdapat selisih murni sekitar ${diffCount} karakter antara berkas asli dan hasil refactoring.`
          };
          setComparisonResult(report);
          triggerNotification("Data Tidak Sinkron", "Ditemukan ketidakcocokan karakter.", "Periksa kembali whitespace atau karakter khusus yang tidak sengaja terhapus.", "error");
        }
      } catch (err) {
        setComparisonResult({
          status: 'ERROR',
          message: 'Verifikasi Gagal!',
          detail: `Sintaksis JSON rusak atau memiliki kesalahan format.`
        });
        triggerNotification("Audit Gagal", "Sintaksis JSON di editor tidak valid.", "Harap perbaiki tanda baca atau kurung kurawal di editor.", "error");
      } finally {
        setIsComparing(false);
      }
    }, 1000); // Memperpanjang sedikit loading audit agar pengerjaan enkripsi SHA-256 terasa profesional
  };

  // Sengaja merusak kode hasil refactoring (Uji Validasi Alat)
  const corruptOutputForTesting = () => {
    if (!refactoredOutput.startsWith('[')) {
      const corrupted = refactoredOutput.replace(/"v": "[^"]+"/, '"v": "9.9.9"')
                                        .replace(/"fr": \d+/, '"fr": 99');
      setRefactoredOutput(corrupted);
      setComparisonResult(null);
      triggerNotification(
        "Kerusakan Simulasi Disuntik",
        "Nilai versi ('v') dan frame rate ('fr') pada editor di atas telah sengaja dimodifikasi.",
        "Gunakan Proses 2 untuk menguji kepekaan dan fungsionalitas sistem audit.",
        "warning"
      );
    }
  };

  // Parsing JSON aktif untuk mendeteksi metadata Lottie secara dinamis
  let lottieConfig = null;
  let parseError = null;
  try {
    lottieConfig = JSON.parse(refactoredOutput);
  } catch (e) {
    parseError = e.message;
  }

  // Auto-detect parameter murni Lottie
  const lottieVersion = lottieConfig?.v || "N/A";
  const lottieFps = lottieConfig?.fr || 60;
  const lottieInPoint = lottieConfig?.ip || 0;
  const lottieOutPoint = lottieConfig?.op || 0;
  const lottieWidth = lottieConfig?.w || "N/A";
  const lottieHeight = lottieConfig?.h || "N/A";
  const totalFrames = lottieOutPoint - lottieInPoint;
  const computedDuration = lottieFps > 0 ? (totalFrames / lottieFps).toFixed(2) : 0;
  const layersCount = lottieConfig?.layers?.length || 0;
  const assetsCount = lottieConfig?.assets?.length || 0;

  // Auto-detect variabel dinamis yang tersedia di JSON aktif (bernilai number / string)
  const detectedKeys = lottieConfig ? Object.keys(lottieConfig).filter(
    key => typeof lottieConfig[key] === 'number' || typeof lottieConfig[key] === 'string'
  ) : [];

  // Helper pengubah ukuran dimensi bingkai preview secara asinkron mengikuti Aspect Ratio
  const getAspectRatioStyles = () => {
    switch (aspectRatio) {
      case '16:9':
        return { width: '100%', aspectRatio: '16/9', maxHeight: '280px' };
      case '9:16':
        return { width: '170px', height: '300px' };
      case '1:1':
        return { width: '240px', height: '270px' };
      case '4:5':
        return { width: '220px', height: '280px' };
      default:
        return { width: '100%', aspectRatio: '16/9', maxHeight: '280px' };
    }
  };

  // Komponen Label Parameter dengan Hover Tooltip untuk Lottie Spec
  const ParameterLabelWithTooltip = ({ paramKey, val }) => {
    const tooltip = lottieMetadataTooltips[paramKey] || {
      letter: "P",
      title: paramKey,
      description: "Informasi metadata murni Lottie."
    };

    return (
      <div className="flex justify-between items-center bg-slate-900/40 p-2.5 rounded border border-slate-850">
        <div className="flex items-center gap-2">
          {/* Huruf Parameter dengan Hover Tooltip */}
          <div className="relative group inline-block cursor-help">
            <span className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 text-indigo-400 font-extrabold border border-indigo-500/20 text-[10px] hover:bg-indigo-600 hover:text-white transition-all duration-200">
              {tooltip.letter}
            </span>
            {/* Tooltip Card */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-60 p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl text-[10.5pt] text-slate-300 font-sans leading-normal opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 font-normal">
              <div className="font-bold text-indigo-400 mb-1 border-b border-slate-800 pb-1 flex items-center gap-1.5">
                <span className="bg-indigo-600/20 px-1 py-0.5 rounded text-[9px] text-indigo-300">{tooltip.letter}</span>
                {tooltip.title}
              </div>
              <p className="font-normal text-slate-400 text-xs leading-relaxed">{tooltip.description}</p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 border-b border-r border-slate-800 rotate-45 -mt-1.5"></div>
            </div>
          </div>
          <span className="text-slate-300 font-medium text-xs font-mono">"{paramKey}"</span>
        </div>
        <span className="text-indigo-300 font-mono font-bold text-xs">{val}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* ==========================================
          MODAL POP-UP TOAST NOTIFIKASI SINKRON & ANIMATIF (PREMIUM & SIMPEL)
          ========================================== */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 max-w-sm w-full">
          {/* Efek transisi masuk-keluar dikontrol oleh state toast.visible */}
          <div className={`bg-slate-900/90 backdrop-blur-xl border border-slate-850 rounded-xl p-4 shadow-2xl flex items-start gap-3 relative overflow-hidden transition-all duration-500 ease-in-out transform ${
            toast.visible 
              ? 'opacity-100 translate-x-0 scale-100' 
              : 'opacity-0 translate-x-12 scale-95 pointer-events-none'
          }`}>
            {/* Garis aksen vertikal di sebelah kiri */}
            <div className={`absolute top-0 bottom-0 left-0 w-1 ${
              toast.type === 'error' ? 'bg-rose-500' :
              toast.type === 'success' ? 'bg-emerald-500' :
              toast.type === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'
            }`} />

            {/* Ikon Notifikasi */}
            <div className={`text-base p-1.5 rounded-lg shrink-0 ${
              toast.type === 'error' ? 'bg-rose-500/10 text-rose-400' :
              toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
              toast.type === 'warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'
            }`}>
              {toast.type === 'error' ? '🚨' : toast.type === 'success' ? '✅' : '⚠️'}
            </div>
            
            {/* Teks Informasi Notifikasi & Rekomendasi */}
            <div className="flex-1 space-y-0.5 pr-2">
              <h4 className="text-xs font-bold text-slate-100 leading-tight">{toast.title}</h4>
              <p className="text-[11px] text-slate-400 leading-normal font-normal">{toast.message}</p>
              
              {toast.recommendation && (
                <div className="text-[10px] text-indigo-300 font-mono mt-1.5 pt-1.5 border-t border-slate-850/60 leading-relaxed font-normal">
                  💡 <strong></strong> {toast.recommendation}
                </div>
              )}
            </div>

            {/* Tombol Tutup (X) */}
            <button 
              onClick={() => setToast(prev => ({ ...prev, visible: false }))}
              className="text-slate-500 hover:text-slate-300 transition-colors text-xs shrink-0 self-start p-1"
            >
              ✕
            </button>

            {/* COUNTDOWN PROGRESS BAR ANIMATIF (Penyusutan selama 4.5 Detik secara linier) */}
            <div 
              className={`absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 transition-all ease-linear ${
                toast.visible ? 'w-0 duration-[9500ms]' : 'w-full duration-0'
              }`}
            />
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-extrabold text-white text-lg tracking-wider">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Arqé JSON Validator & Live Lottie Animator Studio
              </h1>
              <p className="text-xs text-slate-400">
                Workspace Pengecekan Desain: Sanding Preview Instan & Video Referensi
              </p>
            </div>
          </div>
          <div className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-slate-300 font-mono">{fileName}</span>
          </div>
        </div>
      </nav>

      {/* CORE WORKSPACE FLOW (Vertikal dari Atas ke Bawah) */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-6 py-8 space-y-10">
        
        {/* ==========================================
            BAGIAN 1 (ATAS): SINKRONISASI EDITOR & PREVIEW INSTAN
            ========================================== */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-slate-850/40 px-6 py-4 border-b border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-sm">1</span>
              <div>
                <h3 className="font-semibold text-slate-200">Proses 1: Real-Time Live Editor & Instant Preview</h3>
                <p className="text-xs text-slate-400">Sunting kode JSON secara interaktif, preview langsung ter-update di sebelah kanan</p>
              </div>
            </div>

            {/* Opsi Tab Indentasi */}
            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-400 font-medium">Indentasi Editor:</label>
              <select 
                value={indentSize} 
                onChange={(e) => {
                  setIndentSize(e.target.value);
                  doRefactor(rawInput, e.target.value);
                }}
                className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 text-slate-200 cursor-pointer"
              >
                <option value={2}>2 Spasi</option>
                <option value={4}>4 Spasi</option>
                <option value={8}>8 Spasi</option>
              </select>
            </div>
          </div>

          <div className="p-6 flex flex-col xl:flex-row gap-6">
            
            {/* Editor Sisi Kiri (Bisa Diedit Manual) */}
            <div className="w-full xl:w-7/12 flex flex-col gap-4 relative">
              
              {/* LAYOVER LOADING PROTEKSI PROSES 1 (PILIH FILE / FETCH DRIVE / REFACTOR) */}
              {(isRefactoring || isFileLoading) && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center rounded-2xl border border-indigo-500/20 shadow-2xl animate-fade-in">
                  <div className="relative flex items-center justify-center h-16 w-16 mb-4">
                    <div className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-indigo-500/30 opacity-75"></div>
                    <div className="relative rounded-full h-10 w-10 bg-indigo-600/20 flex items-center justify-center border border-indigo-500/40">
                      <svg className="animate-spin h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-xs font-bold font-mono tracking-widest text-indigo-300 uppercase animate-pulse">
                    {isFileLoading ? "Menarik Berkas Desain..." : "Melakukan Refactoring JSON..."}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1">Sistem sedang merestrukturisasi pohon objek vektor Lottie.</p>
                </div>
              )}

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <div className="flex border-b border-slate-800 bg-slate-900 text-xs">
                  <button 
                    onClick={() => setInputTab('paste')}
                    className={`flex-1 py-3 px-4 font-medium transition-all ${inputTab === 'paste' ? 'bg-slate-950 text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    📝 Paste JSON
                  </button>
                  <button 
                    onClick={() => setInputTab('upload')}
                    className={`flex-1 py-3 px-4 font-medium transition-all ${inputTab === 'upload' ? 'bg-slate-950 text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    📤 Unggah Berkas
                  </button>
                  <button 
                    onClick={() => setInputTab('drive')}
                    className={`flex-1 py-3 px-4 font-medium transition-all ${inputTab === 'drive' ? 'bg-slate-950 text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    💾 GDrive Link
                  </button>
                </div>

                <div className="p-4">
                  {inputTab === 'paste' && (
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">JSON Mentah After Effects/Lottie:</label>
                        <button 
                          onClick={() => {
                            setFileName('carousel_design.json');
                            setRawInput(JSON.stringify(defaultCarouselJSON));
                            doRefactor(JSON.stringify(defaultCarouselJSON), indentSize);
                            triggerNotification(
                              "Sistem Direfresh",
                              "Konfigurasi editor telah dikembalikan ke template Lottie berputar bawaan.",
                              "Gunakan Ctrl + Z jika Anda ingin mengembalikan perubahan sebelumnya.",
                              "warning"
                            );
                          }}
                          className="text-[10px] text-indigo-400 hover:underline font-semibold"
                        >
                          Reset Ke Default
                        </button>
                      </div>
                      <textarea
                        value={rawInput}
                        onChange={(e) => {
                          setRawInput(e.target.value);
                          setFileName('pasted_carousel.json');
                        }}
                        placeholder="Tempel baris teks JSON dari Illustrator di sini..."
                        className="w-full h-24 bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none"
                      />
                    </div>
                  )}

                  {inputTab === 'upload' && (
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 transition-all duration-300 ${
                        isDragging 
                          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' 
                          : 'border-slate-800 hover:border-indigo-500/40 bg-slate-900/40'
                      }`}
                    >
                      <svg className={`h-8 w-8 mb-2 ${isDragging ? 'text-indigo-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <label className="cursor-pointer text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition shadow-lg shadow-indigo-500/10">
                        Pilih Berkas JSON
                        <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                      </label>
                      <p className="text-xs text-slate-400 mt-3 text-center">
                        {fileName !== 'carousel_design.json' ? (
                          <span className="text-emerald-400 font-medium font-mono">Aktif: {fileName}</span>
                        ) : (
                          'atau drag & drop berkas JSON di sini'
                        )}
                      </p>
                    </div>
                  )}

                  {inputTab === 'drive' && (
                    <div className="flex flex-col gap-2.5 py-1">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">URL Google Drive:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={driveUrl}
                          onChange={(e) => setDriveUrl(e.target.value)}
                          placeholder="Masukkan link drive file JSON..."
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none"
                        />
                        <button
                          onClick={handleDriveFetch}
                          disabled={!driveUrl}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition shrink-0"
                        >
                          Tarik File
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pretty JSON Editor Panel */}
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    ⚙ PANEL LIVE EDITOR (REAL-TIME EDITABLE):
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      isValidJson 
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' 
                        : 'bg-rose-950/40 text-rose-400 border-rose-500/20'
                    }`}>
                      {isValidJson ? '✔ SINTAKSIS VALID' : '✖ SINTAKSIS ERROR'}
                    </span>
                    <button 
                      onClick={handleCopyToClipboard}
                      className="text-[10px] px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    >
                      {copySuccess ? 'Copied! ✅' : '📋 Copy'}
                    </button>
                    <button 
                      onClick={handleDownloadFile}
                      className="text-[10px] px-2.5 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>

                <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-slate-950 flex flex-col h-[340px]">
                  <textarea
                    value={refactoredOutput}
                    onChange={handleJsonEditorChange}
                    className={`w-full flex-1 bg-slate-950 p-4 font-mono text-xs focus:outline-none resize-none leading-relaxed overflow-y-auto ${
                      isValidJson ? 'text-emerald-400' : 'text-rose-400 bg-rose-950/5'
                    }`}
                    style={{ tabSize: indentSize }}
                    spellCheck="false"
                  />
                  {!isValidJson && (
                    <div className="absolute bottom-0 inset-x-0 bg-rose-950 border-t border-rose-500/20 px-4 py-2 text-[11px] text-rose-300 font-mono truncate">
                      Detail Error: {jsonError}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Instant Preview Sisi Kanan (Berdampingan Langsung) */}
            <div className="w-full xl:w-5/12 flex flex-col gap-3 justify-between bg-slate-950/50 p-5 border border-slate-850 rounded-2xl relative">
              
              {/* LOADING OVERLAY PREVIEW LOTTIE 1 (KETIKA SEDANG REFACTOR) */}
              {(isRefactoring || isFileLoading) && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center rounded-2xl shadow-2xl animate-fade-in">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mb-2"></div>
                  <span className="text-[10px] text-indigo-300 font-mono uppercase tracking-wider animate-pulse">Menghubungkan Render...</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">🖥 INSTANT LOTTIE PREVIEW:</span>
                </div>
                
                {/* Selector Aspek Rasio Canvas Arqé */}
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                  {['16:9', '9:16', '1:1', '4:5'].map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`px-2.5 py-1 rounded font-medium transition ${
                        aspectRatio === ratio ? 'bg-slate-800 text-indigo-300 shadow' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kontainer Box Preview Instan */}
              <div className="flex-1 flex items-center justify-center border border-slate-800/40 rounded-xl bg-slate-950 p-4 relative min-h-[300px]">
                {!lottieLoaded ? (
                  <div className="animate-pulse text-xs text-slate-500">Memuat Player Lottie...</div>
                ) : !isValidJson ? (
                  <div className="text-center p-4">
                    <div className="text-lg mb-1">⚠️</div>
                    <span className="text-xs text-rose-400 font-medium">Render Ditunda</span>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">Perbaiki kesalahan sintaksis di editor kiri untuk mengaktifkan kembali preview murni.</p>
                  </div>
                ) : (
                  <div 
                    className="flex items-center justify-center overflow-hidden transition-all duration-300 relative rounded-xl"
                    style={getAspectRatioStyles()}
                  >
                    {/* DOM Target Lottie 1 */}
                    <div ref={lottieContainerRef1} className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 text-[10.5px] text-slate-400 leading-normal">
                💡 <strong>Keterangan Workstation:</strong> Ketika desainer mengedit manual teks atau angka koordinat Lottie di sebelah kiri, preview di atas akan seketika melakukan render ulang secara instan.
              </div>
            </div>

          </div>
        </section>

        {/* ==========================================
            BAGIAN 2 (TENGAH): PENGECEKAN INTEGRITAS SHA-256
            ========================================== */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-slate-850/40 px-6 py-4 border-b border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-sm">2</span>
              <div>
                <h3 className="font-semibold text-slate-200">Proses 2: Pengecekan Integritas & Struktur Data</h3>
                <p className="text-xs text-slate-400">Pastikan proses pengeditan di atas tidak merusak keaslian byte-by-byte After Effects</p>
              </div>
            </div>

            {/* Tombol Simulasi Error untuk Pembuktian */}
            <button 
              onClick={corruptOutputForTesting}
              disabled={!refactoredOutput || !isValidJson}
              className="text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg font-medium transition"
            >
              ⚠️ Sengaja Buat Error (Uji Alat)
            </button>
          </div>

          <div className="p-6 flex flex-col md:flex-row gap-6 relative">
            
            {/* LOADING OVERLAY INTEGRITAS KETIKA SEDANG MEMPROSES COMPARING */}
            {isComparing && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center rounded-2xl shadow-2xl animate-fade-in">
                <div className="relative flex items-center justify-center h-16 w-16 mb-4">
                  <div className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-emerald-500/30 opacity-75"></div>
                  <div className="relative rounded-full h-10 w-10 bg-emerald-600/20 flex items-center justify-center border border-emerald-500/40">
                    <svg className="animate-spin h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-xs font-bold font-mono tracking-widest text-emerald-300 uppercase animate-pulse">Memproses Validasi Karakter...</h4>
                <p className="text-[10px] text-slate-500 mt-1">Sistem sedang mereduksi data whitespace dan merumuskan enkripsi SHA-256 murni.</p>
              </div>
            )}

            <div className="w-full md:w-5/12 flex flex-col justify-center bg-slate-950/40 border border-slate-800 p-5 rounded-xl">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Metodologi Uji Integritas SHA-256:</h4>
              <ul className="text-xs text-slate-400 space-y-2 mb-5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✔</span>
                  Mengeleminasi spasi murni dan baris baru (whitespace) secara ketat.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✔</span>
                  Membandingkan byte-by-byte menggunakan Signature Hashing digital.
                </li>
              </ul>

              <button
                onClick={handleCompareIntegritas}
                disabled={isComparing || !refactoredOutput || !isValidJson}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition"
              >
                🔒 Mulai Komparasi / Cek Kesamaan
              </button>
            </div>

            {/* Diagnostic Report Panel */}
            <div className="w-full md:w-7/12">
              {!comparisonResult && !isComparing ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-950 border border-slate-850 rounded-xl">
                  <span className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Status Laporan</span>
                  <p className="text-xs text-slate-400">Silakan klik tombol hijau di sebelah kiri untuk mengeluarkan diagnosa.</p>
                </div>
              ) : isComparing ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-950 border border-slate-850 rounded-xl">
                  <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full mb-2" />
                  <span className="text-xs text-slate-300">Menghitung SHA-256 murni...</span>
                </div>
              ) : (
                <div className={`h-full flex flex-col p-5 rounded-xl border transition-all ${
                  comparisonResult.status === 'PASS' 
                    ? 'bg-emerald-950/20 border-emerald-500/30' 
                    : 'bg-rose-950/20 border-rose-500/30'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{comparisonResult.status === 'PASS' ? '✅' : '❌'}</span>
                    <h4 className="font-bold text-sm text-slate-100">{comparisonResult.message}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{comparisonResult.detail}</p>

                  <div className="space-y-1 bg-black/50 p-2.5 rounded border border-slate-800/60 font-mono text-[10px] text-slate-400">
                    <div className="truncate"><b>SHA-256 Asli:</b> {originalHash}</div>
                    <div className="truncate"><b>SHA-256 Hasil:</b> {refactoredHash}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ==========================================
            BAGIAN 3 (BAWAH): COMPARATIVE PLAYBACK DECK (DENGAN DRAG & DROP VIDEO)
            ========================================== */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-slate-850/40 px-6 py-4 border-b border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-sm">3</span>
              <div>
                <h3 className="font-semibold text-slate-200">Proses 3: Side-by-Side Comparative Playback Deck</h3>
                <p className="text-xs text-slate-400">Sandingkan Lottie JSON dengan video referensi (.mp4) secara berdampingan</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {!lottieLoaded ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-3" />
                <p className="text-sm text-slate-400">Memuat Engine Render Lottie murni...</p>
              </div>
            ) : parseError ? (
              <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-6 text-center text-rose-300 text-xs">
                ⚠️ <b>Gagal Me-render Animasi Lottie:</b> {parseError}<br />
                Perbaiki kesalahan ketik JSON di Proses 1 (Atas) agar Lottie Player dapat memuat data.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative">
                
                {/* LOADING OVERLAY PREVIEW LOTTIE 2 & VIDEO COMPARING (KETIKA REFACTOR ATAU FILE SEDANG DIMUAT) */}
                {(isRefactoring || isFileLoading) && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center rounded-2xl shadow-2xl animate-fade-in">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mb-2"></div>
                    <span className="text-[10px] text-indigo-300 font-mono uppercase tracking-wider animate-pulse">Menghubungkan Player...</span>
                  </div>
                )}

                {/* 3D Visual Stage (Kiri) - REAL LOTTIE RENDERER + MP4 COMPARISON */}
                <div className="lg:col-span-8 flex flex-col gap-4 bg-slate-950/40 p-4 border border-slate-850/60 rounded-2xl">
                  
                  {/* Pilihan Mode Sanding / Side-by-Side */}
                  <div className="flex justify-between items-center px-2 py-1 bg-slate-900/50 rounded-lg border border-slate-800/40 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                      <span className="text-slate-300 font-medium">Visual Real-time Stage (Head-to-Head)</span>
                    </div>

                    {/* File Video Input (Fallback) */}
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 transition">
                        {videoFile ? `Ganti Video: ${videoFile.name.substring(0,12)}...` : '📂 Pilih Video Referensi (.mp4)'}
                        <input type="file" accept="video/mp4" onChange={handleVideoUploadButton} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Kontainer Render Berdampingan */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 items-center justify-center">
                    
                    {/* BOX KIRI: Real Lottie Canvas Player */}
                    <div className="flex flex-col items-center justify-center border border-slate-800/55 rounded-xl bg-slate-950 p-4 relative min-h-[300px]">
                      <span className="absolute top-2 left-3 text-[9px] font-bold text-slate-500 tracking-wider uppercase bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                        🎬 Real Lottie JSON Render
                      </span>
                      
                      <div 
                        className="flex items-center justify-center overflow-hidden transition-all duration-300 relative rounded-xl"
                        style={getAspectRatioStyles()}
                      >
                        {/* Target DOM Element tempat Lottie-Web menggambar SVG */}
                        <div ref={lottieContainerRef2} className="w-full h-full object-contain" />
                      </div>
                    </div>

                    {/* BOX KANAN: Reference Video Player (.mp4) dengan DRAG & DROP langsung */}
                    <div 
                      onDragOver={handleVideoDragOver}
                      onDragLeave={handleVideoDragLeave}
                      onDrop={handleVideoDrop}
                      className={`flex flex-col items-center justify-center border-2 rounded-xl p-4 relative min-h-[300px] transition-all duration-300 ${
                        isVideoDragging 
                          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' 
                          : 'border-slate-800/55 bg-slate-950 hover:border-slate-700'
                      }`}
                    >
                      <span className="absolute top-2 left-3 text-[9px] font-bold text-slate-500 tracking-wider uppercase bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                        📹 Video Referensi (.mp4)
                      </span>

                      {videoUrl ? (
                        <div 
                          className="flex items-center justify-center overflow-hidden transition-all duration-300 relative rounded-xl w-full h-full"
                          style={getAspectRatioStyles()}
                        >
                          <video 
                            ref={videoPlayerRef}
                            src={videoUrl}
                            loop 
                            muted
                            playsInline
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-center p-6 max-w-xs cursor-pointer">
                          <div className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-2">
                            <span className="text-lg">🎞️</span>
                          </div>
                          <h5 className="text-xs font-semibold text-slate-300">Drag & Drop Video ke Sini!</h5>
                          <p className="text-[10px] text-slate-500 mt-1">
                            Seret langsung berkas video (example.mp4) milikmu dan letakkan di area kotak ini.
                          </p>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Playback Global Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-2 border-t border-slate-850/60 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 active:scale-95 ${
                          isPlaying 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        <span>{isPlaying ? '⏸ Jeda Sinkronisasi' : '▶ Putar Sinkronisasi'}</span>
                      </button>

                      {/* Speed Multiplier */}
                      <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
                        {[0.5, 1, 1.5, 2].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => setPlaybackSpeed(speed)}
                            className={`px-2.5 py-1 rounded font-semibold transition ${
                              playbackSpeed === speed
                                ? 'bg-slate-800 text-indigo-300'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono">
                      *Kombinasi audit berdampingan menjamin akurasi gerak 100% presisi.
                    </div>
                  </div>

                </div>

                {/* REAL-ONLY AUDIT & SPECS PANEL (Kanan) */}
                <div className="lg:col-span-4 bg-slate-950 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="border-b border-slate-850 pb-2 flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">📋 Detail Parameter JSON Lottie</h4>
                      <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                        Tanpa Adjustment
                      </span>
                    </div>

                    {/* DAFTAR KUNCI JSON YANG TERDIREKSI AKTIF */}
                    <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/60 space-y-2">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">
                        Kunci Parameter Lottie Terdeteksi (Hover huruf untuk penjelasan):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {detectedKeys.map((key) => {
                          const tooltip = lottieMetadataTooltips[key] || {
                            letter: key.substring(0, 1).toUpperCase(),
                            title: key,
                            description: "Parameter kustom terbaca di dalam berkas JSON aktif."
                          };
                          return (
                            <div key={key} className="relative group cursor-help">
                              <span className="bg-indigo-950/80 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 hover:bg-indigo-900 transition-colors">
                                <span className="text-[9px] bg-indigo-500/20 px-1 rounded text-indigo-400 font-bold">
                                  {tooltip.letter}
                                </span>
                                {key}
                              </span>
                              {/* Hover Tooltip Card */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl text-[10.5pt] text-slate-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 font-sans leading-normal">
                                <div className="font-bold text-indigo-400 mb-0.5">{tooltip.title}</div>
                                <p className="text-slate-400 text-xs leading-relaxed">{tooltip.description}</p>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 border-b border-r border-slate-800 rotate-45 -mt-1.5"></div>
                              </div>
                            </div>
                          );
                        })}
                        {detectedKeys.length === 0 && (
                          <span className="text-slate-500 italic text-[11px]">Tidak ada key terbaca</span>
                        )}
                      </div>
                    </div>

                    {/* DETAIL SPECIFICATION SHEET */}
                    <div className="space-y-2.5">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Spesifikasi Lottie Riil:</span>
                      
                      <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                        <ParameterLabelWithTooltip paramKey="v" val={lottieVersion} />
                        <ParameterLabelWithTooltip paramKey="fr" val={`${lottieFps} fps`} />
                        <ParameterLabelWithTooltip paramKey="op" val={`${totalFrames} frames`} />
                        <ParameterLabelWithTooltip paramKey="w" val={`${lottieWidth} px`} />
                        <ParameterLabelWithTooltip paramKey="h" val={`${lottieHeight} px`} />
                        
                        <div className="flex justify-between bg-slate-900/40 p-2.5 rounded border border-slate-850">
                          <span className="text-slate-400 font-medium">Durasi Hitung:</span>
                          <span className="text-indigo-300 font-bold">{computedDuration} detik</span>
                        </div>
                        <div className="flex justify-between bg-slate-900/40 p-2.5 rounded border border-slate-850">
                          <span className="text-slate-400 font-medium">Jumlah Layers / Assets:</span>
                          <span className="text-indigo-300 font-bold">{layersCount} layers / {assetsCount} assets</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STATUS AUDIT */}
                  <div className="bg-indigo-950/25 border border-indigo-500/10 p-3.5 rounded-xl text-xs text-slate-400 space-y-1 mt-4">
                    <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Status Integrasi Lottie
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      Sistem membaca, merender, dan memutar data visual vektor Lottie murni dari berkas JSON secara native tanpa adjustment apa pun.
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Arqé Clone Project — Automated JSON Verification Toolkit</p>
      </footer>

    </div>
  );
}