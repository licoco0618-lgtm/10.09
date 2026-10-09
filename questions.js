// 會計科段考與主題訓練完整題庫
// 包含 11511 會計學 quiz 段考真題 (25題)、借貸法則專題特訓 (15題)、複式簿記實戰分錄 (15題)
// 複式簿記核心鐵律：有借必有貸，有貸必有借，借貸金額必相等

const QUIZ_DATA = {
  // 一、段考全真題庫 (25題：5 是非題 + 20 選擇題)
  examQuestions: [
    // 是非題 1-5
    {
      id: 1,
      type: "tf",
      category: "是非題",
      number: "01",
      question: "台北捷運公司採用營利事業會計。",
      options: ["O (正確)", "X (錯誤)"],
      answer: "O",
      explanation: "【正確】台北捷運股份有限公司為公司組織型態之公營事業，自負盈虧並計算損益，屬於營利事業會計（特殊行業會計中的交通運輸業會計），非政府公務會計。",
      tags: ["會計種類", "營利事業會計"]
    },
    {
      id: 2,
      type: "tf",
      category: "是非題",
      number: "02",
      question: "凡是能使企業的資產、負債、權益、收益及費損發生增減變化者，均屬會計事項。",
      options: ["O (正確)", "X (錯誤)"],
      answer: "O",
      explanation: "【正確】會計事項（交易）之定義：凡能引起企業會計五大要素（資產、負債、權益、收益、費損）發生增減變動之一切經濟事項，均屬會計事項。",
      tags: ["會計事項", "基本定義"]
    },
    {
      id: 3,
      type: "tf",
      category: "是非題",
      number: "03",
      question: "一個企業無論獲利或虧損，會計方程式一定保持平衡。",
      options: ["O (正確)", "X (錯誤)"],
      answer: "O",
      explanation: "【正確】在複式簿記「有借必有貸，有貸必有借，借貸金額必相等」原則下，基本會計方程式「資產 = 負債 + 權益」與動態方程式無論盈虧永遠保持恆等平衡。",
      tags: ["會計方程式", "借貸平衡"]
    },
    {
      id: 4,
      type: "tf",
      category: "是非題",
      number: "04",
      question: "會計循環就是營業循環。",
      options: ["O (正確)", "X (錯誤)"],
      answer: "X",
      explanation: "【錯誤】「會計循環」是每一會計期間週而復始之工作程序（分錄、過帳、試算、調整、結帳、編表）；「營業循環」是企業由現金購入存貨、銷售再轉回現金之營運過程，兩者涵義完全不同。",
      tags: ["會計循環", "營業循環"]
    },
    {
      id: 5,
      type: "tf",
      category: "是非題",
      number: "05",
      question: "公開發行公司的財務報表必須經過會計師的查核簽證。",
      options: ["O (正確)", "X (錯誤)"],
      answer: "O",
      explanation: "【正確】依我國《證券交易法》第36條規定，公開發行公司之年度財務報告，應經會計師查核簽證、董事會通過及監察人承認。",
      tags: ["公開發行", "會計師查核"]
    },

    // 選擇題 6-25
    {
      id: 6,
      type: "choice",
      category: "選擇題",
      number: "06",
      question: "自來水、電力等機關所採用之會計為",
      options: [
        "A. 政府會計",
        "B. 社團會計",
        "C. 非營利會計",
        "D. 公用事業會計"
      ],
      answer: "D",
      explanation: "【選 D】自來水事業、電力公司屬於公用事業，其所採用之會計為「公用事業會計」（屬於營利事業會計中的特殊行業會計）。",
      tags: ["會計分類", "公用事業"]
    },
    {
      id: 7,
      type: "choice",
      category: "選擇題",
      number: "07",
      question: "實帳戶是",
      options: [
        "A. 僅資產項目",
        "B. 僅資產、負債項目",
        "C. 資產、負債、權益",
        "D. 收益、費損"
      ],
      answer: "C",
      explanation: "【選 C】「實帳戶」（永久性帳戶）包含資產、負債、權益三大要素，其期末餘額會結轉至次期，列於資產負債表。收益與費損則屬於「虛帳戶」（暫時性帳戶）。",
      tags: ["實帳戶與虛帳戶", "帳戶分類"]
    },
    {
      id: 8,
      type: "choice",
      category: "選擇題",
      number: "08",
      question: "依我國商業會計法之規定，各項會計憑證，除應永久保存或有關未結會計事項者外，應於年度決算程序辦理終了後，至少保存",
      options: [
        "A. 五年",
        "B. 十年",
        "C. 十五年",
        "D. 廿年"
      ],
      answer: "A",
      explanation: "【選 A】依《商業會計法》第38條規定：各項會計憑證至少保存「五年」；各項會計帳簿及財務報表至少保存「十年」。",
      tags: ["商業會計法", "憑證保存年限"]
    },
    {
      id: 9,
      type: "choice",
      category: "選擇題",
      number: "09",
      question: "中古汽車商行之待售汽車，應列為",
      options: [
        "A. 機器設備成本",
        "B. 運輸設備成本",
        "C. 存貨",
        "D. 投資性不動產"
      ],
      answer: "C",
      explanation: "【選 C】中古車行之主要營業項目為買賣中古汽車，待出售之汽車屬於其主要營業商品，應列為「存貨」。若為公司自用公務車才列為「運輸設備」。",
      tags: ["資產分類", "存貨"]
    },
    {
      id: 10,
      type: "choice",
      category: "選擇題",
      number: "10",
      question: "購入商品而支付的運費屬於",
      options: [
        "A. 營業收入",
        "B. 營業成本",
        "C. 營業費用",
        "D. 營業外支出"
      ],
      answer: "B",
      explanation: "【選 B】購入商品支付的進貨運費為商品達到可供銷售狀態之必要成本，屬於商品取得成本（進貨加項），計入「營業成本」（銷貨成本）。",
      tags: ["進貨運費", "營業成本"]
    },
    {
      id: 11,
      type: "choice",
      category: "選擇題",
      number: "11",
      question: "根據「財務報導之觀念架構」，財務報表的基本假設是",
      options: [
        "A. 繼續經營個體",
        "B. 貨幣評價假設",
        "C. 企業個體假設",
        "D. 報導期間假設"
      ],
      answer: "A",
      explanation: "【選 A】在國際財務報導準則（IFRS）及我國企業會計準則（EAS）觀念架構中，財務報表編製的基礎假設即為「繼續經營假設」（Going Concern）。",
      tags: ["觀念架構", "基本假設"]
    },
    {
      id: 12,
      type: "choice",
      category: "選擇題",
      number: "12",
      question: "根據複式簿記，負債減少的交易可能會使",
      options: [
        "A. 負債增加",
        "B. 資產減少",
        "C. 權益增加",
        "D. 以上皆有可能"
      ],
      answer: "D",
      explanation: "【選 D】借記：負債減少。貸方可以是：(A)貸記負債增加（借新債償舊債）；(B)貸記資產減少（付現償債）；(C)貸記權益增加（債轉股或免除債務）。故以上皆有可能。",
      tags: ["複式簿記", "交易型態"]
    },
    {
      id: 13,
      type: "choice",
      category: "選擇題",
      number: "13",
      question: "所謂營業循環是指下列哪一個循環",
      options: [
        "A. 由以現金、進貨、銷貨，再回復為現金之循環",
        "B. 由分錄、試算、過帳迄編表止，週而復始",
        "C. 由以賒購起至以現金償付應付帳款之循環",
        "D. 由分錄、過帳、試算迄編表止，週而復始"
      ],
      answer: "A",
      explanation: "【選 A】營業循環（Operating cycle）指由投入現金、進貨、銷售商品，最終再收回現金之完整營運流程。(B)與(D)為會計循環。",
      tags: ["營業循環", "會計觀念"]
    },
    {
      id: 14,
      type: "choice",
      category: "選擇題",
      number: "14",
      question: "成功商店期末權益為$90,000，表示",
      options: [
        "A. 該商店本年度之淨利為$90,000",
        "B. 該商店的原始投入資本總額為$90,000",
        "C. 該商店期末資產總額減期末負債總額之餘額為$90,000",
        "D. 該商店收益減費損之餘額為$90,000"
      ],
      answer: "C",
      explanation: "【選 C】依基本會計方程式「資產 = 負債 + 權益」，移項後得「權益 = 資產 - 負債」，故期末權益即為期末資產總額減去期末負債總額之餘額。",
      tags: ["會計方程式", "業主權益"]
    },
    {
      id: 15,
      type: "choice",
      category: "選擇題",
      number: "15",
      question: "記載特定帳戶子項目之增減變動的帳簿為？",
      options: [
        "A. 子項目簿",
        "B. 明細分類帳簿",
        "C. 總分類帳簿",
        "D. 特種序時帳簿"
      ],
      answer: "B",
      explanation: "【選 B】「明細分類帳簿」（Subsidiary Ledger）專門用來詳實記錄總帳統制帳戶各個別子項目（如個別客戶之應收帳款明細）之增減變動。",
      tags: ["帳簿組織", "明細分類帳"]
    },
    {
      id: 16,
      type: "choice",
      category: "選擇題",
      number: "16",
      question: "為因應國際趨勢，我國公開發行公司自何時開始採用國際財務報導準則？",
      options: [
        "A. 2013 年",
        "B. 2014 年",
        "C. 2015 年",
        "D. 2016 年"
      ],
      answer: "A",
      explanation: "【選 A】我國第一階段公開發行公司（上市櫃公司、興櫃及金控業等）自2013年（民國102年）1月1日起開始全面採用IFRSs。",
      tags: ["國際準則", "IFRSs採用時程"]
    },
    {
      id: 17,
      type: "choice",
      category: "選擇題",
      number: "17",
      question: "對於獨資之營利事業，下列何者應入帳",
      options: [
        "A. 以資本主名義買入之古董字畫但實際上供私人收藏之用",
        "B. 資本主為了爭取業務以企業名義購買禮品餽贈顧客之交際費用",
        "C. 資本主名義買入汽車供資本主私人使用",
        "D. 以資本主名義跟銀行借款"
      ],
      answer: "B",
      explanation: "【選 B】根據「企業個體假設」，企業與業主個人的財務須嚴格分離。(A)(C)(D)皆為業主私人事務不得記入商店帳冊；(B)係為爭取業務以企業名義贈禮，屬企業營業費用（交際費），應予入帳。",
      tags: ["企業個體假設", "入帳原則"]
    },
    {
      id: 18,
      type: "choice",
      category: "選擇題",
      number: "18",
      question: "經濟部所採用的會計，下面哪一個描述是錯誤的？",
      options: [
        "A. 為非營利事業會計",
        "B. 僅記錄財務收支",
        "C. 須計算損益",
        "D. 即為「政府會計」"
      ],
      answer: "C",
      explanation: "【選 C】經濟部為國家公務行政機關，所採用之會計為「政府會計」（非營利事業會計），重點在於公務預算執行與公款收支紀錄，既無資本，亦不以營利為目的，因此「無需計算損益」，故(C)敘述錯誤。",
      tags: ["政府會計", "非營利會計"]
    },
    {
      id: 19,
      type: "choice",
      category: "選擇題",
      number: "19",
      question: "下列對於會計上所稱交易之敘述何者為非？",
      options: [
        "A. 會造成資產、負債、權益、收益及費損的增減變化",
        "B. 須完成雙方物品交換的行為",
        "C. 又稱為會計事項",
        "D. 必須記錄入帳"
      ],
      answer: "B",
      explanation: "【選 B】會計事項包括「內部事項」（如提列折舊、認列呆帳/壞帳、存貨盤損等調整事項），不必然涉及外部雙方物品交換，故(B)之敘述為非。",
      tags: ["會計事項", "交易定義"]
    },
    {
      id: 20,
      type: "choice",
      category: "選擇題",
      number: "20",
      question: "若本期收益總額大於費損總額時，會產生",
      options: [
        "A. 淨利",
        "B. 淨損",
        "C. 不一定",
        "D. 沒有影響"
      ],
      answer: "A",
      explanation: "【選 A】本期損益 = 收益總額 - 費損總額。當收益總額大於費損總額時，計算結果為正數，產生「本期淨利」（Net Income）。",
      tags: ["損益計算", "淨利"]
    },
    {
      id: 21,
      type: "choice",
      category: "選擇題",
      number: "21",
      question: "專為現金收付交易而設置的現金簿是屬於",
      options: [
        "A. 普通序時帳簿",
        "B. 特種序時帳簿",
        "C. 明細分類帳簿",
        "D. 以上皆非"
      ],
      answer: "B",
      explanation: "【選 B】序時帳簿（日記簿）中，專供登載某類特定繁多交易（如現金收付、進貨、銷貨）者稱為「特種序時帳簿」；登載一切未設特種帳簿交易者為「普通序時帳簿」。",
      tags: ["帳簿組織", "特種日記簿"]
    },
    {
      id: 22,
      type: "choice",
      category: "選擇題",
      number: "22",
      question: "會計事務處理的相關法令及一般公認會計原則：(1)商業會計法、(2)商業會計處理準則、(3)IFRSs、(4)EAS。小麗獨資設立電腦繪圖工作室，則其會計事務處理的優先順序為",
      options: [
        "A. (1)(3)(2)",
        "B. (2)(1)(4)",
        "C. (1)(2)(4)",
        "D. (3)(1)(2)"
      ],
      answer: "C",
      explanation: "【選 C】小麗之電腦繪圖工作室為獨資非公開發行之商業。法規遵循位階為：法律《商業會計法》(1) 優先於 法規命令《商業會計處理準則》(2)；在一般公認會計原則方面，中小企業優先採用企業會計準則公報(EAS)(4)，而非IFRSs(3)。故優先順序為(1)(2)(4)。",
      tags: ["法令位階", "準則適用"]
    },
    {
      id: 23,
      type: "choice",
      category: "選擇題",
      number: "23",
      question: "下列敘述何者為非？",
      options: [
        "A. 證期局主要管理證券與期貨之交易與公開發行事務",
        "B. 我國公開發行公司適用的一般公認會計原則為企業會計準則公報",
        "C. 目前IFRSs 由會計研究發展基金會負責翻譯",
        "D. 財務報表之編製須遵循一般公認會計原則"
      ],
      answer: "B",
      explanation: "【選 B】我國公開發行公司適用的一般公認會計原則為「國際財務報導準則（IFRSs）」，「企業會計準則公報（EAS）」則適用於非公開發行公司，故(B)選項錯誤。",
      tags: ["會計準則", "IFRS與EAS"]
    },
    {
      id: 24,
      type: "choice",
      category: "選擇題",
      number: "24",
      question: "財務會計的主要目的在於提供",
      options: [
        "A. 企業外部人士所需的通用性資訊",
        "B. 會計師查帳",
        "C. 企業經營管理者等內部使用者決策時所需的財務資訊",
        "D. 稅務主管機關的課稅依據"
      ],
      answer: "A",
      explanation: "【選 A】財務會計（Financial Accounting）的主要目標在於依照一般公認會計原則編製通用財務報表，以提供企業「外部使用者」（如投資人、債權人、主管機關等）作經濟決策之參考。內部管理者所需資訊主要由管理會計提供。",
      tags: ["財務會計", "會計目的"]
    },
    {
      id: 25,
      type: "choice",
      category: "選擇題",
      number: "25",
      question: "以下關於「一般公認會計原則」之敘述，何者正確？",
      options: [
        "A. 管理會計應遵循一般公認會計原則之規定",
        "B. 當稅法與一般公認會計原則有差異時，企業的帳載記錄應遵循稅法",
        "C. 一般公認會計原則乃由各縣市自行公告",
        "D. 財務會計須遵守我國相關法規及一般公認會計原則"
      ],
      answer: "D",
      explanation: "【選 D】(A)管理會計供內部參考不拘泥於GAAP；(B)平時帳載記錄應遵循一般公認會計原則，報稅時再作帳外申報調整；(C)會計原則由中央主管機關或準則研訂單位公告；(D)財務會計具有公信力要求，必須遵守我國相關法規及一般公認會計原則，故(D)正確。",
      tags: ["一般公認會計原則", "稅法與會計"]
    }
  ],

  // 二、借貸法則特訓題庫 (15題)
  debitCreditDrills: [
    {
      id: "dc_1",
      item: "庫存現金 (Cash)",
      change: "增加",
      element: "資產",
      answer: "借",
      hint: "資產增加記借方",
      explanation: "庫存現金為「資產」要素。資產增加記【借方 (Dr.)】，資產減少記貸方。"
    },
    {
      id: "dc_2",
      item: "應付帳款 (Accounts Payable)",
      change: "增加",
      element: "負債",
      answer: "貸",
      hint: "負債增加記貸方",
      explanation: "應付帳款為「負債」要素。負債增加記【貸方 (Cr.)】，負債減少記借方。"
    },
    {
      id: "dc_3",
      item: "業主資本 (Owner's Capital)",
      change: "增加",
      element: "權益",
      answer: "貸",
      hint: "權益增加記貸方",
      explanation: "業主資本為「權益」要素。權益增加記【貸方 (Cr.)】，權益減少記借方。"
    },
    {
      id: "dc_4",
      item: "銷貨收入 (Sales Revenue)",
      change: "增加",
      element: "收益",
      answer: "貸",
      hint: "收益增加記貸方",
      explanation: "銷貨收入為「收益」要素。收益增加記【貸方 (Cr.)】，收益減少記借方。"
    },
    {
      id: "dc_5",
      item: "薪資支出 (Salaries Expense)",
      change: "增加",
      element: "費損",
      answer: "借",
      hint: "費損增加記借方",
      explanation: "薪資支出為「費損」要素。費損增加記【借方 (Dr.)】，費損減少記貸方。"
    },
    {
      id: "dc_6",
      item: "銀行借款 (Bank Loan)",
      change: "減少",
      element: "負債",
      answer: "借",
      hint: "償還借款使負債降低",
      explanation: "銀行借款為「負債」要素。負債減少記【借方 (Dr.)】。"
    },
    {
      id: "dc_7",
      item: "應收帳款 (Accounts Receivable)",
      change: "減少",
      element: "資產",
      answer: "貸",
      hint: "客戶償還貨款使應收帳款收回",
      explanation: "應收帳款為「資產」要素。資產減少記【貸方 (Cr.)】。"
    },
    {
      id: "dc_8",
      item: "租金支出 (Rent Expense)",
      change: "增加",
      element: "費損",
      answer: "借",
      hint: "支付房租產生費用",
      explanation: "租金支出為「費損」要素。費損增加記【借方 (Dr.)】。"
    },
    {
      id: "dc_9",
      item: "預收貨款 (Unearned Revenue)",
      change: "增加",
      element: "負債",
      answer: "貸",
      hint: "預收客戶訂金尚未交貨屬履約義務",
      explanation: "預收貨款是向客戶先收錢尚未交貨，屬「負債」要素。負債增加記【貸方 (Cr.)】。"
    },
    {
      id: "dc_10",
      item: "文具用品 (Office Supplies)",
      change: "增加",
      element: "資產",
      answer: "借",
      hint: "購入未耗用之文具物料",
      explanation: "文具用品（或用品盤存）為「資產」要素。資產增加記【借方 (Dr.)】。"
    },
    {
      id: "dc_11",
      item: "利息收入 (Interest Income)",
      change: "增加",
      element: "收益",
      answer: "貸",
      hint: "存款收到利息屬於收入",
      explanation: "利息收入為「收益」要素。收益增加記【貸方 (Cr.)】。"
    },
    {
      id: "dc_12",
      item: "應付票據 (Notes Payable)",
      change: "減少",
      element: "負債",
      answer: "借",
      hint: "到期付清本票使應付票據註銷",
      explanation: "應付票據為「負債」要素。負債減少記【借方 (Dr.)】。"
    },
    {
      id: "dc_13",
      item: "辦公設備 (Office Equipment)",
      change: "增加",
      element: "資產",
      answer: "借",
      hint: "購買電腦設備使設備增加",
      explanation: "辦公設備為不動產、廠房及設備項下之「資產」要素。資產增加記【借方 (Dr.)】。"
    },
    {
      id: "dc_14",
      item: "業主往來 (Owner's Drawings / 資本主往來)",
      change: "增加 (業主提領現金自用)",
      element: "權益抵銷",
      answer: "借",
      hint: "業主提款自用使業主權益減少",
      explanation: "業主往來（提資）為「權益減少（借項）」項目。業主提取資金導致權益減少，記【借方 (Dr.)】。"
    },
    {
      id: "dc_15",
      item: "銷貨退回 (Sales Returns and Allowances)",
      change: "增加",
      element: "收益抵銷",
      answer: "借",
      hint: "銷貨收入的抵銷加項，使整體收益減少",
      explanation: "銷貨退回為「收益抵銷項目」。使銷貨收入淨額減少，因此借貸方向與收益增加相反，應記【借方 (Dr.)】。"
    }
  ],

  // 三、複式簿記實戰分錄題庫 (15題)
  // 核心鐵律：有借必有貸，有貸必有借，借貸金額必相等
  journalDrills: [
    {
      id: "je_1",
      scenario: "【創業投資】業主王先生出資現金 $300,000 開設成功商店。",
      transactionType: "資產增加，權益增加",
      debit: { account: "現金", amount: 300000 },
      credit: { account: "業主資本", amount: 300000 },
      explanation: "借：現金（資產增加 $300,000）\n貸：業主資本（權益增加 $300,000）\n★體現鐵律：有借必有貸，有貸必有借，借貸金額必相等。"
    },
    {
      id: "je_2",
      scenario: "【現金購貨】以現金 $40,000 購入商品一批。",
      transactionType: "資產增加，資產減少",
      debit: { account: "進貨", amount: 40000 },
      credit: { account: "現金", amount: 40000 },
      explanation: "借：進貨（成本/資產增加 $40,000）\n貸：現金（資產減少 $40,000）\n★體現鐵律：一資產增加，另一資產減少，借貸金額必相等。"
    },
    {
      id: "je_3",
      scenario: "【賒購商品】向大發公司賒購商品 $65,000，約定次月付款。",
      transactionType: "資產增加，負債增加",
      debit: { account: "進貨", amount: 65000 },
      credit: { account: "應付帳款", amount: 65000 },
      explanation: "借：進貨（成本增加 $65,000）\n貸：應付帳款（負債增加 $65,000）\n★體現鐵律：資產與負債同時增加，借貸金額必相等。"
    },
    {
      id: "je_4",
      scenario: "【現金銷貨】現銷商品一批，得款現金 $50,000。",
      transactionType: "資產增加，收益增加",
      debit: { account: "現金", amount: 50000 },
      credit: { account: "銷貨收入", amount: 50000 },
      explanation: "借：現金（資產增加 $50,000）\n貸：銷貨收入（收益增加 $50,000）\n★體現鐵律：有借必有貸，有貸必有借，借貸金額必相等。"
    },
    {
      id: "je_5",
      scenario: "【賒銷商品】賒銷商品一批給大明商店，金額 $72,000。",
      transactionType: "資產增加，收益增加",
      debit: { account: "應收帳款", amount: 72000 },
      credit: { account: "銷貨收入", amount: 72000 },
      explanation: "借：應收帳款（資產增加 $72,000）\n貸：銷貨收入（收益增加 $72,000）\n★體現鐵律：有借必有貸，有貸必有借，借貸金額必相等。"
    },
    {
      id: "je_6",
      scenario: "【收回欠款】收到大明商店償還前欠賒銷貨款現金 $72,000。",
      transactionType: "資產增加，資產減少",
      debit: { account: "現金", amount: 72000 },
      credit: { account: "應收帳款", amount: 72000 },
      explanation: "借：現金（資產增加 $72,000）\n貸：應收帳款（資產減少 $72,000）\n★體現鐵律：現金增，應收帳款減，借貸金額必相等。"
    },
    {
      id: "je_7",
      scenario: "【償還貨欠】以現金 $30,000 償還向大發公司之部分應付帳款。",
      transactionType: "負債減少，資產減少",
      debit: { account: "應付帳款", amount: 30000 },
      credit: { account: "現金", amount: 30000 },
      explanation: "借：應付帳款（負債減少 $30,000）\n貸：現金（資產減少 $30,000）\n★體現鐵律：負債與資產同時減少，借貸金額必相等。"
    },
    {
      id: "je_8",
      scenario: "【支付費用】以現金支付本月份員工薪資 $45,000。",
      transactionType: "費損增加，資產減少",
      debit: { account: "薪資支出", amount: 45000 },
      credit: { account: "現金", amount: 45000 },
      explanation: "借：薪資支出（費損增加 $45,000）\n貸：現金（資產減少 $45,000）\n★體現鐵律：有借必有貸，有貸必有借，借貸金額必相等。"
    },
    {
      id: "je_9",
      scenario: "【向銀行借款】向第一銀行借款 $100,000，款項直接存入商店之銀行存款帳戶。",
      transactionType: "資產增加，負債增加",
      debit: { account: "銀行存款", amount: 100000 },
      credit: { account: "銀行借款", amount: 100000 },
      explanation: "借：銀行存款（資產增加 $100,000）\n貸：銀行借款（負債增加 $100,000）\n★體現鐵律：資產增，負債增，借貸金額必相等。"
    },
    {
      id: "je_10",
      scenario: "【簽發票據買設備】購買辦公用電腦設備 $35,000，簽發一個月期商業本票乙紙支付。",
      transactionType: "資產增加，負債增加",
      debit: { account: "辦公設備", amount: 35000 },
      credit: { account: "應付票據", amount: 35000 },
      explanation: "借：辦公設備（資產增加 $35,000）\n貸：應付票據（負債增加 $35,000）\n★體現鐵律：有借必有貸，有貸必有借，借貸金額必相等。"
    },
    {
      id: "je_11",
      scenario: "【付租金】以現金支付本月份店面租金 $25,000。",
      transactionType: "費損增加，資產減少",
      debit: { account: "租金支出", amount: 25000 },
      credit: { account: "現金", amount: 25000 },
      explanation: "借：租金支出（費損增加 $25,000）\n貸：現金（資產減少 $25,000）\n★體現鐵律：費損借記，資產貸記，借貸金額必相等。"
    },
    {
      id: "je_12",
      scenario: "【預收訂金】接獲客戶訂單，預收定金現金 $15,000，約定下週交貨。",
      transactionType: "資產增加，負債增加",
      debit: { account: "現金", amount: 15000 },
      credit: { account: "預收貨款", amount: 15000 },
      explanation: "借：現金（資產增加 $15,000）\n貸：預收貨款（負債增加 $15,000）\n★體現鐵律：資產增，負債增，借貸金額必相等。"
    },
    {
      id: "je_13",
      scenario: "【業主提領資金】業主王先生因家庭私人開銷，由商店提取現金 $12,000。",
      transactionType: "權益減少，資產減少",
      debit: { account: "業主往來", amount: 12000 },
      credit: { account: "現金", amount: 12000 },
      explanation: "借：業主往來（權益減少 $12,000）\n貸：現金（資產減少 $12,000）\n★體現鐵律：權益減，資產減，借貸金額必相等。"
    },
    {
      id: "je_14",
      scenario: "【收到利息】銀行存款孳生利息 $850，銀行已直接撥入帳戶。",
      transactionType: "資產增加，收益增加",
      debit: { account: "銀行存款", amount: 850 },
      credit: { account: "利息收入", amount: 850 },
      explanation: "借：銀行存款（資產增加 $850）\n貸：利息收入（收益增加 $850）\n★體現鐵律：資產增，收益增，借貸金額必相等。"
    },
    {
      id: "je_15",
      scenario: "【借新償舊】簽發面額 $35,000 之新本票乙紙，以換回已到期之應付帳款 $35,000。",
      transactionType: "負債減少，負債增加",
      debit: { account: "應付帳款", amount: 35000 },
      credit: { account: "應付票據", amount: 35000 },
      explanation: "借：應付帳款（負債減少 $35,000）\n貸：應付票據（負債增加 $35,000）\n★體現鐵律：一負債減少，另一負債增加，借貸金額必相等。"
    }
  ],

  // 四、複式簿記九大交易型態歸納
  nineTransactionTypes: [
    { title: "型態 1", debit: "資產增加 (+)", credit: "資產減少 (-)", example: "現金購買文具用品、收回賒銷貨款存入現金" },
    { title: "型態 2", debit: "資產增加 (+)", credit: "負債增加 (+)", example: "向銀行借款存入戶頭、賒購商品、預收客戶貨款" },
    { title: "型態 3", debit: "資產增加 (+)", credit: "權益增加 (+)", example: "業主現金投資開店、現銷商品認列銷貨收入" },
    { title: "型態 4", debit: "負債減少 (-)", credit: "資產減少 (-)", example: "以現金償還向廠商賒欠之應付帳款、還銀行貸款" },
    { title: "型態 5", debit: "負債減少 (-)", credit: "負債增加 (+)", example: "簽發本票償付即將到期之應付帳款（借新還舊）" },
    { title: "型態 6", debit: "負債減少 (-)", credit: "權益增加 (+)", example: "債權人同意將債款轉為公司股份資本（債轉股）" },
    { title: "型態 7", debit: "權益減少 (-)", credit: "資產減少 (-)", example: "業主提取現金自用、現付水電費與員工薪資支出" },
    { title: "型態 8", debit: "權益減少 (-)", credit: "負債增加 (+)", example: "期末宣告發放現金股利（認列應付股利負債）" },
    { title: "型態 9", debit: "權益減少 (-)", credit: "權益增加 (+)", example: "盈餘轉增資配發股票股利（未分配盈餘轉為股本）" }
  ]
};
