export function TactLinkSection() {
  return (
    <section className="tactlink-landing-section">
      <div className="tactlink-landing-container">
        <div className="tactlink-landing-card">
          <span className="tactlink-badge-top">POWERED BY TACTLINK</span>

          <div className="tactlink-card-header">
            <div className="tactlink-logo-box">
              <img src="/images/tactlink.png" alt="TactLink Logo" />
            </div>
            <h2>
              Connect smarter with <br />
              <span>TactLink</span>
            </h2>
          </div>

          <p className="tactlink-desc">
            Experience smarter networking and modern digital business cards untuk kebutuhan acara Anda.
          </p>

          <div className="tactlink-features-list">
            <div className="tactlink-feature-item">
              <span className="tactlink-check-icon">✓</span>
              Digital participant access & e-badge
            </div>
            <div className="tactlink-feature-item">
              <span className="tactlink-check-icon">✓</span>
              Quick QR check-in saat acara
            </div>
            <div className="tactlink-feature-item">
              <span className="tactlink-check-icon">✓</span>
              Kartu nama digital untuk networking peserta
            </div>
          </div>

          {/* Tombol Kunjungi Website Utama */}
          <a
            href="https://tactlink.com"
            target="_blank"
            rel="noreferrer"
            className="tactlink-main-btn"
          >
            <span>Visit TactLink</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>

          {/* Tombol App Store & Google Play dengan Ikon */}
          <div className="tactlink-stores-row">
            <a
              href="https://apps.apple.com/id/app/tactlink/id1469516661"
              target="_blank"
              rel="noreferrer"
              className="tactlink-store-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 5.75c.67-.82 1.12-1.96.99-3.1-.97.04-2.16.65-2.86 1.47-.62.72-1.16 1.88-1 3.01 1.09.08 2.2-.56 2.87-1.38z"/></svg>
              <span>App Store</span>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.tactlink.app&pli=1"
              target="_blank"
              rel="noreferrer"
              className="tactlink-store-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><path d="M3.609 1.814L13.792 12 3.61 22.186a1.51 1.51 0 0 1-.36-.999V2.813c0-.39.13-.73.36-.999zM15.208 13.416l2.197 2.198-11.233 6.49c-.61.35-1.17.29-1.506-.05l10.542-8.638zM15.208 10.584L4.666 1.946c.336-.34.896-.4 1.506-.05l11.233 6.49-2.197 2.198zM18.113 13.31l2.456 1.418c.84.485.84 1.281 0 1.766l-2.456 1.418-2.315-2.315 2.315-2.287z"/></svg>
              <span>Google Play</span>
            </a>
          </div>

          {/* Statistik Footer Card */}
          <div className="tactlink-card-footer">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: "6px" }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              10,000+ Cards Shared
            </span>
            <span className="tactlink-footer-divider" />
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: "6px" }}><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              Available in 8 Countries
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}