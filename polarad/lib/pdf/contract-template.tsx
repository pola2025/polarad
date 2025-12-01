import React, { ReactElement } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  DocumentProps,
} from '@react-pdf/renderer';

// 한글 폰트 등록 (Noto Sans KR)
Font.register({
  family: 'NotoSansKR',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr@4.5.0/files/noto-sans-kr-all-400-normal.woff',
      fontWeight: 'normal',
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr@4.5.0/files/noto-sans-kr-all-700-normal.woff',
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'NotoSansKR',
    fontSize: 10,
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6',
    padding: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
  },
  label: {
    width: '30%',
    fontWeight: 'bold',
    color: '#374151',
  },
  value: {
    width: '70%',
    color: '#111827',
  },
  article: {
    marginBottom: 15,
  },
  articleTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  articleContent: {
    lineHeight: 1.6,
    color: '#374151',
  },
  signatureSection: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#111827',
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  signatureBox: {
    width: '45%',
  },
  signatureLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#374151',
  },
  signatureImage: {
    width: 150,
    height: 75,
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
  },
  companyInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  companyDetail: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2,
  },
});

interface ContractPDFProps {
  contractNumber: string;
  companyName: string;
  ceoName: string;
  businessNumber: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  packageName: string;
  packageDisplayName: string;
  monthlyFee: number;
  contractPeriod: number;
  totalAmount: number;
  startDate: string;
  endDate: string;
  signedAt: string;
  clientSignature?: string;
}

export function ContractPDF({
  contractNumber,
  companyName,
  ceoName,
  businessNumber,
  address,
  contactName,
  contactPhone,
  contactEmail,
  packageDisplayName,
  monthlyFee,
  contractPeriod,
  totalAmount,
  startDate,
  endDate,
  signedAt,
  clientSignature,
}: ContractPDFProps) {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>광고 대행 서비스 계약서</Text>
          <Text style={styles.subtitle}>계약번호: {contractNumber}</Text>
        </View>

        {/* 계약 당사자 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제1조 계약 당사자</Text>

          <View style={styles.row}>
            <Text style={styles.label}>갑 (서비스 제공자)</Text>
            <Text style={styles.value}>주식회사 폴라애드</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>을 (서비스 이용자)</Text>
            <Text style={styles.value}>{companyName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>대표자</Text>
            <Text style={styles.value}>{ceoName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>사업자등록번호</Text>
            <Text style={styles.value}>{businessNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>사업장 주소</Text>
            <Text style={styles.value}>{address}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>담당자</Text>
            <Text style={styles.value}>{contactName} ({contactPhone})</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>이메일</Text>
            <Text style={styles.value}>{contactEmail}</Text>
          </View>
        </View>

        {/* 계약 내용 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제2조 계약 내용</Text>

          <View style={styles.row}>
            <Text style={styles.label}>서비스 패키지</Text>
            <Text style={styles.value}>{packageDisplayName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>계약 기간</Text>
            <Text style={styles.value}>{contractPeriod}개월 ({startDate} ~ {endDate})</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>월 서비스 비용</Text>
            <Text style={styles.value}>{formatCurrency(monthlyFee)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>총 계약 금액</Text>
            <Text style={styles.value}>{formatCurrency(totalAmount)} (부가세 별도)</Text>
          </View>
        </View>

        {/* 계약 조항 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제3조 서비스 내용 및 범위</Text>
          <View style={styles.article}>
            <Text style={styles.articleContent}>
              1. 갑은 을에게 선택한 패키지에 포함된 광고 대행 서비스를 제공한다.{'\n'}
              2. 서비스의 구체적인 내용은 별첨 서비스 명세서에 따른다.{'\n'}
              3. 광고 집행에 필요한 광고비는 본 계약 금액에 포함되지 않으며, 별도로 청구한다.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제4조 비용 및 결제</Text>
          <View style={styles.article}>
            <Text style={styles.articleContent}>
              1. 을은 갑에게 매월 서비스 비용을 지정된 방법으로 결제한다.{'\n'}
              2. 결제일은 매월 1일이며, 최초 결제는 계약 체결일에 진행한다.{'\n'}
              3. 결제 지연 시 연체료가 부과될 수 있다.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제5조 계약의 해지</Text>
          <View style={styles.article}>
            <Text style={styles.articleContent}>
              1. 을이 계약 기간 중 해지를 원할 경우, 최소 30일 전에 서면으로 통보해야 한다.{'\n'}
              2. 중도 해지 시 위약금이 발생할 수 있다.{'\n'}
              3. 갑의 귀책사유로 서비스가 중단될 경우, 해당 기간만큼 서비스 기간을 연장한다.
            </Text>
          </View>
        </View>

        {/* 서명 섹션 */}
        <View style={styles.signatureSection}>
          <Text style={{ textAlign: 'center', marginBottom: 20 }}>
            위 내용에 동의하며 계약을 체결합니다.
          </Text>
          <Text style={{ textAlign: 'center', marginBottom: 20 }}>
            계약 체결일: {signedAt}
          </Text>

          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>갑 (주식회사 폴라애드)</Text>
              <Text>대표이사 (인)</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>을 ({companyName})</Text>
              {clientSignature ? (
                <Image style={styles.signatureImage} src={clientSignature} />
              ) : (
                <Text>{ceoName} (인)</Text>
              )}
            </View>
          </View>
        </View>

        {/* 회사 정보 */}
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>주식회사 폴라애드</Text>
          <Text style={styles.companyDetail}>사업자등록번호: 000-00-00000</Text>
          <Text style={styles.companyDetail}>주소: 서울특별시 강남구 테헤란로 123</Text>
          <Text style={styles.companyDetail}>대표전화: 02-1234-5678 | 이메일: contact@polarad.co.kr</Text>
        </View>

        {/* 푸터 */}
        <Text style={styles.footer}>
          본 계약서는 전자서명법에 따라 유효한 전자문서입니다.
        </Text>
      </Page>
    </Document>
  );
}

// 서버사이드에서 사용할 팩토리 함수
export function createContractDocument(props: ContractPDFProps): ReactElement<DocumentProps> {
  return <ContractPDF {...props} /> as ReactElement<DocumentProps>;
}
