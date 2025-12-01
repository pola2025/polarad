"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Building,
  User,
  FileText,
  MapPin,
  Phone,
  Mail,
  Package,
  Calendar,
  Loader2,
  Check,
  AlertCircle,
  Pen,
  Send,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface PackageData {
  id: string;
  name: string;
  displayName: string;
  price: number;
  description: string;
  features: string[];
}

interface ContractFormData {
  packageId: string;
  companyName: string;
  ceoName: string;
  businessNumber: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contractPeriod: number;
  additionalNotes: string;
  clientSignature: string;
}

const STEPS = [
  { id: 1, title: "패키지 선택", icon: Package },
  { id: 2, title: "계약 정보", icon: Building },
  { id: 3, title: "확인 및 서명", icon: Pen },
];

export default function ContractPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<ContractFormData>({
    packageId: "",
    companyName: "",
    ceoName: "",
    businessNumber: "",
    address: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contractPeriod: 12,
    additionalNotes: "",
    clientSignature: "",
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // 패키지 정보 로드
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await fetch("/api/packages");
        if (!res.ok) throw new Error("패키지 정보를 불러올 수 없습니다");
        const data = await res.json();
        setPackages(data.packages);
      } catch (error) {
        console.error("패키지 로드 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPackages();
  }, []);

  // 사용자 정보 로드 (기존 정보 자동 입력)
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setFormData((prev) => ({
              ...prev,
              companyName: data.user.clientName || "",
              contactName: data.user.name || "",
              contactPhone: data.user.phone || "",
              contactEmail: data.user.email || "",
            }));
          }
        }
      } catch (error) {
        console.error("사용자 정보 로드 오류:", error);
      }
    };
    loadUserInfo();
  }, []);

  const handleInputChange = (field: keyof ContractFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.packageId) {
        newErrors.packageId = "패키지를 선택해주세요";
      }
    } else if (step === 2) {
      if (!formData.companyName) newErrors.companyName = "상호를 입력해주세요";
      if (!formData.ceoName) newErrors.ceoName = "대표자명을 입력해주세요";
      if (!formData.businessNumber) {
        newErrors.businessNumber = "사업자등록번호를 입력해주세요";
      } else if (!/^\d{3}-\d{2}-\d{5}$/.test(formData.businessNumber)) {
        newErrors.businessNumber = "올바른 형식으로 입력해주세요 (000-00-00000)";
      }
      if (!formData.address) newErrors.address = "사업장 주소를 입력해주세요";
      if (!formData.contactName) newErrors.contactName = "담당자명을 입력해주세요";
      if (!formData.contactPhone) {
        newErrors.contactPhone = "연락처를 입력해주세요";
      } else if (!/^01[0-9]-?\d{3,4}-?\d{4}$/.test(formData.contactPhone.replace(/-/g, ""))) {
        newErrors.contactPhone = "올바른 연락처를 입력해주세요";
      }
      if (!formData.contactEmail) {
        newErrors.contactEmail = "이메일을 입력해주세요";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
        newErrors.contactEmail = "올바른 이메일 형식을 입력해주세요";
      }
    } else if (step === 3) {
      if (!formData.clientSignature) {
        newErrors.clientSignature = "서명을 입력해주세요";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "계약 요청 실패");
      }

      const data = await res.json();
      alert(`계약 요청이 완료되었습니다.\n계약번호: ${data.contractNumber}\n\n승인 후 이메일로 계약서가 발송됩니다.`);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("계약 요청 오류:", error);
      alert(error instanceof Error ? error.message : "계약 요청 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 서명 캔버스 관련 함수들
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  useEffect(() => {
    if (currentStep === 3) {
      initCanvas();
    }
  }, [currentStep, initCanvas]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCanvasCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCanvasCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        const signature = canvas.toDataURL("image/png");
        setFormData((prev) => ({ ...prev, clientSignature: signature }));
      }
    }
    setIsDrawing(false);
  };

  const clearSignature = () => {
    initCanvas();
    setFormData((prev) => ({ ...prev, clientSignature: "" }));
  };

  const selectedPackage = packages.find((p) => p.id === formData.packageId);
  const totalAmount = selectedPackage
    ? selectedPackage.price * formData.contractPeriod + (selectedPackage.name === "CUSTOM" ? 0 : 0)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 스텝 인디케이터 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-100 dark:bg-green-900/30"
                        : isActive
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-blue-600"
                          : isCompleted
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: 패키지 선택 */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            서비스 패키지를 선택해주세요
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handleInputChange("packageId", pkg.id)}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  formData.packageId === pkg.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {pkg.displayName}
                  </h3>
                  {formData.packageId === pkg.id && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {pkg.price === 0 ? "별도 협의" : `${pkg.price.toLocaleString()}원`}
                  {pkg.price > 0 && <span className="text-sm font-normal text-gray-500">/월</span>}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {pkg.description}
                </p>
                <ul className="space-y-1">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
          {errors.packageId && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.packageId}
            </p>
          )}

          {/* 계약 기간 선택 */}
          {formData.packageId && selectedPackage?.name !== "CUSTOM" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                계약 기간
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[6, 12, 24].map((months) => (
                  <button
                    key={months}
                    onClick={() => handleInputChange("contractPeriod", months)}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      formData.contractPeriod === months
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                    }`}
                  >
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {months}개월
                    </p>
                    {months === 12 && (
                      <span className="text-xs text-blue-600 font-medium">추천</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: 계약 정보 입력 */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            계약 정보를 입력해주세요
          </h2>

          {/* 사업자 정보 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5" />
              사업자 정보
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                label="상호"
                value={formData.companyName}
                onChange={(v) => handleInputChange("companyName", v)}
                placeholder="회사명 또는 상호"
                error={errors.companyName}
                required
              />
              <FormField
                label="대표자명"
                value={formData.ceoName}
                onChange={(v) => handleInputChange("ceoName", v)}
                placeholder="대표자 성명"
                error={errors.ceoName}
                required
              />
              <FormField
                label="사업자등록번호"
                value={formData.businessNumber}
                onChange={(v) => handleInputChange("businessNumber", v)}
                placeholder="000-00-00000"
                error={errors.businessNumber}
                required
              />
              <div className="md:col-span-2">
                <FormField
                  label="사업장 주소"
                  value={formData.address}
                  onChange={(v) => handleInputChange("address", v)}
                  placeholder="사업장 소재지 전체 주소"
                  error={errors.address}
                  required
                />
              </div>
            </div>
          </div>

          {/* 담당자 정보 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              담당자 정보
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                label="담당자명"
                value={formData.contactName}
                onChange={(v) => handleInputChange("contactName", v)}
                placeholder="담당자 성명"
                error={errors.contactName}
                required
              />
              <FormField
                label="연락처"
                value={formData.contactPhone}
                onChange={(v) => handleInputChange("contactPhone", v)}
                placeholder="010-0000-0000"
                type="tel"
                error={errors.contactPhone}
                required
              />
              <div className="md:col-span-2">
                <FormField
                  label="이메일"
                  value={formData.contactEmail}
                  onChange={(v) => handleInputChange("contactEmail", v)}
                  placeholder="contact@example.com"
                  type="email"
                  error={errors.contactEmail}
                  required
                />
              </div>
            </div>
          </div>

          {/* 추가 요청사항 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              추가 요청사항 (선택)
            </h3>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
              placeholder="특별히 요청하실 사항이 있으시면 입력해주세요"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      )}

      {/* Step 3: 확인 및 서명 */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            계약 내용을 확인하고 서명해주세요
          </h2>

          {/* 계약 요약 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              계약 요약
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">패키지</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedPackage?.displayName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">계약 기간</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formData.contractPeriod}개월
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">월 서비스 비용</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedPackage?.price === 0
                    ? "별도 협의"
                    : `${selectedPackage?.price.toLocaleString()}원`}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">상호</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formData.companyName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">대표자</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formData.ceoName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">담당자</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formData.contactName} ({formData.contactEmail})
                </span>
              </div>
              <div className="flex justify-between py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 mt-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  총 계약 금액
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {totalAmount === 0
                    ? "별도 협의"
                    : `${totalAmount.toLocaleString()}원`}
                </span>
              </div>
            </div>
          </div>

          {/* 전자 서명 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Pen className="w-5 h-5" />
              전자 서명
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              아래 영역에 서명해주세요. 이 서명은 계약서에 사용됩니다.
            </p>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="w-full h-[200px] cursor-crosshair touch-none bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={clearSignature}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                서명 지우기
              </button>
            </div>
            {errors.clientSignature && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.clientSignature}
              </p>
            )}
          </div>

          {/* 동의 사항 */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              본 계약 요청서를 제출함으로써, 위 내용에 동의하며 계약 체결을 요청합니다.
              계약서는 승인 후 입력하신 이메일로 발송됩니다.
            </p>
          </div>
        </div>
      )}

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            currentStep === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          이전
        </button>

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
          >
            다음
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all shadow-lg shadow-green-600/30 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                제출 중...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                계약 요청 제출
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// 폼 필드 컴포넌트
function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
          error
            ? "border-red-500"
            : "border-gray-300 dark:border-gray-600"
        }`}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
