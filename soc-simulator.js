/**
 * NEXORA CYBER - SOC Threat Defense Simulator & Telemetry Engine
 * Interactive attack simulation and real-time defense log feed
 */

(function () {
  'use strict';

  const logFeed = document.getElementById('socLogFeed');
  const attackButtons = document.querySelectorAll('.attack-pill-btn');
  const threatScoreVal = document.getElementById('socRiskMetric');
  const packetsSecVal = document.getElementById('socThroughputMetric');
  const shieldStatusTxt = document.getElementById('shieldStatusTxt');

  if (!logFeed) return;

  const attackScenarios = {
    ddos: {
      name: 'DDoS SYN Flood (1.4 Tbps)',
      risk: 'CRITICAL',
      throughput: '1,420,890 pkt/s',
      status: 'SCRUBBING ACTIVE',
      logs: [
        { type: 'SCRUBBED', msg: 'Volumetric SYN flood anomaly detected from 18,420 spoofed IPs' },
        { type: 'BLOCKED', msg: 'BGP Anycast routing redirected flood to Tier-1 Scrubbing Center #04' },
        { type: 'SCRUBBED', msg: 'Rate-limiting & cryptographic SYN cookies enforced [1.42 Tbps mitigated]' },
        { type: 'SAFE', msg: 'Legitimate enterprise traffic latency unaffected (0.38ms average)' }
      ]
    },
    sqli: {
      name: 'SQL Injection Probe',
      risk: 'HIGH',
      throughput: '42,100 pkt/s',
      status: 'PAYLOAD NEUTRALIZED',
      logs: [
        { type: 'BLOCKED', msg: 'Heuristic WAF intercepted UNION SELECT / schema extraction payload' },
        { type: 'BLOCKED', msg: 'Attacking host IP [185.220.101.5] quarantined to global blocklist' },
        { type: 'SCRUBBED', msg: 'Parametric query validation strictly enforced across API gateways' },
        { type: 'SAFE', msg: 'Database layer intact. Zero unauthorized data exfiltration recorded' }
      ]
    },
    api: {
      name: 'Zero-Day API Auth Bypass',
      risk: 'ELEVATED',
      throughput: '68,400 pkt/s',
      status: 'TOKEN INVALIDATED',
      logs: [
        { type: 'BLOCKED', msg: 'JWT signature forgery attempt detected on /v2/auth/session' },
        { type: 'BLOCKED', msg: 'Cryptographic challenge failed: Rogue asymmetric public key rejected' },
        { type: 'SCRUBBED', msg: 'Session rotated and rate-limit throttle applied on tenant route' },
        { type: 'SAFE', msg: 'Zero-trust perimeter integrity verified. All endpoints authenticated' }
      ]
    },
    ransomware: {
      name: 'Lateral Movement Probe',
      risk: 'HIGH',
      throughput: '14,200 pkt/s',
      status: 'HOST ISOLATED',
      logs: [
        { type: 'BLOCKED', msg: 'Unusual SMBv3 / RPC port scan detected across internal subnet 10.4.0.0/24' },
        { type: 'BLOCKED', msg: 'Micro-segmentation firewall isolated rogue endpoint in 12ms' },
        { type: 'SCRUBBED', msg: 'Credential dumping attempt (LSASS) intercepted and terminated' },
        { type: 'SAFE', msg: 'Enterprise file servers protected. Threat containment verified' }
      ]
    }
  };

  function getCurrentTime() {
    const now = new Date();
    return now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
  }

  function addLog(type, message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';

    let badgeClass = 'type-safe';
    if (type === 'BLOCKED') badgeClass = 'type-blocked';
    else if (type === 'SCRUBBED') badgeClass = 'type-scrubbed';

    entry.innerHTML = `
      <span class="log-time">${getCurrentTime()}</span>
      <span class="log-type ${badgeClass}">[${type}]</span>
      <span class="log-msg">${escapeHtml(message)}</span>
    `;

    logFeed.appendChild(entry);

    // Keep max 25 logs to prevent memory creep
    while (logFeed.children.length > 25) {
      logFeed.removeChild(logFeed.firstChild);
    }

    logFeed.scrollTop = logFeed.scrollHeight;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function triggerScenario(key) {
    const scenario = attackScenarios[key];
    if (!scenario) return;

    if (threatScoreVal) threatScoreVal.textContent = scenario.risk;
    if (packetsSecVal) packetsSecVal.textContent = scenario.throughput;
    if (shieldStatusTxt) shieldStatusTxt.textContent = scenario.status;

    // Stream logs with slight realistic delay
    scenario.logs.forEach((item, index) => {
      setTimeout(() => {
        addLog(item.type, item.msg);
      }, index * 400);
    });
  }

  // Attack button listeners
  attackButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      attackButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const attackKey = this.getAttribute('data-attack');
      triggerScenario(attackKey);
    });
  });

  // Populate initial telemetry logs
  addLog('SAFE', 'Nexora Autonomous Threat Matrix initialized and synchronized');
  addLog('SAFE', 'TLS 1.3 Strict Mutual-Auth verified on all edge clusters');
  addLog('SCRUBBED', 'Scrubbed 4,210 low-grade scanning probes across global nodes');
  addLog('SAFE', 'Real-time telemetry status: 100% operational');

  // Ambient telemetry feed (adds a low-priority safe/scrub log every 7 seconds)
  const ambientLogs = [
    { type: 'SAFE', msg: 'Global heuristic anomaly index: Low (0.02% variance)' },
    { type: 'SCRUBBED', msg: 'Automated crawler signature filtered from edge cache' },
    { type: 'SAFE', msg: 'Zero-Trust access policies re-evaluated for 1,480 active sessions' },
    { type: 'BLOCKED', msg: 'Shodan scanning probe rejected by border ACL' },
    { type: 'SAFE', msg: 'DNSSEC integrity audit completed successfully' }
  ];

  let ambientIdx = 0;
  setInterval(() => {
    // Only run if document is visible
    if (!document.hidden) {
      const item = ambientLogs[ambientIdx % ambientLogs.length];
      ambientIdx++;
      addLog(item.type, item.msg);
    }
  }, 7000);

})();
