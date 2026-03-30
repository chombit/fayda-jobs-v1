// Simple test job data to isolate the issue
const simpleJobData = {
  title: "Simple Test Job",
  company_id: null,
  location: "Addis Ababa",
  job_type: "Full-time",
  category_id: null,
  description: "Simple description without any special characters or formatting.",
  requirements: "Simple requirements:\n• Requirement 1\n• Requirement 2\n• Requirement 3",
  responsibilities: "Simple responsibilities:\n• Responsibility 1\n• Responsibility 2\n• Responsibility 3",
  application_link: "https://example.com/apply",
  deadline: null,
  featured: false
};

console.log('Simple Test Job Data:');
console.log('Title length:', simpleJobData.title.length);
console.log('Description length:', simpleJobData.description.length);
console.log('Requirements length:', simpleJobData.requirements.length);
console.log('Responsibilities length:', simpleJobData.responsibilities.length);
console.log('');
console.log('Copy this data into the admin form to test if simple text works.');
console.log('If this works but long text fails, the issue is text length related.');
console.log('If this also fails, the issue is with the database connection or form processing.');
