import type { Metadata } from 'next'
import Script from 'next/script'
import React from 'react'

import { getPortfolioContent, mediaUrl } from '@/lib/portfolioContent'
import type { PortfolioSettings, ProjectRecord } from '@/lib/portfolioDefaults'

import './styles.css'

export const dynamic = 'force-dynamic'

const withBreaks = (value: string, keyPrefix: string) =>
  value.split('\n').map((line, index) => (
    <React.Fragment key={`${keyPrefix}-${index}`}>
      {index > 0 && <br />}
      {line}
    </React.Fragment>
  ))

const metricValue = (value: string, key: string) => {
  if (!value.endsWith('+')) return value
  return (
    <>
      {value.slice(0, -1)}
      <span key={`${key}-accent`}>+</span>
    </>
  )
}

const safeClassName = (value: string) => value.replace(/[^a-z0-9_-]/gi, '')

const brand = (settings: PortfolioSettings) => (
  <>
    <span className="brand-mark">
      A<span>/</span>
    </span>
    <span className="brand-name">
      {settings.site.brandName}
      <br />
      <small>{settings.site.brandTagline}</small>
    </span>
  </>
)

const projectCover = (project: ProjectRecord) => {
  const fallback = project.fallbackCover || ''
  return mediaUrl(project.cover, fallback)
}

