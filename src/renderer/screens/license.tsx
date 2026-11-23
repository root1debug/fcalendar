import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSystem from '../hooks/use-system';
import { FIndex } from '../commons/interfaces';
import Loading from '../components/commons/loading';

export default function License() {
  const nav = useNavigate();
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const [loading, saveFile, loadFile, deleteFile] = useSystem();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClickAgree = () => {
    setIsLoading(true);

    // loadFile('index.json').then((res) => {
    //   const newIndex = JSON.parse(res.data as string) as FIndex;

    //   newIndex.license = true;
    //   saveFile(JSON.stringify(newIndex), 'index.json')
    //     .then((res) => {
    //       setIsLoading(false);
    //     })
    //     .catch((err) => {
    //       console.error('Error saving index.json:', err);
    //     });
    // });
    setIsLoading(false);
    nav('/');
  };

  return (
    <>
      <style>
        {`
      h1 {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
      }
      .subtitle {
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 1rem;
      }
      .notice {
        font-size: 0.9rem;
        color: #555;
        margin-bottom: 1rem;
      }
      h2 {
        font-size: 1.2rem;
        font-weight: bold;
        margin-top: 1rem; 
      margin-bottom: 0.5rem;  
      }
      p, li {
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
      }
        .button {
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          padding: 0.3rem 0.6rem;
          margin-right: 0.5rem;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }
        .button.selected {
         
         
        }
          .button:hover{
            background-color: #e0e0e0;
          }
          .info {
            font-size: 0.8rem;
            color: #555;
            margin-top: 1rem;
          }
    `}
      </style>
      <Loading isLoading={isLoading} />
      <div className="w-full p-6 pl-7 flex gap-2 justify-end pb-0">
        <div
          className={`button button-selection ${language === 'ko' ? 'selected' : ''} cursor-pointer`}
          onClick={() => setLanguage('ko')}
        >
          한국어
        </div>
        <div
          className={`button button-selection ${language === 'en' ? 'selected' : ''} cursor-pointer`}
          onClick={() => setLanguage('en')}
        >
          English
        </div>
      </div>
      <div className="h-full p-10 overflow-y-auto w-full">
        {language === 'ko' ? <KO /> : <EN />}
      </div>
      <div className="w-full p-4 flex flex-col justify-center items-center gap-4 pb-20">
        위 사용자는 본 계약 내용에 동의합니다. (The user agrees to the terms of this agreement.)
        <div className="button cursor-pointer ml-4" onClick={onClickAgree}>
          동의(Agree)
        </div>
      </div>
    </>
  );
}

