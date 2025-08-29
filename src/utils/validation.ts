import type { Gender } from '@/types';

export const validateId = (v: string) => {
  const s = v.trim();
  if (!s) return '아이디를 입력해 주세요.';
  if (s.length < 5 || s.length > 15) return '아이디는 5~15자로 입력해 주세요.';
  if (!/^[a-z0-9._-]+$/.test(s))
    return '영문 소문자, 숫자, . _ - 만 사용할 수 있어요.';
  if (!/^[a-z]/.test(s)) return '아이디는 영문 소문자로 시작해 주세요.';
  if (/(\.|_|-){2,}/.test(s)) return '구분 문자를 연속으로 사용할 수 없어요.';
  if (/^[._-]|[._-]$/.test(s)) return '구분 문자는 처음/끝에 올 수 없어요.';
  return undefined;
};

export const validatePw = (v: string, ctx?: { id?: string; name?: string }) => {
  if (!v) return '비밀번호를 입력해 주세요.';
  if (v.length < 8 || v.length > 18)
    return '비밀번호는 8~18자로 입력해 주세요.';
  if (/\s/.test(v)) return '공백은 사용할 수 없어요.';

  let types = 0;
  if (/[a-z]/.test(v)) types += 1;
  if (/[A-Z]/.test(v)) types += 1;
  if (/\d/.test(v)) types += 1;
  if (/[^A-Za-z0-9]/.test(v)) types += 1;
  if (types < 3)
    return '영문 대/소문자, 숫자, 특수문자 중 3가지 이상을 조합해 주세요.';

  if (
    ctx?.id &&
    ctx.id.length >= 3 &&
    v.toLowerCase().includes(ctx.id.toLowerCase())
  )
    return '아이디를 비밀번호에 포함할 수 없어요.';
  if (
    ctx?.name &&
    ctx.name.length >= 2 &&
    v.toLowerCase().includes(ctx.name.toLowerCase())
  )
    return '이름을 비밀번호에 포함할 수 없어요.';

  return undefined;
};

export const validatePwConfirm = (pwV: string, confirmV: string) => {
  if (!confirmV) return '비밀번호를 한 번 더 입력해 주세요.';
  if (pwV !== confirmV) return '비밀번호가 일치하지 않아요.';
  return undefined;
};

export const validateName = (v: string) => {
  if (!v.trim()) return '이름을 입력해 주세요.';
  if (v.length < 2) return '이름은 2자 이상이어야 해요.';
  return undefined;
};

export const validateAge = (v: number | '') => {
  if (v === '') return '나이를 입력해 주세요.';
  if (v < 14 || v > 120) return '만 14세 이상만 가입할 수 있어요.';
  return undefined;
};

export const validateGender = (v: Gender) => {
  if (!v) return '성별을 선택해 주세요.';
  return undefined;
};
