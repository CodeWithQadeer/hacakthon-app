const Complaint = require("../models/complaint.model");
const User = require("../models/user.model");

/**
 * AI Chatbot Controller - Handles natural language queries about complaints
 */
exports.handleChatbotQuery = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.userId;

    console.log('💬 Chatbot Query:', {
      message,
      userId,
      userRole: req.user.role
    });

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        response: "Please type a message to get started!" 
      });
    }

    const query = message.toLowerCase().trim();

    // Fetch user's complaints once
    const userComplaints = await Complaint.find({ userId })
      .sort({ createdAt: -1 });

    console.log(`📊 Found ${userComplaints.length} complaints for user ${userId}`);

    // ============================================
    // PATTERN 1: List all complaints / Check status
    // ============================================
    if (
      /\b(status|check|list|show|my complaints?|all|view)\b/.test(query) &&
      !/\b(latest|last|recent|pending|progress|resolved|about|find)\b/.test(query)
    ) {
      if (userComplaints.length === 0) {
        return res.json({
          response: "You haven't submitted any complaints yet. 😊\n\nWould you like to create one? Just click the 'Create Complaint' button!"
        });
      }

      let response = `📋 You have ${userComplaints.length} complaint(s):\n\n`;
      
      userComplaints.slice(0, 10).forEach((c, idx) => {
        const statusEmoji = 
          c.status === 'Resolved' ? '✅' : 
          c.status === 'In Progress' ? '🔄' : '⏳';
        
        response += `${idx + 1}. ${statusEmoji} "${c.title}"\n`;
        response += `   Status: ${c.status}\n`;
        response += `   Created: ${new Date(c.createdAt).toLocaleDateString()}\n\n`;
      });

      if (userComplaints.length > 10) {
        response += `... and ${userComplaints.length - 10} more!`;
      }

      return res.json({ response: response.trim() });
    }

    // ============================================
    // PATTERN 2: Latest/Recent/Last complaint
    // ============================================
    if (/\b(latest|last|recent|newest)\b/.test(query)) {
      if (userComplaints.length === 0) {
        return res.json({
          response: "You haven't submitted any complaints yet."
        });
      }

      const latest = userComplaints[0];
      const statusEmoji = 
        latest.status === 'Resolved' ? '✅' : 
        latest.status === 'In Progress' ? '🔄' : '⏳';

      let response = `🔍 Your latest complaint:\n\n`;
      response += `📌 Title: "${latest.title}"\n`;
      response += `${statusEmoji} Status: ${latest.status}\n`;
      response += `📅 Created: ${new Date(latest.createdAt).toLocaleDateString()}\n`;
      response += `📍 Location: ${latest.location?.address || 'Not specified'}\n\n`;

      if (latest.adminComments && latest.adminComments.length > 0) {
        const lastComment = latest.adminComments[latest.adminComments.length - 1];
        response += `💬 Admin Comment: "${lastComment.comment}"\n`;
        response += `   by ${lastComment.adminName} on ${new Date(lastComment.timestamp).toLocaleDateString()}`;
      } else {
        response += `💭 No admin comments yet.`;
      }

      return res.json({ response });
    }

    // ============================================
    // PATTERN 3: Count by status (Pending/In Progress/Resolved)
    // ============================================
    if (/\b(pending|in progress|resolved|how many)\b/.test(query)) {
      let targetStatus = null;
      
      if (/\bpending\b/.test(query)) targetStatus = 'Pending';
      else if (/\bin progress\b/.test(query)) targetStatus = 'In Progress';
      else if (/\bresolved\b/.test(query)) targetStatus = 'Resolved';

      if (targetStatus) {
        const count = userComplaints.filter(c => c.status === targetStatus).length;
        const emoji = 
          targetStatus === 'Resolved' ? '✅' : 
          targetStatus === 'In Progress' ? '🔄' : '⏳';
        
        return res.json({
          response: `${emoji} You have ${count} ${targetStatus.toLowerCase()} complaint(s).`
        });
      }

      // Show breakdown of all statuses
      const pending = userComplaints.filter(c => c.status === 'Pending').length;
      const inProgress = userComplaints.filter(c => c.status === 'In Progress').length;
      const resolved = userComplaints.filter(c => c.status === 'Resolved').length;

      return res.json({
        response: `📊 Your complaint status breakdown:\n\n⏳ Pending: ${pending}\n🔄 In Progress: ${inProgress}\n✅ Resolved: ${resolved}\n\nTotal: ${userComplaints.length}`
      });
    }

    // ============================================
    // PATTERN 4: Search by keyword
    // ============================================
    if (/\b(find|search|about|regarding|look for)\b/.test(query)) {
      // Extract keywords by removing common words
      const keywords = query
        .replace(/\b(find|search|about|regarding|look for|my|complaint|status|show|me|the|a|an)\b/g, '')
        .trim();

      if (keywords.length < 2) {
        return res.json({
          response: "Please provide a keyword to search for. For example: 'Find complaints about pothole'"
        });
      }

      const matches = userComplaints.filter(c => 
        c.title.toLowerCase().includes(keywords) ||
        c.description.toLowerCase().includes(keywords) ||
        c.category.toLowerCase().includes(keywords)
      );

      if (matches.length === 0) {
        return res.json({
          response: `🔍 No complaints found matching "${keywords}".\n\nTry searching for: pothole, garbage, streetlight, or other keywords.`
        });
      }

      let response = `🔍 Found ${matches.length} complaint(s) matching "${keywords}":\n\n`;
      
      matches.slice(0, 5).forEach((c, idx) => {
        const statusEmoji = 
          c.status === 'Resolved' ? '✅' : 
          c.status === 'In Progress' ? '🔄' : '⏳';
        
        response += `${idx + 1}. ${statusEmoji} "${c.title}"\n`;
        response += `   Status: ${c.status}\n`;
        response += `   Category: ${c.category}\n\n`;
      });

      return res.json({ response: response.trim() });
    }

    // ============================================
    // PATTERN 5: Summary/Overview
    // ============================================
    if (/\b(summary|overview|total|count|statistics|stats)\b/.test(query)) {
      const pending = userComplaints.filter(c => c.status === 'Pending').length;
      const inProgress = userComplaints.filter(c => c.status === 'In Progress').length;
      const resolved = userComplaints.filter(c => c.status === 'Resolved').length;

      const response = `📊 Your Complaint Summary:\n\n` +
        `Total Complaints: ${userComplaints.length}\n\n` +
        `⏳ Pending: ${pending}\n` +
        `🔄 In Progress: ${inProgress}\n` +
        `✅ Resolved: ${resolved}\n\n` +
        `Resolution Rate: ${userComplaints.length > 0 ? Math.round((resolved / userComplaints.length) * 100) : 0}%`;

      return res.json({ response });
    }

    // ============================================
    // DEFAULT: Help message
    // ============================================
    return res.json({
      response: `👋 Hi! I'm your complaint assistant. I can help you with:\n\n` +
        `📋 "Check my complaints" - List all your complaints\n` +
        `🔍 "Show latest complaint" - Get your most recent complaint\n` +
        `📊 "How many pending complaints?" - Count by status\n` +
        `🔎 "Find complaints about [keyword]" - Search complaints\n` +
        `📈 "Show summary" - Get overall statistics\n\n` +
        `Just type what you need! 😊`
    });

  } catch (error) {
    console.error("❌ Chatbot error:", error);
    return res.status(500).json({ 
      response: "Sorry, I encountered an error. Please try again! 😔" 
    });
  }
};
