import React from 'react';
import { render, screen } from '@testing-library/react';
import JobCard from '@/components/JobCard';

// Mock the components that JobCard might use
jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: any) => <span data-testid="badge" {...props}>{children}</span>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button data-testid="button" {...props}>{children}</button>,
}));

describe('JobCard', () => {
  const mockJob = {
    id: 'test-job-id',
    title: 'Test Job',
    description: 'Test job description',
    location: 'Addis Ababa',
    job_type: 'full-time',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    slug: 'test-job',
    featured: true,
    deadline: '2024-12-31',
    application_link: 'https://example.com/apply',
    category_id: 'test-category-id',
    company_id: 'test-company-id',
    posted_date: '2024-01-01T00:00:00Z',
    requirements: 'Test requirements',
    responsibilities: 'Test responsibilities',
    telegram_posted: true,
    companies: {
      id: 'test-company-id',
      name: 'Test Company',
      description: 'Test company description',
      location: 'Addis Ababa',
      logo: null,
      logo_url: null,
      website: 'https://testcompany.com',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    categories: {
      id: 'test-category-id',
      name: 'Test Category',
      slug: 'test-category',
      description: 'Test category description',
      icon: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  };

  it('renders job title correctly', () => {
    render(<JobCard job={mockJob} />);
    
    expect(screen.getByText(mockJob.title)).toBeInTheDocument();
  });

  it('renders company name correctly', () => {
    render(<JobCard job={mockJob} />);
    
    expect(screen.getByText(mockJob.companies.name)).toBeInTheDocument();
  });

  it('renders job location correctly', () => {
    render(<JobCard job={mockJob} />);
    
    expect(screen.getByText(mockJob.location)).toBeInTheDocument();
  });

  it('renders job type correctly', () => {
    render(<JobCard job={mockJob} />);
    
    expect(screen.getByText(mockJob.job_type)).toBeInTheDocument();
  });

  it('shows featured badge for featured jobs', () => {
    render(<JobCard job={mockJob} />);
    
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('does not show featured badge for non-featured jobs', () => {
    const nonFeaturedJob = { ...mockJob, featured: false };
    render(<JobCard job={nonFeaturedJob} />);
    
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });

  it('displays deadline when provided', () => {
    render(<JobCard job={mockJob} />);
    
    expect(screen.getByText(/deadline/i)).toBeInTheDocument();
  });

  it('renders application link when provided', () => {
    render(<JobCard job={mockJob} />);
    
    const applyButton = screen.getByRole('button', { name: /apply/i });
    expect(applyButton).toBeInTheDocument();
  });

  it('handles missing company data gracefully', () => {
    const jobWithoutCompany = { ...mockJob, companies: undefined };
    render(<JobCard job={jobWithoutCompany} />);
    
    expect(screen.getByText(mockJob.title)).toBeInTheDocument();
    // Should not crash and should still render other content
  });

  it('handles missing category data gracefully', () => {
    const jobWithoutCategory = { ...mockJob, categories: undefined };
    render(<JobCard job={jobWithoutCategory} />);
    
    expect(screen.getByText(mockJob.title)).toBeInTheDocument();
    // Should not crash and should still render other content
  });

  it('truncates long descriptions', () => {
    const jobWithLongDescription = {
      ...mockJob,
      description: 'A'.repeat(200), // Very long description
    };
    
    render(<JobCard job={jobWithLongDescription} />);
    
    const description = screen.getByText(/A+/);
    expect(description.textContent?.length).toBeLessThan(200);
  });

  it('applies correct CSS classes for styling', () => {
    const { container } = render(<JobCard job={mockJob} />);
    
    const cardElement = container.querySelector('[data-testid="job-card"]') || container.firstChild;
    expect(cardElement).toHaveClass('bg-card');
  });

  it('is accessible with proper ARIA labels', () => {
    render(<JobCard job={mockJob} />);
    
    // Check for proper heading structure
    const jobTitle = screen.getByRole('heading', { name: mockJob.title });
    expect(jobTitle).toBeInTheDocument();
    
    // Check for proper link labels
    const applyLink = screen.getByRole('link', { name: /apply/i });
    expect(applyLink).toBeInTheDocument();
  });
});
