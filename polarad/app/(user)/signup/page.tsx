"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  clientName: string;
  email: string;
  name: string;
  phone: string;
  password: string;
  passwordConfirm: string;
  smsConsent: boolean;
  emailConsent: boolean;
}

const STEPS = [
  { step: 1, title: "업체 정보", description: "클라이언트명과 이메일" },
  { step: 2, title: "담당자 정보", description: "이름과 연락처" },
  { step: 3, title: "비밀번호", description: "4자리 숫자 PIN" },
  { step: 4, title: "알림 동의", description: "알림 수신 동의" },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    email: "",
    name: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    smsConsent: false,
    emailConsent: false,
  });

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!formData.clientName) {
          setError("클라이언트명(업체명)을 입력해주세요");
          return false;
        }
        if (!formData.email) {
          setError("이메일을 입력해주세요");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError("올바른 이메일 형식을 입력해주세요");
          return false;
        }
        break;
      case 2:
        if (!formData.name) {
          setError("담당자명을 입력해주세요");
          return false;
        }
        if (!formData.phone) {
          setError("연락처를 입력해주세요");
          return false;
        }
        if (!/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(formData.phone.replace(/-/g, ""))) {
          setError("올바른 연락처 형식을 입력해주세요");
          return false;
        }
        break;
      case 3:
        if (!formData.password) {
          setError("비밀번호를 입력해주세요");
          return false;
        }
        if (!/^\d{4}$/.test(formData.password)) {
          setError("비밀번호는 4자리 숫자로 입력해주세요");
          return false;
        }
        if (formData.password !== formData.passwordConfirm) {
          setError("비밀번호가 일치하지 않습니다");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 4) {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: formData.clientName,
          email: formData.email,
          name: formData.name,
          phone: formData.phone.replace(/-/g, ""),
          password: formData.password,
          smsConsent: formData.smsConsent,
          emailConsent: formData.emailConsent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "회원가입에 실패했습니다");
      }

      // 성공 시 로그인 페이지로 이동
      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Polarad
            </span>
          </Link>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            마케팅 패키지 회원가입
          </p>
        </div>

        {/* 진행 단계 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((s, idx) => (
              <div key={s.step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step > s.step
                      ? "bg-blue-600 text-white"
                      : step === s.step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > s.step ? <Check className="w-4 h-4" /> : s.step}
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-1 ${
                      step > s.step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {STEPS[step - 1].title}
            </p>
            <p className="text-xs text-gray-500">{STEPS[step - 1].description}</p>
          </div>
        </div>

        {/* 카드 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: 업체 정보 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="clientName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  클라이언트명 (업체명)
                </label>
                <input
                  id="clientName"
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => updateField("clientName", e.target.value)}
                  placeholder="예: 폴라세일즈"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  이메일 주소
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-2 text-xs text-gray-500">
                  알림 및 안내 메시지를 수신할 이메일입니다
                </p>
              </div>
            </div>
          )}

          {/* Step 2: 담당자 정보 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  담당자명
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  연락처
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="010-1234-5678"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 3: 비밀번호 */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  비밀번호 (4자리 숫자)
                </label>
                <input
                  id="password"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value.replace(/\D/g, ""))}
                  placeholder="••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                />
              </div>
              <div>
                <label
                  htmlFor="passwordConfirm"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  비밀번호 확인
                </label>
                <input
                  id="passwordConfirm"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={formData.passwordConfirm}
                  onChange={(e) => updateField("passwordConfirm", e.target.value.replace(/\D/g, ""))}
                  placeholder="••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                />
              </div>
              <p className="text-xs text-gray-500 text-center">
                로그인 시 사용할 4자리 숫자를 입력하세요
              </p>
            </div>
          )}

          {/* Step 4: 알림 동의 */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                알림 수신에 동의해주세요
              </p>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.smsConsent}
                    onChange={(e) => updateField("smsConsent", e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      SMS 알림 수신 동의
                    </p>
                    <p className="text-sm text-gray-500">
                      마감일 알림, 긴급 안내 등을 SMS로 받습니다
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.emailConsent}
                    onChange={(e) => updateField("emailConsent", e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      이메일 알림 수신 동의
                    </p>
                    <p className="text-sm text-gray-500">
                      시안 완료, 제작 진행 상황 등을 이메일로 받습니다
                    </p>
                  </div>
                </label>
              </div>

              {/* 선택한 정보 요약 */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  가입 정보 확인
                </p>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>클라이언트명: {formData.clientName}</p>
                  <p>담당자: {formData.name}</p>
                  <p>이메일: {formData.email}</p>
                  <p>연락처: {formData.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="mt-6 flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                이전
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                다음
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    처리 중...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    가입 완료
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* 로그인 링크 */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
