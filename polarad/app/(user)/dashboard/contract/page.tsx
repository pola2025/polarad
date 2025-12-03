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
  termsAgreed: boolean;
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
    contractPeriod: 1,
    additionalNotes: "",
    termsAgreed: false,
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
      if (!formData.termsAgreed) {
        newErrors.termsAgreed = "서비스 이용약관에 동의해주세요";
      }
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
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
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
  const totalAmount = selectedPackage ? selectedPackage.price : 0;

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
                  {pkg.price > 0 && <span className="text-sm font-normal text-gray-500"> (VAT 포함)</span>}
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
                <span className="text-gray-600 dark:text-gray-400">서비스 비용</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedPackage?.price === 0
                    ? "별도 협의"
                    : `${selectedPackage?.price.toLocaleString()}원 (VAT 포함)`}
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

          {/* 표준계약서 약관 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              서비스 이용약관
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto text-sm text-gray-700 dark:text-gray-300 space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">제1조 (목적)</h4>
              <p>
                본 약관은 폴라애드(이하 "회사")가 제공하는 온라인 영업 올인원 패키지 서비스(이하 "서비스")의
                이용에 관하여 회사와 클라이언트(이하 "고객") 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>

              <h4 className="font-semibold text-gray-900 dark:text-white">제2조 (서비스 내용)</h4>
              <p>회사가 제공하는 서비스의 내용은 다음과 같습니다:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>인쇄물 제작: 명함 200매, 대봉투 500매, 계약서 500매, 명찰</li>
                <li>홈페이지 제작: 10페이지 이내, 반응형 디자인</li>
                <li>도메인 및 호스팅: 1년 무료 제공 (2년차부터 연 66,000원)</li>
                <li>광고 지원: Meta 광고 연동, 자동화 설정, 실시간 알림, 리포팅 대시보드</li>
              </ul>
              <p className="text-gray-500 text-xs mt-2">
                ※ 상기 서비스 범위를 초과하는 추가 작업은 별도 협의 및 비용이 발생합니다.
              </p>

              <h4 className="font-semibold text-gray-900 dark:text-white">제3조 (계약 금액 및 결제)</h4>
              <p>
                1. 서비스 이용 금액은 3,300,000원(VAT 포함)입니다.<br />
                2. 결제는 계약 체결 후 7일 이내에 선금 100%를 완료해야 하며, 미입금 시 계약은 자동 해지됩니다.<br />
                3. 결제 방법은 계좌이체 또는 카드결제가 가능합니다.<br />
                4. 세금계산서는 입금 확인 후 발행됩니다.
              </p>

              <h4 className="font-semibold text-gray-900 dark:text-white">제4조 (서비스 진행 절차)</h4>
              <p>
                1. 진행 절차: 계약 → 입금 → 자료 수령 → 디자인 제작 → 시안 확인 → 수정 → 최종 컨펌 → 발주요청(고객) → 발주/배포 → 완료<br />
                2. 고객은 회사의 자료 요청일로부터 7일 이내에 필요 자료를 제공해야 합니다.<br />
                3. 자료 미제공 시 제작 일정이 지연되며, 30일 이상 자료 미제공 시 계약 해지 및 기 진행 비용 공제 후 환불됩니다.
              </p>

              <h4 className="font-semibold text-gray-900 dark:text-white">제5조 (제작 기간)</h4>
              <p>
                1. 인쇄물: 고객의 최종 발주요청 확정 후 7영업일 이내 배송<br />
                2. 홈페이지: 자료 수령 후 14영업일 이내 제작 완료<br />
                3. 단, 다음의 경우 제작 기간이 연장됩니다:<br />
                &nbsp;&nbsp;- 고객의 시안 컨펌 지연<br />
                &nbsp;&nbsp;- 고객의 수정 요청 (3회 초과 시 추가 비용 발생)<br />
                &nbsp;&nbsp;- 고객의 자료 제공 지연<br />
                &nbsp;&nbsp;- 명절, 공휴일 등 회사 휴무일<br />
                4. 도메인 및 호스팅은 계약일로부터 1년간 무료 제공됩니다.
              </p>

              <h4 className="font-semibold text-gray-900 dark:text-white text-red-600 dark:text-red-400">제6조 (인쇄물 발주 및 책임)</h4>
              <p className="text-red-600 dark:text-red-400 font-medium">
                1. 고객은 발주요청 전 인쇄물의 오탈자, 내용, 디자인을 반드시 최종 확인해야 합니다.<br />
                2. 고객의 발주요청은 최종 컨펌으로 간주되며, 발주 후에는 수정 및 취소가 불가합니다.<br />
                3. 발주 후 발견된 오탈자, 내용 오류로 인한 재제작 비용은 전액 고객이 부담합니다.<br />
                4. 회사의 귀책사유(디자인 오류, 인쇄 불량 등)로 인한 재제작은 회사가 부담합니다.
              </p>

              <h4 className="font-semibold text-gray-900 dark:text-white">제7조 (고객의 의무)</h4>
              <p>
                1. 고객은 서비스 이용에 필요한 자료(로고, 이미지, 텍스트 등)를 기한 내 제공해야 합니다.<br />
                2. 고객이 제공한 자료의 저작권, 초상권 등 법적 문제에 대한 책임은 고객에게 있습니다.<br />
                3. 고객은 시안 확인 요청 시 3영업일 이내에 피드백을 제공해야 합니다.<br />
                4. 고객은 제공된 서비스를 제3자에게 재판매하거나 양도할 수 없습니다.
              </p>

              <h4 className="font-semibold text-gray-900 dark:text-white">제8조 (회사의 의무)</h4>
              <p>
                1. 회사는 약정된 서비스를 전문성을 가지고 성실히 제공합니다.<br />
                2. 회사는 고객의 개인정보를 보호하며, 관련 법령을 준수합니다.<br />
                3. 회사는 제작물의 원본 파일을 1년간 보관하며, 이후 삭제될 수 있습니다.
              </p>

              <h4 className="font-semibold text-gray-900 dark:text-white">제9조 (저작권 및 소유권)</h4>
              <p>
                1. 제작 완료된 결과물의 저작권은 대금 완납 시 고객에게 이전됩니다.<br />
                2. 회사는 포트폴리오 목적으로 제작물을 활용할 수 있습니다.<br />
                3. 제작 과정에서 발생한 중간 산출물의 저작권은 회사에 귀속됩니다.
              </p>

              <h4 className="font-semibold text-gray-900 dark:text-white">제10조 (계약 해지 및 환불)</h4>
              <p>
                1. 계약 후 작업 착수 전: 전액 환불<br />
                2. 자료 수령 후 ~ 시안 제작 전: 계약금의 70% 환불<br />
                3. 시안 제작 후 ~ 최종 컨펌 전: 계약금의 50% 환불<br />
                4. 최종 컨펌 후 또는 인쇄물 발주 후: 환불 불가<br />
                5. 고객의 귀책사유로 인한 계약 해지 시 위 기준에 따라 환불됩니다.<br />
                6. 환불은 요청일로부터 7영업일 이내에 처리됩니다.
              </p>

              <h4 className="font-semibold text-gray-900 dark:text-white">제11조 (면책 조항)</h4>
              <p>
                1. 천재지변, 전쟁, 정부 규제 등 불가항력적 사유로 인한 서비스 지연 또는 불이행에 대해 회사는 책임을 지지 않습니다.<br />
                2. 고객의 자료 제공 지연, 컨펌 지연, 연락 두절 등 고객 귀책사유로 인한 일정 지연에 대해 회사는 책임을 지지 않습니다.<br />
                3. 고객이 제공한 자료의 저작권, 초상권 침해 등으로 인한 법적 분쟁은 고객이 책임집니다.<br />
                4. 발주 후 발견된 오탈자 및 내용 오류는 고객의 귀책사유로 간주됩니다.<br />
                5. 호스팅 서버의 장애, 해킹 등 외부 요인으로 인한 손해에 대해 회사는 책임을 지지 않습니다.
              </p>

              <h4 className="font-semibold text-gray-900 dark:text-white">제12조 (손해배상)</h4>
              <p>
                1. 회사의 귀책사유로 인한 손해배상 범위는 고객이 지불한 서비스 이용료를 초과하지 않습니다.<br />
                2. 간접 손해, 영업 손실, 기대 이익의 상실 등에 대해서는 배상 책임을 지지 않습니다.
              </p>

              <h4 className="font-semibold text-gray-900 dark:text-white">제13조 (분쟁 해결)</h4>
              <p>
                1. 본 계약과 관련하여 분쟁이 발생한 경우 양 당사자는 원만한 합의를 위해 노력합니다.<br />
                2. 합의가 이루어지지 않을 경우 회사 소재지 관할 법원을 전속관할로 합니다.
              </p>

              <h4 className="font-semibold text-gray-900 dark:text-white">제14조 (기타)</h4>
              <p>
                1. 본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.<br />
                2. 본 약관은 2024년 12월 1일부터 시행됩니다.
              </p>
            </div>

            {/* 약관 동의 체크박스 */}
            <div className="mt-4 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAgreed}
                  onChange={(e) => handleInputChange("termsAgreed", e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  위 서비스 이용약관을 모두 읽었으며, 이에 동의합니다. <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.termsAgreed && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.termsAgreed}
                </p>
              )}
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

          {/* 안내 사항 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>안내:</strong> 본 계약 요청서를 제출하면 담당자가 검토 후 연락드립니다.
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
