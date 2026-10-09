
export const paths = {
  tenants: {
    public: "/tenants/public",
    publicByCode: (code: string) => `/tenants/public/${code}`,
  },
  payments: {
    maintenanceStatus: "/payments/status/maintenance",
    initialize: "/payments/initialize",
    verifyCallback: "/payments/verify-callback",
    byReference: (reference: string) => `/payments/${reference}`,
  },
  receipts: {
    byMatric: "/receipts",
    verify: (reference: string) => `/receipts/verify/${reference}`,
    download: (reference: string) => `/receipts/${reference}/download`,
    byReference: (reference: string) => `/receipts/${reference}`,
  },
  onboarding: {
    banks: "/onboarding/banks",
    resolveAccount: "/onboarding/resolve-account",
    submit: "/onboarding",
    activate: "/onboarding/finance-directors/activate",
  },
  executives: {
    public: "/executives/public",
  },
  contactInfo: {
    public: "/contact-info/public",
  },
  socialLinks: {
    public: "/social-links/public",
  },
  hallOfFame: {
    public: "/hall-of-fame/public",
  },
  executiveSessions: {
    public: "/executive-sessions/public",
  },
  communityEvents: {
    public: "/community-events/public",
    publicById: (id: string) => `/community-events/public/${id}`,
  },
};
