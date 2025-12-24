import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Target,
  Zap,
  Stamp,
  Award,
  Heart,
  ShoppingBag,
  Gem,
  LogOut,
  ChevronRight,
  Plus,
  Search,
  Trophy,
  TrendingUp,
  User,
  Settings,
  Trash2,
  X,
  ChevronLeft,
  Clock,
  EyeOff,
  Eye,
  AlertTriangle,
  Calendar,
  Filter,
  Brain,
  Shield,
  MessageCircle,
  HeartPulse,
  Palette,
  Activity,
  MoreVertical,
  Check,
  CheckCircle,
  ChevronLeftCircle,
  ChevronRightCircle,
  ChevronUp,
  ChevronDown,
  Lock,
  ShoppingCart,
  Cookie,
  RefreshCw,
  Database,
} from "lucide-react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";

// --- 중요: 여기에 선생님의 Firebase 설정값을 복사해서 붙여넣으세요 ---
const firebaseConfig = {
  apiKey: "AIzaSyCKvM84gs65-UsEz7KgxXF1i8P5I_ljftw",
  authDomain: "rpg-class.firebaseapp.com",
  projectId: "rpg-class",
  storageBucket: "rpg-class.firebasestorage.app",
  messagingSenderId: "991131780134",
  appId: "1:991131780134:web:73183608adbc78c6ced2e7",
  measurementId: "G-VRWJ9C17G8",
};

// Firebase 초기화
let db;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase 설정 오류:", error);
}

// --- 초기 설정 데이터 (DB 초기화용) ---
const INITIAL_EXP_ACTIONS = [
  { id: 1, label: "바른 인사", value: 2, type: "gain" },
  { id: 2, label: "좋은 발표", value: 3, type: "gain" },
  { id: 3, label: "수업 태도", value: 5, type: "gain" },
  { id: 4, label: "봉사 심부름", value: 5, type: "gain" },
  { id: 5, label: "선생님 칭찬", value: 5, type: "gain" },
  { id: 6, label: "칭호 획득", value: 30, type: "gain" },
  { id: 7, label: "규칙 위반", value: -2, type: "loss" },
  { id: 8, label: "나쁜 언어", value: -3, type: "loss" },
  { id: 9, label: "준비 불량", value: -5, type: "loss" },
  { id: 10, label: "수업 방해", value: -10, type: "loss" },
  { id: 11, label: "폭력 행위", value: -10, type: "loss" },
  { id: 12, label: "예의 없음", value: -15, type: "loss" },
  { id: 13, label: "반역", value: -999, type: "loss" },
];

const STAMP_ITEMS = [
  { id: 1, label: "국어", emoji: "📖", area: "학습", stat: "탐구력" },
  { id: 2, label: "도덕", emoji: "⚖️", area: "학습", stat: "공감력" },
  { id: 3, label: "사회", emoji: "🌍", area: "학습", stat: "탐구력" },
  { id: 4, label: "수학", emoji: "🔢", area: "학습", stat: "탐구력" },
  { id: 5, label: "실과", emoji: "🛠️", area: "학습", stat: "예술력" },
  { id: 6, label: "음악", emoji: "🎵", area: "학습", stat: "예술력" },
  { id: 7, label: "미술", emoji: "🎨", area: "학습", stat: "예술력" },
  { id: 8, label: "체육", emoji: "⚽", area: "학습", stat: "행동력" },
  { id: 9, label: "글쓰기", emoji: "✍️", area: "학습", stat: "탐구력" },
  { id: 10, label: "독서", emoji: "📚", area: "학습", stat: "예술력" },
  { id: 11, label: "글씨", emoji: "🖋️", area: "학습", stat: "행동력" },
  { id: 12, label: "발표", emoji: "🎤", area: "학습", stat: "소통력" },
  { id: 13, label: "성실", emoji: "⏰", area: "생활", stat: "계획력" },
  { id: 14, label: "노력", emoji: "🔥", area: "생활", stat: "계획력" },
  { id: 15, label: "정돈", emoji: "✨", area: "생활", stat: "계획력" },
  { id: 16, label: "질서", emoji: "🚶", area: "생활", stat: "계획력" },
  { id: 17, label: "협동", emoji: "🤝", area: "생활", stat: "소통력" },
  { id: 18, label: "친절", emoji: "😊", area: "생활", stat: "소통력" },
  { id: 19, label: "적극", emoji: "🙋", area: "생활", stat: "소통력" },
  { id: 20, label: "예의", emoji: "🙇", area: "생활", stat: "공감력" },
  { id: 21, label: "배려", emoji: "🎁", area: "생활", stat: "공감력" },
  { id: 22, label: "나눔", emoji: "🤲", area: "생활", stat: "공감력" },
  { id: 23, label: "모범", emoji: "🌟", area: "생활", stat: "행동력" },
  { id: 24, label: "긍정", emoji: "🌈", area: "생활", stat: "행동력" },
];

const INITIAL_TITLES_DATA = [
  {
    id: 1,
    name: "독서왕",
    condition: "책 50권 읽기",
    hasDate: false,
    startDate: "",
    endDate: "",
    status: "active",
  },
  {
    id: 2,
    name: "청소 반장",
    condition: "1학기 청소 당번 완료",
    hasDate: true,
    startDate: "2024-03-01",
    endDate: "2024-07-20",
    status: "active",
  },
];

const INITIAL_STUDENTS = [
  {
    id: 1,
    name: "이인지",
    password: "0000",
    level: 5,
    exp: 45,
    gold: 550,
    dia: 40,
    stats: {
      탐구력: 80,
      계획력: 60,
      소통력: 90,
      공감력: 70,
      예술력: 50,
      행동력: 85,
    },
    titles: ["초보 모험가"],
    role: "none",
    logs: [],
    hidden: false,
  },
  {
    id: 2,
    name: "유철민",
    password: "0000",
    level: 7,
    exp: 20,
    gold: 1200,
    dia: 60,
    stats: {
      탐구력: 95,
      계획력: 85,
      소통력: 70,
      공감력: 95,
      예술력: 80,
      행동력: 60,
    },
    titles: ["독서 챔피언"],
    role: "manager",
    logs: [],
    hidden: false,
  },
  {
    id: 3,
    name: "유이안",
    password: "0000",
    level: 3,
    exp: 80,
    gold: 200,
    dia: 10,
    stats: {
      탐구력: 40,
      계획력: 50,
      소통력: 80,
      공감력: 90,
      예술력: 60,
      행동력: 70,
    },
    titles: [],
    role: "none",
    logs: [],
    hidden: false,
  },
  {
    id: 4,
    name: "유이엘",
    password: "0000",
    level: 2,
    exp: 10,
    gold: 100,
    dia: 0,
    stats: {
      탐구력: 60,
      계획력: 40,
      소통력: 50,
      공감력: 80,
      예술력: 90,
      행동력: 60,
    },
    titles: [],
    role: "none",
    logs: [],
    hidden: false,
  },
];

const INITIAL_MISSIONS = [
  {
    id: 1,
    title: "주제 글쓰기 제출",
    hasDate: false,
    exp: 20,
    gold: 100,
    stamps: ["국어", "글쓰기"],
    titleReward: "",
    startDate: "",
    endDate: "",
  },
  {
    id: 2,
    title: "단소 '아리랑' 연주 미션",
    hasDate: true,
    startDate: "2024-03-20",
    endDate: "2024-03-30",
    exp: 50,
    gold: 500,
    stamps: ["음악", "실과"],
    titleReward: "음악가",
  },
];

const INITIAL_GOLD_ITEMS = [
  {
    id: 1,
    name: "젤리/사탕",
    description: "마이쮸, 하리보, 츄파춥스 등",
    price: 10,
    requiredLevel: 0,
  },
  {
    id: 2,
    name: "제티/미니 과자",
    description: "제티, 미니 과자 등",
    price: 15,
    requiredLevel: 0,
  },
  {
    id: 3,
    name: "활동지",
    description: "분실한 활동지 재발부",
    price: 10,
    requiredLevel: 0,
  },
  {
    id: 4,
    name: "학용품",
    description: "연필/지우개/볼펜/형광펜 대여",
    price: 10,
    requiredLevel: 0,
  },
  {
    id: 5,
    name: "키트/재료",
    description: "여분의 키트/활동 재료",
    price: 20,
    requiredLevel: 0,
  },
  {
    id: 6,
    name: "자리 선택권",
    description: "다음 달 자리 배치시 원하는 자리 선택",
    price: 300,
    requiredLevel: 0,
  },
  {
    id: 7,
    name: "청소 면제권",
    description: "청소 당번 1회 면제",
    price: 100,
    requiredLevel: 0,
  },
  {
    id: 8,
    name: "음악 선택권",
    description: "활동 시간, 점심 시간에 음악 신청",
    price: 30,
    requiredLevel: 0,
  },
  {
    id: 9,
    name: "숙제 면제권",
    description: "숙제 1회 면제",
    price: 150,
    requiredLevel: 0,
  },
];

const INITIAL_DIAMOND_ITEMS = [
  {
    id: 1,
    name: "일반 아이템 쿠폰",
    description: "10레벨 헤어/성형/의상 교환권",
    price: 10,
    requiredLevel: 10,
  },
  {
    id: 2,
    name: "고급 아이템 쿠폰",
    description: "20레벨 헤어/성형/의상 교환권",
    price: 20,
    requiredLevel: 20,
  },
  {
    id: 3,
    name: "희귀 아이템 쿠폰",
    description: "30레벨 헤어/성형/의상 교환권",
    price: 30,
    requiredLevel: 30,
  },
  {
    id: 4,
    name: "에픽 아이템 쿠폰",
    description: "40레벨 헤어/성형/의상 교환권",
    price: 40,
    requiredLevel: 40,
  },
  {
    id: 5,
    name: "레전더리 아이템 쿠폰",
    description: "50레벨 헤어/성형/의상 교환권",
    price: 50,
    requiredLevel: 50,
  },
];

// --- 육각형 차트 컴포넌트 ---
const RadarChart = ({ stats }) => {
  const labels = ["탐구력", "계획력", "소통력", "공감력", "예술력", "행동력"];
  const size = 180;
  const center = size / 2;
  const radius = 60;

  const points = labels.map((label, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    const value = (stats[label] || 0) / 100;
    return {
      x: center + radius * value * Math.cos(angle),
      y: center + radius * value * Math.sin(angle),
      lx: center + (radius + 12) * Math.cos(angle),
      ly: center + (radius + 12) * Math.sin(angle),
      label,
    };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="flex justify-center items-center bg-slate-50 rounded-2xl p-2">
      <svg width={size} height={size}>
        {[0.2, 0.4, 0.6, 0.8, 1].map((tick) => (
          <polygon
            key={tick}
            points={labels
              .map((_, i) => {
                const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
                return `${center + radius * tick * Math.cos(angle)},${
                  center + radius * tick * Math.sin(angle)
                }`;
              })
              .join(" ")}
            className="fill-none stroke-slate-200"
            strokeWidth="1"
          />
        ))}
        {points.map((p, i) => (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.lx}
            y2={p.ly}
            className="stroke-slate-200"
            strokeWidth="1"
          />
        ))}
        <polygon
          points={polygonPoints}
          className="fill-indigo-500/30 stroke-indigo-500"
          strokeWidth="2"
        />
        {points.map((p, i) => (
          <text
            key={i}
            x={p.lx}
            y={p.ly}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[9px] font-bold fill-slate-500"
          >
            {p.label.replace("력", "")}
          </text>
        ))}
      </svg>
    </div>
  );
};