function KO() {
  return (
    <>
      <h1>최종 사용자 라이선스 계약서</h1>
      <div className="subtitle">End User License Agreement (EULA)</div>
      <div className="notice">
        본 최종 사용자 라이선스 계약서(이하 "본 계약")는 본 소프트웨어를 제공하는
        <strong>ROOT</strong>(이하 "제공자")와 본 소프트웨어를 설치, 실행 또는 사용하는 개인 또는
        법인(이하 "사용자") 간의 소프트웨어 사용에 관한 계약입니다.
        <br />
        <br />
        사용자는 본 소프트웨어를 설치, 실행 또는 사용함으로써 본 계약의 내용을 확인하고 이에 동의한
        것으로 간주됩니다. 본 계약에 동의하지 않는 경우 사용자는 본 소프트웨어를 설치하거나
        사용해서는 안 됩니다.
      </div>
      <h2>제1조 (목적)</h2>
      <p>
        본 계약은 제공자가 사용자에게 제공하는 <strong>판타지 칼렌더</strong>(이하 "소프트웨어")의
        사용 조건, 허용 범위 및 제한 사항과 제공자 및 사용자의 권리와 의무를 정하는 것을 목적으로
        합니다.
      </p>
      <h2>제2조 (라이선스의 부여)</h2>
      <ol>
        <li>
          제공자는 사용자에게 본 계약의 조건에 따라 소프트웨어를 사용할 수 있는 제한적이고
          비독점적이며 양도 불가능한 사용권을 부여합니다.
        </li>
        <li>
          본 계약에 따른 사용권은 소프트웨어에 대한 소유권 또는 지식재산권의 이전을 의미하지
          않습니다.
        </li>
        <li>
          사용자는 제공자가 명시적으로 허용한 목적과 범위 내에서만 소프트웨어를 사용할 수 있습니다.
        </li>
        <li>
          제공자가 별도로 허용하지 않는 한 사용자는 본 계약에 따른 사용권을 제3자에게 양도, 대여,
          임대 또는 재허가할 수 없습니다.
        </li>
      </ol>
      <h2>제3조 (지식재산권)</h2>
      <ol>
        <li>
          소프트웨어 및 소프트웨어에 포함된 프로그램 코드, 실행 파일, 데이터, 구조, 디자인, 사용자
          인터페이스, 문서 및 기타 구성 요소에 관한 저작권 및 기타 지식재산권은 제공자 또는 정당한
          권리자에게 귀속됩니다.
        </li>
        <li>사용자는 본 계약에 명시적으로 규정된 사용권 이외의 어떠한 권리도 취득하지 않습니다.</li>
        <li>
          소프트웨어에 포함된 제3자 소프트웨어, 라이브러리 또는 기타 구성 요소에는 해당 제3자의 별도
          라이선스가 적용될 수 있습니다.
        </li>
      </ol>
      <h2>제4조 (금지 행위)</h2>
      <p>
        사용자는 관련 법령에 의하여 명시적으로 허용되거나 제공자의 사전 서면 허가를 받은 경우를
        제외하고 다음 각 호의 행위를 해서는 안 됩니다.
      </p>
      <ol>
        <li> 소프트웨어의 전부 또는 일부를 복제, 복사 또는 무단으로 배포하는 행위 </li>
        <li>
          소프트웨어를 판매, 재판매, 대여, 임대, 재라이선스 또는 기타 방법으로 제3자에게 제공하는
          행위
        </li>
        <li>
          소프트웨어 또는 그 일부를 인터넷, 파일 공유 서비스, 저장소, 커뮤니티 또는 기타 매체를
          통하여 무단으로 공개하거나 배포하는 행위
        </li>
        <li>
          소프트웨어를 역공학(Reverse Engineering), 역어셈블(Disassembly),
          디컴파일(Decompilation)하거나 소스 코드 또는 내부 구조를 추출, 분석 또는 복원하려는 행위
        </li>
        <li>
          소프트웨어의 실행 파일, 라이브러리, 리소스, 데이터 파일, 설정 파일 또는 기타 구성 요소를
          무단으로 수정, 변조, 패치 또는 교체하는 행위
        </li>
        <li>
          소프트웨어의 기술적 보호조치, 라이선스 확인 기능, 인증 기능 또는 기타 접근·사용 제한
          기능을 제거, 무력화 또는 우회하는 행위
        </li>
        <li>
          소프트웨어의 저작권 표시, 상표, 제작자 표시, 라이선스 표시 또는 기타 권리 고지를
          삭제하거나 변경하는 행위
        </li>
        <li>
          소프트웨어 또는 그 구성 요소를 자신의 제품인 것처럼 표시하거나 제3자에게 판매 또는
          제공하는 행위
        </li>
        <li>
          기타 본 계약에서 허용한 사용 범위를 벗어나 제공자의 저작권 또는 기타 지식재산권을 침해하는
          행위
        </li>
      </ol>
      <p>
        단, 관련 법령에 따라 특정한 역공학, 분석, 호환성 확보 등의 행위를 계약으로 제한할 수 없는
        경우에는 해당 법령이 허용하는 최소한의 범위에서 그 행위가 허용될 수 있습니다.
      </p>
      <h2>제5조 (재배포 및 상업적 이용)</h2>
      <ol>
        <li>
          사용자는 소프트웨어 자체 또는 그 복제본을 판매하거나 금전적 또는 기타 경제적 대가를 받고
          제공할 수 없습니다.
        </li>
        <li>
          사용자는 소프트웨어를 다른 제품이나 서비스에 포함하여 판매 또는 배포하거나, 소프트웨어의
          사용권을 별도의 상품 또는 서비스로 판매할 수 없습니다.
        </li>
        <li>
          제공자가 별도의 상업용 라이선스 또는 재배포 라이선스를 제공하는 경우에는 해당 라이선스의
          조건이 우선 적용됩니다.
        </li>
      </ol>
      <h2>제6조 (업데이트 및 변경)</h2>
      <ol>
        <li>
          제공자는 필요한 경우 소프트웨어의 기능, 구성 또는 제공 방식을 변경하거나 업데이트할 수
          있습니다.
        </li>
        <li> 업데이트 또는 새로운 버전에는 별도의 라이선스 조건이 적용될 수 있습니다. </li>
        <li>
          제공자는 관련 법령 또는 별도의 계약에서 달리 정하지 않는 한 특정 버전에 대한 지속적인
          업데이트 또는 지원을 보장하지 않습니다.
        </li>
      </ol>
      <h2>제7조 (사용자의 책임)</h2>
      <ol>
        <li> 사용자는 소프트웨어를 관련 법령 및 본 계약에 따라 사용하여야 합니다. </li>
        <li> 사용자가 본 계약을 위반하여 발생한 문제에 대해서는 사용자가 그 책임을 부담합니다. </li>
        <li>
          사용자는 자신의 사용 환경 및 데이터에 대한 적절한 백업 및 보안 조치를 수행할 책임이
          있습니다.
        </li>
      </ol>
      <h2>제8조 (보증의 제한)</h2>
      <ol>
        <li>
          소프트웨어는 관련 법령에서 달리 요구하지 않는 한 현재 제공되는 상태를 기준으로 제공됩니다.
        </li>
        <li>
          제공자는 소프트웨어가 사용자의 모든 목적이나 요구를 충족하거나 모든 환경에서 오류 없이
          작동한다는 것을 보증하지 않습니다.
        </li>
        <li>
          제공자는 발견된 오류 또는 문제를 수정하기 위해 합리적인 범위에서 업데이트를 제공할 수
          있으나, 모든 오류의 수정 또는 지속적인 지원을 보장하지 않습니다.
        </li>
        <li>
          본 조의 내용은 관련 법령에 따라 배제하거나 제한할 수 없는 사용자의 법적 권리를 제한하지
          않습니다.
        </li>
      </ol>
      <h2>제9조 (책임의 제한)</h2>
      <p>
        관련 법령에서 허용되는 범위 내에서 제공자는 사용자의 소프트웨어 사용 또는 사용 불능으로
        인하여 발생한 간접적, 부수적 또는 특별한 손해에 대하여 책임을 부담하지 않습니다.
      </p>
      <p>
        다만, 제공자의 고의 또는 중대한 과실로 발생한 손해 등 관련 법령상 책임을 제한하거나 배제할
        수 없는 경우에는 그러하지 않습니다.
      </p>
      <h2>제10조 (계약의 종료)</h2>
      <ol>
        <li>
          사용자가 본 계약의 조건을 중대하게 위반한 경우 제공자는 본 계약에 따른 사용권을 종료할 수
          있습니다.
        </li>
        <li>
          사용권이 종료된 경우 사용자는 소프트웨어의 사용을 중단하고, 관련 법령상 보존 의무가 있는
          경우를 제외하고 자신이 보유한 소프트웨어의 복제본을 삭제하여야 합니다.
        </li>
        <li>
          계약 종료 후에도 그 성질상 존속하여야 하는 지식재산권, 책임 제한 및 기타 관련 조항은 계속
          효력을 가질 수 있습니다.
        </li>
      </ol>
      <h2>제11조 (계약의 변경)</h2>
      <ol>
        <li>
          제공자는 법령의 변경, 소프트웨어 기능의 변경 또는 서비스 운영상 필요한 경우 본 계약을
          변경할 수 있습니다.
        </li>
        <li>
          변경된 계약이 기존 사용자의 권리 또는 의무에 중대한 영향을 미치는 경우 제공자는 합리적인
          방법으로 변경 내용을 고지합니다.
        </li>
        <li>
          관련 법령상 사용자의 별도 동의가 필요한 변경 사항에 대해서는 해당 법령에서 요구하는 절차를
          따릅니다.
        </li>
      </ol>
      <h2>제12조 (준거법 및 관할)</h2>
      <ol>
        <li> 본 계약은 대한민국 법률을 준거법으로 합니다. </li>
        <li>
          본 계약과 관련하여 분쟁이 발생한 경우 당사자는 우선 상호 협의를 통하여 해결하도록
          노력합니다.
        </li>
        <li>협의로 해결되지 않는 분쟁에 대해서는 관련 법령에서 정한 관할 법원을 따릅니다.</li>
      </ol>
      <h2>제13조 (일부 조항의 무효)</h2>
      <p>
        본 계약의 일부 조항이 관련 법령 또는 법원의 판단에 따라 무효 또는 집행 불가능한 것으로
        판단되더라도, 가능한 범위에서 나머지 조항의 효력에는 영향을 미치지 않습니다.
      </p>
      <h2>제14조 (전체 계약)</h2>
      <p>
        본 계약은 소프트웨어 사용에 관한 제공자와 사용자 간의 기본적인 합의를 구성합니다. 별도의
        서면 라이선스 계약, 상업용 라이선스 또는 기타 개별 계약이 체결된 경우 해당 개별 계약과 본
        계약이 충돌하는 범위에서는 개별 계약의 내용이 우선합니다.
      </p>
      <div className="info mt-4">
        <p>
          <strong>소프트웨어명</strong> 판타지 칼렌더
        </p>
        <p>
          <strong>제공자</strong> ROOT / com.tistory.terminal-node
        </p>
        <p>
          <strong>버전</strong> 0.0.1
        </p>
        <p>
          <strong>EULA 시행일</strong> 2026년 08월 9일
        </p>
        <p>
          <strong>문의</strong> wazavvodip@naver.com
        </p>
      </div>
    </>
  );
}

