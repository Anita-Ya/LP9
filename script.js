// ========================================================
// LANDING PAGE SCRIPT: SCROLL REVEAL & INTERACTIONS
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll-triggered reveal animation using IntersectionObserver
  const revealElements = document.querySelectorAll('.anim-reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once animated, keep visible
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach(element => {
      element.classList.add('is-visible');
    });
  }

  // 2. Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 3. Show the order confirmation page after form submission
  const orderForm = document.querySelector('.order-form');
  const landingPage = document.querySelector('.page-container');
  const thankyouPage = document.querySelector('#thankyou-page');
  const thankyouBack = document.querySelector('#thankyou-back');

  if (orderForm && landingPage && thankyouPage) {
    orderForm.addEventListener('submit', event => {
      event.preventDefault();

      const name = orderForm.elements.name;
      const pincode = orderForm.elements.pincode;
      const address = orderForm.elements.address;
      const phone = orderForm.elements.phone;
      const fields = [name, pincode, address, phone];
      let isValid = true;

      fields.forEach(field => {
        const wrapper = field.closest('.order-field');
        const error = wrapper.querySelector('.order-error');
        wrapper.classList.remove('has-error');
        error.textContent = '';

        let message = '';
        if (!field.value.trim()) {
          message = 'यह जानकारी आवश्यक है।';
        } else if (field === name && !/^[A-Za-zÀ-ÖØ-öø-ÿ\u0900-\u097F\s]+$/.test(field.value.trim())) {
          message = 'कृपया केवल अक्षरों में नाम लिखें';
        } else if (field === pincode && !/^\d{6}$/.test(field.value.trim())) {
          message = 'कृपया 6 अंकों का सही पिनकोड डालें';
        } else if (field === phone && !/^[6-9]\d{9}$/.test(field.value.trim())) {
          message = '10 अंकों का सही मोबाइल नंबर डालें (6-9 से शुरू)';
        }

        if (message) {
          isValid = false;
          wrapper.classList.add('has-error');
          error.textContent = message;
        }
      });

      if (!isValid) return;

      landingPage.hidden = true;
      thankyouPage.hidden = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (thankyouBack && landingPage && thankyouPage) {
    thankyouBack.addEventListener('click', () => {
      thankyouPage.hidden = true;
      landingPage.hidden = false;
      document.querySelector('#order-form')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const policyModal = document.querySelector('#policy-modal');
  const policyTitle = document.querySelector('#policy-title');
  const policyContent = document.querySelector('#policy-content');
  const policyClose = document.querySelector('.policy-close');
  const policies = {
    privacy: ['Privacy Policy', '<p>FibroCare आपकी personal information की सुरक्षा को सर्वोच्च प्राथमिकता देता है। Order करते समय हम नाम, मोबाइल नंबर, delivery address, payment details और order history जैसी जानकारी एकत्र कर सकते हैं।</p><ul><li>आपकी जानकारी encrypted और secure रखी जाती है।</li><li>जानकारी केवल order processing और delivery के लिए उपयोग होती है।</li><li>आपकी जानकारी किसी third-party को बेची नहीं जाती।</li></ul><p>किसी privacy concern के लिए हमारी टीम से संपर्क करें।</p>'],
    terms: ['Terms & Conditions', '<p>FibroCare का उपयोग करके आप इन terms से सहमत होते हैं:</p><ul><li>Product results व्यक्ति-व्यक्ति अलग हो सकते हैं।</li><li>यह product किसी बीमारी का इलाज नहीं है—यह wellness supplement है।</li><li>18 वर्ष से कम आयु के व्यक्ति guardian consent के बिना order न करें।</li><li>Fake या fraudulent orders के लिए legal action लिया जा सकता है।</li><li>Product images केवल representation के लिए हैं।</li></ul><p><b>FibroCare बिना prior notice के prices, offers या specifications बदलने का अधिकार रखता है।</b></p>'],
    shipping: ['Shipping Policy', '<p>हम पूरे India में shipping प्रदान करते हैं। Delivery timeline:</p><ul><li>Metro cities: 3–5 business days</li><li>Tier-2 / Tier-3 cities: 5–7 business days</li><li>Remote / rural areas: 7–10 business days</li></ul><p><b>Order confirm होने के 24–48 घंटे के अंदर tracking number SMS/WhatsApp पर भेजा जाएगा।</b></p><ul><li>Delivery attempt 3 बार की जाएगी।</li><li>Incorrect address की जिम्मेदारी customer की होगी।</li></ul>'],
    cancellation: ['Cancellation Policy', '<p>आप order confirm होने के 24 घंटे के अंदर cancellation request कर सकते हैं।</p><ul><li>Order dispatch होने के बाद cancellation संभव नहीं है।</li><li>Damaged या wrong product मिलने पर 7 दिन के अंदर complaint करें।</li><li>Opened/used products return नहीं किए जाएंगे।</li><li>Refund 5–7 business days में original payment method पर होगा।</li></ul><p><b>Return के लिए product original packaging में होना ज़रूरी है।</b></p>'],
    legal: ['Legal Disclaimer', '<p>FibroCare एक natural wellness supplement है। यह product किसी बीमारी का diagnosis, treatment, cure या prevention नहीं करता।</p><ul><li>Results individual to individual अलग हो सकते हैं।</li><li>यह FSSAI guidelines के अनुसार food supplement है, drug नहीं।</li><li>किसी medical condition में उपयोग से पहले doctor से परामर्श करें।</li><li>Pregnant, nursing women या chronic illness वाले व्यक्ति पहले physician से consult करें।</li></ul><p><b>Product की images, descriptions और testimonials केवल illustrative purpose के लिए हैं।</b></p>']
  };

  document.querySelectorAll('[data-policy]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const policy = policies[link.dataset.policy];
      if (!policy) return;
      policyTitle.textContent = policy[0];
      policyContent.innerHTML = policy[1];
      policyModal.hidden = false;
    });
  });

  const closePolicy = () => { if (policyModal) policyModal.hidden = true; };
  policyClose?.addEventListener('click', closePolicy);
  policyModal?.addEventListener('click', event => {
    if (event.target === policyModal) closePolicy();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closePolicy();
  });
});
