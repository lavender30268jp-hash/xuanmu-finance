/**
 * 李宣穆育兒資金與開銷控管系統 - Core Application Engine (Light Cozy Professional Edition)
 * Fixed: Force merge & sync latest August transactions (8/12 - 8/20) even if browser localStorage has old cache.
 */

const DEFAULT_TRANSACTIONS = [
  { id: 'tx-21', date: '2026-08-20', type: '支出', sourceAccount: '永豐大戶 (DAWHO)', targetAccount: '商家/用品店', category: '醫療衛教', fund: '宣穆基金', amount: 4000, note: '腸病毒疫苗第一劑' },
  { id: 'tx-20', date: '2026-08-19', type: '支出', sourceAccount: '永豐大戶 (DAWHO)', targetAccount: '商家/用品店', category: '每月開銷', fund: '宣穆基金', amount: 3326, note: '織物清洗機運費' },
  { id: 'tx-19', date: '2026-08-18', type: '支出', sourceAccount: '永豐大戶 (DAWHO)', targetAccount: '商家/用品店', category: '醫療衛教', fund: '宣穆基金', amount: 1900, note: '自費預防針（輪狀病毒...）' },
  { id: 'tx-18', date: '2026-08-17', type: '支出', sourceAccount: '育兒實體現金', targetAccount: '商家/用品店', category: '每月開銷', fund: '宣穆基金', amount: 4800, note: '臍帶章' },
  { id: 'tx-17', date: '2026-08-12', type: '支出', sourceAccount: '共同小雞錢包', targetAccount: '商家/用品店', category: '每月開銷', fund: '宣穆基金', amount: 2048, note: '林貝兒兩罐+兩盒' },
  { id: 'tx-16', date: '2026-08-10', type: '支出', sourceAccount: '永豐大戶 (DAWHO)', targetAccount: '家電/育兒設備店', category: '每月開銷', fund: '宣穆基金', amount: 5368, note: '圍欄' },
  { id: 'tx-15', date: '2026-08-10', type: '支出', sourceAccount: '永豐大戶 (DAWHO)', targetAccount: '共同小雞錢包', category: '每月開銷', fund: '宣穆基金', amount: 15000, note: '115/8 共同小雞' },
  { id: 'tx-14', date: '2026-08-08', type: '收入', sourceAccount: '政府補助/親友', targetAccount: '育兒實體現金', category: '其他', fund: '宣穆戶頭', amount: 4800, note: '政詢親戚給的 (阿姨+小舅舅)' },
  { id: 'tx-13', date: '2026-08-07', type: '支出', sourceAccount: 'LINE 阿萌', targetAccount: '商家/用品店', category: '每月開銷', fund: '宣穆基金', amount: 10321, note: '阿萌花用：扣款 10321' },
  { id: 'tx-12', date: '2026-08-05', type: '支出', sourceAccount: '永豐大戶 (DAWHO)', targetAccount: '家電/育兒設備店', category: '育兒大額設備/用品', fund: '宣穆基金', amount: 7539, note: '8/5 購買織物清洗機 (育兒開銷)' },
  { id: 'tx-9', date: '2026-08-01', type: '支出', sourceAccount: '郵局數位帳戶', targetAccount: 'LINE 阿萌', category: '每月開銷', fund: '宣穆基金', amount: 10000, note: '8/1 阿萌小雞' },
  { id: 'tx-8', date: '2026-07-20', type: '收入', sourceAccount: '萌媽資助', targetAccount: '育兒實體現金', category: '萌媽', fund: '其他', amount: 20000, note: '萌媽點外送資助 (現金)' },
  { id: 'tx-7', date: '2026-07-19', type: '支出', sourceAccount: '永豐大戶 (DAWHO)', targetAccount: 'LINE 阿萌', category: '每月開銷', fund: '宣穆基金', amount: 10000, note: '7/19 阿萌小雞' },
  { id: 'tx-6', date: '2026-07-15', type: '收入', sourceAccount: '政府補助/親友', targetAccount: '郵局 (實體存簿)', category: '固定收入', fund: '宣穆戶頭', amount: 5000, note: '育兒津貼6月' },
  { id: 'tx-5', date: '2026-07-10', type: '轉帳', sourceAccount: '永豐大戶 (DAWHO)', targetAccount: '郵局數位帳戶', category: '轉帳', fund: '宣穆基金', amount: 180000, note: '永豐轉入郵局數位帳戶' },
  { id: 'tx-4', date: '2026-07-10', type: '支出', sourceAccount: '永豐大戶 (DAWHO)', targetAccount: '共同小雞錢包', category: '每月開銷', fund: '宣穆基金', amount: 15000, note: '115/7 共同小雞' },
  { id: 'tx-3', date: '2026-07-08', type: '收入', sourceAccount: '永豐大戶 (DAWHO)', targetAccount: '永豐大戶 (DAWHO)', category: '萌爸', fund: '宣穆基金', amount: 360000, note: '115/7-116/7宣穆津貼' },
  { id: 'tx-2', date: '2026-06-30', type: '收入', sourceAccount: '政府補助/現金', targetAccount: '郵局 (實體存簿)', category: '單次津貼', fund: '宣穆戶頭', amount: 100000, note: '生育津貼' },
  { id: 'tx-1', date: '2026-06-22', type: '收入', sourceAccount: '政府補助/現金', targetAccount: '郵局 (實體存簿)', category: '單次津貼', fund: '宣穆戶頭', amount: 20000, note: '台中市加碼津貼' }
];

const DEFAULT_ACCOUNTS = [
  { id: 'acc-post-phys', name: '郵局 (實體存簿)', group: '存款帳戶', icon: 'fa-envelope-open-text text-emerald-500', badge: '實體存簿', note: '政府補助生育給付/育兒津貼專款' },
  { id: 'acc-post-digi', name: '郵局數位帳戶', group: '存款帳戶', icon: 'fa-mobile-screen-button text-cyan-500', badge: '數位帳戶', note: '存放萌爸 18 萬宣穆基金' },
  { id: 'acc-sinopac', name: '永豐大戶 (DAWHO)', group: '存款帳戶', icon: 'fa-building-columns text-teal-500', badge: '主要轉入帳戶', note: '存放萌爸 18 萬宣穆基金' },
  { id: 'acc-cash', name: '育兒實體現金', group: '實體現金', icon: 'fa-money-bill-wave text-amber-500', badge: '手邊現金/紅包', note: '收到的親友紅包與現金資助' },
  { id: 'acc-joint', name: '共同小雞錢包', group: '開銷錢包', icon: 'fa-heart text-rose-500', badge: '日常開銷錢包', note: '買飯、尿布、育兒用品' },
  { id: 'acc-line-among', name: 'LINE 阿萌', group: '開銷錢包', icon: 'fa-comment text-emerald-500', badge: '阿萌開銷錢包', note: '阿萌買兒子花費與共同餐費' },
  { id: 'acc-atong', name: '💳 阿彤代付', group: '代付墊款', icon: 'fa-credit-card text-purple-500', badge: '阿彤墊款專區', note: '阿彤先用自己的錢幫宣穆付費，隨時可一鍵歸還還款' }
];

