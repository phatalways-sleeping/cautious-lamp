const { Task, CooperatedTask } = require("../models/taskModel");

module.exports = [
  new Task({
    creator: "65a1a85cfd837a6b0806c579", // Replace with a valid ObjectId
    scheduledDate: new Date("2024-01-14"),
    category: "Development", // Add a category
    completion: 0.0, // Initialize completion
    steps: ["Step 1", "Step 2", "Step 3"],
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
    completion: 0.0, // Initialize completion
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
    completion: 0.0, // Initialize completion
    notes: "", // Optional notes can be added here
    attachments: [], // Optional attachments can be listed here
    steps: [
      "Download new brand assets.",
      "Update Facebook, Twitter, Instagram, and LinkedIn profiles.",
      "Schedule launch posts for each platform.",
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
    completion: 0.0, // Initialize completion
    notes: "", // Optional notes can be added here
    attachments: [], // Optional attachments can be listed here
    steps: [
      "Book flights and hotel room.",
      "Register for the conference.",
      "Create a packing list and itinerary.",
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
    completion: 0.0, // Initialize completion
    notes: "", // Optional notes can be added here
    attachments: [], // Optional attachments can be listed here
    steps: [
      "Identify top competitors.",
      "Gather information on their marketing channels and campaigns.",
      "Analyze strengths, weaknesses, and opportunities.",
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
    completion: 0.0, // Initialize completion
    notes: "", // Optional notes can be added here
    attachments: [], // Optional attachments can be listed here
    steps: [
      "Recruit volunteer testers.",
      "Prepare a testing script with specific tasks.",
      "Observe and document user interactions.",
      "Compile feedback and prioritize improvements.",
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
    completion: 0.0, // Initialize completion
    notes: "", // Optional notes can be added here
    attachments: [], // Optional attachments can be listed here
    steps: [
      "Discard or file unnecessary documents and physical materials.",
      "Organize digital files into folders and subfolders.",
      "Clean and sanitize your workspace surfaces.",
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
    completion: 0.0, // Initialize completion
    notes: "", // Optional notes can be added here
    attachments: [], // Optional attachments can be listed here
    steps: [
      "Brainstorm content ideas aligned with target audience and marketing goals.",
      "Schedule publication dates and assign ownership.",
      "Create outlines or rough drafts for key content pieces.",
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
    completion: 0.0, // Initialize completion
    title: "Conduct team brainstorming session for Q2 project ideas",
    priority: "high",
    status: "not-started",
    description:
      "Facilitate a creative session to generate innovative project ideas for the second quarter.",
    steps: [
      "Prepare brainstorming prompts and materials.",
      "Invite all team members and ensure participation.",
      "Set clear guidelines and encourage active participation.",
      "Document all ideas and suggestions.",
      "Analyze and prioritize potential projects.",
    ],
    dueDate: new Date("2024-01-26"),
  }),
  new CooperatedTask({
    creator: "65a1a85cfd837a6b0806c57a", // Replace with a valid ObjectId
    assignee: "65a1a85cfd837a6b0806c57b",
    scheduledDate: new Date("2024-01-21"),
    category: "SEO", // Add a category
    completion: 0.0, // Initialize completion
    title: "Update website SEO to improve organic traffic",
    priority: "medium",
    status: "not-started",
    description:
      "Optimize website content and technical aspects for better search engine ranking.",
    steps: [
      "Research targeted keywords and user intent.",
      "Optimize website title tags and meta descriptions.",
      "Enhance internal linking and page structure.",
      "Submit website to search engine consoles.",
      "Monitor and analyze website traffic over time.",
    ],
    dueDate: new Date("2024-02-02"),
  }),
];
