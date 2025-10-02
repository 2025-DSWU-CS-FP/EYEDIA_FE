import { useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useToast } from '@/contexts/ToastContext';

function toBool(v: string | null): boolean | undefined {
  if (v === 'true') return true;
  if (v === 'false') return false;
  return undefined;
}

export default function OAuthSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const token = params.get('token');
    const name = params.get('name');
    const mvc = params.get('monthlyVisitCount');
    const firstLogin = toBool(params.get('firstLogin'));

    if (!token) {
      showToast(
        '소셜 로그인 처리 중 문제가 발생했습니다. 다시 시도해 주세요.',
        'error',
      );
      navigate('/login', { replace: true });
      return;
    }

    try {
      localStorage.setItem('accessToken', token);
      if (name) localStorage.setItem('name', name);
      if (mvc && /^\d+$/.test(mvc))
        localStorage.setItem('monthlyVisitCount', mvc);

      showToast('로그인에 성공했습니다!', 'success');
      navigate(firstLogin ? '/landing' : '/', { replace: true });
    } catch {
      showToast(
        '로그인 정보를 저장할 수 없습니다. 브라우저 설정을 확인해 주세요.',
        'error',
      );
      navigate('/login', { replace: true });
    }
  }, [navigate, params, showToast]);

  return (
    <main className="grid min-h-dvh place-items-center bg-gray-5">
      <p className="text-gray-70 ct3">로그인 처리 중…</p>
    </main>
  );
}
