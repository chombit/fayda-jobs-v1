import { Job } from '@/lib/supabase-helpers';

export interface JobPostingSchema {
  '@context': string;
  '@type': string;
  title: string;
  description: string;
  identifier?: {
    '@type': string;
    name: string;
    value: string;
  };
  datePosted: string;
  validThrough?: string;
  employmentType: string;
  workHours?: string;
  jobLocation?: {
    '@type': string;
    address: {
      '@type': string;
      addressLocality: string;
      addressCountry: string;
    };
  };
  hiringOrganization?: {
    '@type': string;
    name: string;
    sameAs?: string;
    logo?: string;
  };
  applicationContact?: {
    '@type': string;
    telephone?: string;
    email?: string;
  };
  responsibilities?: string;
  qualifications?: string;
  educationRequirements?: string;
  experienceRequirements?: string;
  skills?: string[];
  salaryCurrency?: string;
  baseSalary?: {
    '@type': string;
    currency: string;
    value: {
      '@type': string;
      minValue: number;
      maxValue: number;
    };
  };
  jobBenefits?: string[];
  industry?: string;
}

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    '@type': string;
    addressCountry: string;
    addressLocality: string;
  };
  contactPoint: {
    '@type': string;
    telephone?: string;
    email?: string;
    contactType: string;
  };
  sameAs?: string[];
}

export interface BreadcrumbListSchema {
  '@context': string;
  '@type': string;
  itemListElement: {
    '@type': string;
    position: number;
    name: string;
    item: string;
  }[];
}

export function generateJobPostingSchema(job: Job): JobPostingSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || '',
    identifier: {
      '@type': 'PropertyValue',
      name: 'Job ID',
      value: job.id,
    },
    datePosted: job.created_at,
    validThrough: job.deadline || undefined,
    employmentType: mapJobType(job.job_type),
    workHours: 'Full-time',
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'ET', // Ethiopia
      },
    },
    hiringOrganization: job.companies ? {
      '@type': 'Organization',
      name: job.companies.name,
    } : undefined,
    responsibilities: job.responsibilities || undefined,
    qualifications: job.requirements || undefined,
    industry: job.categories?.name || undefined,
  };
}

export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fayda Jobs',
    url: 'https://faydajobs.com',
    logo: 'https://faydajobs.com/faydajobs-logo.png',
    description: 'Find thousands of verified jobs from top companies, NGOs, and government institutions across Ethiopia. Your next career opportunity awaits.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ET',
      addressLocality: 'Addis Ababa',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
    },
    sameAs: [
      'https://t.me/faydajobs',
      'https://facebook.com/faydajobs',
      'https://linkedin.com/company/faydajobs',
    ],
  };
}

export function generateBreadcrumbListSchema(breadcrumbs: { name: string; url: string }[]): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };
}

function mapJobType(jobType: string): string {
  const typeMapping: Record<string, string> = {
    'full-time': 'FULL_TIME',
    'part-time': 'PART_TIME',
    'contract': 'CONTRACTOR',
    'temporary': 'TEMPORARY',
    'internship': 'INTERN',
    'volunteer': 'VOLUNTEER',
    'remote': 'FULL_TIME', // Default to full-time for remote
  };
  
  return typeMapping[jobType.toLowerCase()] || 'FULL_TIME';
}