const DEFAULT_QUICK_PRESETS = [
  { id: 'qp-atong', name: '💳 阿彤先墊錢 (代付)', mode: 'prompt-atong', type: '支出', sourceAccount: '💳 阿彤代付', targetAccount: '商家/用品店', category: '每月開銷', fund: '宣穆基金', note: '阿彤代付', icon: 'fa-credit-card text-purple-500', border: 'border-purple-200 hover:border-purple-400 bg-purple-50/40', desc: '阿彤拿自己的錢先幫宣穆付費' },
  { id: 'qp-chick', name: '🐥 小雞花用 (扣小雞錢包)', mode: 'prompt', type: '支出', sourceAccount: '共同小雞錢包', targetAccount: '商家/用品店', category: '每月開銷', fund: '宣穆基金', note: '買飯/尿布', icon: 'fa-cart-shopping text-rose-500', border: 'border-rose-200 hover:border-rose-400 bg-rose-50/30', desc: '按下去輸入金額與日期，扣小雞錢包' },
  { id: 'qp-among', name: '💬 萌 LINE 花用 (扣阿萌錢包)', mode: 'prompt', type: '支出', sourceAccount: 'LINE 阿萌', targetAccount: '商家/用品店', category: '每月開銷', fund: '宣穆基金', note: '扣款', icon: 'fa-comment text-emerald-500', border: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/30', desc: '按下去輸入金額與日期，扣 LINE 阿萌' },
  { id: 'qp-reimburse', name: '💸 還錢給阿彤 (代付歸還)', mode: 'prompt-reimburse', type: '轉帳', sourceAccount: '永豐大戶 (DAWHO)', targetAccount: '💳 阿彤代付', category: '轉帳', fund: '宣穆基金', note: '歸還阿彤代付款', icon: 'fa-hand-holding-hand text-indigo-500', border: 'border-indigo-200 hover:border-indigo-400 bg-indigo-50/40', desc: '從宣穆基金/銀行歸還墊款給阿彤' }
];

class XuanMuFinanceApp {
  constructor() {
    this.appTitle = localStorage.getItem('xm_app_title') || '小萌馬金庫';
    
    // Load local storage
    this.transactions = (JSON.parse(localStorage.getItem('xm_transactions')) || DEFAULT_TRANSACTIONS)
      .filter(t => t.id !== 'tx-10' && t.id !== 'tx-11');

    // Force merge any missing August transactions (8/12, 8/17, 8/18, 8/19, 8/20) into local dataset
    DEFAULT_TRANSACTIONS.forEach(dtx => {
      const exists = this.transactions.some(t => t.id === dtx.id || (t.date === dtx.date && Number(t.amount) === dtx.amount && t.note === dtx.note));
      if (!exists) {
        this.transactions.push(dtx);
      }
    });

    this.accounts = JSON.parse(localStorage.getItem('xm_accounts')) || DEFAULT_ACCOUNTS;
    this.quickPresets = JSON.parse(localStorage.getItem('xm_quick_presets')) || DEFAULT_QUICK_PRESETS;
    this.subsidyRule = localStorage.getItem('xm_subsidy_rule') || 'child';
    this.syncRoomKey = localStorage.getItem('xm_sync_room') || 'hughtong-2026';
    this.lastUpdatedAt = localStorage.getItem('xm_last_updated_at') || '';

    if (!this.accounts.some(a => a.id === 'acc-atong' || a.name === '💳 阿彤代付')) {
      this.accounts.push({ id: 'acc-atong', name: '💳 阿彤代付', group: '代付墊款', icon: 'fa-credit-card text-purple-500', badge: '阿彤墊款專區', note: '阿彤先用自己的錢幫宣穆付費，隨時可一鍵歸還還款' });
    }

    // Normalize accounts
    this.transactions = this.transactions.map(tx => {
      let src = this.normalizeAccountName(tx.sourceAccount, tx.type === '收入');
      let tgt = this.normalizeAccountName(tx.targetAccount);
      
      if (tx.type === '支出' && src === '育兒實體現金' && tgt === '育兒實體現金') {
        tgt = '商家/用品店';
      }

      if (tx.type === '支出' && (src === '共同小雞錢包' || src === 'LINE 阿萌') && (tgt === src || tgt === '共同小雞錢包' || tgt === 'LINE 阿萌')) {
        tgt = '商家/用品店';
      }

      return { ...tx, sourceAccount: src, targetAccount: tgt };
    }).sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.id || '').localeCompare(a.id || ''));

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('sync')) {
      this.syncRoomKey = urlParams.get('sync');
      localStorage.setItem('xm_sync_room', this.syncRoomKey);
    }

    this.pieChart = null;
    this.barChart = null;
    this.currentTxType = '支出';

    this.initDOM();
    this.bindEvents();
    this.render();

    this.pullFromCloud();
    setInterval(() => this.pullFromCloud(true), 2500);

    window.addEventListener('focus', () => this.pullFromCloud());
  }

  normalizeAccountName(rawName, isIncomeSource = false) {
    if (!rawName) return '其他';
    const s = rawName.trim();
    if (s.includes('阿彤') || s.includes('代付') || s.includes('墊款')) {
      return '💳 阿彤代付';
    }
    if (s.includes('郵局') && (s.includes('數') || s.includes('數位'))) {
      return '郵局數位帳戶';
    }
    if (s.includes('郵局') || s.includes('存簿') || s.includes('實體存簿')) {
      return '郵局 (實體存簿)';
    }
    if (s.includes('永豐') || s.includes('DAWHO') || s.includes('大戶')) {
      return '永豐大戶 (DAWHO)';
    }
    if (s.includes('實體現金') || s.includes('手邊現金') || s.includes('紅包') || (s === '現金' && !isIncomeSource)) {
      return '育兒實體現金';
    }
    if (s.includes('小雞') || s.includes('共同')) {
      return '共同小雞錢包';
    }
    if (s.includes('阿萌') || s.includes('line') || s.includes('LINE')) {
      return 'LINE 阿萌';
    }
    return s;
  }

  initDOM() {
    this.btnQuickAdd = document.getElementById('btn-quick-add');
    this.btnManageRules = document.getElementById('btn-manage-rules');
    this.btnAddAccount = document.getElementById('btn-add-account');
    this.btnAddAccountInner = document.getElementById('btn-add-account-inner');

    this.modalTx = document.getElementById('modal-transaction');
    this.modalRules = document.getElementById('modal-rules');
    this.modalCloudSync = document.getElementById('modal-cloud-sync');
    this.modalQuickPresets = document.getElementById('modal-quick-presets');
    this.modalAccountDetails = document.getElementById('modal-account-details');

    this.formTx = document.getElementById('form-transaction');
    this.txId = document.getElementById('tx-id');
    this.txDate = document.getElementById('tx-date');
    this.txAmount = document.getElementById('tx-amount');
    this.txSourceAccount = document.getElementById('tx-source-account');
    this.txTargetAccount = document.getElementById('tx-target-account');
    this.txCategory = document.getElementById('tx-category');
    this.txFund = document.getElementById('tx-fund');
    this.txNote = document.getElementById('tx-note');

    this.filterFund = document.getElementById('filter-fund');
    this.filterType = document.getElementById('filter-type');
    this.searchKeyword = document.getElementById('search-keyword');
  }

  bindEvents() {
    this.btnQuickAdd.addEventListener('click', () => this.openAddModal());
    this.btnManageRules.addEventListener('click', () => this.openRulesModal());
    this.btnAddAccount?.addEventListener('click', () => this.promptAddAccount());
    this.btnAddAccountInner?.addEventListener('click', () => this.promptAddAccount());

    document.getElementById('modal-tx-close').addEventListener('click', () => this.closeModal(this.modalTx));
    document.getElementById('btn-tx-cancel').addEventListener('click', () => this.closeModal(this.modalTx));
    document.getElementById('modal-rules-close').addEventListener('click', () => this.closeModal(this.modalRules));

    document.querySelectorAll('.tx-type-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.currentTarget.getAttribute('data-type');
        this.setModalTxType(type);
      });
    });

    this.formTx.addEventListener('submit', (e) => this.handleSaveTransaction(e));

    this.filterFund.addEventListener('change', () => this.renderTransactionsTable());
    this.filterType.addEventListener('change', () => this.renderTransactionsTable());
    this.searchKeyword.addEventListener('input', () => this.renderTransactionsTable());
  }

  saveState() {
    localStorage.setItem('xm_app_title', this.appTitle);
    localStorage.setItem('xm_transactions', JSON.stringify(this.transactions));
    localStorage.setItem('xm_accounts', JSON.stringify(this.accounts));
    localStorage.setItem('xm_quick_presets', JSON.stringify(this.quickPresets));
    localStorage.setItem('xm_subsidy_rule', this.subsidyRule);
    localStorage.setItem('xm_sync_room', this.syncRoomKey);

    this.pushToCloud();
  }

  async pushToCloud() {
    try {
      const nowStr = new Date().toISOString();
      this.lastUpdatedAt = nowStr;
      localStorage.setItem('xm_last_updated_at', nowStr);

      const payload = {
        key: this.syncRoomKey,
        appTitle: this.appTitle,
        updatedAt: nowStr,
        transactions: this.transactions,
        accounts: this.accounts,
        quickPresets: this.quickPresets
      };
      
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});

      await fetch(`https://api.npoint.io/c1e345e5d36e2f4762e8`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
      
      const statusEl = document.getElementById('cloud-sync-status-text');
      if (statusEl) statusEl.textContent = `已即時雲端同步 (${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})})`;
    } catch (e) {}
  }

  async pullFromCloud(isSilent = false) {
    try {
      let res = await fetch('/api/sync').then(r => r.json()).catch(() => null);
      if (!res || !res.transactions) {
        res = await fetch(`https://api.npoint.io/c1e345e5d36e2f4762e8`).then(r => r.json()).catch(() => null);
      }

      if (res && res.transactions && Array.isArray(res.transactions)) {
        if (!isSilent || res.transactions.length >= this.transactions.length || res.updatedAt !== this.lastUpdatedAt) {
          this.lastUpdatedAt = res.updatedAt || new Date().toISOString();
          localStorage.setItem('xm_last_updated_at', this.lastUpdatedAt);
          
          if (res.appTitle) this.appTitle = res.appTitle;

          // Merge cloud transactions with local transactions
          const map = new Map();
          this.transactions.forEach(t => map.set(t.id, t));
          res.transactions.forEach(t => map.set(t.id, t));

          this.transactions = Array.from(map.values())
            .filter(t => t.id !== 'tx-10' && t.id !== 'tx-11')
            .map(tx => {
              let src = this.normalizeAccountName(tx.sourceAccount, tx.type === '收入');
              let tgt = this.normalizeAccountName(tx.targetAccount);
              
              if (tx.type === '支出' && src === '育兒實體現金' && tgt === '育兒實體現金') {
                tgt = '商家/用品店';
              }

              if (tx.type === '支出' && (src === '共同小雞錢包' || src === 'LINE 阿萌') && (tgt === src || tgt === '共同小雞錢包' || tgt === 'LINE 阿萌')) {
                tgt = '商家/用品店';
              }

              return { ...tx, sourceAccount: src, targetAccount: tgt };
            })
            .sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.id || '').localeCompare(a.id || ''));
            
          if (res.accounts) this.accounts = res.accounts;
          if (res.quickPresets) this.quickPresets = res.quickPresets;
          
          this.render();
          
          const statusEl = document.getElementById('cloud-sync-status-text');
          if (statusEl) statusEl.textContent = `已即時同步最新資料 (${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})})`;
        }
      }
    } catch (e) {}
  }

  calculateBalances() {
    let xuanmuAccount = 0;
    let xuanmuFund = 0;
    let xuanmuInvest = 0;
    let otherFund = 0;

    let accountBalances = {
      '郵局 (實體存簿)': 0,
      '郵局數位帳戶': 0,
      '永豐大戶 (DAWHO)': 0,
      '育兒實體現金': 0,
      '共同小雞錢包': 0,
      'LINE 阿萌': 0,
      '💳 阿彤代付': 0
    };

    let walletStats = {
      '共同小雞錢包': { topUp: 0, spent: 0 },
      'LINE 阿萌': { topUp: 0, spent: 0 }
    };

    let atongStats = {
      spent: 0,       // Mom advanced out of pocket
      reimbursed: 0   // Reimbursed back to Mom
    };

    this.accounts.forEach(acc => {
      const normName = this.normalizeAccountName(acc.name);
      if (!accountBalances.hasOwnProperty(normName)) {
        accountBalances[normName] = 0;
      }
    });

    this.transactions.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      const src = this.normalizeAccountName(tx.sourceAccount, tx.type === '收入');
      const tgt = this.normalizeAccountName(tx.targetAccount);

      const isFromWallet = src.includes('錢包') || src.includes('阿萌');

      // 1. Fund Totals
      if (tx.type === '收入') {
        if (tx.fund === '宣穆戶頭') xuanmuAccount += amt;
        else if (tx.fund === '宣穆基金') xuanmuFund += amt;
        else if (tx.fund === '宣穆投資') xuanmuInvest += amt;
        else otherFund += amt;
      } else if (tx.type === '支出') {
        if (!isFromWallet) {
          if (tx.fund === '宣穆戶頭') xuanmuAccount -= amt;
          else if (tx.fund === '宣穆基金') xuanmuFund -= amt;
          else if (tx.fund === '宣穆投資') xuanmuInvest -= amt;
          else otherFund -= amt;
        }
      }

      // 2. Account Balances & Mom Advance Tracking
      if (src === '💳 阿彤代付') {
        atongStats.spent += amt;
      }

      if (tgt === '💳 阿彤代付') {
        atongStats.reimbursed += amt;
      }

      if (tx.type === '收入') {
        accountBalances[tgt] = (accountBalances[tgt] || 0) + amt;
      } else if (tx.type === '支出') {
        accountBalances[src] = (accountBalances[src] || 0) - amt;

        if (tgt === '共同小雞錢包' && src !== '共同小雞錢包') {
          walletStats['共同小雞錢包'].topUp += amt;
        } else if (tgt === 'LINE 阿萌' && src !== 'LINE 阿萌') {
          walletStats['LINE 阿萌'].topUp += amt;
        }

        if (src === '共同小雞錢包') {
          walletStats['共同小雞錢包'].spent += amt;
        } else if (src === 'LINE 阿萌') {
          walletStats['LINE 阿萌'].spent += amt;
        }
      } else if (tx.type === '轉帳') {
        accountBalances[src] = (accountBalances[src] || 0) - amt;
        accountBalances[tgt] = (accountBalances[tgt] || 0) + amt;

        if (tgt === '共同小雞錢包' && src !== '共同小雞錢包') {
          walletStats['共同小雞錢包'].topUp += amt;
        } else if (tgt === 'LINE 阿萌' && src !== 'LINE 阿萌') {
          walletStats['LINE 阿萌'].topUp += amt;
        }
      }
    });

    accountBalances['💳 阿彤代付'] = -(atongStats.spent - atongStats.reimbursed);

    const totalAssets = (accountBalances['郵局 (實體存簿)'] || 0) + 
                        (accountBalances['郵局數位帳戶'] || 0) + 
                        (accountBalances['永豐大戶 (DAWHO)'] || 0) +
                        (accountBalances['育兒實體現金'] || 0);

    return {
      totalAssets,
      xuanmuAccount,
      xuanmuFund,
      xuanmuInvest,
      otherFund,
      accountBalances,
      walletStats,
      atongStats
    };
  }

  render() {
    const titleEl = document.getElementById('app-title-text');
    if (titleEl) titleEl.textContent = this.appTitle;
    document.title = `${this.appTitle} - 育兒資金與開銷控管系統`;

    const data = this.calculateBalances();

    document.getElementById('card-total-assets').textContent = `$${data.totalAssets.toLocaleString()}`;
    document.getElementById('card-xuanmu-account').textContent = `$${data.xuanmuAccount.toLocaleString()}`;
    document.getElementById('card-xuanmu-fund').textContent = `$${data.xuanmuFund.toLocaleString()}`;
    document.getElementById('card-xuanmu-invest').textContent = `$${(data.xuanmuInvest + data.otherFund).toLocaleString()}`;
    document.getElementById('badge-total-transactions').textContent = `${this.transactions.length} 筆紀錄 ➔`;

    this.renderQuickPresets();
    this.renderBudgetTrackers(data);
    this.renderAccountsGrid(data);
    this.renderCharts(data);
    this.renderTransactionsTable();
    this.renderRulesAccountList(data);
    this.updateFormAccountDropdowns();

    localStorage.setItem('xm_app_title', this.appTitle);
    localStorage.setItem('xm_transactions', JSON.stringify(this.transactions));
    localStorage.setItem('xm_accounts', JSON.stringify(this.accounts));
    localStorage.setItem('xm_quick_presets', JSON.stringify(this.quickPresets));
    localStorage.setItem('xm_subsidy_rule', this.subsidyRule);
    localStorage.setItem('xm_sync_room', this.syncRoomKey);
  }

  renderQuickPresets() {
    const grid = document.getElementById('quick-presets-grid');
    grid.innerHTML = '';

    if (this.quickPresets.length === 0) {
      grid.innerHTML = `<div class="col-span-4 text-center py-4 text-slate-400 text-xs font-medium">尚未設定快捷按鈕，點擊右上角【編輯快捷按鈕】新增！</div>`;
      return;
    }

    this.quickPresets.forEach((qp, idx) => {
      const btn = document.createElement('button');
      btn.onclick = () => this.triggerQuickPreset(qp.id);
      btn.className = `p-3.5 rounded-2xl bg-white border ${qp.border || 'border-amber-200 hover:border-amber-400'} transition-all text-left group shadow-sm hover:shadow-md flex flex-col justify-between`;
      
      let amountDisplay = qp.amount ? `$${Number(qp.amount).toLocaleString()}` : '點擊輸入金額';
      let subDesc = qp.desc || (qp.type === '收入' ? '入帳' : '支出/撥款');

      btn.innerHTML = `
        <div class="flex items-center justify-between text-xs font-bold mb-1">
          <span class="flex items-center gap-1.5 text-slate-800">
            <i class="fa-solid ${qp.icon || 'fa-bolt'}"></i> ${qp.name}
          </span>
          <i class="fa-solid fa-chevron-right group-hover:translate-x-1 transition-transform text-amber-500"></i>
        </div>
        <div class="text-base font-black text-slate-900 mt-0.5">${amountDisplay}</div>
        <div class="text-[11px] text-slate-400 mt-1 font-medium">${subDesc}</div>
      `;
      grid.appendChild(btn);
    });
  }

  triggerQuickPreset(id) {
    const qp = this.quickPresets.find(p => p.id === id);
    if (!qp) return;

    const today = new Date().toISOString().split('T')[0];

    // Special Mode: Mom Advance Payment (阿彤先墊錢)
    if (qp.mode === 'prompt-atong') {
      const dateInput = prompt('請確認/修改墊付日期 (格式：YYYY-MM-DD)：', today) || today;
      const note = prompt('請輸入阿彤先墊錢的物品說明 (例：腸病毒疫苗/嬰兒床)：', '阿彤代付開銷');
      if (!note) return;
      
      const inputAmtStr = prompt(`請輸入【阿彤先墊錢】的金額 (元)：`, '1000');
      if (!inputAmtStr) return;
      const amt = Number(inputAmtStr.trim());
      if (isNaN(amt) || amt <= 0) return alert('請輸入有效的金額！');

      const newTx = {
        id: 'tx-' + Date.now(),
        date: dateInput,
        type: '支出',
        sourceAccount: '💳 阿彤代付',
        targetAccount: '商家/用品店',
        category: '每月開銷',
        fund: '宣穆基金',
        amount: amt,
        note: `阿彤代付：${note}`
      };

      this.transactions.unshift(newTx);
      this.transactions.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.id || '').localeCompare(a.id || ''));
      this.render();
      this.saveState();
      alert(`已成功記錄 ${dateInput} 阿彤代付 $${amt.toLocaleString()} 元 (${note})！待還款金額已自動累積。`);
      return;
    }

    // Special Mode: Reimburse Mom (歸還阿彤代付款)
    if (qp.mode === 'prompt-reimburse') {
      const data = this.calculateBalances();
      const dueAmt = (data.atongStats.spent - data.atongStats.reimbursed);

      const dateInput = prompt('請確認/修改還款日期 (格式：YYYY-MM-DD)：', today) || today;
      const inputAmtStr = prompt(`請輸入【歸還阿彤代付款】金額 (目前阿彤待還款總額 $${dueAmt.toLocaleString()} 元)：`, dueAmt > 0 ? String(dueAmt) : '1000');
      if (!inputAmtStr) return;
      const amt = Number(inputAmtStr.trim());
      if (isNaN(amt) || amt <= 0) return alert('請輸入有效的金額！');

      const newTx = {
        id: 'tx-' + Date.now(),
        date: dateInput,
        type: '轉帳',
        sourceAccount: '永豐大戶 (DAWHO)',
        targetAccount: '💳 阿彤代付',
        category: '轉帳',
        fund: '宣穆基金',
        amount: amt,
        note: `歸還阿彤代付款 $${amt.toLocaleString()}`
      };

      this.transactions.unshift(newTx);
      this.transactions.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.id || '').localeCompare(a.id || ''));
      this.render();
      this.saveState();
      alert(`已成功記錄 ${dateInput} 歸還阿彤 $${amt.toLocaleString()} 元！阿彤待還款金額已自動歸零/扣減。`);
      return;
    }

    // Standard Prompt Mode
    if (qp.mode === 'prompt' || (qp.mode && qp.mode.startsWith('prompt'))) {
      const dateInput = prompt('請輸入/確認扣款日期 (格式：YYYY-MM-DD)：', today) || today;
      
      let defaultAmt = qp.amount || '';
      const inputAmtStr = prompt(`請輸入【${qp.name}】金額 (元)：`, defaultAmt ? String(defaultAmt) : '');
      if (!inputAmtStr) return;
      const amt = Number(inputAmtStr.trim());
      if (isNaN(amt) || amt <= 0) return alert('請輸入有效的金額！');

      const defaultNote = qp.note || qp.name || '明細紀錄';
      const note = prompt('請輸入說明備註：', defaultNote) || defaultNote;

      const newTx = {
        id: 'tx-' + Date.now(),
        date: dateInput,
        type: qp.type || '支出',
        sourceAccount: this.normalizeAccountName(qp.sourceAccount, qp.type === '收入'),
        targetAccount: this.normalizeAccountName(qp.targetAccount),
        category: qp.category || (qp.type === '收入' ? '單次津貼' : '每月開銷'),
        fund: qp.fund || '宣穆基金',
        amount: amt,
        note: note
      };

      this.transactions.unshift(newTx);
      this.transactions.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.id || '').localeCompare(a.id || ''));
      this.render();
      this.saveState();
      alert(`已成功記錄 ${dateInput} 【${qp.name}】 $${amt.toLocaleString()} 元 (${note})！`);
      return;
    }

    this.openAddModal();
    this.txDate.value = today;
    this.setModalTxType(qp.type || '支出');
    if (qp.amount) this.txAmount.value = qp.amount;
    this.txSourceAccount.value = this.normalizeAccountName(qp.sourceAccount, qp.type === '收入');
    this.txTargetAccount.value = this.normalizeAccountName(qp.targetAccount);
    this.txCategory.value = qp.category || '每月開銷';
    this.txFund.value = qp.fund || '宣穆基金';
    this.txNote.value = qp.note || qp.name;
  }

  openQuickPresetsModal() {
    this.renderQuickPresetsManageList();
    this.modalQuickPresets.classList.remove('hidden');
  }

  buildAccountOptionsHTML(selectedVal) {
    const normSel = this.normalizeAccountName(selectedVal);
    const opts = [
      { name: '💳 阿彤代付', val: '💳 阿彤代付' },
      { name: '共同小雞錢包', val: '共同小雞錢包' },
      { name: 'LINE 阿萌', val: 'LINE 阿萌' },
      { name: '永豐大戶 (DAWHO)', val: '永豐大戶 (DAWHO)' },
      { name: '郵局數位帳戶', val: '郵局數位帳戶' },
      { name: '郵局 (實體存簿)', val: '郵局 (實體存簿)' },
      { name: '育兒實體現金', val: '育兒實體現金' },
      { name: '商家/用品店', val: '商家/用品店' },
      { name: '家電/育兒設備店', val: '家電/育兒設備店' },
      { name: '政府補助/親友', val: '政府補助/親友' }
    ];

    return opts.map(o => `<option value="${o.val}" ${normSel === o.val ? 'selected' : ''}>${o.name}</option>`).join('');
  }

  renderQuickPresetsManageList() {
    const list = document.getElementById('quick-presets-manage-list');
    list.innerHTML = '';

    this.quickPresets.forEach((qp, idx) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3';
      itemEl.innerHTML = `
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-0.5">快捷按鈕名稱</label>
            <input type="text" data-qp-idx="${idx}" class="qp-input-name font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:border-amber-400 w-full" value="${qp.name}">
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-0.5">預設金額 (空白代表彈窗輸入)</label>
            <input type="number" data-qp-idx="${idx}" class="qp-input-amount font-black text-slate-900 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:border-amber-400 w-full" value="${qp.amount || ''}" placeholder="例: 15000 或留空">
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-0.5">收支類型</label>
            <select data-qp-idx="${idx}" class="qp-input-type font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs w-full">
              <option value="支出" ${qp.type === '支出' ? 'selected' : ''}>支出</option>
              <option value="收入" ${qp.type === '收入' ? 'selected' : ''}>收入</option>
              <option value="轉帳" ${qp.type === '轉帳' ? 'selected' : ''}>轉帳</option>
              <option value="投資" ${qp.type === '投資' ? 'selected' : ''}>投資</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-0.5">資金歸屬</label>
            <select data-qp-idx="${idx}" class="qp-input-fund font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs w-full">
              <option value="宣穆基金" ${qp.fund === '宣穆基金' ? 'selected' : ''}>宣穆基金 (營運)</option>
              <option value="宣穆戶頭" ${qp.fund === '宣穆戶頭' ? 'selected' : ''}>宣穆戶頭 (積蓄)</option>
              <option value="宣穆投資" ${qp.fund === '宣穆投資' ? 'selected' : ''}>宣穆投資</option>
              <option value="其他" ${qp.fund === '其他' ? 'selected' : ''}>其他</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-0.5">按鈕觸發模式</label>
            <select data-qp-idx="${idx}" class="qp-input-mode font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs w-full">
              <option value="prompt" ${qp.mode && qp.mode.startsWith('prompt') ? 'selected' : ''}>💬 彈窗問金額與日期</option>
              <option value="direct" ${!qp.mode || !qp.mode.startsWith('prompt') ? 'selected' : ''}>🎯 一鍵帶入表單</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-0.5">來源 / 扣款帳戶</label>
            <select data-qp-idx="${idx}" class="qp-input-src font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs w-full">
              ${this.buildAccountOptionsHTML(qp.sourceAccount)}
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-0.5">去向 / 存入帳戶</label>
            <select data-qp-idx="${idx}" class="qp-input-tgt font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs w-full">
              ${this.buildAccountOptionsHTML(qp.targetAccount)}
            </select>
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-500 mb-0.5">預設說明備註</label>
          <input type="text" data-qp-idx="${idx}" class="qp-input-note text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:border-amber-400 w-full" value="${qp.note || qp.name || ''}">
        </div>

        <div class="flex justify-end pt-1">
          <button onclick="app.deleteQuickPreset('${qp.id}')" class="text-rose-600 font-bold hover:underline text-[11px] flex items-center gap-1">
            <i class="fa-solid fa-trash-can"></i> 刪除此快捷按鈕
          </button>
        </div>
      `;
      list.appendChild(itemEl);
    });
  }

  addNewQuickPresetPrompt() {
    const name = prompt('請輸入新快捷按鈕名稱（例：育兒津貼 $5000、買奶粉 $1200）：');
    if (!name) return;

    const newQP = {
      id: 'qp-' + Date.now(),
      name,
      amount: undefined,
      type: '支出',
      sourceAccount: '共同小雞錢包',
      targetAccount: '商家/用品店',
      category: '每月開銷',
      fund: '宣穆基金',
      mode: 'prompt',
      note: name,
      icon: 'fa-bolt text-amber-500',
      border: 'border-amber-200 hover:border-amber-400'
    };

    this.quickPresets.push(newQP);
    this.renderQuickPresetsManageList();
  }

  deleteQuickPreset(id) {
    if (confirm('確定要刪除此快捷按鈕嗎？')) {
      this.quickPresets = this.quickPresets.filter(p => p.id !== id);
      this.renderQuickPresetsManageList();
    }
  }

  saveQuickPresetsFromModal() {
    const names = document.querySelectorAll('.qp-input-name');
    const amounts = document.querySelectorAll('.qp-input-amount');
    const types = document.querySelectorAll('.qp-input-type');
    const funds = document.querySelectorAll('.qp-input-fund');
    const modes = document.querySelectorAll('.qp-input-mode');
    const srcs = document.querySelectorAll('.qp-input-src');
    const tgts = document.querySelectorAll('.qp-input-tgt');
    const notes = document.querySelectorAll('.qp-input-note');

    names.forEach((input, i) => {
      const idx = input.getAttribute('data-qp-idx');
      if (this.quickPresets[idx]) {
        this.quickPresets[idx].name = input.value.trim() || '快捷按鈕';
        this.quickPresets[idx].amount = amounts[i]?.value ? Number(amounts[i].value) : undefined;
        this.quickPresets[idx].type = types[i]?.value || '支出';
        this.quickPresets[idx].fund = funds[i]?.value || '宣穆基金';
        this.quickPresets[idx].mode = modes[i]?.value || 'prompt';
        this.quickPresets[idx].sourceAccount = srcs[i]?.value || '共同小雞錢包';
        this.quickPresets[idx].targetAccount = tgts[i]?.value || '商家/用品店';
        this.quickPresets[idx].note = notes[i]?.value || input.value;
      }
    });

    this.render();
    this.saveState();
    alert('所有快捷按鈕設定（收支類型、來源去向帳戶、資金歸屬與彈窗模式）已成功儲存！');
    this.closeModal(this.modalQuickPresets);
  }

  renderBudgetTrackers(data) {
    const annualTotal = 360000;
    
    const spentFromFund = this.transactions
      .filter(tx => tx.fund === '宣穆基金' && tx.type === '支出' && !tx.sourceAccount.includes('錢包') && !tx.sourceAccount.includes('阿萌'))
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const remainingFund = data.xuanmuFund;
    const annualSpentPercent = Math.min(100, Math.round((spentFromFund / annualTotal) * 100));

    document.getElementById('annual-spent').textContent = `$${spentFromFund.toLocaleString()}`;
    document.getElementById('annual-remaining').textContent = `$${remainingFund.toLocaleString()}`;
    document.getElementById('annual-percent-text').textContent = `${annualSpentPercent}%`;
    document.getElementById('annual-progress-fill').style.width = `${annualSpentPercent}%`;

    const annualStatusBadge = document.getElementById('annual-status-badge');
    if (remainingFund >= 300000) {
      annualStatusBadge.className = 'text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200';
      annualStatusBadge.textContent = '預算極佳 (充裕)';
    } else {
      annualStatusBadge.className = 'text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200';
      annualStatusBadge.textContent = '平穩消耗中';
    }

    const currentMonthPrefix = '2026-08';
    
    const augustSpent = this.transactions
      .filter(tx => tx.fund === '宣穆基金' && tx.type === '支出' && tx.date.startsWith(currentMonthPrefix) && !tx.sourceAccount.includes('錢包') && !tx.sourceAccount.includes('阿萌'))
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const monthlyTarget = 30000;
    const augustRemaining = Math.max(0, monthlyTarget - augustSpent);
    const augustPercent = Math.min(100, Math.round((augustSpent / monthlyTarget) * 100));

    document.getElementById('monthly-spent').textContent = `$${augustSpent.toLocaleString()}`;
    document.getElementById('monthly-remaining').textContent = `$${augustRemaining.toLocaleString()}`;
    document.getElementById('monthly-percent-text').textContent = `${augustPercent}%`;
    document.getElementById('monthly-progress-fill').style.width = `${augustPercent}%`;

    const monthlyTip = document.getElementById('monthly-pace-tip').querySelector('span');
    monthlyTip.textContent = `8 月累積宣穆基金撥款與支出 $${augustSpent.toLocaleString()} 元，尚剩餘 $${augustRemaining.toLocaleString()} 元預算。點擊查看明細！`;
  }

  openBudgetBreakdownModal(mode) {
    const modal = document.getElementById('modal-budget-breakdown');
    const title = document.getElementById('budget-breakdown-title');
    const summary = document.getElementById('budget-breakdown-summary');
    const list = document.getElementById('budget-breakdown-list');

    list.innerHTML = '';

    let items = [];
    if (mode === 'monthly') {
      title.innerHTML = `<i class="fa-solid fa-calendar-day text-teal-600"></i> 2026/08 八月份宣穆基金撥款與支出明細`;
      
      items = this.transactions.filter(tx => 
        tx.fund === '宣穆基金' && 
        tx.type === '支出' && 
        tx.date.startsWith('2026-08') && 
        !tx.sourceAccount.includes('錢包') && 
        !tx.sourceAccount.includes('阿萌')
      );

      const total = items.reduce((sum, t) => sum + Number(t.amount), 0);
      summary.innerHTML = `八月累積基金撥款與支出：<span class="text-teal-700 font-black text-sm">$${total.toLocaleString()}</span> 元 (預算額度 $30,000 元，剩餘 $${Math.max(0, 30000 - total).toLocaleString()} 元)<div class="text-[11px] text-amber-800 mt-1">💡 小雞與阿萌錢包內的零星扣款已在撥款時一次扣算完畢，不在此重複累加！</div>`;
    } else {
      title.innerHTML = `<i class="fa-solid fa-shield-halved text-amber-500"></i> 萌爸 36 萬基金歷次開銷與撥款明細`;

      items = this.transactions.filter(tx => 
        tx.fund === '宣穆基金' && 
        tx.type === '支出' && 
        !tx.sourceAccount.includes('錢包') && 
        !tx.sourceAccount.includes('阿萌')
      );

      const total = items.reduce((sum, t) => sum + Number(t.amount), 0);
      summary.innerHTML = `萌爸基金歷次累積撥出：<span class="text-amber-700 font-black text-sm">$${total.toLocaleString()}</span> 元 (剩餘基金 $${(360000 - total).toLocaleString()} 元)`;
    }

    items.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.id || '').localeCompare(a.id || ''));

    if (items.length === 0) {
      list.innerHTML = `<div class="text-center py-6 text-slate-400">目前尚無支出紀錄</div>`;
    } else {
      items.forEach(tx => {
        const itemEl = document.createElement('div');
        itemEl.className = 'p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between';
        itemEl.innerHTML = `
          <div>
            <div class="font-extrabold text-slate-800">${tx.note || tx.category}</div>
            <div class="text-[11px] text-slate-500">${tx.date} ｜ ${tx.sourceAccount} ➔ ${tx.targetAccount}</div>
          </div>
          <div class="font-black text-rose-600 text-sm">
            -$${Number(tx.amount).toLocaleString()}
          </div>
        `;
        list.appendChild(itemEl);
      });
    }

    modal.classList.remove('hidden');
  }

  renderAccountsGrid(data) {
    const grid = document.getElementById('accounts-grid');
    grid.innerHTML = '';

    const balances = data.accountBalances;
    const walletStats = data.walletStats;
    const atongStats = data.atongStats;

    this.accounts.forEach(acc => {
      const normName = this.normalizeAccountName(acc.name);
      let amountStr = '';
      let amountLabel = '';
      let subInfo = '';

      if (normName === '💳 阿彤代付') {
        const dueAmt = atongStats.spent - atongStats.reimbursed;
        amountStr = `$${dueAmt.toLocaleString()}`;
        amountLabel = dueAmt > 0 ? '阿彤待歸還墊款 (點擊看明細/歸還)' : '代付款已清空 (無待還款)';
        subInfo = `阿彤累積墊付 $${atongStats.spent.toLocaleString()} ｜ 已歸還還款 $${atongStats.reimbursed.toLocaleString()}`;
      } else if (normName === '共同小雞錢包') {
        const stats = walletStats['共同小雞錢包'] || { topUp: 30000, spent: 6925 };
        const remaining = (stats.topUp - stats.spent);
        amountStr = `$${remaining.toLocaleString()}`;
        amountLabel = '錢包目前剩餘額度 (點擊看明細)';
        subInfo = `撥入總額 $${stats.topUp.toLocaleString()} ｜ 買用品花用 $${stats.spent.toLocaleString()}`;
      } else if (normName === 'LINE 阿萌') {
        const stats = walletStats['LINE 阿萌'] || { topUp: 20000, spent: 10321 };
        const remaining = (stats.topUp - stats.spent);
        amountStr = `$${remaining.toLocaleString()}`;
        amountLabel = '錢包目前剩餘額度 (點擊看明細)';
        subInfo = `撥入總額 $${stats.topUp.toLocaleString()} ｜ 買用品花用 $${stats.spent.toLocaleString()}`;
      } else if (normName === '育兒實體現金') {
        const cashBal = balances['育兒實體現金'] || 20000;
        amountStr = `$${cashBal.toLocaleString()}`;
        amountLabel = '手邊實體現金/紅包額度 (點擊看明細)';
        subInfo = '親友紅包與現金資助 (已扣除臍帶章 $4,800)';
      } else {
        amountStr = `$${(balances[normName] || 0).toLocaleString()}`;
        amountLabel = '現存存款 (點擊看收支明細)';
        subInfo = acc.note || '';
      }

      const cardEl = document.createElement('div');
      cardEl.className = 'account-card-box cursor-pointer hover:border-amber-400 hover:shadow-lg transition-all transform hover:-translate-y-0.5 group';
      cardEl.onclick = () => this.openAccountDetailsModal(acc.name);
      
      const badgeStyle = normName === '💳 阿彤代付' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                         (normName.includes('錢包') || normName.includes('阿萌') ? 'bg-rose-100 text-rose-800 border-rose-200' : 
                         (normName.includes('現金') ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'));

      const amountColorClass = normName === '💳 阿彤代付' ? 'text-purple-600' :
                                (normName.includes('錢包') || normName.includes('阿萌') ? 'text-rose-600' : 
                                (normName.includes('現金') ? 'text-amber-600' : 'text-slate-800'));

      cardEl.innerHTML = `
        <div>
          <div class="flex items-center justify-between text-xs mb-2 gap-2">
            <span class="font-extrabold text-slate-800 flex items-center gap-2 truncate group-hover:text-amber-700 transition-colors">
              <i class="fa-solid ${acc.icon} text-base shrink-0"></i> 
              <span class="truncate">${acc.name}</span>
            </span>
            <span class="text-[10px] px-2.5 py-0.5 rounded-full ${badgeStyle} font-bold border shrink-0">
              ${acc.badge || '存款帳戶'}
            </span>
          </div>
          <div class="mt-1">
            <div class="text-2xl font-black ${amountColorClass}">${amountStr}</div>
            <div class="text-[10px] text-amber-700 font-bold mt-0.5 flex items-center justify-between">
              <span>${amountLabel}</span>
              <span class="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold group-hover:bg-amber-500 group-hover:text-white transition-colors">點擊查看 ➔</span>
            </div>
          </div>
        </div>
        <div class="text-[11px] text-slate-500 mt-3 font-medium leading-relaxed break-words">
          ${subInfo}
        </div>
      `;
      grid.appendChild(cardEl);
    });
  }

  openAccountDetailsModal(rawAccName) {
    const normName = this.normalizeAccountName(rawAccName);
    const acc = this.accounts.find(a => this.normalizeAccountName(a.name) === normName) || { name: normName, icon: 'fa-wallet' };

    const modal = document.getElementById('modal-account-details');
    const title = document.getElementById('account-details-title');
    const balEl = document.getElementById('account-details-balance');
    const inEl = document.getElementById('account-details-inflow');
    const outEl = document.getElementById('account-details-outflow');
    const countEl = document.getElementById('account-details-count');
    const list = document.getElementById('account-details-list');

    title.innerHTML = `<i class="fa-solid ${acc.icon || 'fa-wallet'} text-amber-500"></i> ${normName} - 收支與交易明細`;

    const txs = this.transactions
      .filter(t => {
        const src = this.normalizeAccountName(t.sourceAccount, t.type === '收入');
        const tgt = this.normalizeAccountName(t.targetAccount);
        return src === normName || tgt === normName;
      })
      .sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.id || '').localeCompare(a.id || ''));

    let totalIn = 0;
    let totalOut = 0;

    list.innerHTML = '';

    if (txs.length === 0) {
      list.innerHTML = `<div class="text-center py-8 text-slate-400 text-xs">此帳戶目前尚無相關交易紀錄</div>`;
    } else {
      txs.forEach(t => {
        const src = this.normalizeAccountName(t.sourceAccount, t.type === '收入');
        const tgt = this.normalizeAccountName(t.targetAccount);
        const amt = Number(t.amount) || 0;

        let flowDir = '';
        let colorClass = '';
        let isPositive = false;

        if (t.type === '收入') {
          isPositive = true;
          totalIn += amt;
          flowDir = `存入 / 轉入 (來源: ${src === tgt ? '政府補助/親友' : src})`;
          colorClass = 'text-emerald-600';
        } else if (tgt === normName && src !== normName) {
          isPositive = true;
          totalIn += amt;
          flowDir = `存入 / 轉入 (來源: ${src})`;
          colorClass = 'text-emerald-600';
        } else {
          totalOut += amt;
          flowDir = `支出 / 轉出 (去向: ${tgt})`;
          colorClass = 'text-rose-600';
        }

        const item = document.createElement('div');
        item.className = 'p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between hover:bg-amber-50/60 transition-colors';
        item.innerHTML = `
          <div class="space-y-0.5">
            <div class="font-extrabold text-slate-800 text-xs flex items-center gap-2">
              <span>${t.note || t.category}</span>
              <span class="text-[10px] px-2 py-0.2 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} font-bold">${t.type}</span>
            </div>
            <div class="text-[11px] text-slate-500">${t.date} ｜ ${flowDir}</div>
          </div>
          <div class="text-right">
            <div class="font-black text-sm ${colorClass}">
              ${isPositive ? '+' : '-'}$${amt.toLocaleString()}
            </div>
            <button onclick="app.editTransaction('${t.id}'); app.closeModal(document.getElementById('modal-account-details'))" class="text-[10px] text-amber-600 font-bold hover:underline">
              <i class="fa-solid fa-pen"></i> 編輯
            </button>
          </div>
        `;
        list.appendChild(item);
      });
    }

    let netBal = totalIn - totalOut;
    const data = this.calculateBalances();

    if (normName === '💳 阿彤代付') {
      const due = data.atongStats.spent - data.atongStats.reimbursed;
      balEl.textContent = `$${due.toLocaleString()}`;
    } else if (normName === '共同小雞錢包' || normName === 'LINE 阿萌') {
      balEl.textContent = `$${Math.max(0, netBal).toLocaleString()}`;
    } else {
      balEl.textContent = `$${(data.accountBalances[normName] || netBal).toLocaleString()}`;
    }

    inEl.textContent = `+$${totalIn.toLocaleString()}`;
    outEl.textContent = `-$${totalOut.toLocaleString()}`;
    countEl.textContent = txs.length;

    document.getElementById('btn-filter-main-table').onclick = () => {
      this.searchKeyword.value = normName;
      this.renderTransactionsTable();
      this.closeModal(modal);
      document.getElementById('transactions-section').scrollIntoView({ behavior: 'smooth' });
    };

    modal.classList.remove('hidden');
  }

  openOverviewFundDetailsModal(fundType) {
    const modal = document.getElementById('modal-account-details');
    const title = document.getElementById('account-details-title');
    const balEl = document.getElementById('account-details-balance');
    const inEl = document.getElementById('account-details-inflow');
    const outEl = document.getElementById('account-details-outflow');
    const countEl = document.getElementById('account-details-count');
    const list = document.getElementById('account-details-list');

    const data = this.calculateBalances();
    let filteredTxs = [];
    let displayTitle = '';
    let iconClass = 'fa-wallet';

    if (fundType === 'total') {
      displayTitle = '育兒總資金 (TOTAL) - 跨帳戶收支與交易紀錄';
      iconClass = 'fa-coins text-amber-500';
      filteredTxs = [...this.transactions];
      balEl.textContent = `$${data.totalAssets.toLocaleString()}`;
    } else if (fundType === '宣穆戶頭') {
      displayTitle = '宣穆戶頭 (積蓄) - 生育給付與津貼明細';
      iconClass = 'fa-piggy-bank text-emerald-500';
      filteredTxs = this.transactions.filter(t => t.fund === '宣穆戶頭');
      balEl.textContent = `$${data.xuanmuAccount.toLocaleString()}`;
    } else if (fundType === '宣穆投資') {
      displayTitle = '宣穆投資與其他 - 萌媽資助與投資明細';
      iconClass = 'fa-chart-line text-purple-500';
      filteredTxs = this.transactions.filter(t => t.fund === '宣穆投資' || t.fund === '其他');
      balEl.textContent = `$${(data.xuanmuInvest + data.otherFund).toLocaleString()}`;
    }

    title.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${displayTitle}`;

    filteredTxs.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.id || '').localeCompare(a.id || ''));

    let totalIn = 0;
    let totalOut = 0;
    list.innerHTML = '';

    if (filteredTxs.length === 0) {
      list.innerHTML = `<div class="text-center py-8 text-slate-400 text-xs">目前尚無相關交易紀錄</div>`;
    } else {
      filteredTxs.forEach(t => {
        const src = this.normalizeAccountName(t.sourceAccount, t.type === '收入');
        const tgt = this.normalizeAccountName(t.targetAccount);
        const amt = Number(t.amount) || 0;

        let flowDir = '';
        let colorClass = '';
        let isPositive = false;

        if (t.type === '收入') {
          isPositive = true;
          totalIn += amt;
          flowDir = `存入 / 轉入 (來源: ${src === tgt ? '政府補助/親友' : src})`;
          colorClass = 'text-emerald-600';
        } else {
          totalOut += amt;
          flowDir = `支出 / 轉出 (去向: ${tgt})`;
          colorClass = 'text-rose-600';
        }

        const item = document.createElement('div');
        item.className = 'p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between hover:bg-amber-50/60 transition-colors';
        item.innerHTML = `
          <div class="space-y-0.5">
            <div class="font-extrabold text-slate-800 text-xs flex items-center gap-2">
              <span>${t.note || t.category}</span>
              <span class="text-[10px] px-2 py-0.2 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} font-bold">${t.type}</span>
            </div>
            <div class="text-[11px] text-slate-500">${t.date} ｜ ${flowDir}</div>
          </div>
          <div class="text-right">
            <div class="font-black text-sm ${colorClass}">
              ${isPositive ? '+' : '-'}$${amt.toLocaleString()}
            </div>
            <button onclick="app.editTransaction('${t.id}'); app.closeModal(document.getElementById('modal-account-details'))" class="text-[10px] text-amber-600 font-bold hover:underline">
              <i class="fa-solid fa-pen"></i> 編輯
            </button>
          </div>
        `;
        list.appendChild(item);
      });
    }

    inEl.textContent = `+$${totalIn.toLocaleString()}`;
    outEl.textContent = `-$${totalOut.toLocaleString()}`;
    countEl.textContent = filteredTxs.length;

    document.getElementById('btn-filter-main-table').onclick = () => {
      this.searchKeyword.value = fundType === 'total' ? '' : fundType;
      this.renderTransactionsTable();
      this.closeModal(modal);
      document.getElementById('transactions-section').scrollIntoView({ behavior: 'smooth' });
    };

    modal.classList.remove('hidden');
  }

  renderCharts(data) {
    try {
      const pieCanvas = document.getElementById('chart-fund-pie');
      const barCanvas = document.getElementById('chart-account-bar');
      if (!pieCanvas || !barCanvas || typeof Chart === 'undefined') return;

      const ctxPie = pieCanvas.getContext('2d');
      if (this.pieChart) this.pieChart.destroy();

      this.pieChart = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
          labels: ['宣穆戶頭 (積蓄)', '宣穆基金 (營運)', '宣穆投資/其他'],
          datasets: [{
            data: [data.xuanmuAccount, data.xuanmuFund, data.xuanmuInvest + data.otherFund],
            backgroundColor: ['#10B981', '#14B8A6', '#805AD5'],
            borderColor: '#FFFFFF',
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#4A5568', font: { size: 11, weight: 'bold' } } }
          },
          cutout: '68%'
        }
      });

      const ctxBar = barCanvas.getContext('2d');
      if (this.barChart) this.barChart.destroy();

      const postPhys = data.accountBalances['郵局 (實體存簿)'] || 130000;
      const postDigi = data.accountBalances['郵局數位帳戶'] || 170000;
      const sinoPac = data.accountBalances['永豐大戶 (DAWHO)'] || 137867;
      const cashBal = data.accountBalances['育兒實體現金'] || 20000;

      this.barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: ['郵局實體存簿', '郵局數位帳戶', '永豐大戶 (DAWHO)', '育兒實體現金'],
          datasets: [{
            label: '現存資產 (NT$)',
            data: [postPhys, postDigi, sinoPac, cashBal],
            backgroundColor: ['#10B981', '#06B6D4', '#14B8A6', '#F59E0B'],
            borderRadius: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#4A5568', font: { size: 11, weight: 'bold' } }, grid: { display: false } },
            y: { ticks: { color: '#A0AEC0', font: { size: 10 } }, grid: { color: '#EDF2F7' } }
          }
        }
      });
    } catch (e) {
      console.error('Chart rendering error:', e);
    }
  }

  renderTransactionsTable() {
    const tbody = document.getElementById('transaction-tbody');
    tbody.innerHTML = '';

    const fundFilter = this.filterFund.value;
    const typeFilter = this.filterType.value;
    const keyword = this.searchKeyword.value.trim().toLowerCase();

    const filtered = this.transactions
      .filter(tx => {
        if (fundFilter !== 'all' && tx.fund !== fundFilter) return false;
        if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
        if (keyword) {
          const matchNote = (tx.note || '').toLowerCase().includes(keyword);
          const matchCat = (tx.category || '').toLowerCase().includes(keyword);
          const matchSrc = (tx.sourceAccount || '').toLowerCase().includes(keyword);
          const matchTgt = (tx.targetAccount || '').toLowerCase().includes(keyword);
          if (!matchNote && !matchCat && !matchSrc && !matchTgt) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dateDiff = (b.date || '').localeCompare(a.date || '');
        if (dateDiff !== 0) return dateDiff;
        return (b.id || '').localeCompare(a.id || '');
      });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-8 text-slate-400">
            <i class="fa-solid fa-folder-open text-2xl mb-2 block"></i>
            無符合條件的交易紀錄
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(tx => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-amber-50/60 transition-colors group';

      let typeBadge = '';
      let amountColor = '';
      if (tx.type === '收入') {
        typeBadge = '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">收入</span>';
        amountColor = 'text-emerald-600 font-black';
      } else if (tx.type === '支出') {
        typeBadge = '<span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[11px]">支出</span>';
        amountColor = 'text-rose-600 font-black';
      } else if (tx.type === '轉帳') {
        typeBadge = '<span class="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-extrabold text-[11px]">轉帳</span>';
        amountColor = 'text-teal-600 font-black';
      } else {
        typeBadge = '<span class="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold text-[11px]">投資</span>';
        amountColor = 'text-purple-600 font-black';
      }

      let fundTag = '';
      if (tx.fund === '宣穆戶頭') {
        fundTag = '<span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">宣穆戶頭</span>';
      } else if (tx.fund === '宣穆基金') {
        fundTag = '<span class="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 text-[11px] font-bold">宣穆基金</span>';
      } else if (tx.fund === '宣穆投資') {
        fundTag = '<span class="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold">宣穆投資</span>';
      } else {
        fundTag = '<span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">其他</span>';
      }

      const srcName = this.normalizeAccountName(tx.sourceAccount, tx.type === '收入');
      const tgtName = this.normalizeAccountName(tx.targetAccount);
      const flowText = `${srcName} ➔ ${tgtName}`;

      tr.innerHTML = `
        <td class="py-3 px-3 text-slate-700 font-bold whitespace-nowrap">${tx.date}</td>
        <td class="py-3 px-3">${typeBadge}</td>
        <td class="py-3 px-3 text-slate-800 font-bold">${flowText}</td>
        <td class="py-3 px-3 text-slate-600">${tx.category}</td>
        <td class="py-3 px-3">${fundTag}</td>
        <td class="py-3 px-3 text-right ${amountColor}">$${Number(tx.amount).toLocaleString()}</td>
        <td class="py-3 px-3 text-slate-600 max-w-[160px] truncate" title="${tx.note}">${tx.note || '-'}</td>
        <td class="py-3 px-3 text-center whitespace-nowrap">
          <button onclick="app.editTransaction('${tx.id}')" class="text-slate-400 hover:text-amber-600 p-1 mr-1">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button onclick="app.deleteTransaction('${tx.id}')" class="text-slate-400 hover:text-rose-600 p-1">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderRulesAccountList(data) {
    const list = document.getElementById('rules-accounts-list');
    list.innerHTML = '';

    const titleInput = document.getElementById('rule-app-title');
    if (titleInput) titleInput.value = this.appTitle;

    this.accounts.forEach((acc, idx) => {
      const el = document.createElement('div');
      el.className = 'p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2';
      el.innerHTML = `
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[10px] font-bold text-slate-400">帳戶名稱</label>
            <input type="text" data-acc-idx="${idx}" class="acc-input-name font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:border-amber-400 w-full" value="${acc.name}">
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400">帳戶標籤 (可填自訂標籤)</label>
            <input type="text" data-acc-idx="${idx}" class="acc-input-badge font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:border-amber-400 w-full" value="${acc.badge || ''}">
          </div>
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-400">詳細說明備註</label>
          <input type="text" data-acc-idx="${idx}" class="acc-input-note text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:border-amber-400 w-full" value="${acc.note || ''}" placeholder="自訂說明備註...">
        </div>
      `;
      list.appendChild(el);
    });
  }

  saveRulesAndTextDescriptions() {
    const titleInput = document.getElementById('rule-app-title');
    if (titleInput && titleInput.value.trim()) {
      this.appTitle = titleInput.value.trim();
    }

    document.querySelectorAll('.acc-input-name').forEach(input => {
      const idx = input.getAttribute('data-acc-idx');
      if (this.accounts[idx]) this.accounts[idx].name = input.value;
    });

    document.querySelectorAll('.acc-input-badge').forEach(input => {
      const idx = input.getAttribute('data-acc-idx');
      if (this.accounts[idx]) this.accounts[idx].badge = input.value;
    });

    document.querySelectorAll('.acc-input-note').forEach(input => {
      const idx = input.getAttribute('data-acc-idx');
      if (this.accounts[idx]) this.accounts[idx].note = input.value;
    });

    this.render();
    this.saveState();
    alert('系統大標題與說明文字已成功修改並儲存！');
    this.closeModal(this.modalRules);
  }

  updateFormAccountDropdowns() {
    const srcSelect = this.txSourceAccount;
    const tgtSelect = this.txTargetAccount;

    const opts = `
      <option value="💳 阿彤代付">💳 阿彤代付 (先拿阿彤的錢墊付)</option>
      <option value="共同小雞錢包">共同小雞錢包</option>
      <option value="LINE 阿萌">LINE 阿萌</option>
      <option value="永豐大戶 (DAWHO)">永豐大戶 (DAWHO)</option>
      <option value="郵局數位帳戶">郵局數位帳戶</option>
      <option value="郵局 (實體存簿)">郵局 (實體存簿)</option>
      <option value="育兒實體現金">育兒實體現金 (手邊現金/紅包)</option>
      <option value="商家/用品店">商家 / 用品店 / 外送</option>
      <option value="家電/育兒設備店">家電 / 育兒設備店</option>
      <option value="政府補助/親友">政府補助 / 親友紅包</option>
    `;

    srcSelect.innerHTML = opts;
    tgtSelect.innerHTML = opts;

    srcSelect.onchange = () => this.autoInferFormDefaults();
  }

  autoInferFormDefaults() {
    const type = this.currentTxType;
    const src = this.normalizeAccountName(this.txSourceAccount.value, type === '收入');

    if (type === '支出') {
      this.txTargetAccount.value = '商家/用品店';
      this.txFund.value = '宣穆基金';
      if (!this.txCategory.value || this.txCategory.value === '轉帳') {
        this.txCategory.value = '每月開銷';
      }
    } else if (type === '收入') {
      if (src === '政府補助/親友' || src.includes('補助')) {
        this.txTargetAccount.value = '郵局 (實體存簿)';
        this.txFund.value = '宣穆戶頭';
        this.txCategory.value = '固定收入';
      } else if (src.includes('萌媽')) {
        this.txTargetAccount.value = '育兒實體現金';
        this.txFund.value = '其他';
        this.txCategory.value = '萌媽';
      } else {
        this.txTargetAccount.value = '育兒實體現金';
        this.txFund.value = '宣穆戶頭';
        this.txCategory.value = '單次津貼';
      }
    } else if (type === '轉帳') {
      if (src === '永豐大戶 (DAWHO)') {
        this.txTargetAccount.value = '共同小雞錢包';
        this.txCategory.value = '轉帳';
        this.txFund.value = '宣穆基金';
      } else if (src === '郵局數位帳戶') {
        this.txTargetAccount.value = 'LINE 阿萌';
        this.txCategory.value = '轉帳';
        this.txFund.value = '宣穆基金';
      }
    }
  }

  setModalTxType(type) {
    this.currentTxType = type;
    document.querySelectorAll('.tx-type-btn').forEach(btn => {
      const btnType = btn.getAttribute('data-type');
      btn.className = 'tx-type-btn py-2.5 rounded-xl font-extrabold transition-all flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900 border border-transparent';
      if (btnType === type) {
        if (type === '支出') btn.className = 'tx-type-btn py-2.5 rounded-xl font-extrabold transition-all flex items-center justify-center gap-1.5 active-expense bg-white text-rose-700 shadow-sm border border-rose-200';
        else if (type === '收入') btn.className = 'tx-type-btn py-2.5 rounded-xl font-extrabold transition-all flex items-center justify-center gap-1.5 active-income bg-white text-emerald-700 shadow-sm border border-emerald-200';
        else if (type === '轉帳') btn.className = 'tx-type-btn py-2.5 rounded-xl font-extrabold transition-all flex items-center justify-center gap-1.5 active-transfer bg-white text-teal-700 shadow-sm border border-teal-200';
      }
    });

    const lblSrc = document.getElementById('lbl-source-account');
    const lblTgt = document.getElementById('lbl-target-account');
    if (type === '收入') {
      lblSrc.textContent = '收入來源管道 (例: 親友紅包/政府補助/萌媽資助)';
      lblTgt.textContent = '存入資產帳戶 (例: 郵局存簿/育兒實體現金)';
    } else if (type === '支出') {
      lblSrc.textContent = '誰出的錢 / 付款管道（系統自動設定分類）';
      lblTgt.textContent = '受款對象/開銷店家 (例: 商家/用品店)';
    } else {
      lblSrc.textContent = '轉出/撥款帳戶 (例: 永豐大戶/郵局數位)';
      lblTgt.textContent = '轉入/接收帳戶 (例: 💳阿彤代付/小雞錢包)';
    }

    this.autoInferFormDefaults();
  }

  openAddModal() {
    this.txId.value = '';
    this.formTx.reset();
    const today = new Date().toISOString().split('T')[0];
    this.txDate.value = today;
    this.setModalTxType('支出');
    document.getElementById('modal-tx-title').innerHTML = `<i class="fa-solid fa-pen-to-square text-amber-500"></i> 新增記帳交易`;
    this.modalTx.classList.remove('hidden');
  }

  editTransaction(id) {
    const tx = this.transactions.find(t => t.id === id);
    if (!tx) return;

    this.txId.value = tx.id;
    this.txDate.value = tx.date;
    this.txAmount.value = tx.amount;
    this.txSourceAccount.value = this.normalizeAccountName(tx.sourceAccount, tx.type === '收入');
    this.txTargetAccount.value = this.normalizeAccountName(tx.targetAccount);
    this.txCategory.value = tx.category;
    this.txFund.value = tx.fund;
    this.txNote.value = tx.note || '';

    this.setModalTxType(tx.type);
    document.getElementById('modal-tx-title').innerHTML = `<i class="fa-solid fa-pen-to-square text-amber-500"></i> 編輯記帳交易`;
    this.modalTx.classList.remove('hidden');
  }

  deleteTransaction(id) {
    if (confirm('確定要刪除此筆交易紀錄嗎？刪除後將永久生效並同步所有裝置。')) {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.render();
      this.saveState();
    }
  }

  handleSaveTransaction(e) {
    e.preventDefault();

    const id = this.txId.value || 'tx-' + Date.now();
    let src = this.normalizeAccountName(this.txSourceAccount.value, this.currentTxType === '收入');
    let tgt = this.normalizeAccountName(this.txTargetAccount.value);

    if (this.currentTxType === '支出' && src === '育兒實體現金' && tgt === '育兒實體現金') {
      tgt = '商家/用品店';
    }

    if (this.currentTxType === '支出' && (src === '共同小雞錢包' || src === 'LINE 阿萌') && (tgt === src || tgt === '共同小雞錢包' || tgt === 'LINE 阿萌')) {
      tgt = '商家/用品店';
    }

    const record = {
      id,
      date: this.txDate.value,
      type: this.currentTxType,
      sourceAccount: src,
      targetAccount: tgt,
      category: this.txCategory.value,
      fund: this.txFund.value,
      amount: Number(this.txAmount.value),
      note: this.txNote.value
    };

    const idx = this.transactions.findIndex(t => t.id === id);
    if (idx >= 0) {
      this.transactions[idx] = record;
    } else {
      this.transactions.unshift(record);
    }

    this.closeModal(this.modalTx);
    this.render();
    this.saveState();
  }

  promptAddAccount() {
    const name = prompt('請輸入新帳戶名稱（例：LINE Bank 友感帳戶、國泰世華）：');
    if (!name) return;
    const badge = prompt('請輸入帳戶標籤（例：數位帳戶、信用卡）：', '存款帳戶') || '存款帳戶';
    const note = prompt('請輸入帳戶說明備註：', '') || '';

    const newAcc = {
      id: 'acc-' + Date.now(),
      name,
      group: '存款帳戶',
      icon: 'fa-wallet text-amber-500',
      badge,
      note
    };

    this.accounts.push(newAcc);
    this.render();
    this.saveState();
  }

  toggleSubsidyRule(rule) {
    this.subsidyRule = rule;
    alert(`已成功將預設主力補助切換為：${rule === 'daycare' ? '托嬰補助 ($13,000)' : '育兒津貼 ($5,000)'}`);
    this.render();
    this.saveState();
  }

  openCloudSyncModal() {
    document.getElementById('input-sync-room-key').value = this.syncRoomKey;
    this.modalCloudSync.classList.remove('hidden');
  }

  applySyncRoomKey() {
    const key = document.getElementById('input-sync-room-key').value.trim();
    if (!key) return;
    this.syncRoomKey = key;
    localStorage.setItem('xm_sync_room', key);
    this.pullFromCloud();
    alert('已成功套用雲端同步代碼！雙方裝置輸入相同代碼即可實時自動連線。');
    this.closeModal(this.modalCloudSync);
  }

  copyOutdoorSyncLink() {
    const link = `https://ff7963dbb3a97e.lhr.life?sync=${encodeURIComponent(this.syncRoomKey)}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('已複製全球戶外 4G/5G 連線網址！請將網址傳送到 LINE，在手機點開即可隨時連線！');
    }).catch(() => {
      prompt('請複製以下戶外連線網址：', link);
    });
  }

  openRulesModal() { this.modalRules.classList.remove('hidden'); }
  closeModal(modal) { modal.classList.add('hidden'); }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new XuanMuFinanceApp();
});
