import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Top-level entries take a `sidebar-section-icon-*` className to get the
// section-header styling and icon defined in src/css/theme.css.
const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Get started',
      className: 'sidebar-section-icon-get-started',
      collapsed: false,
      items: [
        'get-started/what-is-wso2-cloud',
        'get-started/sign-up',
        'get-started/key-concepts',
      ],
    },
    {
      // Each service has its own docs site; these entries link out to it.
      type: 'category',
      label: 'Services',
      className: 'sidebar-section-icon-services',
      collapsed: false,
      items: [
        {
          type: 'link',
          label: 'Agent Management',
          href: 'https://wso2.com/agent-platform/docs/cloud/get-started/what-is-amp/',
        },
        {
          type: 'link',
          label: 'API Management',
          href: 'https://wso2.com/api-platform/docs/',
        },
        {
          type: 'link',
          label: 'Integration Management',
          href: 'https://wso2.com/integration-platform/docs/manage/cloud/overview',
        },
        {
          type: 'link',
          label: 'Identity and Access Management',
          href: 'https://wso2.com/identity-platform/docs/',
        },
        {
          type: 'link',
          label: 'Platform Engineering',
          href: 'https://wso2.com/engineering-platform/developer-platform/docs/',
        },
      ],
    },
    {
      type: 'category',
      label: 'Manage your organization',
      className: 'sidebar-section-icon-manage',
      collapsed: false,
      items: [
        'manage/organizations',
        'manage/view-organization-details',
        'manage/access-control',
        'manage/invite-users',
        'manage/manage-service-contacts',
        'manage/subscriptions-and-billing',
        'manage/manage-your-subscription',
        'manage/container-registries',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      className: 'sidebar-section-icon-architecture',
      collapsed: false,
      items: ['architecture/overview', 'architecture/data-planes'],
    },
    {
      type: 'category',
      label: 'Security and compliance',
      className: 'sidebar-section-icon-security',
      collapsed: false,
      items: ['security/overview', 'security/data-residency'],
    },
    {
      type: 'category',
      label: 'Reference',
      className: 'sidebar-section-icon-reference',
      collapsed: false,
      items: ['reference/faq', 'reference/glossary'],
    },
    {
      type: 'doc',
      id: 'support',
      className: 'sidebar-section-icon-support',
    },
  ],
};

export default sidebars;
