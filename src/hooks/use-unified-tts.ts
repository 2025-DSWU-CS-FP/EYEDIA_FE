import useGoogleTtsFront from '@/hooks/use-google-tts-front';
import useTts from '@/hooks/useTTS';

type SpeakArgs = { text: string };

export default function useUnifiedTts() {
  const cloud = useGoogleTtsFront({
    languageCode: 'ko-KR',
    voiceName: 'Alnilam',
    audioEncoding: 'LINEAR16',
  });
  const web = useTts({
    lang: 'ko-KR',
    voiceName: undefined,
    style: 'narration',
  });

  async function speak({ text }: SpeakArgs) {
    try {
      await cloud.speak(text);
    } catch {
      web.speak(text);
    }
  }

  return {
    speaking: false,
    speak,
    stop: () => {
      web.cancel();
    },
  };
}
