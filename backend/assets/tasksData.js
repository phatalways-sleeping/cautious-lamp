const { Task, CooperatedTask } = require("../models/taskModel");

module.exports = [
  new Task({
    creator: "65a1a85cfd837a6b0806c579", // Replace with a valid ObjectId
    scheduledDate: new Date("2024-01-14"),
    category: "Development", // Add a category
    title: "Write a blog post about Mongoose",
    priority: "high",
    status: "not-started",
    description:
      "Write a detailed blog post explaining Mongoose features and usage",
    dueDate: new Date("2024-01-20"),
  }),
  new Task({
    creator: "65a1a85cfd837a6b0806c579", // Replace with a valid ObjectId
    scheduledDate: new Date("2024-01-15"),
    category: "Design", // Add a category
    title: "Review product designs",
    priority: "medium",
    status: "not-started",
    description: "Review the new product designs and provide feedback",
    dueDate: new Date("2024-01-21"),
  }),
  new Task({
    creator: "65a1a85cfd837a6b0806c579", // Replace with a valid ObjectId
    scheduledDate: new Date("2024-01-16"),
    category: "Social Media", // Add a category
    notes: "", // Optional notes can be added here
    attachments: [], // Optional attachments can be listed here
    steps: [
      { title: "Download new brand assets.", isCompleted: true },
      {
        title: "Update Facebook, Twitter, Instagram, and LinkedIn profiles.",
        isCompleted: false,
      },
      {
        title: "Update social media bios.",
        description: "Add new tagline.",
        notes: "Use the new tagline from the brand guidelines.",
      },
    ],
    title: "Update social media profiles with new branding",
    priority: "medium",
    status: "not-started",
    description:
      "Refresh logos, cover photos, and bios across all platforms to reflect the updated brand guidelines.",
    dueDate: new Date("2024-01-19"),
  }),
  new Task({
    creator: "65a1a85cfd837a6b0806c579", // Replace with a valid ObjectId
    scheduledDate: new Date("2024-01-13"),
    category: "Travel", // Add a category
    notes: "", // Optional notes can be added here
    attachments: [], // Optional attachments can be listed here
    steps: [
      { title: "Book flight tickets.", isCompleted: true },
      { title: "Register for the conference.", notes: "Early bird discount!" },
      {
        title: "Create a packing list and itinerary.",
        notes: "Don't forget chargers!",
      },
    ],
    title: "Organize upcoming conference trip",
    priority: "high",
    status: "not-started",
    description:
      "Secure travel arrangements, accommodations, and conference registration.",
    dueDate: new Date("2024-01-17"),
  }),
  new Task({
    creator: "65a1a85cfd837a6b0806c57b", // Replace with a valid ObjectId
    scheduledDate: new Date("2024-01-20"),
    category: "Marketing", // Add a category
    notes: "", // Optional notes can be added here
    attachments: [], // Optional attachments can be listed here
    steps: [
      { title: "Identify top competitors." },
      {
        title: "Gather information on their marketing channels and campaigns.",
        description: "Use a spreadsheet to organize your findings.",
      },
      {
        title: "Analyze strengths, weaknesses, and opportunities.",
        isCompleted: true,
      },
    ],
    title: "Research competitor marketing strategies",
    priority: "medium",
    status: "not-started",
    description:
      "Analyze marketing campaigns and tactics used by key competitors.",
    dueDate: new Date("2024-01-22"),
  }),
  new Task({
    creator: "65a1a85cfd837a6b0806c57b", // Replace with a valid ObjectId
    scheduledDate: new Date("2024-01-23"),
    category: "Website", // Add a category
    notes: "", // Optional notes can be added here
    attachments: [], // Optional attachments can be listed here
    steps: [
      {
        title: "Recruit volunteer testers.",
        notes: "Offer a small incentive.",
      },
      {
        title: "Prepare a testing script with specific tasks.",
        notes: "Include a mix of easy and challenging tasks.",
      },
      {
        title: "Observe and document user interactions.",
        description: "Use a screen recording tool.",
      },
      {
        title: "Compile feedback and prioritize improvements.",
        notes: "Use a spreadsheet.",
      },
    ],
    title: "Conduct website usability testing",
    priority: "high",
    status: "not-started",
    description:
      "Identify any potential issues with website navigation and user experience.",
    dueDate: new Date("2024-01-25"),
  }),
  new Task({
    creator: "65a1a85cfd837a6b0806c57b", // Replace with a valid ObjectId
    scheduledDate: new Date("2024-01-15"),
    category: "Organization", // Add a category
    notes: "", // Optional notes can be added here
    attachments: [], // Optional attachments can be listed here
    steps: [
      {
        title: "Discard or file unnecessary documents and physical materials.",
        description: "Use the 4-box method.",
      },
      {
        title: "Organize digital files into folders and subfolders.",
        notes: "Use a consistent naming convention.",
      },
      {
        title: "Clean and sanitize your workspace surfaces.",
        isCompleted: true,
      },
    ],
    title: "Clean and organize project workspace",
    priority: "low",
    status: "not-started",
    description: "Create a clutter-free environment to enhance productivity.",
    dueDate: new Date("2024-01-18"),
  }),
  new CooperatedTask({
    creator: "65a1a85cfd837a6b0806c57a", // Replace with a valid ObjectId
    assignee: "65a1a85cfd837a6b0806c57b",
    scheduledDate: new Date("2024-01-17"),
    category: "Marketing", // Add a category
    notes: "", // Optional notes can be added here
    attachments: [], // Optional attachments can be listed here
    steps: [
      {
        title:
          "Brainstorm content ideas aligned with target audience and marketing goals.",
        description: "Use a mind map to organize your ideas.",
      },
      {
        title: "Schedule publication dates and assign ownership.",
        isCompleted: true,
      },
      {
        title: "Create outlines or rough drafts for key content pieces.",
        notes: "Use a spreadsheet to track progress.",
      },
    ],
    title: "Develop a content calendar for next quarter",
    priority: "medium",
    status: "not-started",
    description:
      "Plan blog posts, social media content, and other marketing materials.",
    dueDate: new Date("2024-01-20"),
  }),
  new CooperatedTask({
    creator: "65a1a85cfd837a6b0806c57a", // Replace with a valid ObjectId
    assignee: "65a1a85cfd837a6b0806c57b",
    scheduledDate: new Date("2024-01-24"),
    category: "Brainstorming", // Add a category
    title: "Conduct team brainstorming session for Q2 project ideas",
    priority: "high",
    status: "not-started",
    description:
      "Facilitate a creative session to generate innovative project ideas for the second quarter.",
    steps: [
      { title: "Prepare brainstorming prompts and materials." },
      { title: "Invite all team members and ensure participation." },
      { title: "Set clear guidelines and encourage active participation." },
      { title: "Document all ideas and suggestions." },
      { title: "Analyze and prioritize potential projects." },
    ],
    dueDate: new Date("2024-01-26"),
  }),
  new CooperatedTask({
    creator: "65a1a85cfd837a6b0806c57a", // Replace with a valid ObjectId
    assignee: "65a1a85cfd837a6b0806c57b",
    scheduledDate: new Date("2024-01-21"),
    category: "SEO", // Add a category
    title: "Update website SEO to improve organic traffic",
    priority: "medium",
    status: "not-started",
    description:
      "Optimize website content and technical aspects for better search engine ranking.",
    steps: [
      { title: "Research targeted keywords and user intent." },
      { title: "Optimize website title tags and meta descriptions." },
      { title: "Enhance internal linking and page structure." },
      { title: "Submit website to search engine consoles." },
      { title: "Monitor and analyze website traffic over time." },
    ],
    dueDate: new Date("2024-02-02"),
  }),
];