const ProjectCard = ({ project, index }: { project: ProjectRecord; index: number }) => {
  const cardClass = [
    'project-card',
    project.cardVariant === 'wide' ? 'project-card--wide' : '',
    `project-${safeClassName(project.slug)}`,
    'reveal',
  ]
    .filter(Boolean)
    .join(' ')
  const visualClass = ['project-visual', project.visualMode === 'orb' ? 'project-image-aion' : '']
    .filter(Boolean)
    .join(' ')
  const cover = projectCover(project)
  const number = String(project.sortOrder || index + 1).padStart(2, '0')

  return (
    <article
      className={cardClass}
      data-segment={project.category}
      data-title={project.title}
      data-kind={project.kind}
      data-url={project.previewUrl}
      data-tags={project.tags}
    >
      <button className="project-open" type="button" aria-label={`Открыть проект ${project.title}`} />
      <div className={visualClass}>
        {project.visualMode === 'orb' ? (
          <div className="aion-orb">{project.orbLabel || project.title}</div>
        ) : (
          cover && (
            <img
              className={`project-cover ${project.coverClassName || ''}`.trim()}
              src={cover}
              alt={project.alt || project.title}
              loading="lazy"
              decoding="async"
            />
          )
        )}
        <span className="project-number">{number}</span>
        <span className="project-signal">↗</span>
        <div className="project-overlay-label">
          {project.overlayLineOne}
          <br />
          {project.overlayLineTwo}
        </div>
      </div>
      <div className="project-meta">
        <div>
          <span className="project-category">{project.kind}</span>
          <h3>{project.title}</h3>
        </div>
        <span className="project-arrow">↗</span>
      </div>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPortfolioContent()
  return {
    title: settings.site.title,
    description: settings.site.description,
  }
}

export default async function HomePage() {
  const { settings, projects } = await getPortfolioContent()
  const { site, hero, portfolio, filters, services, process, contact, preview } = settings
  const counts = projects.reduce<Record<string, number>>((result, project) => {
    result[project.category] = (result[project.category] || 0) + 1
    return result
  }, {})
  const filterItems = [
    ['all', filters.all, projects.length],
    ['business', filters.business, counts.business || 0],
    ['services', filters.services, counts.services || 0],
    ['lifestyle', filters.lifestyle, counts.lifestyle || 0],
    ['concept', filters.concept, counts.concept || 0],
  ] as const
  const metrics = hero.metrics.slice(0, 3)
  const serviceItems = services.items.slice(0, 12)
  const steps = process.steps.slice(0, 8)

  return (
    <>
      <div className="cursor-glow" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />

      <header className="site-header" id="site-header">
        <a className="brand" href="#top" aria-label={site.brandAriaLabel}>
          {brand(settings)}
        </a>

        <nav className="main-nav" id="main-nav" aria-label="Основная навигация">
          <a href="#projects">
            {site.navProjects} <span>01</span>
          </a>
          <a href="#services">
            {site.navServices} <span>02</span>
          </a>
          <a href="#process">
            {site.navProcess} <span>03</span>
          </a>
          <a href="#contact">
            {site.navContact} <span>04</span>
          </a>
        </nav>

        <a className="header-cta" href="#contact">
          {site.headerCta} <span>↗</span>
        </a>
        <button className="menu-toggle" id="menu-toggle" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="main-nav">
          <i />
          <i />
        </button>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-lines" aria-hidden="true" />
          <div className="hero-topline">
            <span>{hero.year}</span>
            <span className="status">
              <i /> {hero.status}
            </span>
          </div>

          <div className="hero-layout">
            <div className="hero-copy reveal">
              <p className="eyebrow">
                <span className="eyebrow-dot" /> {hero.eyebrow}
              </p>
              <h1>
                {hero.titleLineOne}
                <br />
                <em>{hero.titleEmphasis}</em>
                <br />
                {hero.titleLineTwo}
                <span className="hero-dot">{hero.titleDot}</span>
              </h1>
              <p className="hero-lead">{hero.lead}</p>
              <div className="hero-actions">
                <a className="button button-dark" href="#projects">
                  {hero.primaryCta} <span>↘</span>
                </a>
                <a className="text-link" href="#contact">
                  {hero.secondaryCta} <span>↗</span>
                </a>
              </div>
            </div>

            <div className="hero-visual reveal reveal-delay" aria-label="Портрет Александра и направления работы">
              <div className="visual-orbit orbit-one" />
              <div className="visual-orbit orbit-two" />
              <div className="visual-cross cross-one">+</div>
              <div className="visual-cross cross-two">+</div>
              <div className="visual-glow" />
              <div className="portrait-card">
                <img src={mediaUrl(hero.portrait, hero.portraitFallback)} alt={hero.portraitAlt} fetchPriority="high" />
                <div className="portrait-caption">
                  <span>{hero.portraitCaptionLabel}</span>
                  <strong>
                    {hero.portraitCaptionLineOne}
                    <br />
                    {hero.portraitCaptionLineTwo}
                  </strong>
                </div>
              </div>
              <div className="visual-badge">
                <span>{hero.badgeOne}</span>
                <b>×</b>
                <span>{hero.badgeTwo}</span>
                <b>×</b>
                <span>{hero.badgeThree}</span>
              </div>
              <span className="visual-coordinate">{hero.coordinate}</span>
              <span className="visual-index">{hero.index}</span>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="hero-note">
              <span>{hero.scrollLabel}</span>
              <b>↓</b>
            </div>
            <div className="hero-metrics">
              {metrics.map((metric, index) => (
                <div key={`metric-${index}`}>
                  <strong>{metricValue(metric.value, `metric-${index}`)}</strong>
                  <small>{withBreaks(metric.label, `metric-${index}`)}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="marquee" aria-label="Направления работы">
          <div className="marquee-track">
            {[0, 1].map((group) => (
              <div className="marquee-group" aria-hidden={group === 1 ? 'true' : undefined} key={`marquee-${group}`}>
                {settings.marquee.items.map((item, index) => (
                  <React.Fragment key={`${group}-${index}`}>
                    <span>{item.label}</span>
                    <b>✳</b>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section className="projects section-shell" id="projects">
          <div className="section-heading reveal">
            <div>
              <p className="section-no">{portfolio.sectionLabel}</p>
              <h2>
                {portfolio.headingLineOne}
                <br />
                <em>{portfolio.headingEmphasis}</em>
              </h2>
            </div>
            <div className="heading-side">
              <p>{portfolio.sideCopy}</p>
              <span className="live-label">
                <i /> {portfolio.liveLabel}
              </span>
            </div>
          </div>

          <div className="filter-bar" role="group" aria-label="Фильтр проектов">
            {filterItems.map(([value, label, count], index) => (
              <button className={`filter-button${index === 0 ? ' is-active' : ''}`} type="button" data-filter={value} aria-pressed={index === 0 ? 'true' : 'false'} key={value}>
                {label} <span>{count}</span>
              </button>
            ))}
          </div>

          <div className="projects-grid" id="projects-grid">
            {projects.map((project, index) => (
              <ProjectCard project={project} index={index} key={project.id || project.slug} />
            ))}
          </div>
          <button className="projects-more" id="projects-more" type="button" hidden aria-expanded="false">
            <span id="projects-more-label">Показать ещё</span>
            <span className="projects-more-count" id="projects-more-count" aria-hidden="true" />
            <span aria-hidden="true">↓</span>
          </button>
          <p className="projects-empty" id="projects-empty">
            {portfolio.emptyText}
          </p>
          <div className="projects-foot">
            <span>{projects.length} {portfolio.projectsCountSuffix} · {new Set(projects.map((project) => project.kind)).size} {portfolio.directionsCountSuffix} · {portfolio.approachLabel}</span>
            <a className="text-link" href="#contact">
              {portfolio.footerLink} <span>↗</span>
            </a>
          </div>
        </section>

        <section className="services" id="services">
          <div className="services-grid section-shell">
            <div className="services-intro reveal">
              <p className="section-no section-no-light">{services.sectionLabel}</p>
              <h2>
                {services.headingLineOne}
                <br />
                <em>{services.headingEmphasis}</em>
              </h2>
              <p className="services-lead">{services.lead}</p>
              <div className="service-tags">
                {services.tags.map((tag, index) => <span key={`${tag.label}-${index}`}>{tag.label}</span>)}
              </div>
            </div>

            <div className="service-list reveal reveal-delay">
              {serviceItems.map((item, index) => {
                const itemNumber = String(index + 1).padStart(2, '0')
                const detailId = `service-detail-${index + 1}`
                return (
                  <button className={`service-row${index === 0 ? ' is-open' : ''}`} type="button" aria-expanded={index === 0 ? 'true' : 'false'} aria-controls={detailId} key={detailId}>
                    <span className="service-index">{itemNumber}</span>
                    <span className="service-copy">
                      <strong>{item.title}</strong>
                      <small id={detailId} aria-hidden={index === 0 ? 'false' : 'true'}>{item.description}</small>
                    </span>
                    <span className="service-toggle">↗</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="services-note">
            <span>{services.note}</span>
            <b>↓</b>
          </div>
        </section>

        <section className="process section-shell" id="process">
          <div className="process-head reveal">
            <div>
              <p className="section-no">{process.sectionLabel}</p>
              <h2>
                {process.headingLineOne}
                <br />
                <em>{process.headingEmphasis}</em>
              </h2>
            </div>
            <p>{process.lead}</p>
          </div>

          <div className="about-grid">
            <div className="about-photo reveal">
              <img src={mediaUrl(process.photo, process.photoFallback)} alt={process.photoAlt} />
              <div className="photo-stamp">
                <span>{process.stampLineOne}</span>
                <strong>{process.stampEmphasis}</strong>
                <span>{process.stampLineTwo}</span>
              </div>
              <span className="photo-index">{process.photoIndex}</span>
            </div>
            <div className="process-copy reveal reveal-delay">
              <p className="about-kicker">{process.kicker}</p>
              <h3>
                {process.titleLineOne}
                <br />
                <em>{process.titleEmphasis}</em>
              </h3>
              <p className="about-text">{process.copy}</p>
              <div className="process-steps">
                {steps.map((step, index) => (
                  <div key={`step-${index}`}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{step.title}</strong>
                    <small>{step.description}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-grid section-shell">
            <div className="contact-copy reveal">
              <p className="section-no section-no-light">{contact.sectionLabel}</p>
              <h2>
                {contact.headingLineOne}
                <br />
                {contact.headingLineTwo}
                <br />
                <em>{contact.headingEmphasis}</em>
              </h2>
              <p>{contact.lead}</p>
              <div className="contact-aside">
                <span>{contact.responseLabel}</span>
                <i>↘</i>
              </div>
            </div>
            <form className="contact-form reveal reveal-delay" id="contact-form">
              <label>
                <span>{contact.nameLabel}</span>
                <input type="text" name="name" placeholder={contact.namePlaceholder} required />
              </label>
              <label>
                <span>{contact.contactLabel}</span>
                <input type="text" name="contact" placeholder={contact.contactPlaceholder} required />
              </label>
              <label>
                <span>{contact.typeLabel}</span>
                <select name="type">
                  {contact.typeOptions.map((option, index) => <option key={`${option.label}-${index}`}>{option.label}</option>)}
                </select>
              </label>
              <label>
                <span>{contact.messageLabel}</span>
                <textarea name="message" rows={4} placeholder={contact.messagePlaceholder} />
              </label>
              <button className="button button-light form-submit" type="submit">
                {contact.submitLabel} <span>↗</span>
              </button>
              <p className="form-status" id="form-status" role="status">{contact.statusText}</p>
            </form>
          </div>
          <footer className="site-footer section-shell">
            <a className="brand brand-light" href="#top" aria-label={site.brandAriaLabel}>{brand(settings)}</a>
            <p>{site.location}</p>
            <div>
              <a href={site.telegramUrl}>{site.telegramLabel}</a>
              <a href={site.emailUrl}>{site.emailLabel}</a>
              <a href="#top">{site.backToTopLabel}</a>
            </div>
          </footer>
        </section>
      </main>

      <div className="preview-modal" id="preview-modal" aria-hidden="true">
        <div className="preview-backdrop" data-close-preview />
        <div className="preview-dialog" role="dialog" aria-modal="true" aria-labelledby="preview-title" tabIndex={-1}>
          <div className="preview-header">
            <div>
              <span className="preview-kicker" id="preview-kind">{preview.defaultKind}</span>
              <h2 id="preview-title">{preview.defaultTitle}</h2>
              <p id="preview-tags">{preview.defaultTags}</p>
            </div>
            <div className="preview-actions">
              <a className="preview-external" id="preview-external" href="#" target="_blank" rel="noopener">{preview.externalLabel} ↗</a>
              <button className="preview-close" type="button" data-close-preview aria-label={preview.closeLabel}>×</button>
            </div>
          </div>
          <div className="browser-frame">
            <div className="browser-bar"><span><i /><i /><i /></span><small id="preview-url">{preview.browserLabel}</small><b>↗</b></div>
            <div className="browser-screen"><div className="frame-loader" id="frame-loader"><i /> {preview.loaderText}</div><iframe id="preview-frame" title={preview.frameTitle} loading="lazy" allow="fullscreen" /></div>
          </div>
          <p className="preview-hint">{preview.hint}</p>
        </div>
      </div>
      <Script src="/portfolio.js" strategy="afterInteractive" />
    </>
  )
}
