import axios from 'axios';

const KIE_API_KEY = process.env.NEXT_PUBLIC_KIE_API_KEY || 'c8ee5ff3aa3ba89b29413e4c2eaf3c04';
const KIE_BASE_URL = 'https://api.kie.ai/api/v1';

interface VideoGenerationRequest {
  prompt: string;
  imageUrl: string;
  duration?: string;
  mode?: 'std' | 'pro';
  aspectRatio?: string;
}

interface VideoGenerationResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
  };
}

interface VideoStatusResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
    state: 'waiting' | 'success' | 'fail';
    resultJson?: string;
    failMsg?: string;
  };
}

/**
 * Generate video using KIE.ai Kling 3.0
 */
export async function generateVideo(request: VideoGenerationRequest): Promise<string> {
  const payload = {
    model: 'kling-3.0/video',
    input: {
      mode: request.mode || 'pro',
      image_urls: [request.imageUrl],
      prompt: request.prompt,
      duration: request.duration || '15',
      aspect_ratio: request.aspectRatio || '9:16',
      multi_shots: false,
      sound: true,
    },
  };

  try {
    const response = await axios.post<VideoGenerationResponse>(
      `${KIE_BASE_URL}/jobs/createTask`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${KIE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.code === 200 && response.data.data.taskId) {
      return response.data.data.taskId;
    } else {
      throw new Error(`KIE API error: ${response.data.msg}`);
    }
  } catch (error) {
    console.error('Video generation failed:', error);
    throw error;
  }
}

/**
 * Check video generation status
 */
export async function checkVideoStatus(taskId: string): Promise<{
  status: 'pending' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
}> {
  try {
    const response = await axios.get<VideoStatusResponse>(
      `${KIE_BASE_URL}/jobs/recordInfo`,
      {
        params: { taskId },
        headers: {
          'Authorization': `Bearer ${KIE_API_KEY}`,
        },
      }
    );

    const data = response.data.data;

    if (data.state === 'success') {
      const result = JSON.parse(data.resultJson || '{}');
      const videoUrl = result.resultUrls?.[0];

      return {
        status: 'completed',
        videoUrl,
      };
    } else if (data.state === 'fail') {
      return {
        status: 'failed',
        error: data.failMsg,
      };
    } else {
      return {
        status: 'pending',
      };
    }
  } catch (error) {
    console.error('Status check failed:', error);
    throw error;
  }
}
