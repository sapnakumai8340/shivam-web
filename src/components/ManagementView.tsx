import React, { useState } from 'react';
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
  Download, 
  Share2, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Package, 
  UserCheck, 
  UserX, 
  Printer, 
  Check, 
  Sparkles, 
  X, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  ExternalLink,
  MessageSquare,
  Award,
  Activity,
  Zap,
  Filter
} from 'lucide-react';
import { 
  PlayerManagementProfile, 
  FeePaymentRecord, 
  FeePaymentStatus, 
  EquipmentInventoryItem,
  UserRole,
  AthleteProfile
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

  // Active Tab
  const [activeTab, setActiveTab] = useState<'fees' | 'roster' | 'attendance' | 'inventory' | 'ledger'>('fees');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [selectedPlayerForPayment, setSelectedPlayerForPayment] = useState<PlayerManagementProfile | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<FeePaymentRecord | null>(null);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);
  const [selectedPlayerForKitModal, setSelectedPlayerForKitModal] = useState<PlayerManagementProfile | null>(null);
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  // Self-Service Kit & Gear Modal State (No Admin Dependency)
  const [modalJerseySize, setModalJerseySize] = useState<string>('L');
  const [modalBootSize, setModalBootSize] = useState<string>('UK 9');
  const [modalKitBag, setModalKitBag] = useState<boolean>(true);
  const [modalBall, setModalBall] = useState<boolean>(true);
  const [modalShinGuards, setModalShinGuards] = useState<boolean>(true);
  const [modalGripSocks, setModalGripSocks] = useState<boolean>(true);
  const [modalGps, setModalGps] = useState<boolean>(true);

  // Equipment Category Filter
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState<string>('ALL');

  // New Payment Form State
  const [payAmount, setPayAmount] = useState<number>(2500);
  const [payMonth, setPayMonth] = useState<string>('August 2026');
  const [payMethod, setPayMethod] = useState<'UPI' | 'Cash' | 'Bank Transfer' | 'Card' | 'Cheque'>('UPI');
  const [payNotes, setPayNotes] = useState<string>('');

  // New Player Form State
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerJersey, setNewPlayerJersey] = useState<number>(12);
  const [newPlayerPos, setNewPlayerPos] = useState('FWD (ST)');
  const [newPlayerSport, setNewPlayerSport] = useState('Football (Striker)');
  const [newPlayerPhone, setNewPlayerPhone] = useState('');
  const [newPlayerFee, setNewPlayerFee] = useState<number>(2500);
  const [newPlayerGuardian, setNewPlayerGuardian] = useState('');
  const [newPlayerGuardianPhone, setNewPlayerGuardianPhone] = useState('');

  // New Equipment Form State
  const [newEqName, setNewEqName] = useState('');
  const [newEqCategory, setNewEqCategory] = useState<'BALLS' | 'GEAR' | 'FITNESS' | 'MEDICAL' | 'UNIFORMS'>('BALLS');
  const [newEqQty, setNewEqQty] = useState<number>(10);

  // Attendance state for today
  const [attendanceDate, setAttendanceDate] = useState<string>('2026-08-16');
  const [attendanceMarks, setAttendanceMarks] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'MEDICAL'>>(() => {
    const init: Record<string, 'PRESENT' | 'ABSENT' | 'MEDICAL'> = {};
    displayPlayers.forEach((p) => {
      init[p.id] = p.status === 'RESTING' || p.status === 'INJURED' ? 'MEDICAL' : 'PRESENT';
    });
    return init;
  });

  // Calculate Metrics
  const totalMonthlyTarget = displayPlayers.reduce((acc, p) => acc + (p.monthlyFee || 2500), 0);
  const totalPaid = displayPlayers.filter((p) => p.feeStatus === 'PAID').reduce((acc, p) => acc + (p.monthlyFee || 2500), 0);
  const totalPartial = displayPlayers.filter((p) => p.feeStatus === 'PARTIAL').reduce((acc, p) => acc + (p.lastPaymentAmount || 1250), 0);
  const totalCollected = totalPaid + totalPartial;
  const totalPending = totalMonthlyTarget - totalCollected;
  const paidRatio = Math.round((totalCollected / (totalMonthlyTarget || 1)) * 100);

  const overdueCount = displayPlayers.filter((p) => p.feeStatus === 'OVERDUE').length;
  const pendingCount = displayPlayers.filter((p) => p.feeStatus === 'PENDING').length;

  // Search & Filtered Players
  const filteredPlayers = displayPlayers.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.phone && p.phone.includes(searchQuery)) ||
      p.jerseyNumber.toString().includes(searchQuery);

    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PAID') return p.feeStatus === 'PAID';
    if (statusFilter === 'PENDING') return p.feeStatus === 'PENDING' || p.feeStatus === 'PARTIAL';
    if (statusFilter === 'OVERDUE') return p.feeStatus === 'OVERDUE';
    return true;
  });

  // Handle Record Payment Submit
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
      collectorName: 'Admin Desk',
    };

    // Update Fee Records List
    const updatedRecords = [newRecord, ...feeRecords];
    onUpdateFeeRecords(updatedRecords);

    // Update Player Fee Status
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
    setSelectedReceipt(newRecord);
    setSelectedPlayerForPayment(null);
    setPayNotes('');
  };

  // Handle Add New Player
  const handleAddPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    const newP: PlayerManagementProfile = {
      id: `APX-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newPlayerName.trim(),
      jerseyNumber: Number(newPlayerJersey) || 12,
      position: newPlayerPos,
      sportSpecialty: newPlayerSport,
      phone: newPlayerPhone.trim() || '+91 98000 00000',
      joiningDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      monthlyFee: Number(newPlayerFee) || 2500,
      feeStatus: 'PENDING',
      attendancePct: 100,
      status: 'ACTIVE',
      guardianName: newPlayerGuardian.trim(),
      guardianPhone: newPlayerGuardianPhone.trim(),
      kitIssued: {
        jerseySize: 'M',
        bootSize: 'UK 8',
        kitBagAssigned: true,
        ballAssigned: true,
      },
    };

    onUpdatePlayers([newP, ...players]);
    setIsAddPlayerModalOpen(false);
    setNewPlayerName('');
    setNewPlayerPhone('');
  };

  // Handle Add Equipment
  const handleAddEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEqName.trim()) return;

    const newEq: EquipmentInventoryItem = {
      id: `EQ-${Date.now()}`,
      name: newEqName.trim(),
      category: newEqCategory,
      totalQuantity: Number(newEqQty) || 10,
      inUseQuantity: Math.floor(Number(newEqQty) * 0.8),
      condition: 'EXCELLENT',
    };

    onUpdateInventory([...inventory, newEq]);
    setIsAddEquipmentModalOpen(false);
    setNewEqName('');
    setReminderToast(`Added "${newEq.name}" (${newEq.totalQuantity} units) to academy inventory.`);
    setTimeout(() => setReminderToast(null), 3000);
  };

  // Open Kit Customizer Modal for a player (Self-Managed or Admin)
  const openKitModalForPlayer = (player: PlayerManagementProfile) => {
    setSelectedPlayerForKitModal(player);
    setModalJerseySize(player.kitIssued?.jerseySize || 'L');
    setModalBootSize(player.kitIssued?.bootSize || 'UK 9');
    setModalKitBag(player.kitIssued?.kitBagAssigned !== false);
    setModalBall(player.kitIssued?.ballAssigned !== false);
    setModalShinGuards(player.kitIssued?.shinGuards !== false);
    setModalGripSocks(player.kitIssued?.gripSocks !== false);
    setModalGps(player.kitIssued?.gpsTrackerAssigned !== false);
  };

  // Save Kit changes from Modal
  const handleSavePlayerKitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerForKitModal) return;

    const updated = players.map((p) => {
      if (p.id === selectedPlayerForKitModal.id) {
        return {
          ...p,
          kitIssued: {
            ...p.kitIssued,
            jerseySize: modalJerseySize,
            bootSize: modalBootSize,
            kitBagAssigned: modalKitBag,
            ballAssigned: modalBall,
            shinGuards: modalShinGuards,
            gripSocks: modalGripSocks,
            gpsTrackerAssigned: modalGps,
          },
        };
      }
      return p;
    });

    onUpdatePlayers(updated);
    setReminderToast(`Official kit & gear specifications saved for ${selectedPlayerForKitModal.name}`);
    setTimeout(() => setReminderToast(null), 3500);
    setSelectedPlayerForKitModal(null);
  };

  // Admin Check Out / Assign Equipment
  const handleAdminCheckOutEquipment = (item: EquipmentInventoryItem) => {
    if (item.inUseQuantity >= item.totalQuantity) {
      setReminderToast(`All ${item.name} (${item.totalQuantity} units) are currently dispatched / in use.`);
      setTimeout(() => setReminderToast(null), 3000);
      return;
    }

    const updated = inventory.map((i) => {
      if (i.id === item.id) {
        return {
          ...i,
          inUseQuantity: Math.min(i.totalQuantity, i.inUseQuantity + 1),
        };
      }
      return i;
    });

    onUpdateInventory(updated);
    setReminderToast(`Admin dispatched 1x ${item.name}`);
    setTimeout(() => setReminderToast(null), 3000);
  };

  // Admin Return Equipment back to inventory
  const handleAdminReturnEquipment = (item: EquipmentInventoryItem) => {
    if (item.inUseQuantity <= 0) {
      setReminderToast(`No active in-use units of ${item.name} to return.`);
      setTimeout(() => setReminderToast(null), 3000);
      return;
    }

    const updated = inventory.map((i) => {
      if (i.id === item.id) {
        return {
          ...i,
          inUseQuantity: Math.max(0, i.inUseQuantity - 1),
        };
      }
      return i;
    });

    onUpdateInventory(updated);
    setReminderToast(`1x ${item.name} returned to available academy stock.`);
    setTimeout(() => setReminderToast(null), 3000);
  };

  // Delete Equipment item
  const handleDeleteEquipment = (itemId: string, name: string) => {
    if (confirm(`Remove "${name}" from kit & equipment inventory?`)) {
      const updated = inventory.filter((i) => i.id !== itemId);
      onUpdateInventory(updated);
      setReminderToast(`Removed "${name}" from inventory.`);
      setTimeout(() => setReminderToast(null), 3000);
    }
  };

  // Trigger Fee Reminder
  const triggerReminder = (player: PlayerManagementProfile) => {
    const text = `Hi ${player.name}, this is a gentle reminder from Kheltantra Academy regarding your pending monthly dues of ₹${player.monthlyFee} for August 2026. Please settle via UPI or at the admin desk. Thank you!`;
    if (player.phone) {
      const cleanPhone = player.phone.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    }
    setReminderToast(`Fee reminder sent to ${player.name}`);
    setTimeout(() => setReminderToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#070a0e] text-white pb-28 pt-4 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#0e141c] via-[#121924] to-[#0e141c] border border-slate-800 rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#ff5500]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#ff5500]/15 border border-[#ff5500]/40 text-[#ff7733] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#ff5500]" />
                  <span>Academy Management System</span>
                </span>
                {isAdmin ? (
                  <span className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Admin Active
                  </span>
                ) : (
                  <span className="bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    <span>Logged In Player: {currentLoggedInPlayer.name} (#{currentLoggedInPlayer.jerseyNumber})</span>
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black italic uppercase tracking-wider text-white mt-1 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#ff5500]" />
                <span>{isAdmin ? 'Kheltantra Admin & Dues Desk' : `Player Management: ${currentLoggedInPlayer.name}`}</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {isAdmin
                  ? 'Manage squad dues, player registration files, fee payment history, receipts, attendance logs & kit inventory.'
                  : `Personal management portal for ${currentLoggedInPlayer.name} (#${currentLoggedInPlayer.jerseyNumber}). View monthly fee status, digital receipts, kit allocation, and attendance record.`}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {!isAdmin ? (
                <>
                  <button
                    onClick={onOpenLogin}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#ff5500]" />
                    <span>Coach Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlayerForPayment(currentLoggedInPlayer);
                      setPayAmount(currentLoggedInPlayer.monthlyFee || 2500);
                    }}
                    className="bg-[#ff5500] hover:bg-[#ff6611] text-white px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,85,0,0.4)] active:scale-95 transition-all"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Fee Online</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsAddPlayerModalOpen(true)}
                    className="bg-[#ff5500] hover:bg-[#ff6611] text-white px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,85,0,0.4)] active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Player</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Toast Alert */}
        {reminderToast && (
          <div className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{reminderToast}</span>
            </div>
            <button onClick={() => setReminderToast(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Summary Metric Cards */}
        {isAdmin ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Card 1: Dues Collected */}
            <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider">
                <span>Total Fees Collected</span>
                <IndianRupee className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-2">
                ₹{totalCollected.toLocaleString()}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${paidRatio}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400">{paidRatio}%</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Target: ₹{totalMonthlyTarget.toLocaleString()}</div>
            </div>

            {/* Card 2: Pending Dues */}
            <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider">
                <span>Pending / Overdue</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 mt-2">
                ₹{totalPending.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1.5">
                <span className="bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded text-[9px]">
                  {pendingCount + overdueCount} Players
                </span>
                <span>Awaiting Dues</span>
              </div>
            </div>

            {/* Card 3: Total Squad Roster */}
            <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider">
                <span>Total Enrolled Roster</span>
                <Users className="w-4 h-4 text-[#ff5500]" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-2">
                {players.length} Players
              </div>
              <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">
                  {players.filter(p => p.status === 'ACTIVE').length} Active
                </span>
                <span>• {players.filter(p => p.status === 'RESTING' || p.status === 'INJURED').length} Resting</span>
              </div>
            </div>

            {/* Card 4: Equipment & Inventory */}
            <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider">
                <span>Kit & Ball Inventory</span>
                <Package className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-indigo-300 mt-2">
                {inventory.reduce((acc, i) => acc + i.totalQuantity, 0)} Items
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                {inventory.length} Categories Tracked
              </div>
            </div>
          </div>
        ) : (
          /* Personal Player Summary Metric Cards */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Player Card 1: Fee Status */}
            <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider">
                <span>Monthly Fee Status</span>
                <CreditCard className="w-4 h-4 text-[#ff5500]" />
              </div>
              <div className={`text-xl sm:text-2xl font-black mt-2 ${
                currentLoggedInPlayer.feeStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {currentLoggedInPlayer.feeStatus === 'PAID' ? 'PAID' : 'DUE / PENDING'}
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                Subscription: ₹{currentLoggedInPlayer.monthlyFee || 2500}/month
              </div>
            </div>

            {/* Player Card 2: Last Payment */}
            <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider">
                <span>Last Payment Date</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-base sm:text-lg font-black text-white mt-2">
                {currentLoggedInPlayer.lastPaymentDate || '10 Aug 2026'}
              </div>
              <div className="text-[10px] text-emerald-400 mt-2">
                Amount Paid: ₹{currentLoggedInPlayer.lastPaymentAmount || 2500}
              </div>
            </div>

            {/* Player Card 3: Attendance */}
            <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider">
                <span>Session Attendance</span>
                <Calendar className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-indigo-300 mt-2">
                {currentLoggedInPlayer.attendancePct}%
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                Status: {currentLoggedInPlayer.status}
              </div>
            </div>

            {/* Player Card 4: Kit Issued (Admin Decided) */}
            <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider">
                <span>{isAdmin ? 'Kit Allocation Desk' : 'Assigned Kit & Gear'}</span>
                <Package className="w-4 h-4 text-amber-400" />
              </div>
              {isAdmin ? (
                <>
                  <div className="text-sm font-black text-amber-300 mt-2">
                    {players.filter((p) => p.kitIssued?.jerseySize || p.kitIssued?.bootSize).length} / {players.length} Athletes Allocated
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">Admin Decided</span>
                    <button
                      onClick={() => setActiveTab('inventory')}
                      className="text-[10px] font-bold text-[#ff5500] hover:text-[#ff7722] bg-[#ff5500]/10 px-2 py-0.5 rounded border border-[#ff5500]/20 uppercase transition-colors"
                    >
                      Manage Kit
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm font-black text-amber-300 mt-2">
                    {currentLoggedInPlayer.kitIssued && (currentLoggedInPlayer.kitIssued.jerseySize || currentLoggedInPlayer.kitIssued.bootSize) ? (
                      `Jersey ${currentLoggedInPlayer.kitIssued.jerseySize || '—'} • Boots ${currentLoggedInPlayer.kitIssued.bootSize || '—'}`
                    ) : (
                      <span className="text-slate-400 font-bold text-xs">Pending Admin Allocation</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className={`w-3 h-3 ${currentLoggedInPlayer.kitIssued?.jerseySize ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className={currentLoggedInPlayer.kitIssued?.jerseySize ? 'text-emerald-400' : 'text-slate-500'}>
                        {currentLoggedInPlayer.kitIssued?.jerseySize ? 'Official Allocation' : 'Awaiting Staff Decision'}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tab Switcher Bar */}
        <div className="bg-[#0b0f14] border border-slate-800/80 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('fees')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'fees'
                ? 'bg-[#ff5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Fee Status ({displayPlayers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'roster'
                ? 'bg-[#ff5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Player Files</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'attendance'
                ? 'bg-[#ff5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Attendance Marker</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'inventory'
                ? 'bg-[#ff5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Kit & Gear</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'ledger'
                ? 'bg-[#ff5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Txn History ({activeFeeRecords.length})</span>
          </button>
        </div>

        {/* Search & Status Filter Controls */}
        {(activeTab === 'fees' || activeTab === 'roster') && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0e141c] border border-slate-800 p-3 rounded-2xl">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search player, phone, jersey #..."
                className="w-full bg-[#070a0e] border border-slate-800 focus:border-[#ff5500] rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
              {['ALL', 'PAID', 'PENDING', 'OVERDUE'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase transition-colors shrink-0 ${
                    statusFilter === st
                      ? 'bg-[#ff5500]/20 text-[#ff7733] border border-[#ff5500]/50'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 1: FEES & PAYMENT STATUS */}
        {activeTab === 'fees' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#ff5500]" />
                <span>Monthly Player Fee Matrix (August 2026)</span>
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">
                Showing {filteredPlayers.length} of {displayPlayers.length} Players
              </span>
            </div>

            {filteredPlayers.length === 0 ? (
              <div className="bg-[#0e141c] border border-slate-800/80 rounded-2xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-[#ff5500]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">No Players in Dues Desk Roster</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    {isAdmin 
                      ? 'No player records found. Click "Add Player" above to enroll a new player into the academy dues desk.'
                      : 'No dues records found for your account.'}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setIsAddPlayerModalOpen(true)}
                    className="bg-[#ff5500] hover:bg-[#ff6611] text-white text-xs font-black px-4 py-2 rounded-xl uppercase tracking-wider inline-flex items-center gap-2 shadow-[0_0_15px_rgba(255,85,0,0.4)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Player</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="bg-[#0e141c] border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all space-y-3 relative overflow-hidden"
                  >
                    {/* Status Color Strip */}
                    <div 
                      className={`absolute top-0 left-0 right-0 h-1 ${
                        player.feeStatus === 'PAID'
                          ? 'bg-emerald-500'
                          : player.feeStatus === 'PARTIAL'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`} 
                    />

                    {/* Header Row */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={player.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                            alt={player.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-700"
                          />
                          <span className="absolute -bottom-1 -right-1 bg-[#ff5500] text-white text-[9px] font-black px-1.5 rounded-full border border-[#0e141c]">
                            #{player.jerseyNumber}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-black text-white flex items-center gap-1.5">
                            <span>{player.name}</span>
                            <span className="text-[10px] font-bold text-[#ff5500] bg-[#ff5500]/10 px-1.5 py-0.2 rounded">
                              {player.position}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-500" />
                              {player.phone || 'No phone'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Fee Status Badge */}
                      <div>
                        {player.feeStatus === 'PAID' && (
                          <span className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>PAID</span>
                          </span>
                        )}
                        {player.feeStatus === 'PARTIAL' && (
                          <span className="bg-amber-500/15 border border-amber-500/40 text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>PARTIAL</span>
                          </span>
                        )}
                        {(player.feeStatus === 'PENDING' || player.feeStatus === 'OVERDUE') && (
                          <span className="bg-rose-500/15 border border-rose-500/40 text-rose-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            <span>{player.feeStatus}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Payment Details Row */}
                    <div className="bg-[#080b0e] border border-slate-800/80 rounded-xl p-2.5 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Monthly Fee</span>
                        <span className="font-extrabold text-white">₹{player.monthlyFee.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Last Paid Date</span>
                        <span className="font-bold text-slate-300">{player.lastPaymentDate || 'Pending'}</span>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          setSelectedPlayerForPayment(player);
                          setPayAmount(player.monthlyFee);
                        }}
                        className="flex-1 bg-[#ff5500] hover:bg-[#ff6611] text-white py-1.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                      >
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span>Record Fee</span>
                      </button>

                      {player.lastPaymentDate && (
                        <button
                          onClick={() => {
                            // Find latest fee record
                            const rec = feeRecords.find((r) => r.playerId === player.id) || {
                              id: `PAY-SYS-${player.id}`,
                              playerId: player.id,
                              playerName: player.name,
                              jerseyNumber: player.jerseyNumber,
                              phone: player.phone,
                              amount: player.lastPaymentAmount || player.monthlyFee,
                              monthYear: 'August 2026',
                              paidDate: player.lastPaymentDate || '10 Aug 2026',
                              paymentMethod: 'UPI',
                              receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                              status: player.feeStatus,
                              notes: 'Verified Academy Receipt',
                              collectorName: 'Admin Desk',
                            };
                            setSelectedReceipt(rec);
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 py-1.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                          title="Generate Official Digital Receipt"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#ff5500]" />
                          <span>Receipt</span>
                        </button>
                      )}

                      {player.feeStatus !== 'PAID' && (
                        <button
                          onClick={() => triggerReminder(player)}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 p-1.5 rounded-xl text-xs font-bold transition-all"
                          title="Send Fee Reminder Notice"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PLAYER ROSTER & PROFILES */}
        {activeTab === 'roster' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#ff5500]" />
                <span>Player Registration Files & Emergency Contacts</span>
              </h2>
            </div>

            {filteredPlayers.length === 0 ? (
              <div className="bg-[#0e141c] border border-slate-800/80 rounded-2xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-[#ff5500]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">No Players Registered in Roster</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    {isAdmin 
                      ? 'No players found in the academy database. Click "Add Player" to enroll athletes.'
                      : 'No roster information available.'}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setIsAddPlayerModalOpen(true)}
                    className="bg-[#ff5500] hover:bg-[#ff6611] text-white text-xs font-black px-4 py-2 rounded-xl uppercase tracking-wider inline-flex items-center gap-2 shadow-[0_0_15px_rgba(255,85,0,0.4)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Player</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={player.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80'}
                          alt={player.name}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-[#ff5500]"
                        />
                        <div>
                          <div className="text-base font-black text-white flex items-center gap-2">
                            <span>{player.name}</span>
                            <span className="text-xs font-extrabold text-[#ff5500]">#{player.jerseyNumber}</span>
                          </div>
                          <div className="text-xs text-slate-400 font-bold">{player.sportSpecialty || player.position}</div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                        player.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        {player.status}
                      </span>
                    </div>

                    {/* Player Contact Details */}
                    <div className="bg-[#070a0e] border border-slate-800 rounded-xl p-3 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-500 text-[10px] font-bold uppercase">Mobile Phone:</span>
                        <span className="font-mono font-bold">{player.phone || '+91 98765 43210'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-500 text-[10px] font-bold uppercase">Guardian / Emergency:</span>
                        <span className="font-bold">{player.guardianName || 'Parent Contact'} ({player.guardianPhone || 'Available'})</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-500 text-[10px] font-bold uppercase">Joining Date:</span>
                        <span className="font-bold">{player.joiningDate || '15 Jan 2024'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-500 text-[10px] font-bold uppercase">Official Kit:</span>
                        <div className="flex items-center gap-1.5">
                          {player.kitIssued && (player.kitIssued.jerseySize || player.kitIssued.bootSize) ? (
                            <span className="text-emerald-400 font-bold">
                              Jersey: {player.kitIssued.jerseySize || '—'} | Boots: {player.kitIssued.bootSize || '—'}
                            </span>
                          ) : (
                            <span className="text-slate-500 italic text-[10px]">Pending Allocation</span>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() => openKitModalForPlayer(player)}
                              className="text-[9px] font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 uppercase"
                            >
                              Allocate Kit
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Medical Note */}
                    {player.medicalNotes && (
                      <div className="text-[11px] text-slate-400 bg-slate-900/60 border border-slate-800 p-2 rounded-lg italic">
                        <span className="text-[#ff5500] font-bold uppercase not-italic mr-1">Medical/Physio Note:</span>
                        {player.medicalNotes}
                      </div>
                    )}

                    {/* Contact Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`tel:${player.phone?.replace(/[^0-9+]/g, '') || ''}`}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 py-1.5 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call Athlete</span>
                      </a>
                      <button
                        onClick={() => triggerReminder(player)}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 py-1.5 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>WhatsApp</span>
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${player.name} from dues desk roster?`)) {
                              onUpdatePlayers(players.filter((p) => p.id !== player.id));
                              onUpdateFeeRecords(feeRecords.filter((f) => f.playerId !== player.id));
                            }
                          }}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 p-2 rounded-xl text-xs font-bold transition-all"
                          title="Remove Player from Dues Desk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ATTENDANCE MARKER */}
        {activeTab === 'attendance' && (
          <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#ff5500]" />
                  <span>Daily Squad Practice Attendance Sheet</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select date and mark attendance for today's high-intensity session.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="bg-[#070a0e] border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
                />
                <button
                  onClick={() => {
                    const allP: Record<string, 'PRESENT' | 'ABSENT' | 'MEDICAL'> = {};
                    displayPlayers.forEach((p) => {
                      allP[p.id] = 'PRESENT';
                    });
                    setAttendanceMarks(allP);
                  }}
                  className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold uppercase"
                >
                  Mark All Present
                </button>
              </div>
            </div>

            {/* Attendance Player List */}
            <div className="space-y-2">
              {displayPlayers.map((player) => {
                const currentMark = attendanceMarks[player.id] || 'PRESENT';

                return (
                  <div
                    key={player.id}
                    className="bg-[#070a0e] border border-slate-800/90 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#ff5500]/20 text-[#ff5500] font-black flex items-center justify-center text-xs">
                        #{player.jerseyNumber}
                      </div>
                      <div>
                        <div className="text-xs font-black text-white">{player.name}</div>
                        <div className="text-[10px] text-slate-400">{player.position} • {player.attendancePct}% Historical Rate</div>
                      </div>
                    </div>

                    {/* Present / Absent / Medical Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setAttendanceMarks({ ...attendanceMarks, [player.id]: 'PRESENT' })}
                        className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition-all ${
                          currentMark === 'PRESENT'
                            ? 'bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => setAttendanceMarks({ ...attendanceMarks, [player.id]: 'ABSENT' })}
                        className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition-all ${
                          currentMark === 'ABSENT'
                            ? 'bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => setAttendanceMarks({ ...attendanceMarks, [player.id]: 'MEDICAL' })}
                        className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition-all ${
                          currentMark === 'MEDICAL'
                            ? 'bg-amber-500 text-white shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        Medical
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setReminderToast('Today\'s squad attendance saved successfully!')}
                className="bg-[#ff5500] hover:bg-[#ff6611] text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all"
              >
                Save Attendance Sheet
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: KIT & EQUIPMENT INVENTORY (ADMIN DECIDED ONLY) */}
        {activeTab === 'inventory' && (
          <div className="space-y-5">
            {/* Top Section: Kit Allocation Desk (Admin) or Official Kit Status (Player) */}
            {isAdmin ? (
              <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ff5500]/10 border border-[#ff5500]/30 flex items-center justify-center text-[#ff5500]">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-white uppercase tracking-tight">
                          Squad Kit & Gear Allocation Desk (Admin Control)
                        </h3>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                          Admin Decided
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Assign and dispatch official jersey sizes, boot specifications, training kit bags, and GPS tracking hardware for squad athletes.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 self-start sm:self-auto bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl">
                    Allocated: <span className="text-emerald-400 font-black">{players.filter((p) => p.kitIssued?.jerseySize || p.kitIssued?.bootSize).length}</span> / {players.length} Players
                  </span>
                </div>

                {/* Squad Kit Allocation Roster Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-800 bg-[#070a0e]">
                        <th className="p-3">Athlete</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Jersey Size</th>
                        <th className="p-3">Boot Size</th>
                        <th className="p-3">Kit Bag</th>
                        <th className="p-3">Training Ball</th>
                        <th className="p-3">GPS Pod</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {players.map((p) => {
                        const isAllocated = !!(p.kitIssued?.jerseySize || p.kitIssued?.bootSize);
                        return (
                          <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={p.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80'}
                                  alt={p.name}
                                  className="w-7 h-7 rounded-lg object-cover border border-slate-700"
                                />
                                <div>
                                  <div className="font-bold text-white text-xs">{p.name}</div>
                                  <div className="text-[10px] text-slate-500 font-mono">#{p.jerseyNumber} • {p.position}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                {p.ageCategory}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`font-black ${p.kitIssued?.jerseySize ? 'text-white' : 'text-slate-500 italic'}`}>
                                {p.kitIssued?.jerseySize || 'Pending'}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`font-black ${p.kitIssued?.bootSize ? 'text-[#ff5500]' : 'text-slate-500 italic'}`}>
                                {p.kitIssued?.bootSize || 'Pending'}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.kitIssued?.kitBagAssigned ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500'}`}>
                                {p.kitIssued?.kitBagAssigned ? '✓ Issued' : '—'}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.kitIssued?.ballAssigned ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500'}`}>
                                {p.kitIssued?.ballAssigned ? '✓ Issued' : '—'}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.kitIssued?.gpsTrackerAssigned ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500'}`}>
                                {p.kitIssued?.gpsTrackerAssigned ? '✓ GPS Pod' : '—'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => openKitModalForPlayer(p)}
                                className="text-[10px] font-black uppercase text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/30 transition-colors"
                              >
                                {isAllocated ? 'Edit Kit' : 'Allocate Kit'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentLoggedInPlayer.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80'}
                      alt={currentLoggedInPlayer.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-[#ff5500]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-white uppercase tracking-tight">
                          Official Kit & Gear Status: {currentLoggedInPlayer.name}
                        </h3>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                          Admin Decided
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Official academy training kit, matchday boots, and telemetry equipment allocated by Administration.
                      </p>
                    </div>
                  </div>
                </div>

                {currentLoggedInPlayer.kitIssued && (currentLoggedInPlayer.kitIssued.jerseySize || currentLoggedInPlayer.kitIssued.bootSize) ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="bg-[#070a0e] border border-slate-800/90 rounded-xl p-3 space-y-1">
                        <div className="text-[10px] font-black text-slate-500 uppercase flex items-center justify-between">
                          <span>Jersey Size</span>
                          <Package className="w-3 h-3 text-[#ff5500]" />
                        </div>
                        <div className="text-base font-black text-white">{currentLoggedInPlayer.kitIssued.jerseySize || 'Pending'}</div>
                      </div>

                      <div className="bg-[#070a0e] border border-slate-800/90 rounded-xl p-3 space-y-1">
                        <div className="text-[10px] font-black text-slate-500 uppercase flex items-center justify-between">
                          <span>Boot Size</span>
                          <Package className="w-3 h-3 text-amber-400" />
                        </div>
                        <div className="text-base font-black text-[#ff5500]">{currentLoggedInPlayer.kitIssued.bootSize || 'Pending'}</div>
                      </div>

                      <div className="bg-[#070a0e] border border-slate-800/90 rounded-xl p-3 space-y-1">
                        <div className="text-[10px] font-black text-slate-500 uppercase flex items-center justify-between">
                          <span>Kit Bag</span>
                          <span className={`text-[9px] font-bold ${currentLoggedInPlayer.kitIssued.kitBagAssigned ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {currentLoggedInPlayer.kitIssued.kitBagAssigned ? 'ISSUED' : 'PENDING'}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-300">
                          {currentLoggedInPlayer.kitIssued.kitBagAssigned ? 'Official Bag Assigned' : 'Awaiting Issue'}
                        </div>
                      </div>

                      <div className="bg-[#070a0e] border border-slate-800/90 rounded-xl p-3 space-y-1">
                        <div className="text-[10px] font-black text-slate-500 uppercase flex items-center justify-between">
                          <span>Training Ball</span>
                          <span className={`text-[9px] font-bold ${currentLoggedInPlayer.kitIssued.ballAssigned ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {currentLoggedInPlayer.kitIssued.ballAssigned ? 'ISSUED' : 'PENDING'}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-300">
                          {currentLoggedInPlayer.kitIssued.ballAssigned ? 'Match Ball Issued' : 'Awaiting Issue'}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Accessories Status:</span>
                      <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${currentLoggedInPlayer.kitIssued.shinGuards ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                        {currentLoggedInPlayer.kitIssued.shinGuards ? '✓ Shin Guards Issued' : 'Shin Guards: Pending'}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${currentLoggedInPlayer.kitIssued.gripSocks ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                        {currentLoggedInPlayer.kitIssued.gripSocks ? '✓ Grip Socks Issued' : 'Grip Socks: Pending'}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${currentLoggedInPlayer.kitIssued.gpsTrackerAssigned ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                        {currentLoggedInPlayer.kitIssued.gpsTrackerAssigned ? '✓ GPS Pod Sensor Issued' : 'GPS Pod: Pending'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#070a0e] border border-slate-800/80 rounded-xl p-5 text-center space-y-2">
                    <Package className="w-8 h-8 text-amber-400/60 mx-auto" />
                    <h4 className="text-xs font-black text-white uppercase">Awaiting Official Kit Allocation</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Your training jersey, matchday boots, and equipment will be assigned directly by the Academy Admin / Head Coach during squad onboarding.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Equipment & Club Inventory Section */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                <div>
                  <h2 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#ff5500]" />
                    <span>Academy Equipment, Balls & Inventory</span>
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {isAdmin ? 'Admin equipment stock management, dispatch logs, and condition tracking.' : 'Academy equipment and training inventory status.'}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setIsAddEquipmentModalOpen(true)}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#ff5500]" />
                    <span>Add Equipment Item</span>
                  </button>
                )}
              </div>

              {/* Category Filter Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                {['ALL', 'BALLS', 'GEAR', 'FITNESS', 'UNIFORMS', 'MEDICAL'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setInventoryCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                      inventoryCategoryFilter === cat
                        ? 'bg-[#ff5500] text-white'
                        : 'bg-[#0e141c] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Equipment Items Grid */}
              {inventory.length === 0 ? (
                <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-8 text-center space-y-2">
                  <Package className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-300">No Equipment or Kit Items in Inventory</p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    {isAdmin
                      ? 'The inventory is currently empty. Click "+ Add Equipment Item" above to add footballs, cones, bibs, GPS units, or medical kits.'
                      : 'Academy inventory is maintained directly by the Academy Admin.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {inventory
                    .filter((item) => inventoryCategoryFilter === 'ALL' || item.category === inventoryCategoryFilter)
                    .map((item) => {
                      const availableQty = Math.max(0, item.totalQuantity - item.inUseQuantity);
                      return (
                        <div
                          key={item.id}
                          className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 space-y-3 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-[#ff5500] bg-[#ff5500]/10 px-2 py-0.5 rounded uppercase">
                              {item.category}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">
                                {item.condition}
                              </span>
                              {isAdmin && (
                                <button
                                  onClick={() => handleDeleteEquipment(item.id, item.name)}
                                  className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                                  title="Delete Item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-black text-white">{item.name}</h3>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Available: <span className="text-emerald-400 font-bold">{availableQty} units</span> in stock
                            </div>
                          </div>

                          <div className="bg-[#070a0e] border border-slate-800/80 rounded-xl p-2.5 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-[9px] text-slate-500 font-bold block uppercase">Total Stock</span>
                                <span className="font-black text-white text-sm">{item.totalQuantity}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] text-slate-500 font-bold block uppercase">In Active Use</span>
                                <span className="font-black text-amber-400 text-sm">{item.inUseQuantity}</span>
                              </div>
                            </div>

                            {/* Visual stock bar */}
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-400 h-full rounded-full transition-all"
                                style={{ width: `${Math.min(100, (availableQty / (item.totalQuantity || 1)) * 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Admin Dispatch & Return Controls */}
                          {isAdmin && (
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleAdminCheckOutEquipment(item)}
                                disabled={availableQty <= 0}
                                className={`flex-1 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                                  availableQty > 0
                                    ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 active:scale-95'
                                    : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                                }`}
                              >
                                <Plus className="w-3 h-3" />
                                <span>Dispatch 1</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAdminReturnEquipment(item)}
                                disabled={item.inUseQuantity <= 0}
                                className={`flex-1 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                                  item.inUseQuantity > 0
                                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95'
                                    : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                                }`}
                              >
                                <Check className="w-3 h-3 text-[#ff5500]" />
                                <span>Return 1</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: ALL TRANSACTION HISTORY LEDGER */}
        {activeTab === 'ledger' && (
          <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ff5500]" />
                <span>Complete Academy Fee Transaction History</span>
              </h2>
              <span className="text-xs text-slate-400 font-bold">Total Records: {activeFeeRecords.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-800 bg-[#070a0e]">
                    <th className="p-3">Receipt #</th>
                    <th className="p-3">Player Name</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Month</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Mode</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {activeFeeRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#ff7733]">{rec.receiptNo}</td>
                      <td className="p-3 font-bold text-white">{rec.playerName} (#{rec.jerseyNumber})</td>
                      <td className="p-3 font-black text-emerald-400">₹{rec.amount.toLocaleString()}</td>
                      <td className="p-3 text-slate-300">{rec.monthYear}</td>
                      <td className="p-3 text-slate-400">{rec.paidDate}</td>
                      <td className="p-3">
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          {rec.paymentMethod}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedReceipt(rec)}
                          className="text-[#ff5500] hover:underline text-[10px] font-bold flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: RECORD FEE PAYMENT */}
      {selectedPlayerForPayment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
          <div className="bg-[#0e141c] border border-[#ff5500]/50 rounded-2xl w-full max-w-md p-5 space-y-4 relative shadow-2xl animate-fade-in">
            <button
              onClick={() => setSelectedPlayerForPayment(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black text-[#ff5500] uppercase tracking-wider flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-[#ff5500]" />
                <span>Official Fee Collection Form</span>
              </span>
              <h3 className="text-base font-black text-white mt-1">
                Collect Fee: {selectedPlayerForPayment.name} (#{selectedPlayerForPayment.jerseyNumber})
              </h3>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">Fee Amount (₹)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-[#070a0e] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-2 text-sm font-black text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">Select Month / Term</label>
                <select
                  value={payMonth}
                  onChange={(e) => setPayMonth(e.target.value)}
                  className="w-full bg-[#070a0e] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="August 2026">August 2026</option>
                  <option value="September 2026">September 2026</option>
                  <option value="October 2026">October 2026</option>
                  <option value="Full Quarter (3 Months)">Full Quarter (3 Months)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Cash', 'Bank Transfer', 'Card'] as const).map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPayMethod(method)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        payMethod === method
                          ? 'bg-[#ff5500] text-white border-[#ff5500]'
                          : 'bg-[#070a0e] text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">Receipt Note / Txn Ref No</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. GPay Txn #987123 or Cash at desk"
                  className="w-full bg-[#070a0e] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlayerForPayment(null)}
                  className="flex-1 bg-slate-900 text-slate-300 py-2.5 rounded-xl text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#ff5500] hover:bg-[#ff6611] text-white py-2.5 rounded-xl text-xs font-black uppercase shadow-lg transition-all"
                >
                  Generate Receipt & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DIGITAL RECEIPT CARD */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3">
          <div className="bg-[#0b0f14] border-2 border-[#ff5500] rounded-2xl w-full max-w-sm p-6 space-y-4 relative shadow-[0_0_40px_rgba(255,85,0,0.3)] animate-fade-in text-slate-200">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Header */}
            <div className="text-center border-b border-slate-800 pb-3">
              <h2 className="text-lg font-black italic uppercase text-[#ff5500]">KHELTANTRA SPORTS ACADEMY</h2>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Official Fee Payment Receipt
              </div>
              <div className="mt-2 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[10px] font-black py-0.5 px-3 rounded-full inline-block uppercase">
                {selectedReceipt.status} RECEIPT
              </div>
            </div>

            {/* Receipt Table */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-500 font-bold">Receipt No:</span>
                <span className="font-mono font-bold text-[#ff7733]">{selectedReceipt.receiptNo}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-500 font-bold">Athlete Name:</span>
                <span className="font-bold text-white">{selectedReceipt.playerName} (#{selectedReceipt.jerseyNumber})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-500 font-bold">Contact Phone:</span>
                <span className="font-bold text-slate-300">{selectedReceipt.phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-500 font-bold">Month / Term:</span>
                <span className="font-bold text-white">{selectedReceipt.monthYear}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-500 font-bold">Payment Method:</span>
                <span className="font-bold text-slate-300">{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-500 font-bold">Payment Date:</span>
                <span className="font-bold text-slate-300">{selectedReceipt.paidDate}</span>
              </div>

              <div className="bg-[#121924] p-3 rounded-xl border border-slate-800 text-center my-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Amount Received</span>
                <span className="text-2xl font-black text-emerald-400">₹{selectedReceipt.amount.toLocaleString()}</span>
              </div>

              {selectedReceipt.notes && (
                <div className="text-[10px] text-slate-400 italic text-center">
                  "{selectedReceipt.notes}"
                </div>
              )}
            </div>

            {/* Official Stamp */}
            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[10px] text-slate-500">
              <div>Issued By: {selectedReceipt.collectorName || 'Academy Admin Desk'}</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Stamp</span>
              </div>
            </div>

            {/* Print & Share Actions */}
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-[#ff5500]" />
                <span>Print PDF</span>
              </button>
              <button
                onClick={() => {
                  const text = `Receipt #${selectedReceipt.receiptNo} from Kheltantra Academy for ${selectedReceipt.playerName}: ₹${selectedReceipt.amount} paid via ${selectedReceipt.paymentMethod} on ${selectedReceipt.paidDate}.`;
                  navigator.clipboard.writeText(text);
                  setReminderToast('Receipt details copied to clipboard!');
                  setSelectedReceipt(null);
                }}
                className="flex-1 bg-[#ff5500] hover:bg-[#ff6611] py-2 rounded-xl text-xs font-black text-white flex items-center justify-center gap-1.5 shadow-md"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NEW PLAYER */}
      {isAddPlayerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
          <div className="bg-[#0e141c] border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setIsAddPlayerModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-base font-black text-white uppercase">Register New Academy Player</h3>
              <p className="text-xs text-slate-400">Add a new player file to the management system.</p>
            </div>

            <form onSubmit={handleAddPlayerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="e.g. Rohan Verma"
                  className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#ff5500]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">Jersey Number</label>
                  <input
                    type="number"
                    value={newPlayerJersey}
                    onChange={(e) => setNewPlayerJersey(Number(e.target.value))}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">Position</label>
                  <input
                    type="text"
                    value={newPlayerPos}
                    onChange={(e) => setNewPlayerPos(e.target.value)}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">Mobile Phone Number</label>
                <input
                  type="text"
                  value={newPlayerPhone}
                  onChange={(e) => setNewPlayerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff5500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">Monthly Fee (₹)</label>
                  <input
                    type="number"
                    value={newPlayerFee}
                    onChange={(e) => setNewPlayerFee(Number(e.target.value))}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">Guardian Contact</label>
                  <input
                    type="text"
                    value={newPlayerGuardian}
                    onChange={(e) => setNewPlayerGuardian(e.target.value)}
                    placeholder="Parent Name"
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPlayerModalOpen(false)}
                  className="flex-1 bg-slate-900 py-2.5 rounded-xl font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#ff5500] hover:bg-[#ff6611] py-2.5 rounded-xl font-black text-white"
                >
                  Register Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD EQUIPMENT ITEM */}
      {isAddEquipmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
          <div className="bg-[#0e141c] border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 relative">
            <button
              onClick={() => setIsAddEquipmentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-base font-black text-white uppercase">Add Equipment Item</h3>
            </div>

            <form onSubmit={handleAddEquipmentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">Equipment Name</label>
                <input
                  type="text"
                  value={newEqName}
                  onChange={(e) => setNewEqName(e.target.value)}
                  placeholder="e.g. Adidas FIFA Match Balls"
                  className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={newEqCategory}
                    onChange={(e) => setNewEqCategory(e.target.value as any)}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none"
                  >
                    <option value="BALLS">BALLS</option>
                    <option value="GEAR">GEAR</option>
                    <option value="FITNESS">FITNESS</option>
                    <option value="UNIFORMS">UNIFORMS</option>
                    <option value="MEDICAL">MEDICAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">Total Quantity</label>
                  <input
                    type="number"
                    value={newEqQty}
                    onChange={(e) => setNewEqQty(Number(e.target.value))}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEquipmentModalOpen(false)}
                  className="flex-1 bg-slate-900 py-2.5 rounded-xl font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#ff5500] py-2.5 rounded-xl font-black text-white"
                >
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: KIT & GEAR ALLOCATION (ADMIN AUTHORIZED ONLY) */}
      {selectedPlayerForKitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
          <div className="bg-[#0e141c] border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setSelectedPlayerForKitModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase">
                  Admin Kit & Gear Allocation
                </h3>
                <p className="text-xs text-slate-400">
                  Assigning official academy kit for <span className="text-white font-bold">{selectedPlayerForKitModal.name}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSavePlayerKitSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">
                    Jersey Size
                  </label>
                  <select
                    value={modalJerseySize}
                    onChange={(e) => setModalJerseySize(e.target.value)}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="XS">Size XS</option>
                    <option value="S">Size S</option>
                    <option value="M">Size M</option>
                    <option value="L">Size L</option>
                    <option value="XL">Size XL</option>
                    <option value="XXL">Size XXL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-300 uppercase mb-1">
                    Boot / Cleat Size
                  </label>
                  <select
                    value={modalBootSize}
                    onChange={(e) => setModalBootSize(e.target.value)}
                    className="w-full bg-[#070a0e] border border-slate-800 rounded-xl px-3 py-2 text-[#ff5500] font-bold focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="UK 6">UK 6</option>
                    <option value="UK 7">UK 7</option>
                    <option value="UK 8">UK 8</option>
                    <option value="UK 9">UK 9</option>
                    <option value="UK 10">UK 10</option>
                    <option value="UK 11">UK 11</option>
                    <option value="UK 12">UK 12</option>
                  </select>
                </div>
              </div>

              {/* Equipment Allocation Toggles */}
              <div className="bg-[#070a0e] border border-slate-800/80 rounded-xl p-3 space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase block">
                  Official Gear & Equipment Allocation
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2 bg-[#0e141c] border border-slate-800 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modalKitBag}
                      onChange={(e) => setModalKitBag(e.target.checked)}
                      className="rounded accent-[#ff5500]"
                    />
                    <span className="text-xs font-bold text-slate-200">Academy Kit Bag</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-[#0e141c] border border-slate-800 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modalBall}
                      onChange={(e) => setModalBall(e.target.checked)}
                      className="rounded accent-[#ff5500]"
                    />
                    <span className="text-xs font-bold text-slate-200">Match Ball (Size 5)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-[#0e141c] border border-slate-800 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modalShinGuards}
                      onChange={(e) => setModalShinGuards(e.target.checked)}
                      className="rounded accent-[#ff5500]"
                    />
                    <span className="text-xs font-bold text-slate-200">Pro Shin Guards</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-[#0e141c] border border-slate-800 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modalGripSocks}
                      onChange={(e) => setModalGripSocks(e.target.checked)}
                      className="rounded accent-[#ff5500]"
                    />
                    <span className="text-xs font-bold text-slate-200">Grip Socks (Pair)</span>
                  </label>
                </div>

                <label className="flex items-center gap-2 p-2 bg-[#0e141c] border border-slate-800 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalGps}
                    onChange={(e) => setModalGps(e.target.checked)}
                    className="rounded accent-[#ff5500]"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-slate-200 block">GPS Tracker Pod Assigned</span>
                    <span className="text-[10px] text-slate-500 block">Live telemetry & speed monitoring vest device</span>
                  </div>
                </label>
              </div>

              <div className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Admin Authorization: Saving kit specifications directly updates the official athlete profile.</span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlayerForKitModal(null)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 py-2.5 rounded-xl font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#ff5500] hover:bg-[#ff6611] py-2.5 rounded-xl font-black text-white shadow-md active:scale-95 transition-all"
                >
                  Save Kit Specs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Helper Building icon
function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m4 10V11m-4 0h4"
      />
    </svg>
  );
}
