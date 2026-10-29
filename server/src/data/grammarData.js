export const initialGrammarList = [
  // ===================== JLPT N5 =====================
  {
    pattern: "〜てはいけない",
    romaji: "te wa ikenai",
    meaning: "Không được làm gì đó (cấm đoán)",
    jlptLevel: "N5",
    structure: "V-て + はいけない / はいけません",
    formation: "Động từ chia thể て + はいけません (Lịch sự) / はいけない (Thông thường)",
    explanation: "Dùng để biểu thị sự cấm đoán, nội quy hoặc yêu cầu người nghe tuyệt đối không làm điều gì đó.",
    caution: "Không dùng câu này với người trên hoặc cấp trên vì mang sắc thái cấm đoán nghiêm khắc.",
    tags: ["Cấm đoán", "Nội quy", "Thể Te"],
    examples: [
      {
        japanese: "ここで写真を撮ってはいけません。",
        reading: "ここでしゃしんをとってはいけません。",
        vietnamese: "Không được chụp ảnh ở đây.",
        furiganaHtml: "ここで<ruby>写真<rt>しゃしん</rt></ruby>を<ruby>撮<rt>と</rt></ruby>ってはいけません。"
      },
      {
        japanese: "テスト中、話してはいけません。",
        reading: "テストちゅう、はなしてはいけません。",
        vietnamese: "Trong giờ thi không được nói chuyện.",
        furiganaHtml: "テスト<ruby>中<rt>ちゅう</rt></ruby>、<ruby>話<rt>はな</rt></ruby>してはいけません。"
      }
    ],
    quizzes: [
      {
        question: "美術館の中でお酒を飲ん____はいけません。",
        options: ["で", "だ", "て", "に"],
        correctIndex: 0,
        explanation: "Động từ 飲む (nomu) chia thể Te là 飲んで (nonde). Đi với はいけません thành 飲んではいけません."
      }
    ]
  },
  {
    pattern: "〜てもいい",
    romaji: "te mo ii",
    meaning: "Được phép làm gì đó (xin phép / cho phép)",
    jlptLevel: "N5",
    structure: "V-て + もいいですか / もいいです",
    formation: "Động từ chia thể て + もいい",
    explanation: "Dùng để xin phép được làm gì (〜てもいいですか) hoặc cho phép ai làm gì (〜てもいいです).",
    caution: "Khi cho phép người trên, nên dùng 〜ても構いません hoặc thể khiêm nhường.",
    tags: ["Cho phép", "Xin phép", "Thể Te"],
    examples: [
      {
        japanese: "ここに座ってもいいですか。",
        reading: "ここにすわってもいいですか。",
        vietnamese: "Tôi có thể ngồi ở đây được không?",
        furiganaHtml: "ここに<ruby>座<rt>すわ</rt></ruby>ってもいいですか。"
      },
      {
        japanese: "窓を開けてもいいですよ。",
        reading: "まどをあけてもいいですよ。",
        vietnamese: "Bạn mở cửa sổ ra cũng được đấy.",
        furiganaHtml: "<ruby>窓<rt>まど</rt></ruby>を<ruby>開<rt>あ</rt></ruby>けてもいいですよ。"
      }
    ],
    quizzes: [
      {
        question: "すみません、このペンを____もいいですか。",
        options: ["使って", "使う", "使った", "使い"],
        correctIndex: 0,
        explanation: "Mẫu câu xin phép '〜てもいいですか' yêu cầu động từ đứng trước phải chia ở thể Te (使って)."
      }
    ]
  },
  {
    pattern: "〜たことがある",
    romaji: "ta koto ga aru",
    meaning: "Đã từng làm gì đó (nói về kinh nghiệm trong quá khứ)",
    jlptLevel: "N5",
    structure: "V-た + ことがある / あります",
    formation: "Động từ thể Quá khứ ngắn (V-た) + ことがある",
    explanation: "Dùng để nói về trải nghiệm hoặc việc đã từng xảy ra ít nhất một lần trong đời cho tới thời điểm hiện tại.",
    caution: "Không dùng để nói về hành động thường ngày trong quá khứ gần (như 'hôm qua tôi đã ăn cơm').",
    tags: ["Kinh nghiệm", "Quá khứ", "Thể Ta"],
    examples: [
      {
        japanese: "日本へ行ったことがありますか。",
        reading: "にほんへいったことがありますか。",
        vietnamese: "Bạn đã từng đến Nhật Bản chưa?",
        furiganaHtml: "<ruby>日本<rt>にほん</rt></ruby>へ<ruby>行<rt>い</rt></ruby>ったことがありますか。"
      },
      {
        japanese: "富士山に登ったことがある。",
        reading: "ふじさんにのぼったことがある。",
        vietnamese: "Tôi từng leo núi Phú Sĩ rồi.",
        furiganaHtml: "<ruby>富士山<rt>ふじさん</rt></ruby>に<ruby>登<rt>のぼ</rt></ruby>ったことがある。"
      }
    ],
    quizzes: [
      {
        question: "納豆を一度も____ことがありません。",
        options: ["食べた", "食べる", "食べ", "食べて"],
        correctIndex: 0,
        explanation: "Cấu trúc kinh nghiệm yêu cầu thể Ta (quá khứ thể thông thường) + ことがある. Do đó là 食べた."
      }
    ]
  },
  {
    pattern: "〜ないでください",
    romaji: "naide kudasai",
    meaning: "Xin đừng làm gì đó (yêu cầu phủ định lịch sự)",
    jlptLevel: "N5",
    structure: "V-ない + でください",
    formation: "Động từ thể Phủ định ngắn (V-ない) + でください",
    explanation: "Dùng để nhờ vả hoặc yêu cầu ai đó không làm một hành động nào đó một cách lịch sự.",
    caution: "Vẫn mang tính yêu cầu nên cần cân nhắc khi nói với bề trên.",
    tags: ["Yêu cầu", "Phủ định", "Thể Nai"],
    examples: [
      {
        japanese: "ここでタバコを吸わないでください。",
        reading: "ここでたばこをすわないでください。",
        vietnamese: "Xin đừng hút thuốc ở đây.",
        furiganaHtml: "ここでタバコを<ruby>吸<rt>す</rt></ruby>わないでください。"
      },
      {
        japanese: "心配しないでください。",
        reading: "しんぱいしないでください。",
        vietnamese: "Xin đừng lo lắng.",
        furiganaHtml: "<ruby>心配<rt>しんぱい</rt></ruby>しないでください。"
      }
    ],
    quizzes: [
      {
        question: "図書館ですから、大声で____でください。",
        options: ["話さない", "話して", "話す", "話し"],
        correctIndex: 0,
        explanation: "Cấu trúc xin đừng làm gì: V-ない + でください. 話す -> 話さない + でください."
      }
    ]
  },
  {
    pattern: "〜たい / 〜たくない",
    romaji: "tai / takunai",
    meaning: "Muốn / Không muốn làm gì (nguyện vọng của bản thân)",
    jlptLevel: "N5",
    structure: "V-ます (bỏ ます) + たい / たくない",
    formation: "Bỏ đuôi ます, thêm たい (muốn) hoặc たくない (không muốn). Chia đuôi như tính từ đuôi い.",
    explanation: "Dùng để biểu thị mong muốn làm một hành động của ngôi thứ nhất (tôi) hoặc hỏi ngôi thứ hai (bạn).",
    caution: "Không dùng trực tiếp 〜たい để nói về mong muốn của người thứ ba (cần dùng 〜たがっている).",
    tags: ["Mong muốn", "Ý muốn"],
    examples: [
      {
        japanese: "日本料理を食べたいです。",
        reading: "にほんりょうりをたべたいです。",
        vietnamese: "Tôi muốn ăn món ăn Nhật Bản.",
        furiganaHtml: "<ruby>日本料理<rt>にほんりょうり</rt></ruby>を<ruby>食<rt>た</rt></ruby>べたいです。"
      },
      {
        japanese: "今日はどこへも行きたくない。",
        reading: "きょうはどこへもいきたくない。",
        vietnamese: "Hôm nay tôi chẳng muốn đi đâu cả.",
        furiganaHtml: "<ruby>今日<rt>きょう</rt></ruby>はどこへも<ruby>行<rt>い</rt></ruby>きたくない。"
      }
    ],
    quizzes: [
      {
        question: "新しいパソコンを____たいです。",
        options: ["買い", "買う", "買って", "買っ"],
        correctIndex: 0,
        explanation: "Động từ bỏ đuôi ます: 買います -> 買い + たい = 買いたい (Muốn mua)."
      }
    ]
  },

  // ===================== JLPT N4 =====================
  {
    pattern: "〜ほうがいい",
    romaji: "hou ga ii",
    meaning: "Nên / Không nên làm gì đó (lời khuyên)",
    jlptLevel: "N4",
    structure: "V-た + ほうがいい / V-ない + ほうがいい",
    formation: "Khuyên nên làm: Động từ thể Ta + ほうがいい. Khuyên không nên làm: Động từ thể Nai + ほうがいい.",
    explanation: "Dùng để đưa ra lời khuyên hoặc gợi ý cho người nghe nên hay không nên làm việc gì.",
    caution: "Mang tính khuyên bảo trực tiếp, nếu đối phương lớn tuổi hơn cần dùng cách nói khéo léo hơn.",
    tags: ["Lời khuyên", "Gợi ý"],
    examples: [
      {
        japanese: "風邪を引いたから、早く寝たほうがいいですよ。",
        reading: "かぜをひいたから、はやくねたほうがいいですよ。",
        vietnamese: "Vì bị cảm rồi nên bạn nên đi ngủ sớm đi nhé.",
        furiganaHtml: "<ruby>風邪<rt>かぜ</rt></ruby>を<ruby>引<rt>ひ</rt></ruby>いたから、<ruby>早<rt>はや</rt></ruby>く<ruby>寝<rt>ね</rt></ruby>たほうがいいですよ。"
      },
      {
        japanese: "夜遅くにお菓子を食べないほうがいい。",
        reading: "よるおそくにおかしをたべないほうがいい。",
        vietnamese: "Không nên ăn bánh kẹo vào đêm muộn.",
        furiganaHtml: "<ruby>夜遅<rt>よるおそ</rt></ruby>くにお<ruby>菓子<rt>かし</rt></ruby>を<ruby>食<rt>た</rt></ruby>べないほうがいい。"
      }
    ],
    quizzes: [
      {
        question: "熱があるなら、病院へ____ほうがいいです。",
        options: ["行った", "行く", "行って", "行かない"],
        correctIndex: 0,
        explanation: "Khi khuyên ai đó NÊN làm việc gì, ta dùng V-た + ほうがいい. 行く -> 行った + ほうがいい."
      }
    ]
  },
  {
    pattern: "〜すぎる",
    romaji: "sugiru",
    meaning: "Quá mức, làm gì đó quá nhiều (mang ý tiêu cực)",
    jlptLevel: "N4",
    structure: "V-ます (bỏ ます) / A-い (bỏ い) / A-な (bỏ な) + すぎる",
    formation: "Động từ bỏ ます + すぎる; Tính từ đuôi い bỏ い + すぎる; Tính từ đuôi な bỏ な + すぎる.",
    explanation: "Biểu thị hành động hoặc tính chất vượt quá giới hạn bình thường, thường mang lại kết quả không tốt.",
    caution: "Được chia như một động từ nhóm 2 (Ichidan: すぎます, すぎて, すぎた).",
    tags: ["Mức độ", "Quá mức"],
    examples: [
      {
        japanese: "昨日、お酒を飲みすぎました。",
        reading: "きのう、おさけをのみすぎました。",
        vietnamese: "Hôm qua tôi đã uống quá nhiều rượu.",
        furiganaHtml: "<ruby>昨日<rt>きのう</rt></ruby>、お<ruby>酒<rt>さけ</rt></ruby>を<ruby>飲<rt>の</rt></ruby>みすぎました。"
      },
      {
        japanese: "この問題は難しすぎる。",
        reading: "このもんだいはむずかしすぎる。",
        vietnamese: "Câu hỏi này quá khó.",
        furiganaHtml: "この<ruby>問題<rt>もんだい</rt></ruby>は<ruby>難<rt>むずか</rt></ruby>しすぎる。"
      }
    ],
    quizzes: [
      {
        question: "テレビを____すぎて、目が痛くなりました。",
        options: ["見", "見て", "見る", "見ない"],
        correctIndex: 0,
        explanation: "Động từ bỏ đuôi ます: 見ます -> 見 + すぎて = 見すぎて (Xem quá nhiều)."
      }
    ]
  },
  {
    pattern: "〜ようにする",
    romaji: "you ni suru",
    meaning: "Cố gắng làm / cố gắng không làm gì (tạo thói quen)",
    jlptLevel: "N4",
    structure: "V-る / V-ない + ようにする / ようにしています",
    formation: "Động từ thể từ điển (V-る) hoặc thể phủ định (V-ない) + ようにする",
    explanation: "Diễn tả sự nỗ lực tạo lập một thói quen hoặc cố gắng ý thức thực hiện việc gì đều đặn.",
    caution: "Thường dùng ở dạng 〜ようにしています để nói về thói quen hiện tại đang duy trì.",
    tags: ["Nỗ lực", "Thói quen"],
    examples: [
      {
        japanese: "毎日野菜を食べるようにしています。",
        reading: "まいにちやさいをたべるようにしています。",
        vietnamese: "Tôi luôn cố gắng ăn rau mỗi ngày.",
        furiganaHtml: "<ruby>毎日<rt>まいにち</rt></ruby><ruby>野菜<rt>やさい</rt></ruby>を<ruby>食<rt>た</rt></ruby>べるようにしています。"
      },
      {
        japanese: "夜遅くスマホを見ないようにする。",
        reading: "よるおそくスマホをみないようにする。",
        vietnamese: "Tôi sẽ cố gắng không xem điện thoại vào đêm muộn.",
        furiganaHtml: "<ruby>夜遅<rt>よるおそ</rt></ruby>くスマホを<ruby>見<rt>み</rt></ruby>ないようにする。"
      }
    ],
    quizzes: [
      {
        question: "健康のために、甘いものを____ようにしています。",
        options: ["食べない", "食べる", "食べて", "食べた"],
        correctIndex: 0,
        explanation: "Để giữ gìn sức khoẻ, cố gắng 'không ăn' đồ ngọt: V-ない (食べない) + ようにしています."
      }
    ]
  },
  {
    pattern: "〜てしまう / 〜ちゃう",
    romaji: "te shimau / chau",
    meaning: "Lỡ làm việc gì đó (nuối tiếc) / Hoàn thành triệt để",
    jlptLevel: "N4",
    structure: "V-て + しまう / しまいました",
    formation: "Động từ thể Te + しまう (Văn nói thân mật: 〜てしまう -> 〜ちゃう, 〜でしまう -> 〜じゃう)",
    explanation: "1. Thể hiện sự tiếc nuối khi lỡ làm điều gì đó không mong muốn. 2. Thể hiện hành động đã hoàn tất trọn vẹn.",
    caution: "Cần phân biệt rõ ngữ cảnh xem câu mang ý nuối tiếc hay ý hoàn tất.",
    tags: ["Nuối tiếc", "Hoàn thành", "Văn nói"],
    examples: [
      {
        japanese: "大事な財布を電車の中に忘れてしまいました。",
        reading: "だいじなさいふをでんしゃのなかにわすれてしまいました。",
        vietnamese: "Tôi đã lỡ để quên chiếc ví quan trọng trên tàu điện mất rồi.",
        furiganaHtml: "<ruby>大事<rt>だいじ</rt></ruby>な<ruby>財布<rt>さいふ</rt></ruby>を<ruby>電車<rt>でんしゃ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>に<ruby>忘<rt>わす</rt></ruby>れてしまいました。"
      },
      {
        japanese: "宿題を全部やってしまった。",
        reading: "しゅくだいをぜんぶやってしまった。",
        vietnamese: "Tôi đã làm xong sạch sẽ bài tập về nhà rồi.",
        furiganaHtml: "<ruby>宿題<rt>しゅくだい</rt></ruby>を<ruby>全部<rt>ぜんぶ</rt></ruby>やってしまった。"
      }
    ],
    quizzes: [
      {
        question: "うっかり約束の時間を____しまいました。",
        options: ["間違えて", "間違える", "間違えた", "間違え"],
        correctIndex: 0,
        explanation: "Động từ thể Te đi với しまう: 間違える -> 間違えてしまいました."
      }
    ]
  },

  // ===================== JLPT N3 =====================
  {
    pattern: "〜わけではない",
    romaji: "wake dewa nai",
    meaning: "Không hẳn là, không có nghĩa là (phủ định một phần)",
    jlptLevel: "N3",
    structure: "Thể thông thường (Na/N + な) + わけではない",
    formation: "Động từ/Tính từ thể thông thường + わけではない. Tính từ đuôi な giữ な, Danh từ thêm な/である.",
    explanation: "Dùng để phủ định một phần nhận định, không hoàn toàn đồng ý 100% với suy nghĩ thông thường.",
    caution: "Thường dùng trong văn viết hoặc đối thoại mang tính giải thích lý do cụ thể.",
    tags: ["Phủ định", "Khẳng định nhẹ", "N3 Cốt lõi"],
    examples: [
      {
        japanese: "日本料理が嫌いなわけではありませんが、納豆は苦手です。",
        reading: "にほんりょうりがきらいなわけではありませんが、なっとうはにがてです。",
        vietnamese: "Không hẳn là tôi ghét đồ ăn Nhật, nhưng tôi không ăn được món Natto.",
        furiganaHtml: "<ruby>日本料理<rt>にほんりょうり</rt></ruby>が<ruby>嫌<rt>きら</rt></ruby>いなわけではありませんが、<ruby>納豆<rt>なっとう</rt></ruby>は<ruby>苦手<rt>にがて</rt></ruby>です。"
      },
      {
        japanese: "暇なわけではないが、手伝ってあげるよ。",
        reading: "ひまなわけではないが、てつだってあげるよ。",
        vietnamese: "Không hẳn là tôi rảnh rỗi đâu, nhưng tôi sẽ giúp bạn một tay.",
        furiganaHtml: "<ruby>暇<rt>ひま</rt></ruby>なわけではないが、<ruby>手伝<rt>てつだ</rt></ruby>ってあげるよ。"
      }
    ],
    quizzes: [
      {
        question: "全く日本語が話せない____ではありません。",
        options: ["わけ", "はず", "もの", "こと"],
        correctIndex: 0,
        explanation: "Cấu trúc '〜わけではない' mang ý nghĩa phủ định một phần: 'Không hẳn là hoàn toàn không nói được tiếng Nhật'."
      }
    ]
  },
  {
    pattern: "〜おかげで / 〜せいで",
    romaji: "okage de / sei de",
    meaning: "Nhờ có... (kết quả tốt) / Tại vì... (kết quả xấu)",
    jlptLevel: "N3",
    structure: "Thể thông thường (Na/N + な/の) + おかげで / せいで",
    formation: "Danh từ + の + おかげで/せいで; Động từ/Tính từ thể ngắn + おかげで/せいで.",
    explanation: "おかげで dùng khi biết ơn vì nhờ nguyên nhân đó mà có kết quả tốt. せいで dùng để đổ lỗi/than phiền vì nguyên nhân đó mà dẫn đến kết quả xấu.",
    caution: "Tránh nhầm lẫn sắc thái: Đừng dùng せいで khi nói về sự giúp đỡ của người khác.",
    tags: ["Nguyên nhân", "Lý do", "Sắc thái"],
    examples: [
      {
        japanese: "先生のおかげで、JLPT N3に合格できました。",
        reading: "せんせいのおかげで、JLPT N3にごうかくできました。",
        vietnamese: "Nhờ có thầy cô mà tôi đã đỗ kỳ thi JLPT N3.",
        furiganaHtml: "<ruby>先生<rt>せんせい</rt></ruby>のおかげで、JLPT N3に<ruby>合格<rt>ごうかく</rt></ruby>できました。"
      },
      {
        japanese: "台風のせいで、電車が止まってしまった。",
        reading: "たいふうのせいで、でんしゃがとまってしまった。",
        vietnamese: "Tại cơn bão mà tàu điện bị ngừng hoạt động mất rồi.",
        furiganaHtml: "<ruby>台風<rt>たいふう</rt></ruby>のせいで、<ruby>電車<rt>でんしゃ</rt></ruby>が<ruby>止<rt>と</rt></ruby>まってしまった。"
      }
    ],
    quizzes: [
      {
        question: "毎日練習した____、ピアノが上手に弾けるようになりました。",
        options: ["おかげで", "せいで", "ために", "わりに"],
        correctIndex: 0,
        explanation: "Kết quả tích cực ('đánh piano thành thạo') nên sử dụng 'おかげで' (Nhờ có...)."
      }
    ]
  },
  {
    pattern: "〜に違いない",
    romaji: "ni chigainai",
    meaning: "Chắc chắn là..., không thể sai được (phán đoán mạnh mẽ)",
    jlptLevel: "N3",
    structure: "Thể thông thường (Na/N không cần だ) + に違いない",
    formation: "Động từ/Tính từ thể thông thường + に違いない. Danh từ và Tính từ đuôi な ghép trực tiếp không có だ.",
    explanation: "Người nói có trực giác mạnh mẽ hoặc căn cứ chắc chắn tin rằng điều đó đúng 100%.",
    caution: "Khẳng định rất quả quyết, mạnh hơn 〜でしょう hoặc 〜はずだ.",
    tags: ["Phán đoán", "Chắc chắn"],
    examples: [
      {
        japanese: "彼があんなに喜んでいるのだから、試験に受かったに違いない。",
        reading: "かれがあんなによろこんでいるのだから、しけんにうかったにちがいない。",
        vietnamese: "Anh ấy vui sướng đến thế kia thì chắc chắn là đã đỗ kỳ thi rồi.",
        furiganaHtml: "<ruby>彼<rt>かれ</rt></ruby>があんなに<ruby>喜<rt>よろこ</rt></ruby>んでいるのだから、<ruby>試験<rt>しけん</rt></ruby>に<ruby>受<rt>う</rt></ruby>かったに<ruby>違<rt>ちが</rt></ruby>いない。"
      },
      {
        japanese: "犯人はあの男に違いない。",
        reading: "はんにんはあのおとこにちがいない。",
        vietnamese: "Thủ phạm chắc chắn là gã đàn ông kia.",
        furiganaHtml: "<ruby>犯人<rt>はんにん</rt></ruby>はあの<ruby>男<rt>おとこ</rt></ruby>に<ruby>違<rt>ちが</rt></ruby>いない。"
      }
    ],
    quizzes: [
      {
        question: "部屋の電気がついているから、誰か____に違いない。",
        options: ["いる", "いて", "いた", "い"],
        correctIndex: 0,
        explanation: "Hiện tại đèn đang bật -> chắc chắn có ai đó đang ở trong phòng: いる + に違いない."
      }
    ]
  },
  {
    pattern: "〜たとたん(に)",
    romaji: "ta totan ni",
    meaning: "Ngay sau khi... thì đột ngột xảy ra...",
    jlptLevel: "N3",
    structure: "V-た + とたん(に)",
    formation: "Động từ thể Quá khứ ngắn (V-た) + とたんに",
    explanation: "Diễn tả một sự việc xảy ra gần như ngay tức khắc sau hành động trước, thường là sự việc bất ngờ ngoài dự kiến.",
    caution: "Vế sau không dùng với ý chí, mệnh lệnh hay dự định của người nói.",
    tags: ["Thời điểm", "Bất ngờ", "Khoảnh khắc"],
    examples: [
      {
        japanese: "窓を開けたとたん、冷たい風が入ってきた。",
        reading: "まどをあけたとたん、つめたいかぜがはいってきた。",
        vietnamese: "Vừa mới mở cửa sổ ra thì cơn gió lạnh lập tức ùa vào.",
        furiganaHtml: "<ruby>窓<rt>まど</rt></ruby>を<ruby>開<rt>あ</rt></ruby>けたとたん、<ruby>冷<rt>つめ</rt></ruby>たい<ruby>風<rt>かぜ</rt></ruby>が<ruby>入<rt>はい</rt></ruby>ってきた。"
      },
      {
        japanese: "薬を飲んだとたんに、眠くなってきた。",
        reading: "くすりをのんだとたんに、ねむくなってきた。",
        vietnamese: "Vừa mới uống thuốc xong là cơn buồn ngủ ập đến ngay.",
        furiganaHtml: "<ruby>薬<rt>くすり</rt></ruby>を<ruby>飲<rt>の</rt></ruby>んだとたんに、<ruby>眠<rt>ねむ</rt></ruby>くなってきた。"
      }
    ],
    quizzes: [
      {
        question: "立ち上がった____、めまいがした。",
        options: ["とたん", "ばかり", "まえに", "あいだ"],
        correctIndex: 0,
        explanation: "Diễn tả vừa đứng dậy thì lập tức bị chóng mặt ngoài ý muốn: V-た + とたん."
      }
    ]
  }
];

