const reviews = [
  {
    id: 'seoul-form', clinic: 'Seoul Form Clinic', city: 'Gangnam · Sinsa', procedure: 'rhinoplasty', procedureLabel: 'Rhinoplasty', date: 'May 2026', title: 'A calm recovery plan',
    quote: 'The reviewer describes a conservative bridge adjustment and gives day-by-day recovery notes. The source language is specific about swelling, not just a before/after result.',
    original: '붓기 빠지는 과정과 주의사항을 날짜별로 자세히 적어두었습니다.', translation: '“I wrote down the swelling timeline and precautions day by day.”',
    confidence: 'high', confidenceLabel: 'High confidence', signals: [['Procedure mentioned', 'Specific'], ['Surgeon named', 'Matched'], ['Recovery detail', '7 days'], ['Source type', 'Patient review']], source: 'Naver Cafe · sample', note: 'The clinic and surgeon fields were matched against the guide’s directory. This is fictional sample data for the prototype.'
  },
  {
    id: 'muse-eye', clinic: 'Muse Eye Centre', city: 'Gangnam · Cheongdam', procedure: 'blepharoplasty', procedureLabel: 'Blepharoplasty', date: 'Apr 2026', title: 'Natural, not dramatic',
    quote: 'A translated review focused on asymmetry and the patient’s preference for a subtle change. The uncertainty flag preserves the source’s tentative wording.',
    original: '양쪽 눈이 조금 달라서 상담 때 원하는 느낌을 많이 설명했어요.', translation: '“My eyes were a little different, so I explained the look I wanted in detail.”',
    confidence: 'medium', confidenceLabel: 'Review checked', signals: [['Procedure mentioned', 'Specific'], ['Surgeon named', 'Not listed'], ['Recovery detail', 'Partial'], ['Source type', 'Patient review']], source: 'Daum blog · sample', note: 'The original wording uses a subjective preference. It is kept as a preference, not promoted to a clinical outcome.'
  },
  {
    id: 'clear-skin', clinic: 'Clearline Dermatology', city: 'Gangnam · Yeoksam', procedure: 'skin', procedureLabel: 'Skin & laser', date: 'Jun 2026', title: 'A useful price breakdown',
    quote: 'The author separates the consultation fee, treatment price, and optional add-ons. That makes this a useful planning signal even when results are personal.',
    original: '상담비와 시술비, 추가 옵션을 따로 안내받았습니다.', translation: '“They explained the consultation fee, treatment fee, and add-ons separately.”',
    confidence: 'high', confidenceLabel: 'High confidence', signals: [['Procedure mentioned', 'Laser toning'], ['Price detail', 'Itemised'], ['Recovery detail', 'None'], ['Source type', 'Patient review']], source: 'Naver blog · sample', note: 'Price information is time-sensitive and should be confirmed with the clinic before travel.'
  },
  {
    id: 'line-aesthetic', clinic: 'Line Aesthetic', city: 'Gangnam · Apgujeong', procedure: 'rhinoplasty', procedureLabel: 'Rhinoplasty', date: 'Mar 2026', title: 'Questions worth taking in',
    quote: 'A long-form post is useful less for its verdict than for the questions it raises about implant material, revision policy, and follow-up after returning home.',
    original: '재료와 재수술 정책은 상담 전에 꼭 물어보세요.', translation: '“Ask about the material and revision policy before your consultation.”',
    confidence: 'medium', confidenceLabel: 'Review checked', signals: [['Procedure mentioned', 'General'], ['Surgeon named', 'Matched'], ['Recovery detail', 'Partial'], ['Source type', 'Patient review']], source: 'Naver Cafe · sample', note: 'Advice from a reviewer is not medical advice. The detail is surfaced as a question prompt.'
  },
  {
    id: 'derma-room', clinic: 'Derma Room', city: 'Gangnam · Nonhyeon', procedure: 'skin', procedureLabel: 'Skin & laser', date: 'Feb 2026', title: 'Small details, clearly logged',
    quote: 'The author records treatment settings, waiting time, and the date of the next visit. Those operational details help a traveller plan without implying a guaranteed result.',
    original: '다음 방문 날짜와 대기 시간까지 메모해 두면 편합니다.', translation: '“It helps to note the next-visit date and waiting time too.”',
    confidence: 'high', confidenceLabel: 'High confidence', signals: [['Procedure mentioned', 'Specific'], ['Price detail', 'Not listed'], ['Recovery detail', 'Logged'], ['Source type', 'Patient review']], source: 'Naver blog · sample', note: 'The record is useful for logistics. It does not establish that a treatment is suitable for any individual.'
  },
  {
    id: 'soft-eye', clinic: 'Softline Plastic Surgery', city: 'Gangnam · Samseong', procedure: 'blepharoplasty', procedureLabel: 'Blepharoplasty', date: 'Jan 2026', title: 'A mixed outcome, kept honest',
    quote: 'The review includes a positive change and a lingering concern. Showing both sides is intentional: the reader can decide what follow-up questions matter.',
    original: '원하는 변화는 있었지만 한 달째 건조함이 남아있어요.', translation: '“There was a change I wanted, but dryness remained after a month.”',
    confidence: 'medium', confidenceLabel: 'Needs follow-up', signals: [['Procedure mentioned', 'Specific'], ['Surgeon named', 'Not listed'], ['Recovery detail', '1 month'], ['Source type', 'Patient review']], source: 'Naver Cafe · sample', note: 'A single patient account cannot establish frequency or causation. The concern is shown to prompt a clinician question.'
  }
];

