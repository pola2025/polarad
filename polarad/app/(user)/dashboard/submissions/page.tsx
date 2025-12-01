"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Upload,
  Check,
  AlertCircle,
  FileText,
  Image,
  Building,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Palette,
  FileEdit,
  Save,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface SubmissionField {
  id: string;
  label: string;
  type: "file" | "text" | "email" | "tel" | "textarea" | "select";
  required: boolean;
  icon: React.ElementType;
  placeholder?: string;
  accept?: string;
  hint?: string;
  options?: { value: string; label: string }[];
}

interface SubmissionData {
  businessLicense?: string;
  profilePhoto?: string;
  brandName?: string;
  contactEmail?: string;
  contactPhone?: string;
  bankAccount?: string;
  deliveryAddress?: string;
  websiteStyle?: string;
  websiteColor?: string;
  blogDesignNote?: string;
  additionalNote?: string;
}

const REQUIRED_FIELDS: SubmissionField[] = [
  {
    id: "businessLicense",
    label: "사업자등록증",
    type: "file",
    required: true,
    icon: FileText,
    accept: ".pdf,.jpg,.jpeg,.png",
    hint: "PDF, JPG, PNG (최대 10MB)",
  },
  {
    id: "profilePhoto",
    label: "프로필 사진",
    type: "file",
    required: true,
    icon: Image,
    accept: ".jpg,.jpeg,.png",
    hint: "JPG, PNG (정방형 권장, 최대 5MB)",
  },
  {
    id: "brandName",
    label: "브랜드명/상호",
    type: "text",
    required: true,
    icon: Building,
    placeholder: "예: 폴라세일즈",
  },
  {
    id: "contactEmail",
    label: "대표 이메일",
    type: "email",
    required: true,
    icon: Mail,
    placeholder: "contact@example.com",
  },
  {
    id: "contactPhone",
    label: "대표 번호",
    type: "tel",
    required: true,
    icon: Phone,
    placeholder: "02-1234-5678",
  },
  {
    id: "bankAccount",
    label: "계좌 정보",
    type: "text",
    required: true,
    icon: CreditCard,
    placeholder: "은행명 / 계좌번호 / 예금주",
  },
];

const OPTIONAL_FIELDS: SubmissionField[] = [
  {
    id: "deliveryAddress",
    label: "인쇄물 배송지",
    type: "text",
    required: false,
    icon: MapPin,
    placeholder: "배송받을 주소 (기본: 사업장 주소)",
  },
  {
    id: "websiteStyle",
    label: "홈페이지 스타일",
    type: "select",
    required: false,
    icon: Palette,
    options: [
      { value: "", label: "선택해주세요" },
      { value: "modern", label: "모던/미니멀" },
      { value: "professional", label: "전문가/신뢰감" },
      { value: "friendly", label: "친근/따뜻함" },
      { value: "premium", label: "프리미엄/고급" },
    ],
  },
  {
    id: "websiteColor",
    label: "컬러 컨셉",
    type: "text",
    required: false,
    icon: Palette,
    placeholder: "예: 블루 계열, 따뜻한 톤 등",
  },
  {
    id: "blogDesignNote",
    label: "블로그 디자인 요청사항",
    type: "textarea",
    required: false,
    icon: FileEdit,
    placeholder: "블로그 디자인에 대한 요청사항을 입력해주세요",
  },
  {
    id: "additionalNote",
    label: "추가 요청사항",
    type: "textarea",
    required: false,
    icon: FileEdit,
    placeholder: "기타 요청사항을 입력해주세요",
  },
];