const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [activeMenu, setActiveMenu] = useState("학생 관리");

  // 데이터 상태
  const [students, setStudents] = useState([]);
  const [missions, setMissions] = useState([]);
  const [titles, setTitles] = useState([]);
  const [expActions, setExpActions] = useState([]);
  const [goldItems, setGoldItems] = useState([]);
  const [diamondItems, setDiamondItems] = useState([]);

  // Firebase 실시간 동기화
  useEffect(() => {
    if (!db) return;
    const unsubStudents = onSnapshot(
      query(collection(db, "students")),
      (snapshot) => {
        setStudents(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      }
    );
    const unsubMissions = onSnapshot(
      query(collection(db, "missions")),
      (snapshot) => {
        setMissions(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      }
    );
    const unsubTitles = onSnapshot(
      query(collection(db, "titles")),
      (snapshot) => {
        setTitles(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }
    );
    const unsubExpActions = onSnapshot(
      query(collection(db, "expActions")),
      (snapshot) => {
        setExpActions(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      }
    );
    const unsubGoldItems = onSnapshot(
      query(collection(db, "goldItems")),
      (snapshot) => {
        setGoldItems(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      }
    );
    const unsubDiamondItems = onSnapshot(
      query(collection(db, "diamondItems")),
      (snapshot) => {
        setDiamondItems(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      }
    );

    return () => {
      unsubStudents();
      unsubMissions();
      unsubTitles();
      unsubExpActions();
      unsubGoldItems();
      unsubDiamondItems();
    };
  }, []);

  // --- 화면 표시용 데이터 가공 (useMemo를 최상단으로 이동) ---
  const studentActiveMissions = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const active = missions.filter((m) => {
      if (!m.hasDate) return true;
      return m.endDate >= today;
    });
    return active.sort((a, b) => {
      if (a.hasDate && !b.hasDate) return -1;
      if (!a.hasDate && b.hasDate) return 1;
      if (a.hasDate && b.hasDate) return a.startDate.localeCompare(b.startDate);
      return 0;
    });
  }, [missions]);

  const missionSections = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const ongoing = missions.filter(
      (m) => !m.hasDate || (m.startDate <= today && m.endDate >= today)
    );
    const scheduled = missions.filter((m) => m.hasDate && m.startDate > today);
    return { ongoing, scheduled };
  }, [missions]);

  const titleSections = useMemo(() => {
    return {
      active: titles.filter((t) => t.status === "active"),
      completed: titles.filter((t) => t.status === "completed"),
    };
  }, [titles]);

  // --- 상태 정의 ---
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loggedInStudentId, setLoggedInStudentId] = useState(null);

  const [studentTab, setStudentTab] = useState("dashboard");
  const [teacherStudentTab, setTeacherStudentTab] = useState("dashboard");

  const [loginName, setLoginName] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginError, setLoginError] = useState("");

  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [tempLoginId, setTempLoginId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwChangeError, setPwChangeError] = useState("");
  const [studentToResetPw, setStudentToResetPw] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [bulkNames, setBulkNames] = useState("");
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [showMissionModal, setShowMissionModal] = useState(false);
  const [missionToDelete, setMissionToDelete] = useState(null);
  const [editingMission, setEditingMission] = useState(null);
  const [missionForm, setMissionForm] = useState({
    title: "",
    hasDate: false,
    startDate: "",
    endDate: "",
    exp: 0,
    gold: 0,
    stamps: [],
    titleReward: "",
  });

  const [missionPage, setMissionPage] = useState(0);
  const [isMissionsExpanded, setIsMissionsExpanded] = useState(true);
  const [viewingMission, setViewingMission] = useState(null);

  const [stampAreaFilter, setStampAreaFilter] = useState("전체");
  const [stampStatFilter, setStampStatFilter] = useState("전체");
  const [selectedStampLabel, setSelectedStampLabel] = useState(null);
  const [applyingStampItem, setApplyingStampItem] = useState(null);

  const [showExpActionModal, setShowExpActionModal] = useState(false);
  const [editingExpAction, setEditingExpAction] = useState(null);
  const [expActionToDelete, setExpActionToDelete] = useState(null);
  const [expActionForm, setExpActionForm] = useState({
    label: "",
    value: "",
    type: "gain",
  });

  const [applyingExpAction, setApplyingExpAction] = useState(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const [showTitleModal, setShowTitleModal] = useState(false);
  const [editingTitle, setEditingTitle] = useState(null);
  const [titleToDelete, setTitleToDelete] = useState(null);
  const [titleForm, setTitleForm] = useState({
    name: "",
    condition: "",
    hasDate: false,
    startDate: "",
    endDate: "",
    status: "active",
  });
  const [applyingTitle, setApplyingTitle] = useState(null);

  const [showShopModal, setShowShopModal] = useState(false);
  const [editingShopItem, setEditingShopItem] = useState(null);
  const [shopItemToDelete, setShopItemToDelete] = useState(null);
  const [shopForm, setShopForm] = useState({
    name: "",
    description: "",
    price: "",
    requiredLevel: 0,
  });

  const [purchasingItem, setPurchasingItem] = useState(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState(10);

  const [viewingDonationHistory, setViewingDonationHistory] = useState(null);

  // --- Derived State ---

  // 정렬된 학생 목록 (나를 맨 앞으로)
  const sortedStudents = useMemo(() => {
    let list = [...students];
    // 기본 이름순 정렬
    list.sort((a, b) => a.name.localeCompare(b.name));

    // 학생 모드이고 로그인되어 있다면 본인을 맨 앞으로 이동
    if (userRole === "student" && loggedInStudentId) {
      const meIndex = list.findIndex((s) => s.id === loggedInStudentId);
      if (meIndex > -1) {
        const me = list.splice(meIndex, 1)[0];
        list.unshift(me);
      }
    }
    return list;
  }, [students, userRole, loggedInStudentId]);

  const visibleMissions = useMemo(
    () => studentActiveMissions.slice(missionPage * 3, (missionPage + 1) * 3),
    [studentActiveMissions, missionPage]
  );

  const realFilteredStamps = useMemo(() => {
    return STAMP_ITEMS.filter((s) => {
      const areaMatch =
        stampAreaFilter === "전체" || s.area === stampAreaFilter;
      const statMatch =
        stampStatFilter === "전체" || s.stat === stampStatFilter;
      return areaMatch && statMatch;
    });
  }, [stampAreaFilter, stampStatFilter]);

  const stampHolders = useMemo(() => {
    if (!selectedStampLabel) return [];
    return students
      .map((s) => {
        const count = s.logs.filter(
          (log) => log.type === "stamp" && log.item === selectedStampLabel
        ).length;
        return { ...s, count };
      })
      .filter((s) => s.count > 0);
  }, [selectedStampLabel, students]);

  const totalClassHearts = useMemo(() => {
    return students.reduce((total, s) => {
      const studentHearts = s.logs
        .filter((log) => log.type === "donation")
        .reduce((sum, log) => sum + Math.abs(log.value) / 10, 0);
      return total + studentHearts;
    }, 0);
  }, [students]);

  const donationHallOfFame = useMemo(() => {
    return students
      .map((s) => {
        const hearts = s.logs
          .filter((log) => log.type === "donation")
          .reduce((sum, log) => sum + Math.abs(log.value) / 10, 0);
        return { ...s, hearts };
      })
      .filter((s) => s.hearts > 0)
      .sort((a, b) => b.hearts - a.hearts);
  }, [students]);

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId),
    [students, selectedStudentId]
  );

  const loggedInStudent = useMemo(
    () => students.find((s) => s.id === loggedInStudentId),
    [students, loggedInStudentId]
  );

  // --- DB 초기화 함수 (2중 경고) ---
  const initializeDatabase = async () => {
    if (!db) return;
    if (
      !window.confirm("지금까지 저장된 학생의 성장 기록이 모두 초기화됩니다.")
    )
      return;
    if (!window.confirm("정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."))
      return;

    try {
      for (const s of INITIAL_STUDENTS) {
        await setDoc(doc(db, "students", String(s.id)), s);
      }
      for (const m of INITIAL_MISSIONS) {
        await setDoc(doc(db, "missions", String(m.id)), m);
      }
      for (const t of INITIAL_TITLES_DATA) {
        await setDoc(doc(db, "titles", String(t.id)), t);
      }
      for (const e of INITIAL_EXP_ACTIONS) {
        await setDoc(doc(db, "expActions", String(e.id)), e);
      }
      for (const g of INITIAL_GOLD_ITEMS) {
        await setDoc(doc(db, "goldItems", String(g.id)), g);
      }
      for (const d of INITIAL_DIAMOND_ITEMS) {
        await setDoc(doc(db, "diamondItems", String(d.id)), d);
      }
      alert("데이터베이스 초기화 완료!");
    } catch (e) {
      console.error("초기화 실패:", e);
      alert("초기화 중 오류가 발생했습니다.");
    }
  };

  // ... (기존 핸들러 함수들 - handleAddMissionClick 등 포함) ...
  const handleAddMissionClick = () => {
    setEditingMission(null);
    setMissionForm({
      title: "",
      hasDate: false,
      startDate: "",
      endDate: "",
      exp: 0,
      gold: 0,
      stamps: [],
      titleReward: "",
    });
    setShowMissionModal(true);
  };

  const handleMissionSubmit = async () => {
    if (!missionForm.title || !db) return;
    const finalForm = {
      ...missionForm,
      exp: Number(missionForm.exp),
      gold: Number(missionForm.gold),
    };
    if (editingMission) {
      await updateDoc(doc(db, "missions", editingMission.id), finalForm);
    } else {
      await addDoc(collection(db, "missions"), finalForm);
    }
    setMissionForm({
      title: "",
      hasDate: false,
      startDate: "",
      endDate: "",
      exp: 0,
      gold: 0,
      stamps: [],
      titleReward: "",
    });
    setShowMissionModal(false);
    setEditingMission(null);
  };

  const confirmDeleteMission = async () => {
    if (missionToDelete && db) {
      await deleteDoc(doc(db, "missions", missionToDelete.id));
      setMissionToDelete(null);
    }
  };

  const handleExpActionSubmit = async () => {
    if (!expActionForm.label || !db) return;
    const finalForm = { ...expActionForm, value: Number(expActionForm.value) };
    if (editingExpAction) {
      await updateDoc(doc(db, "expActions", editingExpAction.id), finalForm);
    } else {
      await addDoc(collection(db, "expActions"), finalForm);
    }
    setExpActionForm({ label: "", value: "", type: "gain" });
    setShowExpActionModal(false);
    setEditingExpAction(null);
  };

  const handleTitleSubmit = async () => {
    if (!titleForm.name || !db) return;
    if (editingTitle) {
      await updateDoc(doc(db, "titles", editingTitle.id), titleForm);
    } else {
      await addDoc(collection(db, "titles"), titleForm);
    }
    setTitleForm({
      name: "",
      condition: "",
      hasDate: false,
      startDate: "",
      endDate: "",
      status: "active",
    });
    setShowTitleModal(false);
    setEditingTitle(null);
  };

  const confirmDeleteTitle = async () => {
    if (titleToDelete && db) {
      await deleteDoc(doc(db, "titles", titleToDelete.id));
      setTitleToDelete(null);
    }
  };
  const completeTitle = async (title) => {
    if (db) {
      await updateDoc(doc(db, "titles", title.id), { status: "completed" });
    }
  };

  const handleShopSubmit = async () => {
    if (!shopForm.name || !db) return;
    const finalForm = {
      ...shopForm,
      price: Number(shopForm.price),
      requiredLevel: Number(shopForm.requiredLevel || 0),
    };
    const isGold = activeMenu === "쿠키 상점";
    if (editingShopItem) {
      await updateDoc(
        doc(db, isGold ? "goldItems" : "diamondItems", editingShopItem.id),
        finalForm
      );
    } else {
      await addDoc(
        collection(db, isGold ? "goldItems" : "diamondItems"),
        finalForm
      );
    }
    setShopForm({ name: "", description: "", price: "", requiredLevel: 0 });
    setShowShopModal(false);
    setEditingShopItem(null);
  };

  const confirmDeleteShopItem = async () => {
    if (!shopItemToDelete || !db) return;
    const isGold = activeMenu === "쿠키 상점";
    await deleteDoc(
      doc(db, isGold ? "goldItems" : "diamondItems", shopItemToDelete.id)
    );
    setShopItemToDelete(null);
  };

  const handleLogin = () => {
    if (loginName === "선생님" && loginPw === "1234") {
      setUserRole("teacher");
      setLoginError("");
    } else {
      const student = students.find((s) => s.name === loginName);
      if (student) {
        if (student.password === loginPw) {
          if (student.password === "0000") {
            setTempLoginId(student.id);
            setShowPasswordChangeModal(true);
            setLoginError("");
          } else {
            setUserRole("student");
            setLoggedInStudentId(student.id);
            setSelectedStudentId(student.id);
            setStudentTab("dashboard");
            setLoginError("");
          }
        } else {
          setLoginError("비밀번호를 확인하세요.");
        }
      } else {
        setLoginError("이름을 확인하세요.");
      }
    }
  };

  const handlePasswordChangeSubmit = async () => {
    if (!/^\d{4}$/.test(newPassword)) {
      setPwChangeError("숫자 4자리를 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwChangeError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (db && tempLoginId) {
      await updateDoc(doc(db, "students", tempLoginId), {
        password: newPassword,
      });
    }
    setUserRole("student");
    setLoggedInStudentId(tempLoginId);
    setSelectedStudentId(tempLoginId);
    setStudentTab("dashboard");
    setShowPasswordChangeModal(false);
    setTempLoginId(null);
    setNewPassword("");
    setConfirmPassword("");
    setPwChangeError("");
  };

  const handleLogout = () => {
    setUserRole(null);
    setSelectedStudentId(null);
    setLoggedInStudentId(null);
    setLoginName("");
    setLoginPw("");
    setLoginError("");
    setActiveMenu("학생 관리");
  };

  const addStudents = async () => {
    const names = bulkNames
      .split(/[,|\n]/)
      .map((n) => n.trim())
      .filter((n) => n !== "");
    if (!db) return;
    for (const name of names) {
      const newStudent = {
        name,
        password: "0000",
        level: 1,
        exp: 0,
        gold: 0,
        dia: 0,
        stats: {
          탐구력: 50,
          계획력: 50,
          소통력: 50,
          공감력: 50,
          예술력: 50,
          행동력: 50,
        },
        titles: ["신규 모험가"],
        role: "none",
        logs: [],
        hidden: false,
      };
      await addDoc(collection(db, "students"), newStudent);
    }
    setBulkNames("");
    setShowAddModal(false);
  };

  const confirmDelete = async () => {
    if (studentToDelete && db) {
      await deleteDoc(doc(db, "students", studentToDelete.id));
      setStudentToDelete(null);
    }
  };

  const confirmResetPassword = async () => {
    if (studentToResetPw && db) {
      await updateDoc(doc(db, "students", studentToResetPw.id), {
        password: "0000",
      });
      setStudentToResetPw(null);
    }
  };

  const toggleHide = async (id) => {
    if (!db) return;
    const student = students.find((s) => s.id === id);
    if (student)
      await updateDoc(doc(db, "students", id), { hidden: !student.hidden });
  };

  const updateRole = async (id, role) => {
    if (!db) return;
    await updateDoc(doc(db, "students", id), { role });
  };

  const applyExpToStudents = async () => {
    if (!applyingExpAction || selectedStudentIds.length === 0 || !db) return;
    const now = new Date();
    const timeStr = `${
      now.getMonth() + 1
    }/${now.getDate()} ${now.getHours()}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const action = applyingExpAction;
    for (const id of selectedStudentIds) {
      const s = students.find((st) => st.id === id);
      if (!s) continue;
      let newLevel = s.level,
        newExp = s.exp,
        newDia = s.dia,
        resultText = "";
      if (action.label === "반역") {
        newLevel = 1;
        newExp = 0;
        resultText = "반역(초기화)";
      } else {
        newExp += Number(action.value);
        if (newExp >= 100) {
          const levelGain = Math.floor(newExp / 100);
          newLevel += levelGain;
          newExp %= 100;
          newDia += levelGain * 10;
        } else if (newExp < 0) {
          newExp = 0;
        }
        resultText = `${action.value > 0 ? "+" : ""}${action.value}xp`;
      }
      const newLog = {
        time: timeStr,
        item: action.label,
        type: "exp",
        value: Number(action.value),
        result: resultText,
      };
      await updateDoc(doc(db, "students", id), {
        level: newLevel,
        exp: newExp,
        dia: newDia,
        logs: [newLog, ...s.logs],
      });
    }
    setApplyingExpAction(null);
    setSelectedStudentIds([]);
  };

  const applyStampToStudents = async () => {
    if (!applyingStampItem || selectedStudentIds.length === 0 || !db) return;
    const now = new Date();
    const timeStr = `${
      now.getMonth() + 1
    }/${now.getDate()} ${now.getHours()}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const stamp = applyingStampItem;
    for (const id of selectedStudentIds) {
      const s = students.find((st) => st.id === id);
      if (!s) continue;
      let newLevel = s.level,
        newExp = s.exp + 5,
        newDia = s.dia;
      const newStats = { ...s.stats };
      if (stamp.stat && newStats[stamp.stat] !== undefined) {
        newStats[stamp.stat] = Math.min(100, newStats[stamp.stat] + 5);
      }
      if (newExp >= 100) {
        const levelGain = Math.floor(newExp / 100);
        newLevel += levelGain;
        newExp %= 100;
        newDia += levelGain * 10;
      }
      const newLog = {
        time: timeStr,
        item: stamp.label,
        type: "stamp",
        value: 5,
        result: "스탬프(+5xp)",
      };
      await updateDoc(doc(db, "students", id), {
        level: newLevel,
        exp: newExp,
        dia: newDia,
        stats: newStats,
        logs: [newLog, ...s.logs],
      });
    }
    setApplyingStampItem(null);
    setSelectedStudentIds([]);
  };

  const applyTitleToStudents = async () => {
    if (!applyingTitle || selectedStudentIds.length === 0 || !db) return;
    const now = new Date();
    const timeStr = `${
      now.getMonth() + 1
    }/${now.getDate()} ${now.getHours()}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const title = applyingTitle;
    for (const id of selectedStudentIds) {
      const s = students.find((st) => st.id === id);
      if (!s) continue;
      let newLevel = s.level,
        newExp = s.exp + 30,
        newDia = s.dia;
      const newTitles = [title.name, ...s.titles];
      if (newExp >= 100) {
        const levelGain = Math.floor(newExp / 100);
        newLevel += levelGain;
        newExp %= 100;
        newDia += levelGain * 10;
      }
      const newLog = {
        time: timeStr,
        item: `칭호 획득(${title.name})`,
        type: "exp",
        value: 30,
        result: "+30xp",
      };
      await updateDoc(doc(db, "students", id), {
        level: newLevel,
        exp: newExp,
        dia: newDia,
        titles: newTitles,
        logs: [newLog, ...s.logs],
      });
    }
    setApplyingTitle(null);
    setSelectedStudentIds([]);
  };

  const addLog = async (studentId, type, item, value) => {
    if (!db) return;
    const now = new Date();
    const timeStr = `${
      now.getMonth() + 1
    }/${now.getDate()} ${now.getHours()}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const s = students.find((st) => st.id === studentId);
    if (!s) return;
    let newLevel = s.level,
      expAdd = type === "exp" ? Number(value) : type === "stamp" ? 5 : 0,
      newExp = s.exp,
      newDia = s.dia;
    const newStats = { ...s.stats };
    let resultText = "";
    if (item === "반역") {
      newLevel = 1;
      newExp = 0;
      resultText = "반역(초기화)";
    } else {
      newExp += expAdd;
      if (type === "stamp") {
        const stampData = STAMP_ITEMS.find((st) => st.label === item);
        if (stampData && newStats[stampData.stat] !== undefined) {
          newStats[stampData.stat] = Math.min(
            100,
            newStats[stampData.stat] + 5
          );
        }
      }
      if (newExp >= 100) {
        const levelGain = Math.floor(newExp / 100);
        newLevel += levelGain;
        newExp %= 100;
        newDia += levelGain * 10;
      } else if (newExp < 0) {
        newExp = 0;
      }
      resultText =
        type === "exp"
          ? `${value > 0 ? "+" : ""}${value}xp`
          : type === "stamp"
          ? "스탬프(+5xp)"
          : "획득";
    }
    const newLog = {
      time: timeStr,
      item,
      type,
      value: item === "반역" ? 0 : expAdd,
      result: resultText,
    };
    await updateDoc(doc(db, "students", studentId), {
      level: newLevel,
      exp: newExp,
      dia: newDia,
      stats: newStats,
      logs: [newLog, ...s.logs],
    });
  };

  const handleShopItemClick = (item, isGold) => {
    if (!loggedInStudent) return;
    if (!isGold && loggedInStudent.level < (item.requiredLevel || 0)) {
      alert(`Lv.${item.requiredLevel} 이상만 구매할 수 있습니다!`);
      return;
    }
    if (isGold && loggedInStudent.gold < item.price) {
      alert("쿠키가 부족합니다!");
      return;
    }
    if (!isGold && loggedInStudent.dia < item.price) {
      alert("다이아가 부족합니다!");
      return;
    }
    setPurchasingItem({ ...item, isGold });
  };

  const handlePurchaseItem = async () => {
    if (!purchasingItem || !loggedInStudentId || !db) return;
    const price = purchasingItem.price;
    const isGoldItem = purchasingItem.isGold;
    const now = new Date();
    const timeStr = `${
      now.getMonth() + 1
    }/${now.getDate()} ${now.getHours()}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const s = students.find((st) => st.id === loggedInStudentId);
    if (!s) return;
    const newLog = {
      time: timeStr,
      item: `아이템 구매(${purchasingItem.name})`,
      type: "shop",
      value: -price,
      result: `-${price}${isGoldItem ? "C" : "Dia"}`,
    };
    await updateDoc(doc(db, "students", loggedInStudentId), {
      gold: isGoldItem ? s.gold - price : s.gold,
      dia: !isGoldItem ? s.dia - price : s.dia,
      logs: [newLog, ...s.logs],
    });
    setPurchasingItem(null);
  };

  const handleDonation = async () => {
    if (!loggedInStudentId || !db) return;
    const s = students.find((st) => st.id === loggedInStudentId);
    if (!s) return;
    if (donationAmount <= 0) return;
    if (s.gold < donationAmount) {
      alert("쿠키가 부족합니다.");
      return;
    }
    const now = new Date();
    const timeStr = `${
      now.getMonth() + 1
    }/${now.getDate()} ${now.getHours()}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const newLog = {
      time: timeStr,
      item: "학급 기부",
      type: "donation",
      value: -donationAmount,
      result: `-${donationAmount}C`,
    };
    await updateDoc(doc(db, "students", loggedInStudentId), {
      gold: s.gold - donationAmount,
      logs: [newLog, ...s.logs],
    });
    setShowDonationModal(false);
    setDonationAmount(10);
  };

  // --- 헬퍼 함수들 (이모지 등) ---
  const getMissionEmoji = (title) => {
    if (title.includes("청소")) return "🧹";
    if (title.includes("독서") || title.includes("책")) return "📚";
    if (
      title.includes("운동") ||
      title.includes("체육") ||
      title.includes("줄넘기")
    )
      return "⚽";
    if (
      title.includes("글쓰기") ||
      title.includes("일기") ||
      title.includes("기록")
    )
      return "✍️";
    if (title.includes("발표") || title.includes("말하기")) return "🎤";
    if (title.includes("수학") || title.includes("연산")) return "🔢";
    if (
      title.includes("음악") ||
      title.includes("악기") ||
      title.includes("리코더") ||
      title.includes("단소")
    )
      return "🎵";
    if (title.includes("미술") || title.includes("그리기")) return "🎨";
    if (title.includes("인사") || title.includes("예절")) return "🙇";
    return "✨";
  };

  const getShopEmoji = (name) => {
    if (name.includes("우선") || name.includes("권") || name.includes("쿠폰"))
      return "🎟️";
    if (name.includes("간식") || name.includes("파티") || name.includes("먹"))
      return "🍬";
    if (name.includes("자리") || name.includes("앉")) return "🪑";
    if (name.includes("청소") || name.includes("빗자루")) return "🧹";
    if (name.includes("숙제") || name.includes("공부") || name.includes("과제"))
      return "📝";
    if (name.includes("면제") || name.includes("패스")) return "🛡️";
    if (name.includes("랜덤") || name.includes("뽑기")) return "🎲";
    if (name.includes("아이템")) return "🎁";
    if (name.includes("헤어")) return "💇";
    return "🎁";
  };

  const getMissionStatus = (mission) => {
    if (!mission.hasDate)
      return { label: "상시", color: "bg-slate-200 text-slate-600" };
    const today = new Date().toISOString().split("T")[0];
    if (mission.startDate > today)
      return { label: "예정", color: "bg-yellow-100 text-yellow-700" };
    return { label: "진행", color: "bg-green-100 text-green-700" };
  };

  // --- 로그인 화면 ---
  if (!userRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          <div className="p-8 text-center bg-white">
            <div className="text-6xl mb-4">🏰</div>
            <h1 className="text-3xl font-black mb-2 text-indigo-900 italic tracking-tighter">
              RPG Classroom
            </h1>
            <p className="opacity-60 font-medium text-xs text-indigo-900 uppercase tracking-widest">
              Login Portal
            </p>
          </div>
          <div className="p-8 space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1 ml-1">
                이름
              </label>
              <input
                type="text"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                placeholder="이름을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1 ml-1">
                비밀번호
              </label>
              <input
                type="password"
                value={loginPw}
                onChange={(e) => setLoginPw(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-sm font-bold ml-1">
                {loginError}
              </p>
            )}
            <button
              onClick={handleLogin}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4"
            >
              로그인
            </button>
          </div>
        </div>
        {/* 비밀번호 변경 모달 */}
        {showPasswordChangeModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-200">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw size={32} />
              </div>
              <h3 className="text-xl font-black mb-2 text-center text-slate-900">
                비밀번호 변경
              </h3>
              <p className="text-sm text-slate-500 font-medium text-center mb-6">
                새로운 비밀번호(숫자 4자리)를 설정해주세요.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 ml-1 uppercase">
                    새로운 비밀번호
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-center tracking-widest text-lg"
                    placeholder="숫자 4자리"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 ml-1 uppercase">
                    비밀번호 확인
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-center tracking-widest text-lg"
                    placeholder="한 번 더 입력"
                    maxLength={4}
                  />
                </div>
                {pwChangeError && (
                  <p className="text-red-500 text-xs font-bold text-center">
                    {pwChangeError}
                  </p>
                )}
                <button
                  onClick={handlePasswordChangeSubmit}
                  className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 mt-2"
                >
                  변경 완료 및 로그인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- 메인 렌더링 ---
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* 교사일 때 사이드바 */}
      {userRole === "teacher" && (
        <aside className="w-52 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
          <div className="p-5 border-b border-slate-100 flex justify-center">
            <div className="flex items-center gap-2 font-black text-indigo-600 text-lg italic tracking-tighter">
              <Zap size={24} fill="currentColor" />
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {[
              { name: "학생 관리", icon: <Users size={18} /> },
              { name: "미션 관리", icon: <Target size={18} /> },
              { name: "칭호 관리", icon: <Award size={18} /> },
              { name: "경험치 관리", icon: <Zap size={18} /> },
              { name: "스탬프 관리", icon: <Stamp size={18} /> },
              { name: "기부 관리", icon: <Heart size={18} /> },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveMenu(item.name);
                  setSelectedStudentId(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold text-sm ${
                  activeMenu === item.name && !selectedStudentId
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {item.icon} {item.name}
              </button>
            ))}
            <div className="h-8"></div>
            {[
              { name: "쿠키 상점", icon: <Cookie size={18} /> },
              { name: "다이아 상점", icon: <Gem size={18} /> },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveMenu(item.name);
                  setSelectedStudentId(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold text-sm ${
                  activeMenu === item.name
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {item.icon} {item.name}
              </button>
            ))}
          </nav>
          <div className="p-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-500 transition-colors font-bold text-sm"
            >
              <LogOut size={18} /> 로그아웃
            </button>
            {/* 데이터 초기화 버튼 */}
            <button
              onClick={initializeDatabase}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-indigo-500 transition-colors font-bold text-xs mt-2 border-t border-slate-100 pt-4"
            >
              <Database size={14} /> DB 초기화
            </button>
          </div>
        </aside>
      )}

      <main
        className={`${
          userRole === "teacher" ? "ml-52" : "w-full max-w-5xl mx-auto"
        } flex-1 p-6 lg:p-10`}
      >
        {/* 학생 모드 헤더 및 메뉴 */}
        {userRole === "student" && (
          <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setStudentTab("dashboard");
                  setSelectedStudentId(loggedInStudentId);
                  setTeacherStudentTab("dashboard");
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  studentTab === "dashboard"
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                👤 내 프로필
              </button>
              <button
                onClick={() => {
                  setStudentTab("class");
                  setSelectedStudentId(null);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  studentTab === "class"
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                🏫 우리 학급
              </button>
              <button
                onClick={() => {
                  setStudentTab("missions");
                  setSelectedStudentId(null);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  studentTab === "missions"
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                📜 학급 미션
              </button>
              <button
                onClick={() => {
                  setStudentTab("goldShop");
                  setSelectedStudentId(null);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  studentTab === "goldShop"
                    ? "text-orange-500 bg-orange-50"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                🍪 쿠키 상점
              </button>
              <button
                onClick={() => {
                  setStudentTab("diamondShop");
                  setSelectedStudentId(null);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  studentTab === "diamondShop"
                    ? "text-blue-500 bg-blue-50"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                💎 다이아 상점
              </button>
              <button
                onClick={() => {
                  setStudentTab("donation");
                  setSelectedStudentId(null);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  studentTab === "donation"
                    ? "text-rose-500 bg-rose-50"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                ❤️ 기부
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold text-xs transition-colors px-4 py-2 hover:bg-red-50 rounded-xl"
            >
              <LogOut size={16} /> 로그아웃
            </button>
          </header>
        )}

        {/* 미션 상세 정보 팝업 모달 */}
        {viewingMission && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative">
              <button
                onClick={() => setViewingMission(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-black mb-1 text-slate-900">
                {getMissionEmoji(viewingMission.title)} {viewingMission.title}
              </h3>
              <p className="text-xs text-slate-400 font-bold mb-6 uppercase tracking-widest">
                {viewingMission.hasDate
                  ? `${viewingMission.startDate} ~ ${viewingMission.endDate}`
                  : "상시 미션"}
              </p>

              <div className="space-y-3">
                {viewingMission.exp > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl text-indigo-700 font-black text-sm">
                    <Zap size={16} /> +{viewingMission.exp} XP
                  </div>
                )}
                {viewingMission.gold > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl text-orange-700 font-black text-sm">
                    🍪 {viewingMission.gold} Cookie
                  </div>
                )}

                {viewingMission.stamps && viewingMission.stamps.length > 0 && (
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <p className="text-xs font-bold text-emerald-600 mb-2 flex items-center gap-2">
                      <Stamp size={14} /> Reward Stamps
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {viewingMission.stamps.map((s) => (
                        <span
                          key={s}
                          className="bg-white px-2 py-1 rounded-lg text-[10px] font-black text-emerald-700 shadow-sm"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {viewingMission.titleReward && (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl text-purple-700 font-black text-sm">
                    <Award size={16} /> 칭호: {viewingMission.titleReward}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- 학생 상세 대시보드 --- */}
        {selectedStudentId &&
          ((userRole === "teacher" && activeMenu === "학생 관리") ||
            (userRole === "student" &&
              (studentTab === "dashboard" || studentTab === "class"))) && (
            <div className="animate-in fade-in duration-300">
              {/* 뒤로가기 버튼 */}
              {(userRole === "teacher" ||
                (userRole === "student" && studentTab === "class")) && (
                <button
                  onClick={() => setSelectedStudentId(null)}
                  className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold mb-5 transition-colors text-xs italic"
                >
                  <ChevronLeft size={16} /> Back to list
                </button>
              )}

              {/* 교사 모드에서 학생 상세 보기 시 상단 탭 */}
              {userRole === "teacher" && (
                <div className="flex justify-center mb-6">
                  <div className="bg-slate-100 p-1 rounded-xl inline-flex">
                    <button
                      onClick={() => setTeacherStudentTab("dashboard")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        teacherStudentTab === "dashboard"
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      대시보드
                    </button>
                    <button
                      onClick={() => setTeacherStudentTab("missions")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        teacherStudentTab === "missions"
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      미션 현황
                    </button>
                  </div>
                </div>
              )}

              {/* 1. 대시보드 탭 내용 */}
              {teacherStudentTab === "dashboard" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4 space-y-5">
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 text-center relative overflow-hidden">
                      <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-50 rounded-full opacity-50 blur-3xl"></div>
                      <div className="flex flex-wrap justify-center gap-1.5 mb-5 min-h-[2rem] items-end">
                        {selectedStudent.titles
                          ?.slice(0, 3)
                          .map((title, idx) => (
                            <span
                              key={idx}
                              className="bg-indigo-50/80 text-indigo-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-indigo-100 shadow-sm"
                            >
                              {title}
                            </span>
                          ))}
                      </div>
                      <h2 className="text-2xl font-black mb-5 text-slate-800 tracking-tight">
                        {selectedStudent.name}
                      </h2>
                      <div className="bg-slate-50 rounded-2xl p-4 space-y-3 mb-6">
                        <div className="flex justify-between font-black italic text-sm">
                          <span className="text-lg">
                            Lv. {selectedStudent.level}
                          </span>
                          <span className="text-slate-400">
                            {selectedStudent.exp}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500"
                            style={{ width: `${selectedStudent.exp}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-around pt-1 text-[11px] font-black">
                          <div>
                            <p className="text-[8px] text-slate-400 uppercase mb-0.5 tracking-widest">
                              COOKIE
                            </p>
                            <p className="text-orange-500">
                              🍪 {selectedStudent.gold}
                            </p>
                          </div>
                          <div className="w-px h-6 bg-slate-200"></div>
                          <div>
                            <p className="text-[8px] text-slate-400 uppercase mb-0.5 tracking-widest">
                              DIAMOND
                            </p>
                            <p className="text-blue-500">
                              💎 {selectedStudent.dia}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-left font-bold text-slate-400 text-[9px] mb-3 uppercase tracking-tighter italic">
                        Status Radar
                      </p>
                      <RadarChart stats={selectedStudent.stats} />
                    </div>
                  </div>
                  <div className="lg:col-span-8 space-y-6">
                    {/* 입력 패널: 교사 or 본인 or 지킴이 */}
                    {userRole === "teacher" ||
                    (userRole === "student" &&
                      selectedStudent.id === loggedInStudentId) ||
                    (userRole === "student" &&
                      loggedInStudent?.role === "keeper") ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                          <h3 className="text-sm font-black mb-4 flex items-center gap-2">
                            <Zap size={16} className="text-indigo-500" /> 경험치
                          </h3>
                          <div className="space-y-1.5">
                            {[...expActions]
                              .sort((a, b) => {
                                if (a.type !== b.type)
                                  return a.type === "gain" ? -1 : 1;
                                if (a.type === "gain") return a.value - b.value;
                                return b.value - a.value;
                              })
                              .map((action) => (
                                <button
                                  key={action.id}
                                  onClick={() =>
                                    addLog(
                                      selectedStudent.id,
                                      "exp",
                                      action.label,
                                      action.value
                                    )
                                  }
                                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-50 hover:bg-slate-50 transition-all text-xs font-bold group"
                                >
                                  <span className="text-slate-600">
                                    {action.label}
                                  </span>
                                  <span
                                    className={
                                      action.type === "gain"
                                        ? "text-blue-500"
                                        : "text-red-500"
                                    }
                                  >
                                    {action.label === "반역"
                                      ? "RESET"
                                      : `${action.value > 0 ? "+" : ""}${
                                          action.value
                                        }xp`}
                                  </span>
                                </button>
                              ))}
                          </div>
                        </div>
                        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                          <h3 className="text-sm font-black mb-4 flex items-center gap-2">
                            <Stamp size={16} className="text-emerald-500" />{" "}
                            스탬프
                          </h3>
                          {/* 스탬프 영역 스크롤 제거 및 그리드 조정 */}
                          <div className="grid grid-cols-3 gap-1.5">
                            {realFilteredStamps.map((stamp) => (
                              <button
                                key={stamp.id}
                                onClick={() =>
                                  addLog(
                                    selectedStudent.id,
                                    "stamp",
                                    stamp.label,
                                    0
                                  )
                                }
                                className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-50 hover:bg-emerald-50 transition-all gap-1 group"
                              >
                                <span className="text-xl group-hover:scale-110 transition-transform">
                                  {stamp.emoji}
                                </span>
                                <span className="text-[9px] font-bold text-slate-500">
                                  {stamp.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // 뷰 모드
                      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 h-full">
                        <h3 className="text-sm font-black mb-4 flex items-center gap-2">
                          <Clock size={16} className="text-slate-400" /> 성장
                          기록
                        </h3>
                        <div className="space-y-2 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                          {selectedStudent.logs.length === 0 ? (
                            <div className="text-center py-20 text-[10px] text-slate-300">
                              아직 기록이 없습니다.
                            </div>
                          ) : (
                            selectedStudent.logs.map((log, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-slate-400 font-mono italic">
                                    {log.time}
                                  </span>
                                  <span className="text-slate-700">
                                    {log.item}
                                  </span>
                                </div>
                                <span
                                  className={
                                    log.type === "exp" || log.type === "stamp"
                                      ? "text-indigo-600"
                                      : "text-slate-500"
                                  }
                                >
                                  {log.result}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* 하단 로그 (작게) - 교사 or 본인 or 지킴이 */}
                    {(userRole === "teacher" ||
                      (userRole === "student" &&
                        selectedStudent.id === loggedInStudentId) ||
                      (userRole === "student" &&
                        loggedInStudent?.role === "keeper")) && (
                      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black mb-4 flex items-center gap-2">
                          <Clock size={16} className="text-slate-400" /> 로그
                          히스토리
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                          {selectedStudent.logs.length === 0 ? (
                            <div className="text-center py-6 text-[10px] text-slate-300">
                              획득 기록이 없습니다.
                            </div>
                          ) : (
                            selectedStudent.logs.map((log, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-bold"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-slate-400 font-mono italic">
                                    {log.time}
                                  </span>
                                  <span className="text-slate-700">
                                    {log.item}
                                  </span>
                                </div>
                                <span
                                  className={
                                    log.type === "exp" || log.type === "stamp"
                                      ? "text-indigo-600"
                                      : "text-slate-500"
                                  }
                                >
                                  {log.result}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. 미션 탭 (교사만) */}
              {teacherStudentTab === "missions" && userRole === "teacher" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-in fade-in">
                  {studentActiveMissions.map((m) => (
                    <div
                      key={m.id}
                      className={`p-5 rounded-[28px] border cursor-default flex flex-col justify-between h-48 relative overflow-hidden group hover:scale-[1.02] transition-transform ${getMissionStyle(
                        m.id
                      )}`}
                    >
                      <div className="absolute top-4 right-4 text-[10px] font-black px-2 py-1 rounded-full bg-white/50 backdrop-blur-sm">
                        {getMissionStatus(m).label}
                      </div>
                      <div className="mt-2">
                        <div className="text-4xl mb-3">
                          {getMissionEmoji(m.title)}
                        </div>
                        <h4 className="text-lg font-black leading-tight line-clamp-2">
                          {m.title}
                        </h4>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-3">
                          {m.hasDate
                            ? `${m.startDate} ~ ${m.endDate}`
                            : "상시 미션"}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {m.exp > 0 && (
                            <span className="px-2 py-1 bg-white/40 rounded-lg text-[10px] font-black">
                              +{m.exp} XP
                            </span>
                          )}
                          {m.gold > 0 && (
                            <span className="px-2 py-1 bg-white/40 rounded-lg text-[10px] font-black">
                              {m.gold} C
                            </span>
                          )}
                          {m.stamps?.length > 0 && (
                            <span className="px-2 py-1 bg-white/40 rounded-lg text-[10px] font-black">
                              스탬프
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {studentActiveMissions.length === 0 && (
                    <p className="col-span-full text-center text-slate-400 py-12">
                      현재 진행 중인 미션이 없습니다.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

        {/* --- 학생 모드: 미션 탭 --- */}
        {userRole === "student" &&
          studentTab === "missions" &&
          !selectedStudentId && (
            <div className="max-w-7xl mx-auto">
              <header className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                    학급 미션
                  </h2>
                </div>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {studentActiveMissions.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setViewingMission(m)}
                    className={`p-6 rounded-[32px] border cursor-default flex flex-col justify-between h-56 relative overflow-hidden group hover:shadow-xl transition-all ${getMissionStyle(
                      m.id
                    )}`}
                  >
                    <div className="absolute top-5 right-5 text-xs font-black px-2.5 py-1 rounded-full bg-white/60 backdrop-blur-sm">
                      {getMissionStatus(m).label}
                    </div>
                    <div className="mt-2">
                      <div className="text-5xl mb-4">
                        {getMissionEmoji(m.title)}
                      </div>
                      <h4 className="text-xl font-black leading-tight line-clamp-2">
                        {m.title}
                      </h4>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-3">
                        {m.hasDate
                          ? `${m.startDate} ~ ${m.endDate}`
                          : "상시 미션"}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.exp > 0 && (
                          <span className="px-2.5 py-1 bg-white/50 rounded-xl text-[10px] font-black">
                            +{m.exp} XP
                          </span>
                        )}
                        {m.gold > 0 && (
                          <span className="px-2.5 py-1 bg-white/50 rounded-xl text-[10px] font-black">
                            {m.gold} C
                          </span>
                        )}
                        {m.stamps?.length > 0 && (
                          <span className="px-2.5 py-1 bg-white/50 rounded-xl text-[10px] font-black">
                            스탬프
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {studentActiveMissions.length === 0 && (
                  <p className="col-span-full text-center text-slate-400 py-12">
                    현재 진행 중인 미션이 없습니다.
                  </p>
                )}
              </div>
            </div>
          )}

        {/* --- 학생 모드: 우리 학급 리스트 (뷰) --- */}
        {userRole === "student" &&
          studentTab === "class" &&
          !selectedStudentId && (
            <div className="max-w-7xl mx-auto">
              <header className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                    우리 학급
                  </h2>
                </div>
              </header>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {sortedStudents.map((s) => (
                  <div
                    key={s.id}
                    className={`relative bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group ${
                      s.hidden ? "opacity-40 grayscale" : ""
                    }`}
                    onClick={() => setSelectedStudentId(s.id)}
                  >
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-lg font-black">{s.name}</h3>
                        {s.role === "keeper" && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[8px] font-black rounded-md">
                            🛡️ 지킴이
                          </span>
                        )}
                        {s.role === "manager" && (
                          <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[8px] font-black rounded-md">
                            💰 상점
                          </span>
                        )}
                      </div>
                      <p className="text-indigo-500 font-bold text-[9px] uppercase tracking-widest">
                        {s.titles?.[0]}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-2xl font-black italic text-slate-300 tracking-tighter">
                          Lv.{s.level}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {s.exp}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500"
                          style={{ width: `${s.exp}%` }}
                        ></div>
                      </div>
                      <div className="flex gap-3 pt-2 border-t border-slate-50 text-[11px] font-black">
                        <div className="flex-1 text-orange-500">
                          🍪 {s.gold}
                        </div>
                        <div className="flex-1 text-blue-500">💎 {s.dia}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* --- 학생 모드: 상점 뷰 (구매 가능) --- */}
        {userRole === "student" &&
          (studentTab === "goldShop" || studentTab === "diamondShop") && (
            <div className="max-w-7xl mx-auto space-y-8">
              <header className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                    {studentTab === "goldShop" ? "쿠키 상점" : "다이아 상점"}
                  </h2>
                  <p className="text-slate-400 text-sm font-medium">
                    {studentTab === "goldShop"
                      ? "열심히 모은 쿠키로 원하는 아이템을 구매하세요!"
                      : "소중한 다이아로 특별한 혜택을 누리세요!"}
                  </p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm text-sm font-black">
                  {studentTab === "goldShop" ? (
                    <span className="text-orange-500">
                      내 쿠키: 🍪 {loggedInStudent?.gold}
                    </span>
                  ) : (
                    <span className="text-blue-500">
                      내 다이아: 💎 {loggedInStudent?.dia}
                    </span>
                  )}
                </div>
              </header>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(studentTab === "goldShop" ? goldItems : diamondItems).map(
                  (item) => {
                    const isAffordable =
                      studentTab === "goldShop"
                        ? loggedInStudent.gold >= item.price
                        : loggedInStudent.dia >= item.price;

                    // 레벨 제한 확인 (다이아 상점)
                    const isLevelSufficient =
                      studentTab === "goldShop"
                        ? true
                        : loggedInStudent.level >= (item.requiredLevel || 0);

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (!isLevelSufficient) {
                            alert(
                              `Lv.${item.requiredLevel} 이상만 구매할 수 있습니다!`
                            );
                            return;
                          }
                          if (isAffordable)
                            handleShopItemClick(
                              item,
                              studentTab === "goldShop"
                            );
                          else
                            alert(
                              studentTab === "goldShop"
                                ? "쿠키가 부족합니다!"
                                : "다이아가 부족합니다!"
                            );
                        }}
                        className={`relative bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all group overflow-hidden ${
                          isAffordable && isLevelSufficient
                            ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                            : "opacity-50 grayscale cursor-not-allowed"
                        }`}
                      >
                        {!isLevelSufficient && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/5 z-10">
                            <div className="bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1">
                              <Lock size={10} /> Lv.{item.requiredLevel}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col items-center text-center mb-4">
                          <span className="text-4xl mb-3">
                            {getShopEmoji(item.name)}
                          </span>
                          <h4 className="text-lg font-black text-slate-800 leading-tight mb-1">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold line-clamp-2 min-h-[1.5em]">
                            {item.description}
                          </p>
                        </div>
                        <div
                          className={`pt-4 border-t border-slate-50 flex justify-center`}
                        >
                          <span
                            className={`px-3 py-1.5 rounded-xl font-black text-sm flex items-center gap-1 ${
                              studentTab === "goldShop"
                                ? "bg-orange-50 text-orange-600"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {studentTab === "goldShop" ? "🍪" : "💎"}{" "}
                            {item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

        {/* --- 학생 모드: 기부 페이지 --- */}
        {userRole === "student" && studentTab === "donation" && (
          <div className="max-w-7xl mx-auto space-y-12">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                  학급 기부
                </h2>
              </div>
              <button
                onClick={() => setShowDonationModal(true)}
                className="bg-rose-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-rose-600 shadow-lg flex items-center gap-2 text-sm"
              >
                <Heart size={16} fill="currentColor" /> 기부하기
              </button>
            </header>

            {/* 중앙 하트 현황 */}
            <div className="flex flex-col items-center justify-center py-10">
              <div className="relative">
                <Heart
                  size={180}
                  className="text-rose-500 animate-pulse"
                  fill="currentColor"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-black text-white drop-shadow-lg">
                    {totalClassHearts}
                  </span>
                </div>
              </div>
              <p className="mt-6 text-xl font-black text-slate-800">
                우리 학급의 총 하트
              </p>
              <p className="text-sm text-slate-400 font-bold">
                10 Cookie = 1 Heart
              </p>
            </div>

            {/* 명예의 전당 */}
            <section>
              <h3 className="text-lg font-black mb-5 flex items-center gap-2 text-rose-500">
                <Trophy size={20} /> 기부 명예의 전당
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {donationHallOfFame.map((student, index) => (
                  <div
                    key={student.id}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden group hover:shadow-md transition-all"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-2xl mb-2">
                      {index === 0
                        ? "👑"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : "🎖️"}
                    </span>
                    <h4 className="font-black text-slate-800 mb-1">
                      {student.name}
                    </h4>
                    <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">
                      {student.hearts} ❤️
                    </span>
                  </div>
                ))}
                {donationHallOfFame.length === 0 && (
                  <p className="col-span-full text-center text-slate-400 py-8">
                    아직 기부한 학생이 없습니다.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        {/* --- 교사 모드: 기부 관리 페이지 --- */}
        {userRole === "teacher" && activeMenu === "기부 관리" && (
          <div className="max-w-7xl mx-auto space-y-12">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                  기부 관리
                </h2>
              </div>
            </header>

            {/* 중앙 하트 현황 (교사용 - 버튼 없음) */}
            <div className="flex flex-col items-center justify-center py-10">
              <div className="relative">
                <Heart
                  size={180}
                  className="text-rose-500 animate-pulse"
                  fill="currentColor"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-black text-white drop-shadow-lg">
                    {totalClassHearts}
                  </span>
                </div>
              </div>
              <p className="mt-6 text-xl font-black text-slate-800">
                우리 학급의 총 하트
              </p>
              <p className="text-sm text-slate-400 font-bold">
                10 Cookie = 1 Heart
              </p>
            </div>

            {/* 명예의 전당 (교사용 - 클릭 시 로그 확인) */}
            <section>
              <h3 className="text-lg font-black mb-5 flex items-center gap-2 text-rose-500">
                <Trophy size={20} /> 기부 명예의 전당
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {donationHallOfFame.map((student, index) => (
                  <div
                    key={student.id}
                    onClick={() => setViewingDonationHistory(student)}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden group hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-2xl mb-2">
                      {index === 0
                        ? "👑"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : "🎖️"}
                    </span>
                    <h4 className="font-black text-slate-800 mb-1">
                      {student.name}
                    </h4>
                    <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">
                      {student.hearts} ❤️
                    </span>
                    <p className="text-[10px] text-slate-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      클릭하여 기록 보기
                    </p>
                  </div>
                ))}
                {donationHallOfFame.length === 0 && (
                  <p className="col-span-full text-center text-slate-400 py-8">
                    아직 기부한 학생이 없습니다.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ... (교사 모드 상점/미션/경험치/스탬프/칭호 관리 페이지 렌더링 - 기존 유지) ... */}
        {activeMenu === "학생 관리" &&
          !selectedStudentId &&
          userRole === "teacher" && (
            // 교사 메인 (학생 리스트) - 기존 코드 유지
            <div className="max-w-7xl mx-auto">
              <header className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                    학생 관리
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(true);
                    setBulkNames("");
                  }}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex items-center gap-2 text-sm"
                >
                  <Plus size={16} /> 학생 추가
                </button>
              </header>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {students.map((s) => (
                  <div
                    key={s.id}
                    className={`relative bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group ${
                      s.hidden ? "opacity-40 grayscale" : ""
                    }`}
                    onClick={() => setSelectedStudentId(s.id)}
                  >
                    <div
                      className="absolute top-3 right-3 group/menu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="p-1.5 bg-slate-100 rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                        <Settings size={14} />
                      </button>
                      <div className="hidden group-hover/menu:block absolute right-0 top-full pt-2 w-48 z-20">
                        <div className="bg-white border border-slate-100 rounded-xl shadow-xl py-1 text-[11px] font-bold">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateRole(s.id, "keeper");
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                          >
                            🛡️ 학급 지킴이 지정
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateRole(s.id, "manager");
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                          >
                            💰 상점 관리인 지정
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateRole(s.id, "none");
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-slate-50"
                          >
                            ❌ 직책 해제
                          </button>
                          <div className="h-px bg-slate-100 my-1 mx-2"></div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleHide(s.id);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                          >
                            {s.hidden ? (
                              <Eye size={12} />
                            ) : (
                              <EyeOff size={12} />
                            )}{" "}
                            학생 숨기기 {s.hidden ? "해제" : ""}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setStudentToDelete(s);
                            }}
                            className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 size={12} /> 학생 삭제
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setStudentToResetPw(s);
                            }}
                            className="w-full px-4 py-2 text-left text-orange-500 hover:bg-orange-50 flex items-center gap-2 border-t border-slate-50"
                          >
                            <RefreshCw size={12} /> 비밀번호 초기화
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-lg font-black">{s.name}</h3>
                        {s.role === "keeper" && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[8px] font-black rounded-md">
                            🛡️ 지킴이
                          </span>
                        )}
                        {s.role === "manager" && (
                          <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[8px] font-black rounded-md">
                            💰 상점
                          </span>
                        )}
                      </div>
                      <p className="text-indigo-500 font-bold text-[9px] uppercase tracking-widest">
                        {s.titles?.[0]}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-2xl font-black italic text-slate-300 tracking-tighter">
                          Lv.{s.level}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {s.exp}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500"
                          style={{ width: `${s.exp}%` }}
                        ></div>
                      </div>
                      <div className="flex gap-3 pt-2 border-t border-slate-50 text-[11px] font-black">
                        <div className="flex-1 text-orange-500">
                          🍪 {s.gold}
                        </div>
                        <div className="flex-1 text-blue-500">💎 {s.dia}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* ... (미션, 경험치, 스탬프, 칭호, 상점 관리 페이지 렌더링 - 기존 유지) ... */}
        {activeMenu === "미션 관리" && (
          <div className="max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                  미션 관리
                </h2>
              </div>
              <button
                onClick={handleAddMissionClick}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex items-center gap-2 text-sm"
              >
                <Plus size={16} /> 미션 추가
              </button>
            </header>
            <div className="space-y-10">
              <section>
                <h3 className="text-lg font-black mb-5 flex items-center gap-2 text-indigo-600">
                  <TrendingUp size={20} /> 진행 중인 미션
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {missionSections.ongoing.map((m) => (
                    <MissionCard
                      key={m.id}
                      mission={m}
                      onEdit={() => {
                        setEditingMission(m);
                        setMissionForm(m);
                        setShowMissionModal(true);
                      }}
                      onDelete={() => setMissionToDelete(m)}
                    />
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-lg font-black mb-5 flex items-center gap-2 text-slate-400">
                  <Calendar size={20} /> 예정된 미션
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {missionSections.scheduled.map((m) => (
                    <MissionCard
                      key={m.id}
                      mission={m}
                      onEdit={() => {
                        setEditingMission(m);
                        setMissionForm(m);
                        setShowMissionModal(true);
                      }}
                      onDelete={() => setMissionToDelete(m)}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
        {activeMenu === "경험치 관리" && (
          <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                  경험치 관리
                </h2>
              </div>
              <button
                onClick={() => setShowExpActionModal(true)}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex items-center gap-2 text-sm"
              >
                <Plus size={16} /> 항목 추가
              </button>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <section>
                <h3 className="text-lg font-black mb-5 flex items-center gap-2 text-blue-600">
                  <Zap size={20} fill="currentColor" /> 경험치 얻기 (+)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {expActions
                    .filter((a) => a.type === "gain")
                    .map((action) => (
                      <div key={action.id} className="relative group">
                        <button
                          onClick={() => {
                            setApplyingExpAction(action);
                            setSelectedStudentIds([]);
                          }}
                          className="w-full p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-400 hover:bg-blue-50 transition-all text-center flex flex-col items-center justify-center gap-1 group/btn"
                        >
                          <span className="font-black text-[13px] text-slate-700">
                            {action.label}
                          </span>
                          <span className="font-bold text-[11px] text-blue-500">
                            +{action.value}xp
                          </span>
                        </button>
                        <div className="absolute top-2 right-2 group/more opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 hover:bg-blue-100 rounded-lg text-slate-400 hover:text-blue-600">
                            <MoreVertical size={14} />
                          </button>
                          <div className="hidden group-hover/more:block absolute right-0 top-full pt-1 w-24 z-20">
                            <div className="bg-white border border-slate-100 rounded-xl shadow-xl py-1 text-[10px] font-bold">
                              <button
                                onClick={() => {
                                  setEditingExpAction(action);
                                  setExpActionForm({
                                    ...action,
                                    value: String(action.value),
                                  });
                                  setShowExpActionModal(true);
                                }}
                                className="w-full px-3 py-1.5 text-left hover:bg-slate-50 italic"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setExpActionToDelete(action)}
                                className="w-full px-3 py-1.5 text-left text-red-500 hover:bg-red-50 italic border-t border-slate-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
              <section>
                <h3 className="text-lg font-black mb-5 flex items-center gap-2 text-red-600">
                  <Zap size={20} className="rotate-180" fill="currentColor" />{" "}
                  경험치 잃기 (-)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {expActions
                    .filter((a) => a.type === "loss")
                    .map((action) => (
                      <div key={action.id} className="relative group">
                        <button
                          onClick={() => {
                            setApplyingExpAction(action);
                            setSelectedStudentIds([]);
                          }}
                          className={`w-full p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-red-400 hover:bg-red-50 transition-all text-center flex flex-col items-center justify-center gap-1 group/btn ${
                            action.label === "반역"
                              ? "border-red-600 bg-red-50/30"
                              : ""
                          }`}
                        >
                          <span
                            className={`font-black text-[13px] ${
                              action.label === "반역"
                                ? "text-red-700"
                                : "text-slate-700"
                            }`}
                          >
                            {action.label}
                          </span>
                          <span className="font-bold text-[11px] text-red-500">
                            {action.label === "반역"
                              ? "RESET"
                              : `${action.value}xp`}
                          </span>
                        </button>
                        <div className="absolute top-2 right-2 group/more opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 hover:bg-red-100 rounded-lg text-slate-400 hover:text-red-600">
                            <MoreVertical size={14} />
                          </button>
                          <div className="hidden group-hover/more:block absolute right-0 top-full pt-1 w-24 z-20">
                            <div className="bg-white border border-slate-100 rounded-xl shadow-xl py-1 text-[10px] font-bold">
                              <button
                                onClick={() => {
                                  setEditingExpAction(action);
                                  setExpActionForm({
                                    ...action,
                                    value: String(action.value),
                                  });
                                  setShowExpActionModal(true);
                                }}
                                className="w-full px-3 py-1.5 text-left hover:bg-slate-50 italic"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setExpActionToDelete(action)}
                                className="w-full px-3 py-1.5 text-left text-red-500 hover:bg-red-50 italic border-t border-slate-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            </div>
          </div>
        )}
        {activeMenu === "스탬프 관리" && (
          <div className="max-w-7xl mx-auto space-y-6">
            <header>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                스탬프 관리
              </h2>
            </header>
            <div className="flex flex-wrap gap-4 bg-white p-5 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
                <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                  영역
                </span>
                <div className="flex gap-1.5">
                  {["전체", "학습", "생활"].map((area) => (
                    <button
                      key={area}
                      onClick={() => setStampAreaFilter(area)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        stampAreaFilter === area
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                  스탯 연계
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "전체",
                    "탐구력",
                    "계획력",
                    "소통력",
                    "공감력",
                    "예술력",
                    "행동력",
                  ].map((stat) => (
                    <button
                      key={stat}
                      onClick={() => setStampStatFilter(stat)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        stampStatFilter === stat
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      {stat.replace("력", "")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3">
              {filteredStamps.map((stamp) => (
                <button
                  key={stamp.id}
                  onClick={() => setSelectedStampLabel(stamp.label)}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                    selectedStampLabel === stamp.label
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <span className="text-2xl">{stamp.emoji}</span>
                  <span className="text-[10px] font-black leading-none">
                    {stamp.label}
                  </span>
                </button>
              ))}
            </div>
            {selectedStampLabel && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-in fade-in">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-50">
                  <h3 className="text-base font-black text-slate-800">
                    "{selectedStampLabel}" 보유 학생 및 개수
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg">
                      누적{" "}
                      {stampHolders.reduce((acc, curr) => acc + curr.count, 0)}
                      회
                    </span>
                    <button
                      onClick={() => {
                        const currentStamp = STAMP_ITEMS.find(
                          (s) => s.label === selectedStampLabel
                        );
                        setApplyingStampItem(currentStamp);
                        setSelectedStudentIds([]);
                      }}
                      className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] hover:bg-emerald-700 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <Stamp size={14} /> 스탬프 부여
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {stampHolders.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <span className="font-bold text-[11px] text-slate-700">
                        {s.name}
                      </span>
                      <span className="font-black text-[11px] text-indigo-600 bg-white w-6 h-6 flex items-center justify-center rounded-lg shadow-sm">
                        {s.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {activeMenu === "칭호 관리" && (
          <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                  칭호 관리
                </h2>
              </div>
              <button
                onClick={() => setShowTitleModal(true)}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex items-center gap-2 text-sm"
              >
                <Plus size={16} /> 칭호 추가
              </button>
            </header>
            <section>
              <h3 className="text-lg font-black mb-5 flex items-center gap-2 text-indigo-600">
                <Trophy size={20} /> 진행 중인 칭호
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {titleSections.active.map((t) => (
                  <TitleCard
                    key={t.id}
                    title={t}
                    onEdit={() => {
                      setEditingTitle(t);
                      setTitleForm(t);
                      setShowTitleModal(true);
                    }}
                    onDelete={() => setTitleToDelete(t)}
                    onComplete={() => completeTitle(t)}
                    onApply={() => {
                      setApplyingTitle(t);
                      setSelectedStudentIds([]);
                    }}
                  />
                ))}
                {titleSections.active.length === 0 && (
                  <p className="col-span-full py-8 text-center text-slate-300 font-bold bg-slate-50 rounded-2xl border border-dashed">
                    현재 진행 중인 칭호 이벤트가 없습니다.
                  </p>
                )}
              </div>
            </section>
            <section>
              <h3 className="text-lg font-black mb-5 flex items-center gap-2 text-slate-400">
                <CheckCircle size={20} /> 완료된 칭호
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 opacity-60 hover:opacity-100 transition-opacity">
                {titleSections.completed.map((t) => (
                  <TitleCard
                    key={t.id}
                    title={t}
                    onEdit={() => {
                      setEditingTitle(t);
                      setTitleForm(t);
                      setShowTitleModal(true);
                    }}
                    onDelete={() => setTitleToDelete(t)}
                    isCompleted={true}
                    onApply={() => {
                      setApplyingTitle(t);
                      setSelectedStudentIds([]);
                    }}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
        {(activeMenu === "쿠키 상점" || activeMenu === "다이아 상점") && (
          <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                  {activeMenu}
                </h2>
              </div>
              <button
                onClick={() => setShowShopModal(true)}
                className={`px-5 py-2.5 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 text-sm transition-all ${
                  activeMenu === "쿠키 상점"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                <Plus size={16} /> 아이템 추가
              </button>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(activeMenu === "쿠키 상점" ? goldItems : diamondItems).map(
                (item) => (
                  <div
                    key={item.id}
                    className="relative bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
                  >
                    <div className="absolute top-4 right-4 group/menu">
                      <button className="p-1.5 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
                        <Settings size={14} className="text-slate-400" />
                      </button>
                      <div className="hidden group-hover/menu:block absolute right-0 top-full pt-2 w-32 z-20">
                        <div className="bg-white border border-slate-100 rounded-xl shadow-xl py-1 text-[11px] font-bold">
                          <button
                            onClick={() => {
                              setEditingShopItem(item);
                              setShopForm(item);
                              setShowShopModal(true);
                            }}
                            className="w-full px-3 py-1.5 text-left hover:bg-slate-50"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => setShopItemToDelete(item)}
                            className="w-full px-3 py-1.5 text-left text-red-500 hover:bg-red-50 border-t border-slate-50"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center text-center mb-4">
                      <span className="text-4xl mb-3">
                        {getShopEmoji(item.name)}
                      </span>
                      <h4 className="text-lg font-black text-slate-800 leading-tight mb-1">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold line-clamp-2 min-h-[1.5em]">
                        {item.description}
                      </p>
                    </div>
                    <div
                      className={`pt-4 border-t border-slate-50 flex justify-center`}
                    >
                      <span
                        className={`px-3 py-1.5 rounded-xl font-black text-sm flex items-center gap-1 ${
                          activeMenu === "쿠키 상점"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {activeMenu === "쿠키 상점" ? "🍪" : "💎"}{" "}
                        {item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* --- 공통 모달 컴포넌트들 --- */}
        {(applyingExpAction || applyingStampItem || applyingTitle) && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[85vh]">
              <div
                className={`p-4 ${
                  applyingStampItem
                    ? "bg-emerald-600"
                    : applyingTitle
                    ? "bg-purple-600"
                    : "bg-indigo-600"
                } text-white flex justify-between items-center shrink-0`}
              >
                <h3 className="text-lg font-black">
                  {applyingTitle
                    ? `"${applyingTitle.name}" 부여`
                    : `"${
                        applyingExpAction?.label || applyingStampItem?.label
                      }" 부여`}
                </h3>
                <button
                  onClick={() => {
                    setApplyingExpAction(null);
                    setApplyingStampItem(null);
                    setApplyingTitle(null);
                  }}
                  className="p-1 hover:bg-white/10 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                {applyingTitle &&
                  (() => {
                    const existingHolders = students.filter((s) =>
                      s.titles.includes(applyingTitle.name)
                    );
                    const targetStudents = students.filter(
                      (s) => !s.hidden && !s.titles.includes(applyingTitle.name)
                    );
                    return (
                      <>
                        <div className="mb-2 font-bold text-xs text-slate-400 uppercase tracking-widest">
                          대상 학생 선택
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                          {targetStudents.map((student) => (
                            <button
                              key={student.id}
                              onClick={() =>
                                setSelectedStudentIds((prev) =>
                                  prev.includes(student.id)
                                    ? prev.filter((id) => id !== student.id)
                                    : [...prev, student.id]
                                )
                              }
                              className={`p-3 rounded-xl border transition-all text-center relative group ${
                                selectedStudentIds.includes(student.id)
                                  ? "bg-purple-50 border-purple-600 shadow-sm"
                                  : "bg-slate-50 border-transparent hover:border-slate-200"
                              }`}
                            >
                              {selectedStudentIds.includes(student.id) && (
                                <div className="absolute -top-1.5 -right-1.5 bg-purple-600 text-white rounded-full p-0.5 shadow-md">
                                  <Check size={10} strokeWidth={4} />
                                </div>
                              )}
                              <p
                                className={`font-black text-xs ${
                                  selectedStudentIds.includes(student.id)
                                    ? "text-purple-600"
                                    : "text-slate-700"
                                }`}
                              >
                                {student.name}
                              </p>
                            </button>
                          ))}
                        </div>
                        {existingHolders.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-slate-100">
                            <div className="mb-2 font-bold text-xs text-slate-400 uppercase tracking-widest">
                              이미 획득한 학생
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {existingHolders.map((s) => (
                                <span
                                  key={s.id}
                                  className="px-2 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-bold"
                                >
                                  {s.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}

                {!applyingTitle && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {students
                      .filter((s) => !s.hidden)
                      .map((student) => (
                        <button
                          key={student.id}
                          onClick={() =>
                            setSelectedStudentIds((prev) =>
                              prev.includes(student.id)
                                ? prev.filter((id) => id !== student.id)
                                : [...prev, student.id]
                            )
                          }
                          className={`p-4 rounded-2xl border transition-all text-center relative group ${
                            selectedStudentIds.includes(student.id)
                              ? applyingStampItem
                                ? "bg-emerald-50 border-emerald-600"
                                : "bg-indigo-50 border-indigo-600"
                              : "bg-slate-50 border-transparent hover:border-slate-200"
                          }`}
                        >
                          {selectedStudentIds.includes(student.id) && (
                            <div
                              className={`absolute -top-2 -right-2 ${
                                applyingStampItem
                                  ? "bg-emerald-600"
                                  : "bg-indigo-600"
                              } text-white rounded-full p-1 shadow-md`}
                            >
                              <Check size={12} strokeWidth={4} />
                            </div>
                          )}
                          <p
                            className={`font-black text-sm ${
                              selectedStudentIds.includes(student.id)
                                ? applyingStampItem
                                  ? "text-emerald-600"
                                  : "text-indigo-600"
                                : "text-slate-700"
                            }`}
                          >
                            {student.name}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400">
                            Lv.{student.level}
                          </p>
                        </button>
                      ))}
                  </div>
                )}

                {(!applyingTitle ||
                  students.filter(
                    (s) => !s.hidden && !s.titles.includes(applyingTitle.name)
                  ).length > 0) && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-slate-50">
                    <button
                      onClick={() => {
                        const targets = applyingTitle
                          ? students
                              .filter(
                                (s) =>
                                  !s.hidden &&
                                  !s.titles.includes(applyingTitle.name)
                              )
                              .map((s) => s.id)
                          : students.filter((s) => !s.hidden).map((s) => s.id);
                        setSelectedStudentIds(targets);
                      }}
                      className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200 transition-all text-xs uppercase tracking-widest"
                    >
                      전체 선택
                    </button>
                    <button
                      onClick={
                        applyingStampItem
                          ? applyStampToStudents
                          : applyingTitle
                          ? applyTitleToStudents
                          : applyExpToStudents
                      }
                      disabled={selectedStudentIds.length === 0}
                      className={`flex-2 py-3 px-6 ${
                        applyingStampItem
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : applyingTitle
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } text-white rounded-xl font-black transition-all shadow-lg disabled:opacity-50`}
                    >
                      {selectedStudentIds.length}명에게 부여
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {showTitleModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[32px] p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black italic tracking-tight">
                  {editingTitle ? "칭호 수정" : "새 칭호 추가"}
                </h3>
                <button
                  onClick={() => {
                    setShowTitleModal(false);
                    setEditingTitle(null);
                    setTitleForm({
                      name: "",
                      condition: "",
                      hasDate: false,
                      startDate: "",
                      endDate: "",
                      status: "active",
                    });
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X />
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                    칭호 이름
                  </label>
                  <input
                    type="text"
                    value={titleForm.name}
                    onChange={(e) =>
                      setTitleForm({ ...titleForm, name: e.target.value })
                    }
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="칭호 이름 *"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                    획득 조건
                  </label>
                  <textarea
                    value={titleForm.condition}
                    onChange={(e) =>
                      setTitleForm({ ...titleForm, condition: e.target.value })
                    }
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none"
                    placeholder="획득 조건 설명"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm font-bold bg-slate-50 p-3 rounded-xl">
                  <input
                    type="checkbox"
                    checked={titleForm.hasDate}
                    onChange={(e) =>
                      setTitleForm({ ...titleForm, hasDate: e.target.checked })
                    }
                    className="w-4 h-4 accent-purple-600"
                  />{" "}
                  날짜 지정
                </div>
                {titleForm.hasDate && (
                  <div className="grid grid-cols-2 gap-3 animate-in fade-in">
                    <input
                      type="date"
                      value={titleForm.startDate}
                      onChange={(e) =>
                        setTitleForm({
                          ...titleForm,
                          startDate: e.target.value,
                        })
                      }
                      className="p-3 bg-slate-50 rounded-xl text-xs font-bold border border-slate-100"
                    />
                    <input
                      type="date"
                      value={titleForm.endDate}
                      onChange={(e) =>
                        setTitleForm({ ...titleForm, endDate: e.target.value })
                      }
                      className="p-3 bg-slate-50 rounded-xl text-xs font-bold border border-slate-100"
                    />
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setShowTitleModal(false);
                      setEditingTitle(null);
                    }}
                    className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleTitleSubmit}
                    className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100"
                  >
                    칭호 저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {titleToDelete && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-black mb-2">칭호 삭제</h3>
              <p className="text-[11px] text-slate-400 mb-6 italic">
                "{titleToDelete.name}" 칭호가 영구히 삭제됩니다.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setTitleToDelete(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold"
                >
                  취소
                </button>
                <button
                  onClick={confirmDeleteTitle}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
        {showShopModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[32px] p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black italic tracking-tight">
                  {editingShopItem ? "아이템 수정" : "새 아이템 추가"}
                </h3>
                <button
                  onClick={() => {
                    setShowShopModal(false);
                    setEditingShopItem(null);
                    setShopForm({
                      name: "",
                      description: "",
                      price: "",
                      requiredLevel: 0,
                    });
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X />
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                    아이템
                  </label>
                  <input
                    type="text"
                    value={shopForm.name}
                    onChange={(e) =>
                      setShopForm({ ...shopForm, name: e.target.value })
                    }
                    className={`w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm focus:ring-2 outline-none ${
                      activeMenu === "쿠키 상점"
                        ? "focus:ring-orange-500"
                        : "focus:ring-blue-500"
                    }`}
                    placeholder="아이템 이름 *"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                    설명
                  </label>
                  <textarea
                    value={shopForm.description}
                    onChange={(e) =>
                      setShopForm({ ...shopForm, description: e.target.value })
                    }
                    className={`w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm focus:ring-2 outline-none h-24 resize-none ${
                      activeMenu === "쿠키 상점"
                        ? "focus:ring-orange-500"
                        : "focus:ring-blue-500"
                    }`}
                    placeholder="아이템 설명"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                    가격 ({activeMenu === "쿠키 상점" ? "쿠키" : "다이아"})
                  </label>
                  <input
                    type="number"
                    value={shopForm.price}
                    onChange={(e) =>
                      setShopForm({ ...shopForm, price: e.target.value })
                    }
                    className={`w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm focus:ring-2 outline-none ${
                      activeMenu === "쿠키 상점"
                        ? "focus:ring-orange-500 text-orange-600"
                        : "focus:ring-blue-500 text-blue-600"
                    }`}
                    placeholder="가격 입력"
                  />
                </div>
                {activeMenu === "다이아 상점" && (
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                      제한 레벨
                    </label>
                    <input
                      type="number"
                      value={shopForm.requiredLevel}
                      onChange={(e) =>
                        setShopForm({
                          ...shopForm,
                          requiredLevel: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm focus:ring-2 outline-none focus:ring-blue-500 text-blue-600"
                      placeholder="해금 레벨 (0: 즉시 구매)"
                    />
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setShowShopModal(false);
                      setEditingShopItem(null);
                      setShopForm({
                        name: "",
                        description: "",
                        price: "",
                        requiredLevel: 0,
                      });
                    }}
                    className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleShopSubmit}
                    className={`flex-1 py-3 text-white rounded-xl font-bold shadow-lg ${
                      activeMenu === "쿠키 상점"
                        ? "bg-orange-500 shadow-orange-100 hover:bg-orange-600"
                        : "bg-blue-500 shadow-blue-100 hover:bg-blue-600"
                    }`}
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {shopItemToDelete && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-black mb-2">아이템 삭제</h3>
              <p className="text-[11px] text-slate-400 mb-6 italic">
                "{shopItemToDelete.name}" 아이템이 상점에서 제거됩니다.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShopItemToDelete(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold"
                >
                  취소
                </button>
                <button
                  onClick={confirmDeleteShopItem}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
        {purchasingItem && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-8 text-center animate-in zoom-in duration-200 shadow-2xl">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={32} />
              </div>
              <h3 className="text-lg font-black mb-2">구매하시겠습니까?</h3>
              <p className="text-sm font-bold text-slate-700 mb-1">
                {purchasingItem.name}
              </p>
              <p className="text-[11px] text-slate-400 mb-6 font-medium">
                가격: {purchasingItem.isGold ? "🍪" : "💎"}{" "}
                {purchasingItem.price.toLocaleString()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPurchasingItem(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold"
                >
                  취소
                </button>
                <button
                  onClick={handlePurchaseItem}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
        {viewingDonationHistory && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative">
              <button
                onClick={() => setViewingDonationHistory(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-black mb-1 text-slate-900">
                {viewingDonationHistory.name}의 기부 기록
              </h3>
              <p className="text-xs text-slate-400 font-bold mb-6 uppercase tracking-widest">
                Donation History
              </p>

              <div className="space-y-2 h-64 overflow-y-auto pr-2 custom-scrollbar">
                {viewingDonationHistory.logs.filter(
                  (l) => l.type === "donation"
                ).length === 0 ? (
                  <p className="text-center text-slate-400 text-xs py-10">
                    기부 기록이 없습니다.
                  </p>
                ) : (
                  viewingDonationHistory.logs
                    .filter((l) => l.type === "donation")
                    .map((log, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-rose-50 rounded-xl border border-rose-100 text-xs font-bold"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 font-mono">
                            {log.time}
                          </span>
                          <span className="text-slate-700">기부</span>
                        </div>
                        <span className="text-rose-600">
                          {Math.abs(log.value)}C ({Math.abs(log.value) / 10}❤️)
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}
        {showDonationModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-8 text-center animate-in zoom-in duration-200 shadow-2xl">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} fill="currentColor" />
              </div>
              <h3 className="text-lg font-black mb-2">학급 기부하기</h3>
              <p className="text-xs text-slate-400 font-bold mb-6">
                10 Cookie = 1 Heart
              </p>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(Number(e.target.value))}
                step="10"
                min="10"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-center text-xl text-rose-500 mb-6 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDonationModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold"
                >
                  취소
                </button>
                <button
                  onClick={handleDonation}
                  className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200"
                >
                  기부하기
                </button>
              </div>
            </div>
          </div>
        )}
        {showExpActionModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl">
              <h3 className="text-lg font-black mb-4 italic tracking-tight">
                {editingExpAction ? "경험치 항목 수정" : "새 항목 추가"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                    행동
                  </label>
                  <input
                    type="text"
                    value={expActionForm.label}
                    onChange={(e) =>
                      setExpActionForm({
                        ...expActionForm,
                        label: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm"
                    placeholder="예: 바른 인사"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                    경험치
                  </label>
                  <input
                    type="number"
                    value={expActionForm.value}
                    onChange={(e) =>
                      setExpActionForm({
                        ...expActionForm,
                        value: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm"
                    placeholder="수치를 입력하세요"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                    타입
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setExpActionForm({ ...expActionForm, type: "gain" })
                      }
                      className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                        expActionForm.type === "gain"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      얻기 (+)
                    </button>
                    <button
                      onClick={() =>
                        setExpActionForm({ ...expActionForm, type: "loss" })
                      }
                      className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                        expActionForm.type === "loss"
                          ? "bg-red-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      잃기 (-)
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setShowExpActionModal(false);
                      setEditingExpAction(null);
                      setExpActionForm({ label: "", value: "", type: "gain" });
                    }}
                    className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleExpActionSubmit}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {expActionToDelete && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-8 text-center border border-red-100 animate-in zoom-in duration-150">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-black mb-2">경험치 항목 삭제</h3>
              <p className="text-[11px] text-slate-400 mb-6 italic">
                "{expActionToDelete.label}" 항목을 목록에서 제거합니다.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setExpActionToDelete(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    setExpActions(
                      expActions.filter((a) => a.id !== expActionToDelete.id)
                    );
                    setExpActionToDelete(null);
                  }}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-100"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-6">
              <h3 className="text-xl font-black mb-4">학생 추가</h3>
              <textarea
                value={bulkNames}
                onChange={(e) => setBulkNames(e.target.value)}
                placeholder="이름을 콤마나 줄바꿈으로 입력하세요..."
                className="w-full h-40 p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold mb-4"
              ></textarea>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold"
                >
                  취소
                </button>
                <button
                  onClick={addStudents}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold"
                >
                  학생 추가하기
                </button>
              </div>
            </div>
          </div>
        )}
        {studentToDelete && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-black mb-2">정말 삭제할까요?</h3>
              <p className="text-[11px] text-slate-400 mb-6 italic">
                "{studentToDelete.name}"의 모든 모험 기록이 영구히 소멸됩니다.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setStudentToDelete(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold"
                >
                  취소
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
        {missionToDelete && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-black mb-2">미션 영구 삭제</h3>
              <p className="text-[11px] text-slate-400 mb-6">
                "{missionToDelete.title}" 미션을 목록에서 제거합니다.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setMissionToDelete(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold"
                >
                  취소
                </button>
                <button
                  onClick={confirmDeleteMission}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
        {/* 비밀번호 변경 모달 (로그인 시) */}
        {showPasswordChangeModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-200">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw size={32} />
              </div>
              <h3 className="text-xl font-black mb-2 text-center text-slate-900">
                비밀번호 변경
              </h3>
              <p className="text-sm text-slate-500 font-medium text-center mb-6">
                새로운 비밀번호(숫자 4자리)를 설정해주세요.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 ml-1 uppercase">
                    새로운 비밀번호
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-center tracking-widest text-lg"
                    placeholder="숫자 4자리"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 ml-1 uppercase">
                    비밀번호 확인
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-center tracking-widest text-lg"
                    placeholder="한 번 더 입력"
                    maxLength={4}
                  />
                </div>
                {pwChangeError && (
                  <p className="text-red-500 text-xs font-bold text-center">
                    {pwChangeError}
                  </p>
                )}

                <button
                  onClick={handlePasswordChangeSubmit}
                  className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 mt-2"
                >
                  변경 완료 및 로그인
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 미션 추가/수정 모달 */}
        {showMissionModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[32px] p-8 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black italic tracking-tight">
                  {editingMission ? "미션 수정" : "새 미션 추가"}
                </h3>
                <button
                  onClick={() => {
                    setShowMissionModal(false);
                    setEditingMission(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X />
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                    미션 제목
                  </label>
                  <input
                    type="text"
                    value={missionForm.title}
                    onChange={(e) =>
                      setMissionForm({ ...missionForm, title: e.target.value })
                    }
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="미션 제목 *"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm font-bold bg-slate-50 p-3 rounded-xl">
                  <input
                    type="checkbox"
                    checked={missionForm.hasDate}
                    onChange={(e) =>
                      setMissionForm({
                        ...missionForm,
                        hasDate: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-indigo-600"
                  />{" "}
                  날짜 지정
                </div>
                {missionForm.hasDate && (
                  <div className="grid grid-cols-2 gap-3 animate-in fade-in">
                    <input
                      type="date"
                      value={missionForm.startDate}
                      onChange={(e) =>
                        setMissionForm({
                          ...missionForm,
                          startDate: e.target.value,
                        })
                      }
                      className="p-3 bg-slate-50 rounded-xl text-xs font-bold border border-slate-100"
                    />
                    <input
                      type="date"
                      value={missionForm.endDate}
                      onChange={(e) =>
                        setMissionForm({
                          ...missionForm,
                          endDate: e.target.value,
                        })
                      }
                      className="p-3 bg-slate-50 rounded-xl text-xs font-bold border border-slate-100"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                      경험치
                    </label>
                    <input
                      type="number"
                      value={missionForm.exp}
                      onChange={(e) =>
                        setMissionForm({
                          ...missionForm,
                          exp: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 bg-slate-50 rounded-xl font-bold text-sm border border-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                      쿠키
                    </label>
                    <input
                      type="number"
                      value={missionForm.gold}
                      onChange={(e) =>
                        setMissionForm({
                          ...missionForm,
                          gold: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 bg-slate-50 rounded-xl font-bold text-sm border border-slate-100"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">
                      스탬프 보상 (최대 3개)
                    </label>
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {missionForm.stamps.length} / 3
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100 max-h-40 overflow-y-auto custom-scrollbar">
                    {STAMP_ITEMS.map((stamp) => {
                      const isSelected = missionForm.stamps.includes(
                        stamp.label
                      );
                      return (
                        <button
                          key={stamp.id}
                          type="button"
                          onClick={() => {
                            setMissionForm((prev) => {
                              if (isSelected) {
                                return {
                                  ...prev,
                                  stamps: prev.stamps.filter(
                                    (s) => s !== stamp.label
                                  ),
                                };
                              } else if (prev.stamps.length < 3) {
                                return {
                                  ...prev,
                                  stamps: [...prev.stamps, stamp.label],
                                };
                              }
                              return prev;
                            });
                          }}
                          className={`flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all ${
                            isSelected
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm scale-105"
                              : "bg-white border-slate-200 text-slate-400 hover:border-indigo-300"
                          }`}
                        >
                          <span className="text-lg">{stamp.emoji}</span>
                          <span
                            className={`text-[8px] font-black truncate w-full text-center ${
                              isSelected ? "text-white" : "text-slate-500"
                            }`}
                          >
                            {stamp.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                    칭호 보상
                  </label>
                  <select
                    value={missionForm.titleReward}
                    onChange={(e) =>
                      setMissionForm({
                        ...missionForm,
                        titleReward: e.target.value,
                      })
                    }
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none"
                  >
                    <option value="">없음</option>
                    {titles.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setShowMissionModal(false);
                      setEditingMission(null);
                    }}
                    className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleMissionSubmit}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- 미션 카드 컴포넌트 ---
const MissionCard = ({ mission, onEdit, onDelete }) => {
  return (
    <div className="relative bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
      <div className="absolute top-3 right-3 group/menu">
        <button className="p-1.5 bg-slate-50 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
          <Settings size={12} />
        </button>
        <div className="hidden group-hover/menu:block absolute right-0 top-full pt-1.5 w-32 z-20">
          <div className="bg-white border border-slate-100 rounded-lg shadow-lg py-1 text-[10px] font-bold">
            <button
              onClick={onEdit}
              className="w-full px-3 py-1.5 text-left hover:bg-slate-50"
            >
              수정
            </button>
            <button
              onClick={onDelete}
              className="w-full px-3 py-1.5 text-left text-red-500 hover:bg-red-50"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
      <div className="mb-3">
        <h4 className="text-sm font-black text-slate-800 line-clamp-1 pr-6 tracking-tight">
          {mission.title}
        </h4>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
          {mission.hasDate
            ? `${mission.startDate} ~ ${mission.endDate}`
            : "상시 미션"}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-50">
        {mission.exp > 0 && (
          <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-md">
            +{mission.exp} XP
          </span>
        )}
        {mission.gold > 0 && (
          <span className="px-1.5 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-black rounded-md">
            🍪 {mission.gold}
          </span>
        )}
        {mission.stamps &&
          mission.stamps.map((sLabel, idx) => {
            const stampData = STAMP_ITEMS.find((item) => item.label === sLabel);
            return (
              <span
                key={idx}
                className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-md flex items-center gap-0.5"
              >
                {stampData?.emoji} {sLabel}
              </span>
            );
          })}
      </div>
    </div>
  );
};

// --- 칭호 카드 컴포넌트 ---
const TitleCard = ({
  title,
  onEdit,
  onDelete,
  onComplete,
  isCompleted,
  onApply,
}) => {
  return (
    <div
      className={`relative bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden cursor-pointer`}
      onClick={!isCompleted ? onApply : undefined}
    >
      {!isCompleted && (
        <div
          className="absolute top-3 right-3 group/menu"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="p-1.5 bg-slate-50 rounded-full hover:bg-purple-50 hover:text-purple-600 transition-colors">
            <Settings size={12} />
          </button>
          <div className="hidden group-hover/menu:block absolute right-0 top-full pt-1.5 w-32 z-20">
            <div className="bg-white border border-slate-100 rounded-lg shadow-lg py-1 text-[10px] font-bold">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete();
                }}
                className="w-full px-3 py-1.5 text-left text-emerald-600 hover:bg-emerald-50"
              >
                완료 처리
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-slate-50"
              >
                수정
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="w-full px-3 py-1.5 text-left text-red-500 hover:bg-red-50 border-t border-slate-50"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <Award
            size={18}
            className={isCompleted ? "text-slate-400" : "text-purple-500"}
          />
          <h4 className="text-sm font-black text-slate-800 line-clamp-1 pr-6 tracking-tight">
            {title.name}
          </h4>
        </div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
          {title.hasDate
            ? `${title.startDate} ~ ${title.endDate}`
            : "상시 획득 가능"}
        </p>
      </div>
      <div className="pt-3 border-t border-slate-50">
        <p className="text-[10px] font-bold text-slate-600 line-clamp-2">
          {title.condition}
        </p>
      </div>
    </div>
  );
};

export default App;
