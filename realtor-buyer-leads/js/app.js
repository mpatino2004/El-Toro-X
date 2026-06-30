(function () {
  const config = window.REALTOR_CONFIG || {};
  const LEADS_KEY = 'realtor_buyer_leads';

  function applyConfig() {
    const cityLabel = config.city ? `${config.city} buyers` : 'local buyers';
    setText('hero-eyebrow', `Serving ${cityLabel}`);
    setText('header-logo', config.name || 'Your Name');
    setText('footer-name', config.name || 'Your Name');
    setText('footer-name-copy', config.name || 'Your Name');
    setText('footer-brokerage', config.brokerage || '');
    setText('footer-license', config.licenseNumber || '');

    const phoneEl = document.getElementById('footer-phone');
    if (phoneEl && config.phone) {
      phoneEl.textContent = config.phone;
      phoneEl.href = 'tel:' + config.phone.replace(/\D/g, '');
    }

    const emailEl = document.getElementById('footer-email');
    if (emailEl && config.email) {
      emailEl.textContent = config.email;
      emailEl.href = 'mailto:' + config.email;
    }

    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const statsEl = document.getElementById('hero-stats');
    if (statsEl && config.stats) {
      statsEl.innerHTML = [
        { value: config.stats.buyersHelped, label: 'Buyers helped' },
        { value: config.stats.yearsExperience, label: 'Years experience' },
        { value: config.stats.avgDaysToClose, label: 'Avg. days to close' }
      ].map(function (s) {
        return '<div class="stat-item"><span class="stat-value">' + s.value + '</span><span class="stat-label">' + s.label + '</span></div>';
      }).join('');
    }

    const trustEl = document.getElementById('trust-grid');
    if (trustEl) {
      const areas = (config.serviceAreas || []).slice(0, 4).join(' · ') || 'Your area';
      trustEl.innerHTML = [
        { strong: config.city || 'Local', text: 'Market specialist' },
        { strong: 'First-time buyers', text: 'My focus' },
        { strong: areas, text: 'Areas served' },
        { strong: 'Free consultation', text: 'No obligation' }
      ].map(function (t) {
        return '<div class="trust-item"><strong>' + t.strong + '</strong>' + t.text + '</div>';
      }).join('');
    }

    const datalist = document.getElementById('area-suggestions');
    if (datalist && config.serviceAreas) {
      datalist.innerHTML = config.serviceAreas.map(function (a) {
        return '<option value="' + a + '">';
      }).join('');
    }

    if (config.city) {
      document.title = 'First-Time Home Buyer Specialist in ' + config.city + ' | ' + (config.name || 'Free Consultation');
      var meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.content = 'First-time home buyer specialist in ' + config.city + '. Free consultation, mortgage calculator, and buyer guide. Work with ' + (config.name || 'a local expert') + '.';
      }
    }
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el && text) el.textContent = text;
  }

  function getLeads() {
    try {
      return JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveLead(lead) {
    var leads = getLeads();
    leads.push(lead);
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    return lead;
  }

  function sendToWebhook(lead) {
    if (!config.webhookUrl) return Promise.resolve();
    return fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      mode: 'no-cors'
    }).catch(function () {});
  }

  function buildLeadPayload(formData, source) {
    return {
      id: 'lead_' + Date.now(),
      source: source,
      createdAt: new Date().toISOString(),
      realtor: config.name || '',
      market: config.city || '',
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      budget: formData.get('budget') || '',
      timeline: formData.get('timeline') || '',
      areas: formData.get('areas') || '',
      preapproved: formData.get('preapproved') === 'on'
    };
  }

  function initBuyerForm() {
    var form = document.getElementById('buyer-lead-form');
    var success = document.getElementById('lead-form-success');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var lead = buildLeadPayload(new FormData(form), 'buyer_consultation');
      saveLead(lead);
      sendToWebhook(lead);

      form.hidden = true;
      if (success) success.hidden = false;

      if (typeof gtag === 'function' && config.googleAnalyticsId) {
        gtag('event', 'generate_lead', { event_category: 'buyer', event_label: 'consultation' });
      }
    });
  }

  function initGuideForm() {
    var form = document.getElementById('guide-form');
    var success = document.getElementById('guide-success');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var lead = {
        id: 'lead_' + Date.now(),
        source: 'buyer_guide',
        createdAt: new Date().toISOString(),
        realtor: config.name || '',
        market: config.city || '',
        name: fd.get('name') || '',
        email: fd.get('email') || ''
      };
      saveLead(lead);
      sendToWebhook(lead);

      form.hidden = true;
      if (success) success.hidden = false;
    });
  }

  function formatCurrency(n) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(n);
  }

  function calculateMortgage() {
    var price = parseFloat(document.getElementById('calc-price').value) || 0;
    var downPct = parseFloat(document.getElementById('calc-down').value) || 0;
    var rate = parseFloat(document.getElementById('calc-rate').value) || 0;
    var termYears = parseInt(document.getElementById('calc-term').value, 10) || 30;
    var annualTax = parseFloat(document.getElementById('calc-tax').value) || 0;
    var annualInsurance = parseFloat(document.getElementById('calc-insurance').value) || 0;
    var hoa = parseFloat(document.getElementById('calc-hoa').value) || 0;

    var loanAmount = price * (1 - downPct / 100);
    var monthlyRate = rate / 100 / 12;
    var numPayments = termYears * 12;
    var pi = 0;

    if (monthlyRate > 0) {
      pi = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else if (numPayments > 0) {
      pi = loanAmount / numPayments;
    }

    var monthlyTax = annualTax / 12;
    var monthlyInsurance = annualInsurance / 12;
    var total = pi + monthlyTax + monthlyInsurance + hoa;

    document.getElementById('result-monthly').textContent = formatCurrency(total);
    document.getElementById('result-pi').textContent = formatCurrency(pi);
    document.getElementById('result-tax').textContent = formatCurrency(monthlyTax);
    document.getElementById('result-insurance').textContent = formatCurrency(monthlyInsurance);
    document.getElementById('result-hoa').textContent = formatCurrency(hoa);
    document.getElementById('result-loan').textContent = formatCurrency(loanAmount);

    return { price: price, monthly: total, loanAmount: loanAmount };
  }

  function initCalculator() {
    var inputs = document.querySelectorAll('#mortgage-form input, #mortgage-form select');
    inputs.forEach(function (input) {
      input.addEventListener('input', calculateMortgage);
      input.addEventListener('change', calculateMortgage);
    });
    calculateMortgage();

    var ctaBtn = document.getElementById('calc-cta-btn');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', function () {
        var result = calculateMortgage();
        var budgetSelect = document.getElementById('lead-budget');
        if (budgetSelect && result.price) {
          var price = result.price;
          var options = budgetSelect.options;
          for (var i = 0; i < options.length; i++) {
            options[i].selected = false;
          }
          if (price < 300000) budgetSelect.value = 'under-300k';
          else if (price < 450000) budgetSelect.value = '300k-450k';
          else if (price < 600000) budgetSelect.value = '450k-600k';
          else if (price < 800000) budgetSelect.value = '600k-800k';
          else budgetSelect.value = '800k-plus';
        }
        document.getElementById('consultation').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('lead-name').focus();
      });
    }
  }

  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var mobileNav = document.querySelector('.nav-mobile');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      mobileNav.hidden = expanded;
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  applyConfig();
  initBuyerForm();
  initGuideForm();
  initCalculator();
  initMobileNav();

  window.exportLeads = function () {
    var leads = getLeads();
    if (!leads.length) {
      console.log('No leads stored yet.');
      return leads;
    }
    var csv = 'id,source,createdAt,name,email,phone,budget,timeline,areas,preapproved\n';
    leads.forEach(function (l) {
      csv += [
        l.id, l.source, l.createdAt, l.name, l.email,
        l.phone || '', l.budget || '', l.timeline || '',
        l.areas || '', l.preapproved || false
      ].map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(',') + '\n';
    });
    var blob = new Blob([csv], { type: 'text/csv' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'buyer-leads-' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    return leads;
  };
})();