function EN() {
  return (
    <>
      <h1>End User License Agreement</h1> <div className="subtitle">EULA</div>
      <div className="notice">
        This End User License Agreement (the "Agreement") is a legal agreement between{' '}
        <strong>ROOT</strong> (the "Provider"), the provider of this software, and the individual or
        legal entity that installs, executes, or otherwise uses the software (the "User"). <br />
        <br /> By installing, executing, or using the Software, the User acknowledges that the User
        has read, understood, and agreed to be bound by the terms of this Agreement. If the User
        does not agree to the terms of this Agreement, the User must not install or use the
        Software.
      </div>
      <h2>Article 1 (Purpose)</h2>
      <p>
        The purpose of this Agreement is to define the terms and conditions governing the use of
        <strong>Fantasy Calendar</strong> (the "Software"), including the permitted scope of use,
        restrictions, and the respective rights and obligations of the Provider and the User.
      </p>
      <h2>Article 2 (Grant of License)</h2>
      <ol>
        <li>
          Subject to the terms and conditions of this Agreement, the Provider grants the User a
          limited, non-exclusive, and non-transferable license to use the Software.
        </li>
        <li>
          The license granted under this Agreement does not constitute a transfer of ownership or
          any intellectual property rights in or to the Software.
        </li>
        <li>
          The User may use the Software only for the purposes and within the scope expressly
          permitted by the Provider.
        </li>
        <li>
          Unless expressly authorized by the Provider, the User may not assign, rent, lease,
          sublicense, or otherwise transfer the license granted under this Agreement to any third
          party.
        </li>
      </ol>
      <h2>Article 3 (Intellectual Property Rights)</h2>
      <ol>
        <li>
          All copyrights and other intellectual property rights in and to the Software, including
          but not limited to its program code, executable files, data, structure, design, user
          interface, documentation, and other components, are owned by the Provider or their
          respective lawful rights holders.
        </li>
        <li>
          The User acquires no rights in or to the Software other than the limited right to use the
          Software as expressly provided in this Agreement.
        </li>
        <li>
          Third-party software, libraries, or other components included in the Software may be
          subject to separate license terms imposed by their respective rights holders.
        </li>
      </ol>
      <h2>Article 4 (Prohibited Activities)</h2>
      <p>
        Except where expressly permitted by applicable law or with the Provider's prior written
        authorization, the User must not engage in any of the following activities:
      </p>
      <ol>
        <li>
          Copying, reproducing, or distributing all or any portion of the Software without
          authorization.
        </li>
        <li>
          Selling, reselling, renting, leasing, sublicensing, or otherwise providing the Software to
          any third party.
        </li>
        <li>
          Publishing, uploading, sharing, or otherwise distributing the Software or any portion
          thereof through the Internet, file-sharing services, repositories, online communities, or
          any other medium without authorization.
        </li>
        <li>
          Reverse engineering, disassembling, decompiling, or otherwise attempting to derive,
          discover, reconstruct, or analyze the source code or internal structure of the Software.
        </li>
        <li>
          Modifying, altering, patching, replacing, tampering with, or otherwise changing any
          executable file, library, resource, data file, configuration file, or other component of
          the Software without authorization.
        </li>
        <li>
          Removing, disabling, bypassing, circumventing, or interfering with any technical
          protection measure, license verification mechanism, authentication mechanism, access
          restriction, or usage restriction incorporated into the Software.
        </li>
        <li>
          Removing or modifying any copyright notice, trademark, authorship notice, license notice,
          or other proprietary rights notice contained in or displayed by the Software.
        </li>
        <li>
          Representing the Software or any component thereof as the User's own product, or selling
          or otherwise providing it to any third party as such.
        </li>
        <li>
          Engaging in any other activity outside the scope of the license granted under this
          Agreement that infringes the Provider's copyrights or other intellectual property rights.
        </li>
      </ol>
      <p>
        Notwithstanding the foregoing, where applicable law expressly grants the User rights to
        perform certain acts of reverse engineering, analysis, or interoperability that cannot
        lawfully be restricted by contract, such acts shall be permitted only to the minimum extent
        required or permitted by applicable law.
      </p>
      <h2>Article 5 (Redistribution and Commercial Use)</h2>
      <ol>
        <li>
          The User may not redistribute the original Software or any modified version thereof to any
          third party without the Provider's prior written authorization.
        </li>
        <li>
          The User may not sell the Software or copies thereof, or otherwise provide the Software in
          exchange for monetary compensation or any other economic benefit.
        </li>
        <li>
          The User may not incorporate the Software into another product or service for sale or
          distribution, nor sell the right to use the Software as a separate product or service.
        </li>
        <li>
          If the Provider offers a separate commercial license, redistribution license, or other
          special license, the terms of such license shall prevail to the extent applicable.
        </li>
      </ol>
      <h2>Article 6 (Updates and Modifications)</h2>
      <ol>
        <li>
          The Provider may modify or update the features, configuration, or method of distribution
          of the Software when reasonably necessary.
        </li>
        <li>
          Updates or new versions of the Software may be subject to separate or additional license
          terms.
        </li>
        <li>
          Unless otherwise required by applicable law or a separate agreement, the Provider does not
          guarantee continued updates, maintenance, or support for any particular version of the
          Software.
        </li>
      </ol>
      <h2>Article 7 (User Responsibilities)</h2>
      <ol>
        <li>
          The User must use the Software in accordance with applicable laws and the terms of this
          Agreement.
        </li>
        <li>
          The User shall be responsible for issues or damages arising from the User's violation of
          this Agreement, subject to applicable law.
        </li>
        <li>
          The User is responsible for maintaining appropriate backups and security measures for the
          User's systems, environment, and data.
        </li>
      </ol>
      <h2>Article 8 (Disclaimer of Warranties)</h2>
      <ol>
        <li>
          Except as otherwise required by applicable law, the Software is provided on an "AS IS" and
          "AS AVAILABLE" basis.
        </li>
        <li>
          The Provider does not warrant that the Software will satisfy all of the User's purposes or
          requirements or that the Software will operate without errors in every environment.
        </li>
        <li>
          The Provider may provide updates to address discovered errors or issues within a
          reasonable scope, but does not guarantee that all errors will be corrected or that
          continuous maintenance or support will be provided.
        </li>
        <li>
          Nothing in this Article limits any statutory rights of the User that cannot lawfully be
          excluded or restricted.
        </li>
      </ol>
      <h2>Article 9 (Limitation of Liability)</h2>
      <p>
        To the maximum extent permitted by applicable law, the Provider shall not be liable for any
        indirect, incidental, special, or consequential damages arising out of or relating to the
        use of, or inability to use, the Software.
      </p>
      <p>
        The foregoing limitation shall not apply where liability cannot lawfully be excluded or
        limited, including where damages result from the Provider's intentional misconduct or gross
        negligence.
      </p>
      <h2>Article 10 (Termination)</h2>
      <ol>
        <li>
          If the User materially breaches any provision of this Agreement, the Provider may
          terminate the license granted under this Agreement.
        </li>
        <li>
          Upon termination of the license, the User must cease all use of the Software and delete
          all copies of the Software in the User's possession or control, except where retention is
          required by applicable law.
        </li>
        <li>
          Provisions concerning intellectual property rights, limitation of liability, and any other
          provisions that by their nature are intended to survive termination shall remain effective
          following termination of this Agreement.
        </li>
      </ol>
      <h2>Article 11 (Amendments to this Agreement)</h2>
      <ol>
        <li>
          The Provider may amend this Agreement where reasonably necessary due to changes in
          applicable law, changes to the Software, or operational requirements.
        </li>
        <li>
          If an amendment materially affects the rights or obligations of existing Users, the
          Provider shall provide reasonable notice of the amendment.
        </li>
        <li>
          Where applicable law requires separate consent from the User for a particular amendment,
          the Provider shall follow the procedure required by such law.
        </li>
      </ol>
      <h2>Article 12 (Governing Law and Jurisdiction)</h2>
      <ol>
        <li>
          This Agreement shall be governed by and construed in accordance with the laws of the
          Republic of Korea.
        </li>
        <li>
          In the event of any dispute arising out of or relating to this Agreement, the parties
          shall first attempt to resolve the dispute through good-faith consultation.
        </li>
        <li>
          If the dispute cannot be resolved through consultation, jurisdiction shall be determined
          in accordance with applicable laws governing jurisdiction and venue.
        </li>
      </ol>
      <h2>Article 13 (Severability)</h2>
      <p>
        If any provision of this Agreement is found to be invalid, unlawful, or unenforceable under
        applicable law or by a court of competent jurisdiction, the remaining provisions shall
        remain valid and enforceable to the fullest extent permitted by law.
      </p>
      <h2>Article 14 (Entire Agreement)</h2>
      <p>
        This Agreement constitutes the general agreement between the Provider and the User
        concerning the use of the Software. If the parties enter into a separate written license
        agreement, commercial license, or other individual agreement, the terms of such separate
        agreement shall prevail to the extent of any conflict with this Agreement.
      </p>
      <div className="info">
        <p>
          <strong>Software</strong> Fantasy Calendar
        </p>
        <p>
          <strong>Provider</strong> ROOT / com.tistory.terminal-node
        </p>
        <p>
          <strong>Version</strong> 0.0.1
        </p>
        <p>
          <strong>Effective Date</strong> 09 August 2026
        </p>
        <p>
          <strong>Contact</strong> wazavvodip@naver.com
        </p>
      </div>
    </>
  );
}
