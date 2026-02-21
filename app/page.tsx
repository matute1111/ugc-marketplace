'use client';

import { useState } from 'react';
import axios from 'axios';
import { generateVideo, checkVideoStatus } from '@/lib/kie-client';

export default function UGCGenerator() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [product, setProduct] = useState('Apple AirPods Pro');
  const [hook, setHook] = useState('Bluetooth que dura TODO EL DÍA');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500');
  const [taskId, setTaskId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pollCount, setPollCount] = useState(0);

  const handleGenerateClick = async () => {
    setError('');
    setLoading(true);
    setStep(2);

    try {
      const prompt = `UGC TikTok video 9:16 vertical 15 seconds. 
Young person excited unboxing ${product}.
Hook: "${hook}"
Natural bedroom lighting, iPhone aesthetic, authentic genuine reaction.
Trendy, engaging, real UGC style (not commercial).
Close-up shots, natural movements, product featured.`;

      console.log('Generating video with prompt:', prompt);
      console.log('Image URL:', imageUrl);

      const id = await generateVideo({
        prompt,
        imageUrl,
        duration: '15',
        mode: 'pro',
        aspectRatio: '9:16',
      });

      console.log('Task ID:', id);
      setTaskId(id);

      // Start polling
      const pollInterval = setInterval(async () => {
        setPollCount((c) => c + 1);

        try {
          const result = await checkVideoStatus(id);

          if (result.status === 'completed' && result.videoUrl) {
            clearInterval(pollInterval);
            setVideoUrl(result.videoUrl);
            setStep(3);
            setLoading(false);
          } else if (result.status === 'failed') {
            clearInterval(pollInterval);
            setError('Video generation failed: ' + result.error);
            setStep(1);
            setLoading(false);
          }
        } catch (pollError) {
          console.error('Poll error:', pollError);
        }
      }, 5000); // Poll every 5 seconds

      // Timeout after 5 minutes
      setTimeout(() => {
        setError('Video generation timeout');
        setStep(1);
        setLoading(false);
      }, 300000);
    } catch (err) {
      console.error('Generation error:', err);
      setError(
        err instanceof Error ? err.message : 'Unknown error occurred'
      );
      setStep(1);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">🎬 UGC Ads Factory</h1>
          <p className="text-purple-300">Genera anuncios UGC auténticos en segundos</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-300">❌ {error}</p>
          </div>
        )}

        {/* Step 1: Input */}
        {step === 1 && (
          <div className="bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white">📝 Crea tu video UGC</h2>

            <div>
              <label className="text-white font-semibold mb-2 block">Producto</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g., Apple AirPods Pro"
                className="w-full px-4 py-3 bg-slate-700 text-white rounded border border-purple-500/50 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">Hook (primeros 3 segundos)</label>
              <input
                type="text"
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                placeholder="Ej: Bluetooth que REALMENTE dura todo el día"
                className="w-full px-4 py-3 bg-slate-700 text-white rounded border border-purple-500/50 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">URL de imagen inicial</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-slate-700 text-white rounded border border-purple-500/50 focus:border-purple-500 focus:outline-none"
              />
              {imageUrl && (
                <img src={imageUrl} alt="Preview" className="w-full mt-3 rounded max-h-40 object-cover" />
              )}
            </div>

            <button
              onClick={handleGenerateClick}
              disabled={loading || !product || !hook || !imageUrl}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded text-lg transition"
            >
              🎬 Generar Video (15 seg)
            </button>

            <p className="text-slate-400 text-sm">
              ⏱️ Estimado: 2-3 minutos de procesamiento
            </p>
          </div>
        )}

        {/* Step 2: Generating */}
        {step === 2 && (
          <div className="bg-slate-800/50 backdrop-blur border border-blue-500/30 rounded-lg p-8 text-center space-y-6">
            <h2 className="text-2xl font-bold text-white">⏳ Generando video...</h2>

            <div className="relative h-2 bg-slate-700 rounded overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 animate-pulse"
                style={{ width: `${Math.min((pollCount / 36) * 100, 90)}%` }}
              />
            </div>

            <div className="space-y-2 text-slate-300">
              <p>No cierre esta ventana.</p>
              <p className="text-xs">
                Task ID: {taskId.substring(0, 12)}...
              </p>
            </div>

            <div className="bg-slate-700/50 rounded p-4">
              <p className="text-slate-400 text-sm">
                Producto: <span className="text-white font-semibold">{product}</span>
              </p>
              <p className="text-slate-400 text-sm mt-2">
                Hook: <span className="text-white font-semibold">{hook}</span>
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 3 && (
          <div className="bg-slate-800/50 backdrop-blur border border-green-500/30 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-green-400">✅ ¡Video generado!</h2>

            <div className="bg-slate-700/50 rounded overflow-hidden">
              <video
                src={videoUrl}
                controls
                className="w-full aspect-video bg-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a
                href={videoUrl}
                download
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-center transition"
              >
                📥 Descargar
              </a>
              <button
                onClick={() => {
                  setStep(1);
                  setVideoUrl('');
                  setTaskId('');
                  setPollCount(0);
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded transition"
              >
                🔄 Generar otro
              </button>
            </div>

            <p className="text-slate-400 text-xs">
              Video: 1080x1920 (9:16), 15 segundos, MP4
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