// ===================== Dữ liệu luyện chia thể động từ (Verb Conjugation Drills) =====================
export const verbConjugationData = [
  {
    verb: "書く",
    reading: "かく",
    romaji: "kaku",
    meaning: "Viết",
    group: "Nhóm 1 (Godan)",
    conjugations: {
      te: { form: "書いて", reading: "かいて", romaji: "kaite", explanation: "Đuôi 'く' đổi thành 'いて'" },
      ta: { form: "書いた", reading: "かいた", romaji: "kaita", explanation: "Đuôi 'く' đổi thành 'いた'" },
      nai: { form: "書かない", reading: "かかない", romaji: "kakanai", explanation: "Cột 'u' chuyển sang cột 'a' + ない" },
      potential: { form: "書ける", reading: "かける", romaji: "kakeru", explanation: "Cột 'u' chuyển sang cột 'e' + る (Có thể viết)" },
      passive: { form: "書かれる", reading: "かかれる", romaji: "kakareru", explanation: "Cột 'u' chuyển sang cột 'a' + れる (Được/bị viết)" },
      causative: { form: "書かせる", reading: "かかせる", romaji: "kakaseru", explanation: "Cột 'u' chuyển sang cột 'a' + せる (Bắt/cho viết)" },
      volitional: { form: "書こう", reading: "かこう", romaji: "kakou", explanation: "Cột 'u' chuyển sang cột 'o' + う (Hãy cùng viết)" },
      ba: { form: "書けば", reading: "かけば", romaji: "kakeba", explanation: "Cột 'u' chuyển sang cột 'e' + ば (Nếu viết)" }
    }
  },
  {
    verb: "行く",
    reading: "いく",
    romaji: "iku",
    meaning: "Đi",
    group: "Nhóm 1 (Bất quy tắc thể Te)",
    conjugations: {
      te: { form: "行って", reading: "いって", romaji: "itte", explanation: "Trường hợp đặc biệt duy nhất của đuôi 'く' biến thành 'って'" },
      ta: { form: "行った", reading: "いった", romaji: "itta", explanation: "Trường hợp đặc biệt biến thành 'った'" },
      nai: { form: "行かない", reading: "いかない", romaji: "ikanai", explanation: "Cột 'u' chuyển sang cột 'a' + ない" },
      potential: { form: "行ける", reading: "いける", romaji: "ikeru", explanation: "Cột 'u' chuyển sang cột 'e' + る (Có thể đi)" },
      passive: { form: "行かれる", reading: "いかれる", romaji: "ikareru", explanation: "Cột 'u' chuyển sang cột 'a' + れる (Bị đi)" },
      causative: { form: "行かせる", reading: "いかせる", romaji: "ikaseru", explanation: "Cột 'u' chuyển sang cột 'a' + せる (Bắt/cho đi)" },
      volitional: { form: "行こう", reading: "いこう", romaji: "ikou", explanation: "Cột 'u' chuyển sang cột 'o' + う (Cùng đi nào)" },
      ba: { form: "行けば", reading: "いけば", romaji: "ikeba", explanation: "Cột 'u' chuyển sang cột 'e' + ば (Nếu đi)" }
    }
  },
  {
    verb: "飲む",
    reading: "のむ",
    romaji: "nomu",
    meaning: "Uống",
    group: "Nhóm 1 (Godan)",
    conjugations: {
      te: { form: "飲んで", reading: "のんで", romaji: "nonde", explanation: "Đuôi 'む, ぶ, ぬ' đổi thành 'んで'" },
      ta: { form: "飲んだ", reading: "のんだ", romaji: "nonda", explanation: "Đuôi 'む, ぶ, ぬ' đổi thành 'んだ'" },
      nai: { form: "飲まない", reading: "のまない", romaji: "nomanai", explanation: "Cột 'u' chuyển sang cột 'a' + ない" },
      potential: { form: "飲める", reading: "のめる", romaji: "nomeru", explanation: "Cột 'u' chuyển sang cột 'e' + る (Có thể uống)" },
      passive: { form: "飲まれる", reading: "のまれる", romaji: "nomareru", explanation: "Cột 'u' chuyển sang cột 'a' + れる (Bị uống)" },
      causative: { form: "飲ませる", reading: "のませる", romaji: "nomaseru", explanation: "Cột 'u' chuyển sang cột 'a' + せる (Cho uống)" },
      volitional: { form: "飲もう", reading: "のもう", romaji: "nomou", explanation: "Cột 'u' chuyển sang cột 'o' + う (Cùng uống nào)" },
      ba: { form: "飲めば", reading: "のめば", romaji: "nomeba", explanation: "Cột 'u' chuyển sang cột 'e' + ば (Nếu uống)" }
    }
  },
  {
    verb: "話す",
    reading: "はなす",
    romaji: "hanasu",
    meaning: "Nói chuyện",
    group: "Nhóm 1 (Godan)",
    conjugations: {
      te: { form: "話して", reading: "はなして", romaji: "hanashite", explanation: "Đuôi 'す' đổi thành 'して'" },
      ta: { form: "話した", reading: "はなした", romaji: "hanashita", explanation: "Đuôi 'す' đổi thành 'した'" },
      nai: { form: "話さない", reading: "はなさない", romaji: "hanasanai", explanation: "Cột 'u' chuyển sang cột 'a' + ない" },
      potential: { form: "話せる", reading: "はなせる", romaji: "hanaseru", explanation: "Cột 'u' chuyển sang cột 'e' + る (Có thể nói)" },
      passive: { form: "話される", reading: "はなされる", romaji: "hanasareru", explanation: "Cột 'u' chuyển sang cột 'a' + れる" },
      causative: { form: "話させる", reading: "はなさせる", romaji: "hanasaseru", explanation: "Cột 'u' chuyển sang cột 'a' + せる" },
      volitional: { form: "話そう", reading: "はなそう", romaji: "hanasou", explanation: "Cột 'u' chuyển sang cột 'o' + う (Cùng nói chuyện nào)" },
      ba: { form: "話せば", reading: "はなせば", romaji: "hanaseba", explanation: "Cột 'u' chuyển sang cột 'e' + ば (Nếu nói)" }
    }
  },
  {
    verb: "食べる",
    reading: "たべる",
    romaji: "taberu",
    meaning: "Ăn",
    group: "Nhóm 2 (Ichidan)",
    conjugations: {
      te: { form: "食べて", reading: "たべて", romaji: "tabete", explanation: "Động từ nhóm 2 bỏ 'る' thêm 'て'" },
      ta: { form: "食べた", reading: "たべた", romaji: "tabeta", explanation: "Động từ nhóm 2 bỏ 'る' thêm 'た'" },
      nai: { form: "食べない", reading: "たべない", romaji: "tabenai", explanation: "Động từ nhóm 2 bỏ 'る' thêm 'ない'" },
      potential: { form: "食べられる", reading: "たべられる", romaji: "taberareru", explanation: "Bỏ 'る' thêm 'られる' (Có thể ăn)" },
      passive: { form: "食べられる", reading: "たべられる", romaji: "taberareru", explanation: "Bỏ 'る' thêm 'られる' (Bị ăn)" },
      causative: { form: "食べさせる", reading: "たべさせる", romaji: "tabesaseru", explanation: "Bỏ 'る' thêm 'させる' (Cho ăn)" },
      volitional: { form: "食べよう", reading: "たべよう", romaji: "tabeyou", explanation: "Bỏ 'る' thêm 'よう' (Cùng ăn nào)" },
      ba: { form: "食べれば", reading: "たべれば", romaji: "tabereba", explanation: "Bỏ 'る' thêm 'れば' (Nếu ăn)" }
    }
  },
  {
    verb: "見る",
    reading: "みる",
    romaji: "miru",
    meaning: "Xem, nhìn",
    group: "Nhóm 2 (Ichidan)",
    conjugations: {
      te: { form: "見て", reading: "みて", romaji: "mite", explanation: "Bỏ 'る' thêm 'て'" },
      ta: { form: "見た", reading: "みた", romaji: "mita", explanation: "Bỏ 'る' thêm 'た'" },
      nai: { form: "見ない", reading: "みない", romaji: "minai", explanation: "Bỏ 'る' thêm 'ない'" },
      potential: { form: "見られる", reading: "みられる", romaji: "mirareru", explanation: "Bỏ 'る' thêm 'られる' (Có thể xem)" },
      passive: { form: "見られる", reading: "みられる", romaji: "mirareru", explanation: "Bỏ 'る' thêm 'られる' (Bị xem/nhìn)" },
      causative: { form: "見せる / 見させる", reading: "みさせる", romaji: "misaseru", explanation: "Bỏ 'る' thêm 'させる' (Cho xem)" },
      volitional: { form: "見よう", reading: "みよう", romaji: "miyou", explanation: "Bỏ 'る' thêm 'よう' (Cùng xem nào)" },
      ba: { form: "見れば", reading: "みれば", romaji: "mireba", explanation: "Bỏ 'る' thêm 'れば' (Nếu xem)" }
    }
  },
  {
    verb: "する",
    reading: "する",
    romaji: "suru",
    meaning: "Làm",
    group: "Nhóm 3 (Bất quy tắc)",
    conjugations: {
      te: { form: "して", reading: "して", romaji: "shite", explanation: "Bất quy tắc: する -> して" },
      ta: { form: "した", reading: "した", romaji: "shita", explanation: "Bất quy tắc: する -> した" },
      nai: { form: "しない", reading: "しない", romaji: "shinai", explanation: "Bất quy tắc: する -> しない" },
      potential: { form: "できる", reading: "できる", romaji: "dekiru", explanation: "Đặc biệt: Thể khả năng của する là できる" },
      passive: { form: "される", reading: "される", romaji: "sareru", explanation: "Bất quy tắc: する -> される (Bị làm)" },
      causative: { form: "させる", reading: "させる", romaji: "saseru", explanation: "Bất quy tắc: する -> させる (Bắt làm)" },
      volitional: { form: "しよう", reading: "しよう", romaji: "shiyou", explanation: "Bất quy tắc: する -> しよう (Cùng làm nào)" },
      ba: { form: "すれば", reading: "すれば", romaji: "sureba", explanation: "Bất quy tắc: する -> すれば (Nếu làm)" }
    }
  },
  {
    verb: "来る",
    reading: "くる",
    romaji: "kuru",
    meaning: "Đến",
    group: "Nhóm 3 (Bất quy tắc)",
    conjugations: {
      te: { form: "来て", reading: "きて", romaji: "kite", explanation: "Biến âm đặc biệt: くる -> きて" },
      ta: { form: "来た", reading: "きた", romaji: "kita", explanation: "Biến âm đặc biệt: くる -> きた" },
      nai: { form: "来ない", reading: "こない", romaji: "konai", explanation: "Biến âm đặc biệt: くる -> こない" },
      potential: { form: "来られる", reading: "こられる", romaji: "korareru", explanation: "Biến âm: こられる (Có thể đến)" },
      passive: { form: "来られる", reading: "こられる", romaji: "korareru", explanation: "Biến âm: こられる (Bị đến - gây phiền toái)" },
      causative: { form: "来させる", reading: "こさせる", romaji: "kosaseru", explanation: "Biến âm: こさせる (Bắt đến)" },
      volitional: { form: "来よう", reading: "こよう", romaji: "koyou", explanation: "Biến âm: こよう (Cùng đến nào)" },
      ba: { form: "来れば", reading: "くれば", romaji: "kureba", explanation: "Biến âm: くれば (Nếu đến)" }
    }
  }
];
