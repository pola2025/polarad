# Airtable Automation Script

## 설정 방법

1. Airtable → **Automations** 탭
2. **Create automation** 클릭
3. Trigger: **When record is created**
4. Table: **고객정보** 선택
5. Action: **Run a script** 추가
6. 아래 코드 복사 붙여넣기

---

## Script 코드

```javascript
// Airtable Automation Script
// 새 레코드 생성 시 Worker로 알림 전송

let inputConfig = input.config();

// 트리거된 레코드 가져오기
let recordId = inputConfig.recordId;
let table = base.getTable('고객정보');
let record = await table.selectRecordAsync(recordId);

if (record) {
    // 필드 값 추출
    let data = {
        name: record.getCellValueAsString('Name'),
        phone: record.getCellValueAsString('phone'),
        company: record.getCellValueAsString('company'),
        industry: record.getCellValueAsString('industry'),
        adname: record.getCellValueAsString('Adname')
    };

    // Worker 호출
    let response = await fetch('https://2026-pola-meta.mkt9834.workers.dev', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    let result = await response.json();
    console.log('Worker 응답:', result);
}
```

---

## Input Variables 설정

Script 편집 화면에서 **Add input variable** 클릭:

| Name | Value |
|------|-------|
| recordId | Record ID (트리거에서 선택) |

---

## 테스트

1. **Test automation** 클릭
2. 테스트 레코드 선택
3. 실행 결과 확인
4. 텔레그램/SMS/이메일 수신 확인

---

## 완료 후

- **Turn on automation** 활성화
- 새 레코드 추가 시 자동 알림 발송