const grid = document.querySelector('#review-grid');
const count = document.querySelector('#result-count');
const empty = document.querySelector('#empty-state');
const detail = document.querySelector('#detail-panel');
let selected = reviews[0].id;

function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }

function filteredReviews() {
  const query = document.querySelector('#search').value.trim().toLowerCase();
  const procedure = document.querySelector('#procedure').value;
  const trust = document.querySelector('#trust').value;
  return reviews.filter(review => {
    const haystack = `${review.clinic} ${review.city} ${review.procedureLabel} ${review.title} ${review.quote}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesProcedure = procedure === 'all' || review.procedure === procedure;
    const matchesTrust = trust === 'all' || (trust === 'verified' ? review.confidence === 'high' : review.confidence === 'high');
    return matchesQuery && matchesProcedure && matchesTrust;
  });
}

function renderCards() {
  const visible = filteredReviews();
  count.textContent = `${visible.length} review${visible.length === 1 ? '' : 's'}`;
  empty.hidden = visible.length > 0;
  grid.innerHTML = visible.map(review => `
    <article class="review-card ${review.id === selected ? 'selected' : ''}" data-id="${escapeHtml(review.id)}" tabindex="0" role="button" aria-label="Open review from ${escapeHtml(review.clinic)}">
      <div class="review-card-top"><div><span class="clinic">${escapeHtml(review.clinic)}</span><span class="city">${escapeHtml(review.city)}</span></div><span class="confidence ${review.confidence === 'medium' ? 'medium' : ''}"><span aria-hidden="true">${review.confidence === 'high' ? '✓' : '≈'}</span>${escapeHtml(review.confidenceLabel)}</span></div>
      <h3 class="review-title">${escapeHtml(review.title)}</h3><p class="review-quote">${escapeHtml(review.quote)}</p>
      <div class="card-meta"><span>${escapeHtml(review.procedureLabel)} · ${escapeHtml(review.date)}</span><strong>Open details&nbsp; →</strong></div>
    </article>`).join('');
  grid.querySelectorAll('.review-card').forEach(card => { card.addEventListener('click', () => selectReview(card.dataset.id)); card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectReview(card.dataset.id); } }); });
  if (visible.length && !visible.some(review => review.id === selected)) selectReview(visible[0].id, false);
}

function selectReview(id, rerender = true) {
  const review = reviews.find(item => item.id === id); if (!review) return; selected = id;
  detail.innerHTML = `<div class="detail-content"><p class="eyebrow">${escapeHtml(review.procedureLabel)} · ${escapeHtml(review.date)}</p><h3>${escapeHtml(review.title)}</h3><p class="detail-summary">${escapeHtml(review.translation)}</p><div class="signal-list">${review.signals.map(([label,value]) => `<div class="signal-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div><div class="detail-foot"><span>${escapeHtml(review.source)}</span><span class="source-link" title="Source link is represented in this prototype">View source ↗</span></div><p class="detail-note">${escapeHtml(review.note)}</p></div>`;
  if (rerender) renderCards();
}

['search','procedure','trust'].forEach(id => document.querySelector(`#${id}`).addEventListener('input', renderCards));
document.querySelector('#reset').addEventListener('click', () => { document.querySelector('#search').value = ''; document.querySelector('#procedure').value = 'all'; document.querySelector('#trust').value = 'all'; renderCards(); });
renderCards();
selectReview(selected, false);
