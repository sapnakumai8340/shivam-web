import React, { useState, useEffect } from 'react';
import {
  Users,
  CreditCard,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  Send,
  FileText,
  Printer,
  Sparkles,
  X,
  ChevronRight,
  Edit3,
  Trash2,
  MessageSquare,
  Activity,
  Zap,
  Filter,
  QrCode,
  Smartphone,
  Copy,
  TrendingUp,
  TrendingDown,
  LayoutGrid,
  Table as TableIcon,
  Package,
  UserCheck,
  UserX,
  ShieldCheck,
  BookOpen,
  Receipt,
  ClipboardCheck,
  PlusCircle,
  FilePlus,
  PhoneCall,
  SlidersHorizontal,
  CheckCircle,
  ArrowUpRight,
  DollarSign
} from 'lucide-react';
import {
  PlayerManagementProfile,
  FeePaymentRecord,
  FeePaymentStatus,
  EquipmentInventoryItem,
  UserRole,
  AthleteProfile,
  AcademyExpenseRecord,
  CoachSessionNote
} from '../types';

interface ManagementViewProps {
  role: UserRole;
  currentAthlete?: AthleteProfile;
  players: PlayerManagementProfile[];
  feeRecords: FeePaymentRecord[];
  inventory: EquipmentInventoryItem[];
  onUpdatePlayers: (updated: PlayerManagementProfile[]) => void;
  onUpdateFeeRecords: (updated: FeePaymentRecord[]) => void;
  onUpdateInventory: (updated: EquipmentInventoryItem[]) => void;
  onOpenLogin: () => void;
}