export default function SubmissionsPage() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
  const [uploadingFields, setUploadingFields] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadSubmission = useCallback(async () => {
    try {
      const res = await fetch("/api/submissions");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Failed to load");
      }
      const data = await res.json();
      if (data.submission) {
        const s = data.submission as SubmissionData;
        setFormData({
          businessLicense: s.businessLicense || "",
          profilePhoto: s.profilePhoto || "",
          brandName: s.brandName || "",
          contactEmail: s.contactEmail || "",
          contactPhone: s.contactPhone || "",
          bankAccount: s.bankAccount || "",
          deliveryAddress: s.deliveryAddress || "",
          websiteStyle: s.websiteStyle || "",
          websiteColor: s.websiteColor || "",
          blogDesignNote: s.blogDesignNote || "",
          additionalNote: s.additionalNote || "",
        });
      }
    } catch (error) {
      console.error("Load error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubmission();
  }, [loadSubmission]);

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleFileChange = async (id: string, file: File | null) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [id]: "파일 크기는 10MB를 초과할 수 없습니다" }));
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, [id]: "허용되지 않는 파일 형식입니다" }));
      return;
    }

    setPendingFiles((prev) => ({ ...prev, [id]: file }));
    setUploadingFields((prev) => new Set(prev).add(id));

    try {
      const urlRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      });

      if (!urlRes.ok) {
        const error = await urlRes.json();
        throw new Error(error.error || "업로드 URL 생성 실패");
      }

      const { uploadUrl, publicUrl } = await urlRes.json();

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("파일 업로드 실패");

      setFormData((prev) => ({ ...prev, [id]: publicUrl }));
      if (errors[id]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[id];
          return newErrors;
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrors((prev) => ({
        ...prev,
        [id]: error instanceof Error ? error.message : "업로드 오류",
      }));
      setPendingFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[id];
        return newFiles;
      });
    } finally {
      setUploadingFields((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    REQUIRED_FIELDS.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label}을(를) 입력해주세요`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (uploadingFields.size > 0) {
      alert("파일 업로드가 진행 중입니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "저장 실패");
      }
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error("Submit error:", error);
      alert(error instanceof Error ? error.message : "저장 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  const completedCount = REQUIRED_FIELDS.filter((f) => formData[f.id]).length;
  const progress = Math.round((completedCount / REQUIRED_FIELDS.length) * 100);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || uploadingFields.size > 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-blue-600/30"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              저장
            </>
          )}
        </button>
      </div>

      {/* 진행률 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">필수 자료 제출 현황</span>
          <span className="text-sm text-gray-500">{completedCount}/{REQUIRED_FIELDS.length}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* 필수 자료 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          필수 자료
        </h2>
        <div className="space-y-4">
          {REQUIRED_FIELDS.map((field) => (
            <FieldInput
              key={field.id}
              field={field}
              value={formData[field.id]}
              pendingFile={pendingFiles[field.id]}
              isUploading={uploadingFields.has(field.id)}
              error={errors[field.id]}
              onTextChange={(v) => handleInputChange(field.id, v)}
              onFileChange={(f) => handleFileChange(field.id, f)}
            />
          ))}
        </div>
      </section>

      {/* 선택 자료 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">선택 자료</h2>
        <div className="space-y-4">
          {OPTIONAL_FIELDS.map((field) => (
            <FieldInput
              key={field.id}
              field={field}
              value={formData[field.id]}
              pendingFile={pendingFiles[field.id]}
              isUploading={uploadingFields.has(field.id)}
              error={errors[field.id]}
              onTextChange={(v) => handleInputChange(field.id, v)}
              onFileChange={(f) => handleFileChange(field.id, f)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function FieldInput({
  field,
  value,
  pendingFile,
  isUploading,
  error,
  onTextChange,
  onFileChange,
}: {
  field: SubmissionField;
  value: string | undefined;
  pendingFile?: File;
  isUploading?: boolean;
  error?: string;
  onTextChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
}) {
  const Icon = field.icon;
  const hasValue = !!value;

  if (field.type === "file") {
    const isFileUrl = value?.startsWith("http");
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${hasValue ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-700"}`}>
            {isUploading ? (
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            ) : hasValue ? (
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.hint && <p className="text-xs text-gray-500 mb-2">{field.hint}</p>}
            {isFileUrl && !pendingFile && (
              <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">파일 업로드 완료</span>
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
            <label className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isUploading ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"}`}>
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="text-sm text-blue-600">업로드 중...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {pendingFile ? pendingFile.name : isFileUrl ? "파일 변경" : "파일 선택"}
                  </span>
                </>
              )}
              <input type="file" accept={field.accept} onChange={(e) => onFileChange(e.target.files?.[0] || null)} disabled={isUploading} className="hidden" />
            </label>
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-2">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={value || ""}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-2">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={value || ""}
              onChange={(e) => onTextChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${hasValue ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-700"}`}>
          {hasValue ? (
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
          ) : (
            <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-2">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type={field.type}
            value={value || ""}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
