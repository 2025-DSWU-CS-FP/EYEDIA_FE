import { useState, useMemo } from 'react';

import type { SelectOption } from '@/components/auth/CustomSelect';
import type { Gender, Terms } from '@/types';
import {
  validateId,
  validatePw,
  validatePwConfirm,
  validateName,
  validateAge,
  validateGender,
} from '@/utils/validation';

export default function useSignupForm() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<Gender>('');
  const [terms, setTerms] = useState<Terms>({
    all: false,
    privacy: false,
    age: false,
    marketing: false,
  });

  const [dirty, setDirty] = useState({
    id: false,
    pw: false,
    pwConfirm: false,
    name: false,
    age: false,
    gender: false,
  });

  const genderOptions: SelectOption[] = useMemo(
    () => [
      { label: '여성', value: 'FEMALE' },
      { label: '남성', value: 'MALE' },
    ],
    [],
  );

  const idError = dirty.id ? validateId(id) : undefined;
  const pwError = dirty.pw ? validatePw(pw, { id, name }) : undefined;
  const pwConfirmError = dirty.pwConfirm
    ? validatePwConfirm(pw, pwConfirm)
    : undefined;
  const nameError = dirty.name ? validateName(name) : undefined;
  const ageError = dirty.age ? validateAge(age) : undefined;
  const genderError = dirty.gender ? validateGender(gender) : undefined;

  const isFieldsValid =
    !validateId(id) &&
    !validatePw(pw, { id, name }) &&
    !validatePwConfirm(pw, pwConfirm) &&
    !validateName(name) &&
    !validateAge(age) &&
    !validateGender(gender);

  const canSubmit = isFieldsValid && terms.privacy && terms.age;

  const onChangeId = (v: string) => {
    setId(v);
    if (!dirty.id) setDirty(d => ({ ...d, id: true }));
  };
  const onChangePw = (v: string) => {
    setPw(v);
    if (!dirty.pw) setDirty(d => ({ ...d, pw: true }));
    if (dirty.pwConfirm) setDirty(d => ({ ...d, pwConfirm: true }));
  };
  const onChangePwConfirm = (v: string) => {
    setPwConfirm(v);
    if (!dirty.pwConfirm) setDirty(d => ({ ...d, pwConfirm: true }));
  };
  const onChangeName = (v: string) => {
    setName(v);
    if (!dirty.name) setDirty(d => ({ ...d, name: true }));
  };
  const onChangeAgeText = (raw: string) => {
    const digits = raw.replace(/\D+/g, '');
    setAge(digits ? Number(digits) : '');
    if (!dirty.age) setDirty(d => ({ ...d, age: true }));
  };
  const onChangeGender = (v: 'MALE' | 'FEMALE') => {
    setGender(v);
    if (!dirty.gender) setDirty(d => ({ ...d, gender: true }));
  };

  const onAllToggle = () => {
    const allChecked = !terms.all;
    setTerms({
      all: allChecked,
      privacy: allChecked,
      age: allChecked,
      marketing: allChecked,
    });
  };
  const onToggle = (key: keyof Terms) => {
    setTerms(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (key !== 'all') next.all = next.privacy && next.age && next.marketing;
      return next;
    });
  };

  return {
    id,
    pw,
    pwConfirm,
    name,
    age,
    gender,
    terms,
    idError,
    pwError,
    pwConfirmError,
    nameError,
    ageError,
    genderError,
    canSubmit,
    genderOptions,
    onChangeId,
    onChangePw,
    onChangePwConfirm,
    onChangeName,
    onChangeAgeText,
    onChangeGender,
    onAllToggle,
    onToggle,
  };
}
