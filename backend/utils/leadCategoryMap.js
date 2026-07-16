// backend/utils/leadCategoryMap.js
const CATEGORY_MAP = {
  'web-development': 'WEB_DEVELOPMENT',
  'mobile-app-development': 'MOBILE_APP_DEVELOPMENT',
  'ui-ux-design': 'UI_UX_DESIGN',
  'custom-software': 'CUSTOM_SOFTWARE',
  'other-service': 'OTHER_SERVICE',
  'portfolio-inquiry': 'PORTFOLIO_PROJECT',
  'similar-project': 'SIMILAR_TO_YOUR_WORK',
};

function toLeadCategoryEnum(value) {
  if (!value) return null;
  return CATEGORY_MAP[value] || null; // null if unrecognized, don't crash the insert
}

module.exports = { toLeadCategoryEnum };