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
  v: "5.12.1",
  fr: 60,
  ip: 0,
  op: 120,
  w: 500,
  h: 500,
  nm: "Default Loader",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 1,
      nm: "Background",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [250, 250, 0], ix: 2 },
        a: { a: 0, k: [250, 250, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 }
      },
      ao: 0,
      sw: 500,
      sh: 500,
      sc: "#0f172a",
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Vektor Bulat Orbit",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], h: 1 },
            { t: 120, s: [360], h: 1 }
          ],
          ix: 10
        },
        p: { a: 0, k: [250, 250, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [120, 120], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              nm: "Ellipse Path",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false
            },
            {
              ty: "st",
              c: { a: 0, k: [0.38, 0.4, 1, 1], ix: 3 },
              o: { a: 0, k: 100, ix: 4 },
              w: { a: 0, k: 6, ix: 5 },
              lc: 1,
              lj: 1,
              ml: 4,
              bm: 0,
              nm: "Stroke 1",
              mn: "ADBE Vector Graphic - Stroke",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 8 },
              sa: { a: 0, k: 0, ix: 9 },
              nm: "Transform"
            }
          ],
          nm: "Group 1",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    }
  ]
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
  // --- STATE BAGIAN 1 (ATAS): INPUT & EDITING ---
  const [rawInput, setRawInput] = useState(JSON.stringify(defaultLottieJSON));
  const [refactoredOutput, setRefactoredOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [fileName, setFileName] = useState('carousel_design.json');
  const [inputTab, setInputTab] = useState('paste'); // 'paste', 'upload', 'drive'
  const [driveUrl, setDriveUrl] = useState('');
  
  // State untuk penyeretan berkas utama
  const [isDragging, setIsDragging] = useState(false);
  const [isRefactoring, setIsRefactoring] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Validasi sintaksis JSON Real-time
  const [isValidJson, setIsValidJson] = useState(true);
  const [jsonError, setJsonError] = useState('');

  // --- STATE BAGIAN 2 (TENGAH): KOMPARASI INTEGRITAS ---
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [originalHash, setOriginalHash] = useState('');
  const [refactoredHash, setRefactoredHash] = useState('');

  // --- STATE BAGIAN 3 (BAWAH): MULTI PREVIEWS (SAMPINGAN & HEAD-TO-HEAD) ---
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

  // Fungsi Proses 1: Refactoring / Formatting
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
    }, 400);
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
      alert("Hanya berkas berekstensi .json yang didukung!");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setRawInput(event.target.result);
      doRefactor(event.target.result, indentSize);
    };
    reader.readAsText(file);
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
    } else {
      alert("Harap unggah berkas video (.mp4) yang valid!");
    }
  };

  // Upload Video Referensi secara manual via button
  const handleVideoUploadButton = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  // Fetch dari Google Drive menggunakan proxy fallback
  const handleDriveFetch = async () => {
    if (!driveUrl) return;
    setIsRefactoring(true);
    setComparisonResult(null);

    let fileId = '';
    try {
      const match = driveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) fileId = match[1];
    } catch (e) {}

    if (!fileId) {
      alert("ID File Google Drive tidak terdeteksi!");
      setIsRefactoring(false);
      return;
    }

    setFileName(`gdrive_${fileId.substring(0, 6)}.json`);
    const directUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(directUrl)}`;

    try {
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const text = await res.text();
        JSON.parse(text); // Tes validitas JSON sebelum disimpan
        setRawInput(text);
        doRefactor(text, indentSize);
      } else {
        throw new Error();
      }
    } catch (err) {
      alert("Gagal memuat otomatis dari Drive. Silakan gunakan metode 'Unggah Berkas'!");
    } finally {
      setIsRefactoring(false);
    }
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
          setComparisonResult({
            status: 'PASS',
            message: 'INTEGRITAS AMAN (100% Cocok Sempurna!)',
            detail: 'Tidak ada satu pun karakter murni atau parameter dari After Effects yang terlewat atau berubah.'
          });
        } else {
          const diffCount = Math.abs(cleanOriginal.length - cleanRefactored.length);
          setComparisonResult({
            status: 'FAIL',
            message: 'INTEGRITAS TERGANGGU! (Data Berbeda)',
            detail: `Terdeteksi perbedaan struktural. Terdapat selisih murni sekitar ${diffCount} karakter antara berkas asli dan hasil refactoring.`
          });
        }
      } catch (err) {
        setComparisonResult({
          status: 'ERROR',
          message: 'Verifikasi Gagal!',
          detail: `Sintaksis JSON rusak atau memiliki kesalahan format.`
        });
      } finally {
        setIsComparing(false);
      }
    }, 600);
  };

  // Sengaja merusak kode hasil refactoring (Uji Validasi Alat)
  const corruptOutputForTesting = () => {
    if (!refactoredOutput.startsWith('[')) {
      const corrupted = refactoredOutput.replace(/"v": "[^"]+"/, '"v": "9.9.9"')
                                        .replace(/"fr": \d+/, '"fr": 99');
      setRefactoredOutput(corrupted);
      setComparisonResult(null);
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
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-60 p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl text-[10.5pt] text-slate-300 font-sans leading-normal opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
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
            BAGIAN 1 (ATAS): SINKRONISASI SAMPINGAN (EDITOR vs INSTANT PREVIEW)
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
            <div className="w-full xl:w-7/12 flex flex-col gap-4">
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
                            setRawInput(JSON.stringify(defaultLottieJSON));
                            doRefactor(JSON.stringify(defaultLottieJSON), indentSize);
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
                        placeholder="Tempel baris teks JSON dari After Effects di sini..."
                        className="w-full h-24 bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none"
                      />
                    </div>
                  )}

                  {inputTab === 'upload' && (
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
                        isDragging 
                          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' 
                          : 'border-slate-800 hover:border-indigo-500/40 bg-slate-900/40'
                      }`}
                    >
                      <svg className={`h-6 w-6 mb-1.5 ${isDragging ? 'text-indigo-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <label className="cursor-pointer text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-1.5 px-3 rounded-lg transition shadow-lg shadow-indigo-500/10">
                        Pilih Berkas JSON
                        <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                      </label>
                      <p className="text-xs text-slate-400 mt-2 text-center">
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
                    ⚙️ PANEL LIVE EDITOR (REAL-TIME EDITABLE):
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
            <div className="w-full xl:w-5/12 flex flex-col gap-3 justify-between bg-slate-950/50 p-5 border border-slate-850 rounded-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">🖥️ INSTANT LOTTIE PREVIEW:</span>
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

            <button 
              onClick={corruptOutputForTesting}
              disabled={!refactoredOutput || !isValidJson}
              className="text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg font-medium transition"
            >
              ⚠️ Sengaja Buat Error (Uji Alat)
            </button>
          </div>

          <div className="p-6 flex flex-col md:flex-row gap-6">
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
                {isComparing ? 'Memproses Sidik Jari Digital...' : '🔒 Mulai Komparasi / Cek Kesamaan'}
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
            BAGIAN 3 (BAWAH): REAL LOTTIE PREVIEW STAGE (HEAD-TO-HEAD KOMPARASI DENGAN DRAG & DROP VIDEO)
            ========================================== */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-slate-850/40 px-6 py-4 border-b border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-sm">3</span>
              <div>
                <h3 className="font-semibold text-slate-200">Proses 3: Side-by-Side Comparative Playback Deck</h3>
                <p className="text-xs text-slate-400">Sandingkan Lottie JSON dengan video referensi (.mp4) secara berdampingan. Mendukung drag & drop video!</p>
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
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
                            Seret langsung berkas video 11 detik (<code>example.mp4</code>) milikmu dan letakkan di area kotak kanan ini.
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
                        Murni Tanpa Adjustment
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
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-b border-r border-slate-800 rotate-45 -mt-1"></div>
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
                      Sistem membaca, merender, dan memutar data visual vektor Lottie murni dari berkas JSON secara native tanpa adjustment kodingan apa pun.
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