export const ManagementView: React.FC<ManagementViewProps> = ({
  role,
  currentAthlete,
  players,
  feeRecords,
  inventory,
  onUpdatePlayers,
  onUpdateFeeRecords,
  onUpdateInventory,
  onOpenLogin,
}) => {
  const isAdmin = role === 'admin';

  // 1. Resolve logged-in player profile
  const loggedInMatch = players.find(
    (p) =>
      p.id === currentAthlete?.id ||
      p.name.toLowerCase() === currentAthlete?.name?.toLowerCase()
  );

  const currentLoggedInPlayer: PlayerManagementProfile = loggedInMatch || {
    id: currentAthlete?.id || 'APX-9942',
    name: currentAthlete?.name || 'Rahul Kumar',
    avatar: currentAthlete?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    jerseyNumber: currentAthlete?.number || 9,
    position: currentAthlete?.role || currentAthlete?.position || 'FWD (ST)',
    sportSpecialty: currentAthlete?.sportSpecialty || 'Football (Striker)',
    phone: currentAthlete?.phone || '+91 98765 43210',
    email: `${(currentAthlete?.handle || currentAthlete?.name || 'player').toLowerCase().replace(/[^a-z0-9]/g, '')}@apexacademy.org`,
    guardianName: currentAthlete?.guardianName || 'Guardian',
    guardianPhone: currentAthlete?.guardianPhone || '+91 98765 00001',
    joiningDate: '15 Jan 2026',
    monthlyFee: 2500,
    feeStatus: 'PAID',
    lastPaymentDate: '10 Aug 2026',
    lastPaymentAmount: 2500,
    attendancePct: 96,
    status: 'ACTIVE',
    kitIssued: {
      jerseySize: 'L',
      bootSize: 'UK 9',
      kitBagAssigned: true,
      ballAssigned: true,
    },
    medicalNotes: 'Cleared for high-performance training & match sessions.',
  };

  // 2. Strict filtering: If role === 'player', show ONLY the logged-in player!
  const displayPlayers = isAdmin ? players : [currentLoggedInPlayer];

  const rawFeeRecords = isAdmin
    ? feeRecords
    : feeRecords.filter(
      (f) =>
        f.playerId === currentLoggedInPlayer.id ||
        f.playerName.toLowerCase() === currentLoggedInPlayer.name.toLowerCase()
    );

  const activeFeeRecords =
    !isAdmin && rawFeeRecords.length === 0
      ? [
        {
          id: `PAY-${currentLoggedInPlayer.id}-AUG`,
          playerId: currentLoggedInPlayer.id,
          playerName: currentLoggedInPlayer.name,
          jerseyNumber: currentLoggedInPlayer.jerseyNumber,
          phone: currentLoggedInPlayer.phone,
          amount: currentLoggedInPlayer.monthlyFee || 2500,
          monthYear: 'August 2026',
          paidDate: currentLoggedInPlayer.lastPaymentDate || '10 Aug 2026',
          paymentMethod: 'UPI' as const,
          receiptNo: `REC-2026-${currentLoggedInPlayer.jerseyNumber || 9}01`,
          status: (currentLoggedInPlayer.feeStatus || 'PAID') as FeePaymentStatus,
          notes: 'Monthly Academy Training & Performance Infrastructure Fee',
          collectorName: 'Admin Desk',
        },
      ]
      : rawFeeRecords;

  // Active Tab (Defaults to 'all-boxes' for Khel Bahi Grid view)
  const [activeTab, setActiveTab] = useState<'all-boxes' | 'fees' | 'roster' | 'attendance' | 'inventory' | 'ledger' | 'expenses' | 'notes'>('all-boxes');

  // Roster View Mode (Grid vs Table)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [squadFilter, setSquadFilter] = useState<string>('ALL');

  // Modals state
  const [selectedPlayerForPayment, setSelectedPlayerForPayment] = useState<PlayerManagementProfile | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<FeePaymentRecord | null>(null);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [selectedPlayerForKitModal, setSelectedPlayerForKitModal] = useState<PlayerManagementProfile | null>(null);
  const [reminderToast, setReminderToast] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Expenses & Session Notes Local State
  const [expenses, setExpenses] = useState<AcademyExpenseRecord[]>(() => {
    try {
      const saved = localStorage.getItem('khelbahi_expenses_v1');
      return saved ? JSON.parse(saved) : [
        { id: 'EXP-101', category: 'Ground Rent', description: 'Monthly Turf Ground Lease (Sept 2026)', amount: 15000, date: '01 Sept 2026', paidTo: 'Patna Sports Arena', paymentMethod: 'Bank Transfer', receiptRef: 'TXN-998811' },
        { id: 'EXP-102', category: 'Equipment', description: 'Nivia Match Footballs (x10) & Agility Cones', amount: 8500, date: '04 Sept 2026', paidTo: 'Sports Mart India', paymentMethod: 'UPI', receiptRef: 'UPI-774411' },
        { id: 'EXP-103', category: 'Coach Salary', description: 'Head Tactical Coach Monthly Stipend', amount: 25000, date: '05 Sept 2026', paidTo: 'Coach Sharma', paymentMethod: 'Bank Transfer' },
        { id: 'EXP-104', category: 'Refreshments', description: 'Energy Drinks & Bananas for Match Day', amount: 1800, date: '08 Sept 2026', paidTo: 'Fresh Supermarket', paymentMethod: 'Cash' }
      ];
    } catch (e) {
      return [];
    }
  });

  const [sessionNotes, setSessionNotes] = useState<CoachSessionNote[]>(() => {
    try {
      const saved = localStorage.getItem('khelbahi_session_notes_v1');
      return saved ? JSON.parse(saved) : [
        { id: 'NOTE-201', date: '11 Sept 2026', title: 'High-Press Defense & Quick Transitions', focusArea: 'Tactical Passing & Wing Overlaps', coachName: 'Head Coach Vikram', attendanceCount: 18, keyObservations: 'Rahul and Amit displayed excellent synergy in pressing high. Striker finishing requires 1-touch drill work.', nextDrillsPlanned: '3v2 Counter-Attack & Set Piece Defending' },
        { id: 'NOTE-202', date: '09 Sept 2026', title: 'Stamina, Sprint Intervals & Core Fitness', focusArea: 'Physical Conditioning', coachName: 'Fitness Coach Rohan', attendanceCount: 22, keyObservations: 'Squad sprint times improved by 4.2%. Midfielders showed high cardiac recovery.', nextDrillsPlanned: 'Beep Test & Plyometric Box Jumps' }
      ];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('khelbahi_expenses_v1', JSON.stringify(expenses));
    } catch (e) { }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem('khelbahi_session_notes_v1', JSON.stringify(sessionNotes));
    } catch (e) { }
  }, [sessionNotes]);

  // Payment Modal Specific State
  const [paymentModeTab, setPaymentModeTab] = useState<'qr' | 'manual'>('qr');
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Kit & Gear Modal State
  const [modalJerseySize, setModalJerseySize] = useState<string>('L');
  const [modalBootSize, setModalBootSize] = useState<string>('UK 9');
  const [modalKitBag, setModalKitBag] = useState<boolean>(true);
  const [modalBall, setModalBall] = useState<boolean>(true);
  const [modalShinGuards, setModalShinGuards] = useState<boolean>(true);
  const [modalGripSocks, setModalGripSocks] = useState<boolean>(true);
  const [modalGps, setModalGps] = useState<boolean>(true);

  // Form States
  const [payAmount, setPayAmount] = useState<number>(2500);
  const [payMonth, setPayMonth] = useState<string>('September 2026');
  const [payMethod, setPayMethod] = useState<'UPI' | 'Cash' | 'Bank Transfer' | 'Card' | 'Cheque'>('UPI');
  const [payNotes, setPayNotes] = useState<string>('');

  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerJersey, setNewPlayerJersey] = useState<number>(12);
  const [newPlayerPos, setNewPlayerPos] = useState('FWD (ST)');
  const [newPlayerSport, setNewPlayerSport] = useState('Football (Striker)');
  const [newPlayerPhone, setNewPlayerPhone] = useState('');
  const [newPlayerFee, setNewPlayerFee] = useState<number>(2500);
  const [newPlayerGuardian, setNewPlayerGuardian] = useState('');
  const [newPlayerGuardianPhone, setNewPlayerGuardianPhone] = useState('');

  const [newEqName, setNewEqName] = useState('');
  const [newEqCategory, setNewEqCategory] = useState<'BALLS' | 'GEAR' | 'FITNESS' | 'MEDICAL' | 'UNIFORMS'>('BALLS');
  const [newEqQty, setNewEqQty] = useState<number>(10);

  // Expense Form State
  const [newExpCategory, setNewExpCategory] = useState<AcademyExpenseRecord['category']>('Ground Rent');
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpAmount, setNewExpAmount] = useState<number>(5000);
  const [newExpPaidTo, setNewExpPaidTo] = useState('');
  const [newExpMethod, setNewExpMethod] = useState<'UPI' | 'Cash' | 'Bank Transfer'>('UPI');

  // Session Note Form State
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteFocus, setNewNoteFocus] = useState('');
  const [newNoteCoach, setNewNoteCoach] = useState('Head Coach');
  const [newNoteObservations, setNewNoteObservations] = useState('');
  const [newNoteNextDrills, setNewNoteNextDrills] = useState('');

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceMarks, setAttendanceMarks] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'MEDICAL'>>(() => {
    const init: Record<string, 'PRESENT' | 'ABSENT' | 'MEDICAL'> = {};
    displayPlayers.forEach((p) => {
      init[p.id] = p.status === 'RESTING' || p.status === 'INJURED' ? 'MEDICAL' : 'PRESENT';
    });
    return init;
  });

  // Financial & KPI Calculations
  const totalMonthlyTarget = displayPlayers.reduce((acc, p) => acc + (p.monthlyFee || 2500), 0);
  const totalPaid = displayPlayers.filter((p) => p.feeStatus === 'PAID').reduce((acc, p) => acc + (p.monthlyFee || 2500), 0);
  const totalPartial = displayPlayers.filter((p) => p.feeStatus === 'PARTIAL').reduce((acc, p) => acc + (p.lastPaymentAmount || 1250), 0);
  const totalCollected = totalPaid + totalPartial;
  const totalPending = Math.max(0, totalMonthlyTarget - totalCollected);
  const paidRatio = Math.round((totalCollected / (totalMonthlyTarget || 1)) * 100);

  const totalExpensesAmount = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netAcademyBalance = totalCollected - totalExpensesAmount;

  const overdueCount = displayPlayers.filter((p) => p.feeStatus === 'OVERDUE').length;
  const pendingCount = displayPlayers.filter((p) => p.feeStatus === 'PENDING').length;
  const paidCount = displayPlayers.filter((p) => p.feeStatus === 'PAID').length;

  // Attendance Stats
  const presentCount = Object.values(attendanceMarks).filter((m) => m === 'PRESENT').length;
  const absentCount = Object.values(attendanceMarks).filter((m) => m === 'ABSENT').length;
  const medicalCount = Object.values(attendanceMarks).filter((m) => m === 'MEDICAL').length;
  const attendanceRate = Math.round((presentCount / (displayPlayers.length || 1)) * 100);

  // Search & Filtered Players
  const filteredPlayers = displayPlayers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.phone && p.phone.includes(searchQuery)) ||
      p.jerseyNumber.toString().includes(searchQuery);

    if (!matchesSearch) return false;

    if (statusFilter !== 'ALL') {
      if (statusFilter === 'PAID' && p.feeStatus !== 'PAID') return false;
      if (statusFilter === 'PENDING' && (p.feeStatus !== 'PENDING' && p.feeStatus !== 'PARTIAL')) return false;
      if (statusFilter === 'OVERDUE' && p.feeStatus !== 'OVERDUE') return false;
    }

    if (squadFilter !== 'ALL') {
      if (squadFilter === 'ATTACK' && !p.position.toUpperCase().includes('FWD') && !p.position.toUpperCase().includes('ST')) return false;
      if (squadFilter === 'MIDFIELD' && !p.position.toUpperCase().includes('MID') && !p.position.toUpperCase().includes('CAM')) return false;
      if (squadFilter === 'DEFENSE' && !p.position.toUpperCase().includes('DEF') && !p.position.toUpperCase().includes('CB')) return false;
      if (squadFilter === 'GOALKEEPER' && !p.position.toUpperCase().includes('GK')) return false;
    }

    return true;
  });

  // Sound Synth Effect for Smart Payment Confirmation
  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) { }
  };

  // Trigger WhatsApp Fee Reminder
  const triggerReminder = (player: PlayerManagementProfile) => {
    const rawPhone = (player.phone || '').replace(/[^0-9]/g, '');
    const formattedPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const text = `नमस्कार ${player.name}, Kheltantra Sports Academy की ओर से ${payMonth} महीने की बकाया फीस ₹${player.monthlyFee} का रिमाइंडर है। कृपया UPI QR कोड द्वारा ऑनलाइन भुगतान करें। धन्यवाद!`;

    if (formattedPhone) {
      window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(text)}`, '_blank');
      setReminderToast(`WhatsApp reminder dispatched to ${player.name} (${player.phone})`);
    } else {
      setReminderToast(`Reminder notification generated for ${player.name}`);
    }
    setTimeout(() => setReminderToast(null), 4000);
  };

  // Bulk WhatsApp Reminders for All Pending Players
  const triggerBulkReminders = () => {
    const unpaid = displayPlayers.filter(p => p.feeStatus === 'PENDING' || p.feeStatus === 'OVERDUE');
    if (unpaid.length === 0) {
      setReminderToast('All players in squad are fully paid!');
      setTimeout(() => setReminderToast(null), 3000);
      return;
    }
    unpaid.forEach((p, idx) => {
      setTimeout(() => {
        triggerReminder(p);
      }, idx * 600);
    });
    setReminderToast(`Dispatched automated WhatsApp reminders to ${unpaid.length} pending players!`);
  };

  // Submit Manual Payment
  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerForPayment) return;

    const receiptNum = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newRecord: FeePaymentRecord = {
      id: `PAY-${Date.now()}`,
      playerId: selectedPlayerForPayment.id,
      playerName: selectedPlayerForPayment.name,
      jerseyNumber: selectedPlayerForPayment.jerseyNumber,
      phone: selectedPlayerForPayment.phone,
      amount: payAmount,
      monthYear: payMonth,
      paidDate: todayStr,
      paymentMethod: payMethod,
      receiptNo: receiptNum,
      status: payAmount >= selectedPlayerForPayment.monthlyFee ? 'PAID' : 'PARTIAL',
      notes: payNotes || `Paid via ${payMethod}`,
      collectorName: isAdmin ? 'Admin Desk' : 'Self-Service Pay Portal',
    };

    onUpdateFeeRecords([newRecord, ...feeRecords]);

    const updatedPlayers = players.map((p) => {
      if (p.id === selectedPlayerForPayment.id) {
        return {
          ...p,
          feeStatus: (payAmount >= p.monthlyFee ? 'PAID' : 'PARTIAL') as FeePaymentStatus,
          lastPaymentDate: todayStr,
          lastPaymentAmount: payAmount,
        };
      }
      return p;
    });
    onUpdatePlayers(updatedPlayers);

    playSuccessSound();
    setReminderToast(`Payment of ₹${payAmount} recorded for ${selectedPlayerForPayment.name}`);
    setTimeout(() => setReminderToast(null), 4000);

    setSelectedReceipt(newRecord);
    setSelectedPlayerForPayment(null);
  };

  // Instant Smart UPI Payment Simulation
  const handleSimulateUPIPayment = () => {
    if (!selectedPlayerForPayment) return;
    setIsSimulatingPayment(true);

    setTimeout(() => {
      setIsSimulatingPayment(false);
      setPaymentSuccess(true);
      playSuccessSound();

      const receiptNum = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      const newRecord: FeePaymentRecord = {
        id: `PAY-UPI-${Date.now()}`,
        playerId: selectedPlayerForPayment.id,
        playerName: selectedPlayerForPayment.name,
        jerseyNumber: selectedPlayerForPayment.jerseyNumber,
        phone: selectedPlayerForPayment.phone,
        amount: payAmount,
        monthYear: payMonth,
        paidDate: todayStr,
        paymentMethod: 'UPI',
        receiptNo: receiptNum,
        status: 'PAID',
        notes: `Instant UPI Pay via QR VPA (Txn Ref: UPI-${Math.floor(100000000000 + Math.random() * 900000000000)})`,
        collectorName: 'Khel Bahi UPI Soundbox',
      };

      onUpdateFeeRecords([newRecord, ...feeRecords]);

      const updatedPlayers = players.map((p) => {
        if (p.id === selectedPlayerForPayment.id) {
          return {
            ...p,
            feeStatus: 'PAID' as FeePaymentStatus,
            lastPaymentDate: todayStr,
            lastPaymentAmount: payAmount,
          };
        }
        return p;
      });
      onUpdatePlayers(updatedPlayers);

      setTimeout(() => {
        setPaymentSuccess(false);
        setSelectedPlayerForPayment(null);
        setSelectedReceipt(newRecord);
        setReminderToast(`UPI Payment ₹${payAmount} verified instantly for ${selectedPlayerForPayment.name}`);
        setTimeout(() => setReminderToast(null), 4000);
      }, 1200);
    }, 1500);
  };

  // Add Player Submit
  const handleAddPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    const newP: PlayerManagementProfile = {
      id: `APX-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newPlayerName.trim(),
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 9999999)}?auto=format&fit=crop&w=256&q=80`,
      jerseyNumber: Number(newPlayerJersey) || 10,
      position: newPlayerPos,
      sportSpecialty: newPlayerSport,
      phone: newPlayerPhone || '+91 98765 00000',
      guardianName: newPlayerGuardian || 'Guardian',
      guardianPhone: newPlayerGuardianPhone || '+91 98765 11111',
      joiningDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      monthlyFee: Number(newPlayerFee) || 2500,
      feeStatus: 'PENDING',
      attendancePct: 100,
      status: 'ACTIVE',
      kitIssued: {
        jerseySize: 'M',
        bootSize: 'UK 8',
        kitBagAssigned: true,
        ballAssigned: true,
      },
    };

    onUpdatePlayers([...players, newP]);
    setIsAddPlayerModalOpen(false);
    setNewPlayerName('');
    setNewPlayerPhone('');
    setReminderToast(`New Athlete ${newP.name} (#${newP.jerseyNumber}) registered!`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  // Add Equipment Submit
  const handleAddEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEqName.trim()) return;

    const item: EquipmentInventoryItem = {
      id: `EQ-${Date.now()}`,
      name: newEqName.trim(),
      category: newEqCategory,
      totalQuantity: Number(newEqQty) || 1,
      inUseQuantity: Math.floor((Number(newEqQty) || 1) * 0.6),
      condition: 'EXCELLENT',
    };

    onUpdateInventory([...inventory, item]);
    setIsAddEquipmentModalOpen(false);
    setNewEqName('');
    setReminderToast(`New equipment "${item.name}" added to inventory.`);
    setTimeout(() => setReminderToast(null), 3000);
  };

  // Add Expense Submit
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpDesc.trim()) return;

    const newExp: AcademyExpenseRecord = {
      id: `EXP-${Date.now()}`,
      category: newExpCategory,
      description: newExpDesc.trim(),
      amount: Number(newExpAmount) || 0,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      paidTo: newExpPaidTo.trim() || 'Vendor',
      paymentMethod: newExpMethod,
      receiptRef: `REF-${Math.floor(10000 + Math.random() * 90000)}`
    };

    setExpenses([newExp, ...expenses]);
    setIsAddExpenseModalOpen(false);
    setNewExpDesc('');
    setNewExpPaidTo('');
    setReminderToast(`Expense of ₹${newExp.amount} logged under ${newExp.category}`);
    setTimeout(() => setReminderToast(null), 3500);
  };

  // Add Session Note Submit
  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    const newNote: CoachSessionNote = {
      id: `NOTE-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      title: newNoteTitle.trim(),
      focusArea: newNoteFocus.trim() || 'Tactical & Skill Drill',
      coachName: newNoteCoach.trim() || 'Head Coach',
      attendanceCount: presentCount || displayPlayers.length,
      keyObservations: newNoteObservations.trim() || 'Session executed smoothly with high intensity.',
      nextDrillsPlanned: newNoteNextDrills.trim() || 'Tactical match play & small-sided games.'
    };

    setSessionNotes([newNote, ...sessionNotes]);
    setIsAddNoteModalOpen(false);
    setNewNoteTitle('');
    setNewNoteFocus('');
    setNewNoteObservations('');
    setNewNoteNextDrills('');
    setReminderToast(`Coach Session Note "${newNote.title}" saved!`);
    setTimeout(() => setReminderToast(null), 3500);
  };

  // Copy UPI String
  const copyUpiId = (upiText: string) => {
    navigator.clipboard.writeText(upiText);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 p-3 sm:p-5 font-sans space-y-5">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* ======================================================== */}
        {/* KHEL BAHI BRANDED HEADER & DASHBOARD CONTROL PANEL */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-r from-[#0d1420] via-[#121c2e] to-[#0d1420] border border-amber-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff5500]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-gradient-to-r from-amber-500/20 to-[#ff5500]/20 border border-amber-500/40 text-amber-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Khel Bahi (खेल बही OS 4.0)</span>
                </span>
                {isAdmin ? (
                  <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    कोच एवं एडमिन बही-खाता Desk
                  </span>
                ) : (
                  <span className="bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    खिलाड़ी फीस पोर्टल: {currentLoggedInPlayer.name}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-wider text-white mt-2 flex items-center gap-2.5">
                <ShieldCheck className="w-8 h-8 text-[#ff5500]" />
                <span>{isAdmin ? 'Coach & Sports Academy Management System' : `Player Ledger Desk: ${currentLoggedInPlayer.name}`}</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                {isAdmin
                  ? 'अकादमी फीस बही-खाता, खिलाड़ी रोस्टर, दैनिक उपस्थिति रजिस्टर, खेल सामग्री स्टॉक, आय-व्यय बही एवं कोचिंग सत्र नोट्स।'
                  : `अपनी मासिक फीस स्थिति देखें, instant UPI QR कोड से भुगतान करें और आधिकारिक डिजिटल रसीद डाउनलोड करें।`}
              </p>
            </div>

            {/* Top Quick Control Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {isAdmin ? (
                <>
                  <button
                    onClick={triggerBulkReminders}
                    className="bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    title="Send automated WhatsApp fee reminders to all overdue players"
                  >
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Pending ({pendingCount + overdueCount})</span>
                  </button>

                  <button
                    onClick={() => setIsAddPlayerModalOpen(true)}
                    className="bg-[#ff5500] hover:bg-[#ff6611] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,85,0,0.4)] active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Player</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onOpenLogin}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#ff5500]" />
                    <span>Switch to Coach Desk</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlayerForPayment(currentLoggedInPlayer);
                      setPayAmount(currentLoggedInPlayer.monthlyFee || 2500);
                      setPaymentModeTab('qr');
                    }}
                    className="bg-[#ff5500] hover:bg-[#ff6611] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,85,0,0.4)] active:scale-95 transition-all"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Pay Fee via UPI</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Toast Alert Notification Banner */}
        {reminderToast && (
          <div className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xl animate-fade-in backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{reminderToast}</span>
            </div>
            <button onClick={() => setReminderToast(null)} className="text-emerald-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* KHEL BAHI NAVIGATION BOX TABS */}
        {/* ======================================================== */}
        <div className="bg-[#0b0f16] border border-slate-800/90 p-2 rounded-2xl flex items-center justify-between gap-1 overflow-x-auto scrollbar-none shadow-lg">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={() => setActiveTab('all-boxes')}
              className={`py-2 px-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'all-boxes'
                ? 'bg-gradient-to-r from-amber-500 to-[#ff5500] text-white shadow-[0_0_18px_rgba(255,119,0,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Khel Bahi Complete (पूर्ण बही)</span>
            </button>

            <button
              onClick={() => setActiveTab('fees')}
              className={`py-2 px-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'fees'
                ? 'bg-[#ff5500] text-white shadow-[0_0_15px_rgba(255,85,0,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Fee Bahi (फीस बही)</span>
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`py-2 px-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'roster'
                ? 'bg-[#ff5500] text-white shadow-[0_0_15px_rgba(255,85,0,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
            >
              <Users className="w-4 h-4" />
              <span>Player Roster (रोस्टर)</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-2 px-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'attendance'
                ? 'bg-[#ff5500] text-white shadow-[0_0_15px_rgba(255,85,0,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Attendance (उपस्थिति)</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-2 px-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'inventory'
                ? 'bg-[#ff5500] text-white shadow-[0_0_15px_rgba(255,85,0,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
            >
              <Package className="w-4 h-4" />
              <span>Kit & Stock (सामग्री)</span>
            </button>

            <button
              onClick={() => setActiveTab('expenses')}
              className={`py-2 px-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'expenses'
                ? 'bg-[#ff5500] text-white shadow-[0_0_15px_rgba(255,85,0,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Expenses (आय-व्यय)</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`py-2 px-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'notes'
                ? 'bg-[#ff5500] text-white shadow-[0_0_15px_rgba(255,85,0,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Coach Notes (कोच नोट्स)</span>
            </button>

            <button
              onClick={() => setActiveTab('ledger')}
              className={`py-2 px-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'ledger'
                ? 'bg-[#ff5500] text-white shadow-[0_0_15px_rgba(255,85,0,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
            >
              <FileText className="w-4 h-4" />
              <span>Receipt Audit (ऑडिट)</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BOX 1: EXECUTIVE ACADEMY KPI OVERVIEW BOX */}
        {/* ======================================================== */}
        {(activeTab === 'all-boxes' || activeTab === 'fees') && (
          <div className="bg-[#0b1017] border border-amber-500/20 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/15 rounded-xl border border-amber-500/30 text-amber-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase italic tracking-wider flex items-center gap-2">
                    <span>BOX 1: अकादमी सारांश एवं मुख्य आंकड़े (Academy Overview Box)</span>
                  </h3>
                  <p className="text-xs text-slate-400">कुल फीस संग्रह, बकाया, खिलाड़ी उपस्थिति एवं कुल शुद्ध बचत।</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 font-mono">
                September 2026 Live Khata
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Metric 1 */}
              <div className="bg-[#0f1724] border border-slate-800/90 rounded-2xl p-4 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider">
                  <span>Total Fees Collected (जमा फीस)</span>
                  <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <IndianRupee className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-2 tracking-tight">
                  ₹{totalCollected.toLocaleString()}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-slate-800/80 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${paidRatio}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-emerald-400 font-mono">{paidRatio}%</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1.5 flex justify-between">
                  <span>Monthly Goal: ₹{totalMonthlyTarget.toLocaleString()}</span>
                  <span className="text-emerald-400 font-bold">{paidCount} Paid</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-[#0f1724] border border-slate-800/90 rounded-2xl p-4 relative overflow-hidden group hover:border-amber-500/40 transition-all">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider">
                  <span>Pending Dues (बकाया फीस)</span>
                  <span className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 mt-2 tracking-tight">
                  ₹{totalPending.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-2.5 flex items-center justify-between">
                  <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full text-[9px] border border-amber-500/30">
                    {pendingCount + overdueCount} Players Due
                  </span>
                  <span className="text-rose-400 font-bold">{overdueCount} Overdue</span>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-[#0f1724] border border-slate-800/90 rounded-2xl p-4 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider">
                  <span>Attendance & Squad (उपस्थिति)</span>
                  <span className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-cyan-300 mt-2 tracking-tight">
                  {attendanceRate}% Present Today
                </div>
                <div className="text-[10px] text-slate-400 mt-2.5 flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">{presentCount} Present</span>
                  <span>• {absentCount} Absent</span>
                  <span>• {medicalCount} Medical</span>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="bg-[#0f1724] border border-slate-800/90 rounded-2xl p-4 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider">
                  <span>Net Academy Balance (शुद्ध बचत)</span>
                  <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                </div>
                <div className={`text-xl sm:text-2xl font-black mt-2 tracking-tight ${netAcademyBalance >= 0 ? 'text-indigo-300' : 'text-rose-400'}`}>
                  ₹{netAcademyBalance.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-2.5 flex items-center justify-between">
                  <span>Fees: ₹{totalCollected}</span>
                  <span className="text-rose-400 font-bold">Expenses: ₹{totalExpensesAmount}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BOX 2: QUICK OPERATIONS & ACTIONS BOX */}
        {/* ======================================================== */}
        {isAdmin && (activeTab === 'all-boxes' || activeTab === 'roster' || activeTab === 'fees') && (
          <div className="bg-[#0b1017] border border-indigo-500/20 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/15 rounded-xl border border-indigo-500/30 text-indigo-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase italic tracking-wider">
                    BOX 2: त्वरित कार्य एवं ऑपरेशन कंट्रोल (Quick Operations Box)
                  </h3>
                  <p className="text-xs text-slate-400">1-क्लिक से फीस व्हाट्सएप रिमाइंडर, नया खिलाड़ी, हाज़िरी व खर्च जोड़ें।</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              <button
                onClick={() => setIsAddPlayerModalOpen(true)}
                className="bg-[#121c2c] hover:bg-[#1a283e] border border-slate-700/80 hover:border-[#ff5500] p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all text-center group active:scale-95"
              >
                <div className="p-2.5 bg-[#ff5500]/15 rounded-xl text-[#ff5500] group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-white">Add Player (खिलाड़ी)</span>
              </button>

              <button
                onClick={triggerBulkReminders}
                className="bg-[#121c2c] hover:bg-[#1a283e] border border-slate-700/80 hover:border-emerald-500 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all text-center group active:scale-95"
              >
                <div className="p-2.5 bg-emerald-500/15 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                  <Send className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-white">WhatsApp Dues</span>
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className="bg-[#121c2c] hover:bg-[#1a283e] border border-slate-700/80 hover:border-cyan-500 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all text-center group active:scale-95"
              >
                <div className="p-2.5 bg-cyan-500/15 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-white">Mark Attendance</span>
              </button>

              <button
                onClick={() => setIsAddEquipmentModalOpen(true)}
                className="bg-[#121c2c] hover:bg-[#1a283e] border border-slate-700/80 hover:border-indigo-500 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all text-center group active:scale-95"
              >
                <div className="p-2.5 bg-indigo-500/15 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-white">Add Equipment</span>
              </button>

              <button
                onClick={() => setIsAddExpenseModalOpen(true)}
                className="bg-[#121c2c] hover:bg-[#1a283e] border border-slate-700/80 hover:border-rose-500 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all text-center group active:scale-95"
              >
                <div className="p-2.5 bg-rose-500/15 rounded-xl text-rose-400 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-white">Log Expense (खर्च)</span>
              </button>

              <button
                onClick={() => setIsAddNoteModalOpen(true)}
                className="bg-[#121c2c] hover:bg-[#1a283e] border border-slate-700/80 hover:border-amber-500 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all text-center group active:scale-95"
              >
                <div className="p-2.5 bg-amber-500/15 rounded-xl text-amber-400 group-hover:scale-110 transition-transform">
                  <FilePlus className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-white">Add Coach Note</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BOX 3: PLAYER ROSTER & PROFILES BOX */}
        {/* ======================================================== */}
        {(activeTab === 'all-boxes' || activeTab === 'roster') && (
          <div className="bg-[#0b1017] border border-cyan-500/20 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-cyan-500/15 rounded-xl border border-cyan-500/30 text-cyan-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase italic tracking-wider flex items-center gap-2">
                    <span>BOX 3: खिलाड़ी रोस्टर एवं खाता (Player Roster & Profiles Box)</span>
                  </h3>
                  <p className="text-xs text-slate-400">अकादमी के सभी खिलाड़ियों का विवरण, संपर्क एवं फीस स्थिति।</p>
                </div>
              </div>

              {/* Filters & View Switches */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search player, jersey, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#06090e] border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#06090e] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="ALL">Fee Status: All</option>
                  <option value="PAID">Paid Only</option>
                  <option value="PENDING">Pending Dues</option>
                  <option value="OVERDUE">Overdue Only</option>
                </select>

                <div className="bg-[#06090e] p-0.5 rounded-xl border border-slate-800 flex items-center">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'table' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    <TableIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredPlayers.map((player) => (
                  <div key={player.id} className="bg-[#0f1724] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 space-y-3 relative group transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={player.avatar} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-slate-700" />
                          <span className="absolute -bottom-1 -right-1 bg-slate-900 text-[#ff5500] text-[9px] font-black px-1.5 py-0.5 rounded-full border border-slate-700">
                            #{player.jerseyNumber}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white">{player.name}</h4>
                          <span className="text-[10px] text-cyan-400 font-bold uppercase">{player.position}</span>
                          <div className="text-[10px] text-slate-400 mt-0.5">{player.phone}</div>
                        </div>
                      </div>

                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${player.feeStatus === 'PAID'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                        : player.feeStatus === 'OVERDUE'
                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse'
                          : 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                        }`}>
                        {player.feeStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-[#070b10] rounded-xl p-2.5 text-[11px] border border-slate-800/60">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Monthly Fee</span>
                        <span className="font-black text-white">₹{player.monthlyFee}/mo</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Attendance</span>
                        <span className="font-black text-cyan-400">{player.attendancePct}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => triggerReminder(player)}
                        className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1"
                      >
                        <Send className="w-3 h-3 text-emerald-400" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPlayerForPayment(player);
                          setPayAmount(player.monthlyFee || 2500);
                        }}
                        className="flex-1 bg-[#ff5500] hover:bg-[#ff6611] text-white py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1 shadow-sm"
                      >
                        <QrCode className="w-3 h-3" />
                        <span>Collect Fee</span>
                      </button>

                      <button
                        onClick={() => setSelectedPlayerForKitModal(player)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-xl text-[10px]"
                        title="Kit & Gear details"
                      >
                        <Package className="w-3.5 h-3.5 text-indigo-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#0f1724] border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#06090e] text-[10px] uppercase font-black text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Player</th>
                      <th className="p-3">Position</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Guardian</th>
                      <th className="p-3">Monthly Fee</th>
                      <th className="p-3">Fee Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
                    {filteredPlayers.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <img src={p.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                          <span>{p.name} (#{p.jerseyNumber})</span>
                        </td>
                        <td className="p-3 text-cyan-400 font-bold">{p.position}</td>
                        <td className="p-3 text-slate-400 font-mono">{p.phone}</td>
                        <td className="p-3 text-slate-400">{p.guardianName} ({p.guardianPhone})</td>
                        <td className="p-3 font-mono font-bold text-white">₹{p.monthlyFee}</td>
                        <td className="p-3">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${p.feeStatus === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {p.feeStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedPlayerForPayment(p);
                              setPayAmount(p.monthlyFee);
                            }}
                            className="bg-[#ff5500] hover:bg-[#ff6611] text-white px-2.5 py-1 rounded text-[10px] font-black uppercase"
                          >
                            Pay
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* BOX 4: FEE BAHI-KHATA & RECEIPT LEDGER BOX */}
        {/* ======================================================== */}
        {(activeTab === 'all-boxes' || activeTab === 'fees') && (
          <div className="bg-[#0b1017] border border-[#ff5500]/20 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#ff5500]/15 rounded-xl border border-[#ff5500]/30 text-[#ff5500]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase italic tracking-wider flex items-center gap-2">
                    <span>BOX 4: फीस बही-खाता एवं डिजिटल रसीद (Fee Bahi-Khata Box)</span>
                  </h3>
                  <p className="text-xs text-slate-400">मासिक फीस भुगतान, रिमाइंडर एवं UPI QR कोड डिजिटल रसीद संग्रह।</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0f1724] border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-3 bg-[#070b10] border-b border-slate-800 flex items-center justify-between text-xs font-black text-slate-400 uppercase">
                <span>Recent Paid Transactions ({activeFeeRecords.length})</span>
                <span className="text-[#ff5500]">Auto-Verified Receipts</span>
              </div>
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#06090e] text-[10px] uppercase font-black text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Receipt No</th>
                    <th className="p-3">Player</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Print Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {activeFeeRecords.slice(0, 5).map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-[#ff5500]">{rec.receiptNo}</td>
                      <td className="p-3 font-sans font-bold text-white">{rec.playerName}</td>
                      <td className="p-3 text-emerald-400 font-bold">₹{rec.amount}</td>
                      <td className="p-3 font-sans">
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                          {rec.paymentMethod}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{rec.paidDate}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedReceipt(rec)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-[10px] font-sans font-bold uppercase"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BOX 5: DAILY ATTENDANCE REGISTER BAHI BOX */}
        {/* ======================================================== */}
        {(activeTab === 'all-boxes' || activeTab === 'attendance') && (
          <div className="bg-[#0b1017] border border-cyan-500/20 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-cyan-500/15 rounded-xl border border-cyan-500/30 text-cyan-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase italic tracking-wider">
                    BOX 5: दैनिक उपस्थिति बही (Daily Attendance Bahi Box)
                  </h3>
                  <p className="text-xs text-slate-400">दैनिक खिलाड़ी उपस्थिति दर्ज करें एवं ट्रैक करें।</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="bg-[#06090e] border border-slate-800 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => {
                    const updated: Record<string, 'PRESENT' | 'ABSENT' | 'MEDICAL'> = {};
                    displayPlayers.forEach((p) => { updated[p.id] = 'PRESENT'; });
                    setAttendanceMarks(updated);
                    setReminderToast('Marked all squad members as PRESENT!');
                    setTimeout(() => setReminderToast(null), 3000);
                  }}
                  className="bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl uppercase"
                >
                  All Present
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {displayPlayers.map((player) => {
                const mark = attendanceMarks[player.id] || 'PRESENT';
                return (
                  <div key={player.id} className="bg-[#0f1724] border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img src={player.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                      <div>
                        <div className="text-xs font-black text-white">{player.name}</div>
                        <div className="text-[10px] text-slate-400">#{player.jerseyNumber} • {player.position}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setAttendanceMarks({ ...attendanceMarks, [player.id]: 'PRESENT' })}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${mark === 'PRESENT' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-slate-500 hover:text-white'}`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => setAttendanceMarks({ ...attendanceMarks, [player.id]: 'ABSENT' })}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${mark === 'ABSENT' ? 'bg-rose-500 text-white' : 'bg-slate-900 text-slate-500 hover:text-white'}`}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => setAttendanceMarks({ ...attendanceMarks, [player.id]: 'MEDICAL' })}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${mark === 'MEDICAL' ? 'bg-amber-500 text-white' : 'bg-slate-900 text-slate-500 hover:text-white'}`}
                      >
                        Medical
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BOX 6: KIT & EQUIPMENT INVENTORY LEDGER BOX */}
        {/* ======================================================== */}
        {(activeTab === 'all-boxes' || activeTab === 'inventory') && (
          <div className="bg-[#0b1017] border border-indigo-500/20 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/15 rounded-xl border border-indigo-500/30 text-indigo-400">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase italic tracking-wider">
                    BOX 6: खेल सामग्री एवं किट स्टॉक (Kit & Inventory Box)
                  </h3>
                  <p className="text-xs text-slate-400">मैच बॉल्स, कोन्स, बिब्स, जीपीएस ट्रैकर व फर्स्ट एड किट स्टॉक।</p>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setIsAddEquipmentModalOpen(true)}
                  className="bg-[#ff5500] hover:bg-[#ff6611] text-white text-xs font-black px-3 py-1.5 rounded-xl uppercase flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Stock</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {inventory.map((item) => (
                <div key={item.id} className="bg-[#0f1724] border border-slate-800 rounded-2xl p-4 space-y-2.5 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${item.totalQuantity < 5 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {item.condition}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-white">{item.name}</h4>
                    <div className="text-xl font-black text-indigo-300 mt-0.5 font-mono">{item.totalQuantity} Units</div>
                  </div>

                  <div className="bg-[#06090e] rounded-xl p-2 text-xs flex justify-between text-slate-400">
                    <span>In Use: {item.inUseQuantity}</span>
                    <span>Available: {item.totalQuantity - item.inUseQuantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BOX 7: ACADEMY INCOME & EXPENSE LEDGER BOX */}
        {/* ======================================================== */}
        {(activeTab === 'all-boxes' || activeTab === 'expenses') && (
          <div className="bg-[#0b1017] border border-rose-500/20 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-500/15 rounded-xl border border-rose-500/30 text-rose-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase italic tracking-wider">
                    BOX 7: अकादमी आय-व्यय बही खाता (Income & Expense Ledger Box)
                  </h3>
                  <p className="text-xs text-slate-400">ग्राउंड रेंट, कोचिंग वेतन, सामग्री खरीद व टूर्नामेंट एंट्री खर्च रिकॉर्ड।</p>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setIsAddExpenseModalOpen(true)}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-xl uppercase flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Expense</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#0f1724] border border-slate-800 rounded-2xl p-4">
                <span className="text-[10px] text-slate-400 uppercase font-black">Total Fee Income (आय)</span>
                <div className="text-xl font-black text-emerald-400 mt-1">₹{totalCollected.toLocaleString()}</div>
              </div>
              <div className="bg-[#0f1724] border border-slate-800 rounded-2xl p-4">
                <span className="text-[10px] text-slate-400 uppercase font-black">Total Academy Expenses (व्यय)</span>
                <div className="text-xl font-black text-rose-400 mt-1">₹{totalExpensesAmount.toLocaleString()}</div>
              </div>
              <div className="bg-[#0f1724] border border-slate-800 rounded-2xl p-4">
                <span className="text-[10px] text-slate-400 uppercase font-black">Net Academy Profit / Balance</span>
                <div className={`text-xl font-black mt-1 ${netAcademyBalance >= 0 ? 'text-indigo-300' : 'text-rose-400'}`}>
                  ₹{netAcademyBalance.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-[#0f1724] border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#06090e] text-[10px] uppercase font-black text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Category</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Paid To</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-900/50">
                      <td className="p-3">
                        <span className="bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded text-[10px]">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-white">{exp.description}</td>
                      <td className="p-3 text-slate-400">{exp.paidTo}</td>
                      <td className="p-3 text-slate-400 font-mono">{exp.date}</td>
                      <td className="p-3 text-right font-mono font-bold text-rose-400">₹{exp.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BOX 8: COACHING SESSION NOTES & DRILL PLANNER BOX */}
        {/* ======================================================== */}
        {(activeTab === 'all-boxes' || activeTab === 'notes') && (
          <div className="bg-[#0b1017] border border-amber-500/20 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/15 rounded-xl border border-amber-500/30 text-amber-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase italic tracking-wider">
                    BOX 8: कोचिंग नोट्स एवं अभ्यास योजना (Coach Session Notes Box)
                  </h3>
                  <p className="text-xs text-slate-400">दैनिक सत्र फोकस, ड्रिल ऑब्जेक्टिव्स एवं खिलाड़ी मूल्यांकन नोट्स।</p>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setIsAddNoteModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-3 py-1.5 rounded-xl uppercase flex items-center gap-1 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Session Note</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {sessionNotes.map((note) => (
                <div key={note.id} className="bg-[#0f1724] border border-slate-800 rounded-2xl p-4 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      {note.focusArea}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{note.date}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-white">{note.title}</h4>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Coach: {note.coachName} • Attendance: {note.attendanceCount} Athletes</span>
                  </div>

                  <div className="bg-[#06090e] rounded-xl p-3 text-xs space-y-1.5 border border-slate-800">
                    <div>
                      <strong className="text-emerald-400 block text-[10px] uppercase">Observations:</strong>
                      <p className="text-slate-300 leading-relaxed">{note.keyObservations}</p>
                    </div>
                    <div>
                      <strong className="text-cyan-400 block text-[10px] uppercase">Next Drill Focus:</strong>
                      <p className="text-slate-300">{note.nextDrillsPlanned}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: SMART UPI QR & PAYMENT GATEWAY MODAL */}
      {/* ======================================================== */}
      {selectedPlayerForPayment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#0e141c] border border-slate-800 w-full max-w-lg rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedPlayerForPayment(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#ff5500]/15 rounded-2xl border border-[#ff5500]/30 text-[#ff5500]">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white italic uppercase">Record Dues & Pay Online</h3>
                <p className="text-xs text-slate-400">Athlete: <strong className="text-white">{selectedPlayerForPayment.name}</strong> (#{selectedPlayerForPayment.jerseyNumber})</p>
              </div>
            </div>

            {/* Payment Mode Selector Tabs */}
            <div className="bg-[#070a0e] p-1 rounded-2xl flex items-center gap-1 border border-slate-800">
              <button
                onClick={() => setPaymentModeTab('qr')}
                className={`flex-1 py-2 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all ${paymentModeTab === 'qr'
                  ? 'bg-[#ff5500] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Instant UPI QR Code</span>
              </button>
              <button
                onClick={() => setPaymentModeTab('manual')}
                className={`flex-1 py-2 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all ${paymentModeTab === 'manual'
                  ? 'bg-[#ff5500] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                <FileText className="w-4 h-4" />
                <span>Manual Entry</span>
              </button>
            </div>

            {paymentModeTab === 'qr' ? (
              <div className="space-y-4 text-center">
                <div className="bg-white p-4 rounded-2xl max-w-[200px] mx-auto shadow-xl relative group">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=7258935315@ybl%26pn=KheltantraAcademy%26am=${payAmount}%26cu=INR`}
                    alt="UPI QR Code"
                    className="w-full h-auto rounded"
                  />
                  <div className="text-[10px] text-slate-800 font-bold mt-1">Scan via GPay / PhonePe / Paytm</div>
                </div>

                <div className="bg-[#070a0e] p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">VPA: 7258935315@ybl</span>
                  <button
                    onClick={() => copyUpiId('7258935315@ybl')}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedUpi ? 'Copied!' : 'Copy UPI'}</span>
                  </button>
                </div>

                <button
                  onClick={handleSimulateUPIPayment}
                  disabled={isSimulatingPayment || paymentSuccess}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-2xl uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  {isSimulatingPayment ? (
                    <span>Verifying Bank Transaction...</span>
                  ) : paymentSuccess ? (
                    <span>Payment Verified!</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Simulate UPI Payment Verification (₹{payAmount})</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <form onSubmit={handleRecordPaymentSubmit} className="space-y-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Amount Received (₹)</label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white mt-1"
                  >
                    <option value="UPI">UPI Payment</option>
                    <option value="Cash">Cash at Admin Desk</option>
                    <option value="Bank Transfer">Bank NEFT/IMPS</option>
                    <option value="Card">Debit/Credit Card</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Notes & Remarks</label>
                  <input
                    type="text"
                    placeholder="e.g. Paid via PhonePe / Cash collector Rohan"
                    value={payNotes}
                    onChange={(e) => setPayNotes(e.target.value)}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#ff5500] hover:bg-[#ff6611] text-white font-black py-3 rounded-2xl uppercase tracking-wider text-xs shadow-lg mt-2"
                >
                  Record Payment & Issue Receipt
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: DIGITAL RECEIPT MODAL */}
      {/* ======================================================== */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#0e141c] border border-slate-800 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="inline-flex p-2.5 bg-emerald-500/15 rounded-2xl border border-emerald-500/30 text-emerald-400 mb-1">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white italic uppercase">Kheltantra Sports Academy</h3>
              <p className="text-[10px] text-slate-400 font-mono">OFFICIAL DIGITAL FEE RECEIPT</p>
            </div>

            <div className="bg-[#06090e] border border-slate-800 rounded-2xl p-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-500">Receipt No:</span>
                <span className="text-amber-400 font-bold">{selectedReceipt.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Athlete Name:</span>
                <span className="text-white font-sans font-bold">{selectedReceipt.playerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Month / Term:</span>
                <span className="text-slate-200">{selectedReceipt.monthYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Date:</span>
                <span className="text-slate-200">{selectedReceipt.paidDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Channel Mode:</span>
                <span className="text-cyan-400">{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800/80 pt-2 text-sm">
                <span className="text-slate-400 font-sans font-bold">Total Amount Paid:</span>
                <span className="text-emerald-400 font-black">₹{selectedReceipt.amount}</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-black py-2.5 rounded-2xl uppercase tracking-wider text-xs flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-[#ff5500]" />
              <span>Print Official Tax Receipt</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD NEW PLAYER REGISTRATION MODAL */}
      {/* ======================================================== */}
      {isAddPlayerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#0e141c] border border-slate-800 w-full max-w-lg rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddPlayerModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#ff5500]/15 rounded-2xl border border-[#ff5500]/30 text-[#ff5500]">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white italic uppercase">New Athlete Registration</h3>
                <p className="text-xs text-slate-400">Enroll new player into academy roster & fee ledger.</p>
              </div>
            </div>

            <form onSubmit={handleAddPlayerSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Player Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singh"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Jersey Number</label>
                  <input
                    type="number"
                    value={newPlayerJersey}
                    onChange={(e) => setNewPlayerJersey(Number(e.target.value))}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Playing Position</label>
                  <input
                    type="text"
                    value={newPlayerPos}
                    onChange={(e) => setNewPlayerPos(e.target.value)}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Monthly Fee (₹)</label>
                  <input
                    type="number"
                    value={newPlayerFee}
                    onChange={(e) => setNewPlayerFee(Number(e.target.value))}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={newPlayerPhone}
                    onChange={(e) => setNewPlayerPhone(e.target.value)}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Guardian Contact</label>
                  <input
                    type="text"
                    placeholder="Guardian Name & Mobile"
                    value={newPlayerGuardian}
                    onChange={(e) => setNewPlayerGuardian(e.target.value)}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white mt-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff5500] hover:bg-[#ff6611] text-white font-black py-3 rounded-2xl uppercase tracking-wider text-xs shadow-lg mt-2"
              >
                Register & Save to Roster
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: ADD EQUIPMENT ITEM MODAL */}
      {/* ======================================================== */}
      {isAddEquipmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#0e141c] border border-slate-800 w-full max-w-md rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddEquipmentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/15 rounded-2xl border border-indigo-500/30 text-indigo-400">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white italic uppercase">Add Stock Equipment</h3>
                <p className="text-xs text-slate-400">Log new training equipment into inventory ledger.</p>
              </div>
            </div>

            <form onSubmit={handleAddEquipmentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nivia Match Football (Size 5)"
                  value={newEqName}
                  onChange={(e) => setNewEqName(e.target.value)}
                  className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Category</label>
                <select
                  value={newEqCategory}
                  onChange={(e) => setNewEqCategory(e.target.value as any)}
                  className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white mt-1"
                >
                  <option value="BALLS">BALLS</option>
                  <option value="GEAR">GEAR & CONES</option>
                  <option value="FITNESS">FITNESS & AGILITY</option>
                  <option value="MEDICAL">MEDICAL & FIRST AID</option>
                  <option value="UNIFORMS">UNIFORMS & BIBS</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Total Quantity</label>
                <input
                  type="number"
                  value={newEqQty}
                  onChange={(e) => setNewEqQty(Number(e.target.value))}
                  className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 rounded-2xl uppercase tracking-wider text-xs shadow-lg mt-2"
              >
                Save Item to Stock
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: LOG ACADEMY EXPENSE MODAL */}
      {/* ======================================================== */}
      {isAddExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#0e141c] border border-slate-800 w-full max-w-md rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddExpenseModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/15 rounded-2xl border border-rose-500/30 text-rose-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white italic uppercase">Log Academy Expense</h3>
                <p className="text-xs text-slate-400">अकादमी खर्च बही-खाता में नया खर्च दर्ज करें।</p>
              </div>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Expense Category</label>
                <select
                  value={newExpCategory}
                  onChange={(e) => setNewExpCategory(e.target.value as any)}
                  className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white mt-1"
                >
                  <option value="Ground Rent">Ground Rent (टर्फ रेंट)</option>
                  <option value="Coach Salary">Coach Salary (कोचिंग वेतन)</option>
                  <option value="Equipment">Equipment (सामग्री खरीद)</option>
                  <option value="Refreshments">Refreshments (जलपान)</option>
                  <option value="Tournament Fee">Tournament Fee (टूर्नामेंट फीस)</option>
                  <option value="Medical Supplies">Medical Supplies (फर्स्ट एड)</option>
                  <option value="Other">Other Expenses (अन्य)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Turf Lease / Energy Drinks"
                  value={newExpDesc}
                  onChange={(e) => setNewExpDesc(e.target.value)}
                  className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Amount (₹)</label>
                  <input
                    type="number"
                    value={newExpAmount}
                    onChange={(e) => setNewExpAmount(Number(e.target.value))}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Paid To (Vendor)</label>
                  <input
                    type="text"
                    placeholder="Vendor / Receiver Name"
                    value={newExpPaidTo}
                    onChange={(e) => setNewExpPaidTo(e.target.value)}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white mt-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-3 rounded-2xl uppercase tracking-wider text-xs shadow-lg mt-2"
              >
                Log Expense Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: ADD COACH SESSION NOTE MODAL */}
      {/* ======================================================== */}
      {isAddNoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#0e141c] border border-slate-800 w-full max-w-lg rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddNoteModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/15 rounded-2xl border border-amber-500/30 text-amber-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white italic uppercase">Add Coach Session Note</h3>
                <p className="text-xs text-slate-400">ट्रेनिंग सत्र नोट्स एवं अगली अभ्यास योजना दर्ज करें।</p>
              </div>
            </div>

            <form onSubmit={handleAddNoteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Session Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Counter-Attack & Wing Overlaps"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Focus Area</label>
                  <input
                    type="text"
                    placeholder="Tactical / Fitness / Finishing"
                    value={newNoteFocus}
                    onChange={(e) => setNewNoteFocus(e.target.value)}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Coach Name</label>
                  <input
                    type="text"
                    value={newNoteCoach}
                    onChange={(e) => setNewNoteCoach(e.target.value)}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Key Coach Observations</label>
                <textarea
                  rows={2}
                  placeholder="Note player performance, drills executed, area of improvement..."
                  value={newNoteObservations}
                  onChange={(e) => setNewNoteObservations(e.target.value)}
                  className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Next Drills Planned</label>
                <input
                  type="text"
                  placeholder="e.g. 3v2 transition attack & set piece defending"
                  value={newNoteNextDrills}
                  onChange={(e) => setNewNoteNextDrills(e.target.value)}
                  className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-2xl uppercase tracking-wider text-xs shadow-lg mt-2"
              >
                Save Coach Session Note
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 7: KIT ALLOCATION MODAL */}
      {/* ======================================================== */}
      {selectedPlayerForKitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#0e141c] border border-slate-800 w-full max-w-md rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedPlayerForKitModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/15 rounded-2xl border border-indigo-500/30 text-indigo-400">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white italic uppercase">Athlete Kit & Gear</h3>
                <p className="text-xs text-slate-400">{selectedPlayerForKitModal.name} (#{selectedPlayerForKitModal.jerseyNumber})</p>
              </div>
            </div>

            <div className="bg-[#070a0e] border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Jersey Size:</span>
                <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">{selectedPlayerForKitModal.kitIssued?.jerseySize || 'L'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Boot Size:</span>
                <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">{selectedPlayerForKitModal.kitIssued?.bootSize || 'UK 9'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Official Kit Bag:</span>
                <span className="text-emerald-400 font-bold">Assigned</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">GPS Tracker Pod:</span>
                <span className="text-cyan-400 font-bold">Assigned</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedPlayerForKitModal(null);
                setReminderToast(`Kit allocation verified for ${selectedPlayerForKitModal.name}`);
                setTimeout(() => setReminderToast(null), 3000);
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2.5 rounded-2xl uppercase tracking-wider text-xs"
            >
              Close & Save Allocation
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
