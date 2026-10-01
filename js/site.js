function initBannerCarousel() {
  const slides = document.querySelectorAll('.fade-slide')
  const dots = document.querySelectorAll('.fade-dot')
  if (!slides.length) return

  let currentSlide = 0
  let autoPlayInterval
  const totalSlides = slides.length

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index)
      if (dots[i]) dots[i].classList.toggle('active', i === index)
    })
    currentSlide = index
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % totalSlides)
  }

  function startAutoPlay() {
    stopAutoPlay()
    autoPlayInterval = setInterval(nextSlide, 4000)
  }

  function stopAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval)
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index)
      startAutoPlay()
    })
  })

  const carousel = document.querySelector('.fade-carousel-container')
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoPlay)
    carousel.addEventListener('mouseleave', startAutoPlay)
  }

  startAutoPlay()
}

function initIndustryCarousel() {
  const carousel = document.getElementById('carousel')
  if (!carousel) return

  const slides = carousel.querySelectorAll('.mc_a1s2_li')
  const prevBtn = document.querySelector('.mc_a1s2_prev')
  const nextBtn = document.querySelector('.mc_a1s2_next')
  const currentNum = document.querySelector('.mc_a1s2dots_now')
  const totalNum = document.querySelector('.mc_a1s2dots_count')
  if (!slides.length) return

  let currentIndex = 0
  let autoPlayInterval
  const totalSlides = slides.length

  function updateCarousel() {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentIndex)
    })
    if (currentNum) currentNum.textContent = String(currentIndex + 1).padStart(2, '0')
    if (totalNum) totalNum.textContent = String(totalSlides).padStart(2, '0')
  }

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides
    updateCarousel()
  }

  function startAutoPlay() {
    stopAutoPlay()
    autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 4000)
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
      autoPlayInterval = null
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1)
      startAutoPlay()
    })
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1)
      startAutoPlay()
    })
  }

  const container = document.querySelector('.mc_a1s2_container')
  if (container) {
    container.addEventListener('mouseenter', stopAutoPlay)
    container.addEventListener('mouseleave', startAutoPlay)
  }

  updateCarousel()
  startAutoPlay()
}

function t(text) {
  return window.I18n ? window.I18n.t(text) : text
}

function initContactForm() {
  const form = document.getElementById('contact-form')
  if (!form) return

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(form).entries())
    const required = [
      ['name', '姓名'],
      ['phone', '电话'],
      ['company', '公司'],
      ['message', '需求描述'],
    ]
    for (const [key, label] of required) {
      if (!String(data[key] || '').trim()) {
        notify(t(`${label}不能为空！`))
        return
      }
    }
    if (!/^1\d{10}$/.test(String(data.phone).trim())) {
      notify(t('电话格式不正确！'))
      return
    }
    if (data.email && !/^[\w.-]+@[\w.-]+\.\w+$/.test(String(data.email).trim())) {
      notify(t('邮箱格式不正确！'))
      return
    }
    notify(t('提交成功，我们将尽快与您联系。'))
    form.reset()
  })
}

function notify(message) {
  if (window.layer && typeof window.layer.alert === 'function') {
    window.layer.alert(message, { title: t('消息'), btn: [t('好的')] })
    return
  }
  alert(message)
}

function initFaq() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const trigger = item.querySelector('.faq-q')
    if (!trigger) return
    trigger.addEventListener('click', () => {
      item.classList.toggle('open')
    })
  })
}

function initHashScroll() {
  const hash = window.location.hash
  if (!hash) return
  const target = document.querySelector(hash)
  if (!target) return
  window.setTimeout(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 80)
}

function initPageSubnav() {
  const links = Array.from(document.querySelectorAll('.page-subnav a[href^="#"]'))
  if (!links.length) return

  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean)

  function setActive(id) {
    links.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`)
    })
  }

  function updateActive() {
    const offset = 140
    let current = sections[0]
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top - offset <= 0) current = section
    })
    if (current) setActive(current.id)
  }

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'))
      if (!target) return
      event.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      history.replaceState(null, '', link.getAttribute('href'))
      setActive(target.id)
    })
  })

  window.addEventListener('scroll', updateActive, { passive: true })
  updateActive()
}

document.addEventListener('DOMContentLoaded', () => {
  initBannerCarousel()
  initIndustryCarousel()
  initContactForm()
  initFaq()
  initHashScroll()
  initPageSubnav()
})
