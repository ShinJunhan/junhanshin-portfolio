# Cloud Resume Challenge

<!-- TODO: 임시 내용입니다. 실제 작성 내용으로 교체하세요. -->

AWS 위에 정적 이력서 사이트를 올리고 방문자 카운터를 붙인 프로젝트입니다.
모든 리소스는 Terraform으로 정의하고 CI로 배포합니다.

## 구성

- **프런트엔드.** S3에 정적 사이트를 두고, CloudFront로 서빙하며 Route 53에
  커스텀 도메인을 연결합니다.
- **API.** API Gateway 뒤의 Lambda 함수이며, 카운터는 DynamoDB에 저장합니다.
- **인프라.** 위 항목 전부를 Terraform으로 관리하고, 상태는 원격 백엔드에
  보관합니다.
- **파이프라인.** GitHub Actions에서 PR 시 plan을, merge 시 apply를 실행합니다.

## 실행

```bash
terraform init
terraform plan
terraform apply
```

## 메모

- 임시 섹션입니다. 상태 백엔드 선택, 캐시 무효화 단계, CORS 설정처럼 설명할
  가치가 있는 부분을 채워 넣으세요.
