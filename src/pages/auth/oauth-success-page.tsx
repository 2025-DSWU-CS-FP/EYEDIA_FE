import { useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useToast } from '@/contexts/ToastContext';

function toBool(v: string | null): boolean | undefined {
  if (v === 'true') return true;
  if (v === 'false') return false;
  return undefined;
}

function readHashParam(name: string): string | null {
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  if (!hash || !hash.startsWith('#')) return null;
  const sp = new URLSearchParams(hash.slice(1));
  return sp.get(name);
}

export default function OAuthSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const token = params.get('token') ?? readHashParam('token');
    const name = params.get('name') ?? readHashParam('name');
    const mvc =
      params.get('monthlyVisitCount') ?? readHashParam('monthlyVisitCount');
    const firstLogin = toBool(
      params.get('firstLogin') ?? readHashParam('firstLogin'),
    );

    const err = params.get('error') ?? readHashParam('error');
    if (err) {
      showToast(`소셜 로그인 실패: ${err}`, 'error');
      navigate('/login', { replace: true });
      return;
    }

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

      if (typeof window !== 'undefined') {
        const clean = firstLogin ? '/landing' : '/';
        window.history.replaceState(null, '', clean);
        showToast('로그인에 성공했습니다!', 'success');
        navigate(firstLogin ? '/landing' : '/', { replace: true });
      }
    } catch {
      showToast(
        '로그인 정보를 저장할 수 없습니다. 브라우저 설정을 확인해 주세요.',
        'error',
      );
      navigate('/login', { replace: true });
    }
  }, [navigate, params, showToast]);

  return <main className="grid min-h-dvh place-items-center bg-gray-5" />;
}
