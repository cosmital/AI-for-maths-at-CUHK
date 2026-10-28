/* Progressive enhancements; the pages remain navigable without JavaScript. */
(() => {
  'use strict';
  const all = (selector) => [...document.querySelectorAll(selector)];
  const text = (selector, value) => all(selector).forEach((el) => { el.textContent = value; });
  const config = window.CONFERENCE || {};
  const httpsUrl = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
    } catch { return ''; }
  };

  // Keep the menu visible without JS; collapse it only after enhancement.
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const mobile = window.matchMedia('(max-width: 760px)');
  if (menu && nav) {
    const setOpen = (open) => {
      menu.setAttribute('aria-expanded', String(open));
      nav.dataset.collapsed = String(!open);
      menu.querySelector('span').textContent = open ? 'Close' : 'Menu';
    };
    const syncMenu = () => {
      menu.hidden = !mobile.matches;
      setOpen(!mobile.matches);
    };
    syncMenu();
    mobile.addEventListener('change', syncMenu);
    menu.addEventListener('click', () => setOpen(menu.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobile.matches && menu.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        menu.focus();
      }
    });
  }

  const date = /^\d{4}-\d{2}-\d{2}$/.test(config.date || '') ? new Date(`${config.date}T12:00:00+08:00`) : null;
  if (date && !Number.isNaN(date.getTime())) {
    const format = (options) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Shanghai', ...options }).format(date);
    text('[data-event-date]', format({ day: 'numeric', month: 'long', year: 'numeric' }));
    text('[data-event-weekday]', format({ weekday: 'long', day: 'numeric', month: 'long' }));
    text('[data-date-day]', format({ day: '2-digit' }));
    text('[data-date-month]', format({ month: 'short' }).toUpperCase());
    text('[data-date-year]', format({ year: 'numeric' }));
  }
  text('[data-date-status]', config.dateConfirmed === true ? 'Confirmed date' : 'Proposed date');
  const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  if (timePattern.test(config.startTime) && timePattern.test(config.endTime)) {
    text('[data-event-hours]', `${config.startTime}–${config.endTime}`);
  }
  all('[data-config]').forEach((el) => {
    const value = config[el.dataset.config];
    if (typeof value === 'string' && value.trim()) el.textContent = value;
  });

  // Unconfigured registration stays closed; never synthesize a sign-up URL.
  const registrationUrl = httpsUrl(config.registrationUrl);
  const isOpen = Boolean(registrationUrl);
  text('[data-registration-state]', isOpen ? 'Registration open' : 'Registration not yet open');
  all('.registration-open').forEach((el) => { el.hidden = !isOpen; });
  all('.registration-closed').forEach((el) => { el.hidden = isOpen; });
  if (isOpen) {
    text('[data-registration-heading]', 'Registration form');
    text('[data-registration-message]', 'Use the organizer’s external form for attendance information and registration.');
    all('.registration-external').forEach((el) => { el.href = registrationUrl; });
  }
  // QR images must be supplied by an organizer and checked against the form.
  if (isOpen && /^assets\/[\w./-]+\.(png|jpe?g|svg|webp)$/i.test(config.registrationQr || '')) {
    all('.registration-qr').forEach((el) => {
      const img = el.querySelector('img');
      img.addEventListener('load', () => { el.hidden = false; });
      img.src = config.registrationQr;
    });
  }
  if (typeof config.contactEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail)) {
    all('.contact-link').forEach((el) => {
      el.href = `mailto:${config.contactEmail}`;
      el.textContent = config.contactEmail;
    });
    all('.contact-configured').forEach((el) => { el.hidden = false; });
    all('.contact-unconfigured').forEach((el) => { el.hidden = true; });
  }

  const filters = all('[data-filter]');
  const blocks = all('[data-period]');
  if (filters.length) {
    document.querySelector('.filter-group').hidden = false;
    const status = document.createElement('p');
    status.className = 'sr-only';
    status.setAttribute('role', 'status');
    document.querySelector('.program-toolbar').append(status);
    const filter = (period) => {
      filters.forEach((el) => el.setAttribute('aria-pressed', String(el.dataset.filter === period)));
      blocks.forEach((el) => { el.hidden = period !== 'all' && el.dataset.period !== period; });
      status.textContent = period === 'all' ? 'Showing the full proposed day.' : `Showing proposed ${period} sessions.`;
    };
    filters.forEach((el) => el.addEventListener('click', () => filter(el.dataset.filter)));
    const revealAnchor = () => {
      const target = document.getElementById(location.hash.slice(1));
      if (target && target.closest('[data-period]')) {
        filter('all');
        requestAnimationFrame(() => target.scrollIntoView());
      }
    };
    revealAnchor();
    window.addEventListener('hashchange', revealAnchor);
  }
  all('.print-button').forEach((el) => {
    el.hidden = false;
    el.addEventListener('click', () => window.print());
  });

  // Generate UTC calendar times from the stated UTC+8 event hours.
  const start = new Date(`${config.date}T${config.startTime}:00+08:00`);
  const end = new Date(`${config.date}T${config.endTime}:00+08:00`);
  if (date && timePattern.test(config.startTime) && timePattern.test(config.endTime) && end > start) {
    const stamp = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
    const escape = (s) => String(s).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/[,;]/g, '\\$&');
    const fold = (line) => {
      let result = '', size = 0;
      for (const char of line) {
        const bytes = new TextEncoder().encode(char).length;
        if (size + bytes > 75) { result += '\r\n '; size = 1; }
        result += char; size += bytes;
      }
      return result;
    };
    const confirmed = config.dateConfirmed === true;
    const calendar = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AI Math CUHK-Shenzhen//Conference Draft//EN',
      'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
      'UID:ai-math-december-2026-draft@conference.local', `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
      `SUMMARY:${escape(`${confirmed ? '' : '[Provisional] '}${config.title}`)}`,
      `LOCATION:${escape(`CUHK-Shenzhen - ${config.room === 'To be announced' ? 'room to be announced' : config.room}`)}`,
      'DESCRIPTION:Program and attendance details are provisional. Check the conference website before making travel arrangements.',
      `STATUS:${confirmed ? 'CONFIRMED' : 'TENTATIVE'}`, 'TRANSP:TRANSPARENT', 'END:VEVENT', 'END:VCALENDAR'
    ].map(fold).join('\r\n') + '\r\n';
    const url = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar;charset=utf-8' }));
    all('.calendar-link').forEach((el) => { el.href = url; el.download = 'ai-math-conference.ics'; });
    // Retain the URL for back/forward cache restores; the browser releases it
    // when this document is destroyed.
  }

  const toast = document.querySelector('.toast');
  let toastTimer;
  if (navigator.clipboard && window.isSecureContext) {
    all('.copy-address').forEach((el) => {
      el.hidden = false;
      el.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText('香港中文大学（深圳），广东省深圳市龙岗区龙翔大道2001号');
          toast.textContent = 'Chinese campus address copied.';
        } catch { toast.textContent = 'Could not copy. Please select the address above.'; }
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => { toast.textContent = ''; }, 5000);
      });
    });
  }
})();
