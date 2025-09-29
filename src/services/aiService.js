//   import axios from "axios";

//   export class AIService {
//     constructor() {
//       this.apiKey = import.meta.env.VITE_GROQ_API_KEY; // Store your API key in env
//       this.apiUrl = "https://api.groq.com/openai/v1/chat/completions"; // Groq API endpoint
//     }

//     // Generate questions based on resume
//     async generateInterviewQuestions(resumeText) {
//     // Check if API key is available
//     if (!this.apiKey || this.apiKey === 'your_groq_api_key_here') {
//       console.warn("Groq API key not configured. Using fallback questions.");
//       return this.getFallbackQuestions();
//     }

//     // Check if resume text exists (even if short)
//     if (!resumeText || resumeText.trim().length === 0) {
//       console.warn("No resume text provided, using fallback questions.");
//       return this.getFallbackQuestions();
//     }

//     // If resume text is extremely short, use fallback but still try AI
//     if (resumeText.trim().length < 5) {
//       console.warn("Resume text extremely short, using fallback questions.");
//       return this.getFallbackQuestions();
//     }

//       try {
//       console.log("Making Groq API request for question generation...");
//       console.log("API Key present:", !!this.apiKey);
//       console.log("Resume text length:", resumeText?.length || 0);
//       console.log("Resume text preview:", resumeText?.substring(0, 200) + "...");
        
//         const response = await axios.post(
//           this.apiUrl,
//           {
//             model: "llama-3.1-8b-instant",
//             messages: [
//               {
//                 role: "system",
//                 content: "You are a technical interview assistant. Generate 6 technical interview questions based on the skills, projects, and educational background mentioned in the resume. Focus on:\n- Technical skills and technologies mentioned\n- Projects and work experience described\n- Educational background and certifications\n- Programming languages, frameworks, tools listed\n\nCreate questions that test practical knowledge and experience with the technologies mentioned. Return ONLY a valid JSON array with objects containing id, question, category, and difficulty fields. Mix of easy (2), medium (2), and hard (2) questions. Make questions specific to the technologies and skills in the resume."
//               },
//             {
//               role: "user",
//               content: `Resume content: "${resumeText}"\n\nAnalyze the resume and generate 6 technical interview questions that focus on:\n1. Programming languages, frameworks, and technologies mentioned\n2. Projects and work experience described\n3. Educational background and certifications\n4. Technical skills and tools listed\n\nCreate questions that test practical knowledge and hands-on experience with the specific technologies mentioned in the resume. Focus on real-world scenarios and problem-solving with these technologies.`
//             }
//             ],
//             temperature: 0.7,
//             max_tokens: 1500,
//             stream: false
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${this.apiKey}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//       // Parse the response and format questions
//       const content = response.data.choices[0].message.content;
//       console.log("Groq API response:", content);
      
//       // Try to parse JSON, handle various response formats
//       let questionsData;
//       try {
//         // Remove markdown code blocks if present
//         let cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
//         // If the response doesn't start with [, try to find JSON array
//         if (!cleanContent.startsWith('[')) {
//           const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
//           if (jsonMatch) {
//             cleanContent = jsonMatch[0];
//           }
//         }
        
//         console.log("Cleaned content for parsing:", cleanContent);
//         questionsData = JSON.parse(cleanContent);
        
//         // Ensure it's an array
//         if (!Array.isArray(questionsData)) {
//           throw new Error("Response is not an array");
//         }
        
//       } catch (parseError) {
//         console.error("Failed to parse JSON response:", parseError);
//         console.log("Raw content:", content);
//         console.log("Attempting to create questions from text response...");
        
//         // Try to extract questions from text response
//         const questionMatches = content.match(/\d+\.\s*([^?\n]+[?])/g);
//         if (questionMatches && questionMatches.length >= 3) {
//           questionsData = questionMatches.map((match, index) => ({
//             id: index + 1,
//             question: match.replace(/^\d+\.\s*/, '').trim(),
//             category: "General",
//             difficulty: index < 2 ? "easy" : index < 4 ? "medium" : "hard"
//           }));
//           console.log("Extracted questions from text:", questionsData);
//         } else {
//           console.log("Could not extract questions from response, using fallback");
//           return this.getFallbackQuestions();
//         }
//       }
      
//       const mappedQuestions = questionsData.map((q, index) => ({
//         id: q.id || index + 1,
//         question: q.question || `Question ${index + 1}`,
//         category: q.category || "General",
//         difficulty: q.difficulty || (index < 2 ? "easy" : index < 4 ? "medium" : "hard"),
//         timeLimit: q.difficulty === "easy" ? 20 : q.difficulty === "medium" ? 60 : 120,
//       }));
      
//       // Ensure we have at least 3 questions
//       if (mappedQuestions.length < 3) {
//         console.warn("Not enough questions generated, using fallback");
//         return this.getFallbackQuestions();
//       }
      
//       return mappedQuestions;
//     } catch (error) {
//       console.error("Error fetching interview questions:", error.message);
//       console.log("Using fallback questions due to API error");
//       // Return fallback questions if API fails
//       return this.getFallbackQuestions();
//     }
//   }

//   // Fallback questions if API fails
//   getFallbackQuestions() {
//       return [
//         {
//           id: 1,
//           question: "Tell me about your technical background and the programming languages you're most comfortable with.",
//           category: "Technical Skills",
//           difficulty: "easy",
//           timeLimit: 20
//         },
//         {
//           id: 2,
//           question: "Describe a technical project you've worked on recently. What technologies did you use and what challenges did you face?",
//           category: "Projects",
//           difficulty: "easy",
//           timeLimit: 20
//         },
//         {
//           id: 3,
//           question: "Explain a complex technical problem you solved. Walk me through your approach and the solution you implemented.",
//           category: "Problem Solving",
//           difficulty: "medium",
//           timeLimit: 60
//         },
//         {
//           id: 4,
//           question: "How do you stay updated with the latest technologies and trends in your field? Give examples of recent learning.",
//           category: "Learning",
//           difficulty: "medium",
//           timeLimit: 60
//         },
//         {
//           id: 5,
//           question: "Describe your experience with version control, testing, and deployment processes. How do you ensure code quality?",
//           category: "Development Practices",
//           difficulty: "hard",
//           timeLimit: 120
//         },
//         {
//           id: 6,
//           question: "Explain a time when you had to learn a new technology quickly for a project. How did you approach the learning process?",
//           category: "Adaptability",
//           difficulty: "hard",
//           timeLimit: 120
//         }
//       ];
//     }

//     // Score answer using Groq API
//     async scoreAnswer(question, answer) {
//       // Check if API key is available
//       if (!this.apiKey || this.apiKey === 'your_groq_api_key_here') {
//         console.warn("Groq API key not configured. Using fallback scoring.");
//         return this.getFallbackScore(question, answer);
//       }

//       try {
//         const response = await axios.post(
//           this.apiUrl,
//           {
//             model: "llama-3.1-8b-instant",
//             messages: [
//               {
//                 role: "system",
//                 content: "You are a technical interview evaluator. Score the candidate's answer on a scale of 0-100 based on:\n- Technical accuracy and depth of knowledge\n- Practical experience demonstrated\n- Problem-solving approach\n- Communication of technical concepts\n\nProvide constructive feedback focusing on technical aspects. Return JSON with score, feedback, and matchedKeywords fields."
//               },
//               {
//                 role: "user",
//                 content: `Question: ${question?.question || 'Interview question'}\nDifficulty: ${question?.difficulty || 'medium'}\nAnswer: ${answer}\n\nPlease evaluate this answer and provide a score with feedback.`
//               }
//             ],
//             temperature: 0.3,
//             max_tokens: 500
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${this.apiKey}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const content = response.data.choices[0].message.content;
//         console.log("Groq scoring response:", content);
        
//         let scoreData;
//         try {
//           // Remove markdown code blocks if present
//           const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
//           scoreData = JSON.parse(cleanContent);
//         } catch (parseError) {
//           console.error("Failed to parse scoring JSON:", parseError);
//           console.log("Raw scoring content:", content);
//           // Use fallback scoring if JSON parsing fails
//           return this.getFallbackScore(question, answer);
//         }
        
//         return {
//           score: scoreData.score || 75,
//           feedback: scoreData.feedback || "Good answer, keep it up!",
//           matchedKeywords: scoreData.matchedKeywords || [],
//           answerLength: answer.length,
//         };
//       } catch (error) {
//         console.error("Error scoring answer:", error.message);
//         console.log("Using fallback scoring due to API error");
//         return this.getFallbackScore(question, answer);
//       }
//     }

//     // Fallback scoring when API is not available
//     getFallbackScore(question, answer) {
//       const answerLength = answer.length;
//       const difficulty = question?.difficulty || 'medium';
      
//       // Simple scoring based on answer length and difficulty
//       let baseScore = 60;
      
//       if (answerLength > 100) baseScore += 20;
//       if (answerLength > 200) baseScore += 10;
//       if (difficulty === 'easy') baseScore += 10;
//       if (difficulty === 'hard') baseScore -= 5;
      
//       const score = Math.min(100, Math.max(0, baseScore));
      
//       let feedback = "Technical answer received and recorded.";
//       if (score >= 80) {
//         feedback = "Excellent technical response! You demonstrated strong technical knowledge and practical experience.";
//       } else if (score >= 60) {
//         feedback = "Good technical answer! Consider adding more specific technical details and examples.";
//       } else {
//         feedback = "Answer received. Try to provide more detailed technical explanations and examples.";
//       }
      
//       return {
//         score: score,
//         feedback: feedback,
//         matchedKeywords: [],
//         answerLength: answerLength,
//       };
//     }

//     // Generate final interview summary
//     generateFinalSummary({ candidate, answers, scores }) {
//       const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
//       const averageScore = Math.round(totalScore / answers.length);
      
//       return {
//         candidateName: candidate.name,
//         overallScore: averageScore,
//         totalQuestions: answers.length,
//         answers: answers,
//         completedAt: new Date().toISOString(),
//         feedback: `Interview completed with an average score of ${averageScore}/100. ${averageScore >= 80 ? 'Excellent performance!' : averageScore >= 60 ? 'Good performance with room for improvement.' : 'Consider practicing more interview questions.'}`
//       };
//     }
//   }

//   const aiServiceInstance = new AIService();
// export default aiServiceInstance;

import axios from "axios";

export class AIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY;
    this.apiUrl = "https://api.groq.com/openai/v1/chat/completions";
  }

  // Retry wrapper for API requests
  async withRetry(fn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  // Safe JSON parsing
  safeJSONParse(str) {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  // Generate interview questions based on resume
  async generateInterviewQuestions(resumeText) {
    if (!this.apiKey || this.apiKey === "your_groq_api_key_here") {
      console.warn("Groq API key not configured. Using fallback questions.");
      return this.getFallbackQuestions();
    }

    if (!resumeText || resumeText.trim().length < 5) {
      console.warn("Invalid or very short resume text. Using fallback.");
      return this.getFallbackQuestions();
    }

    try {
      console.log("Making Groq API request for question generation...");
      console.log("API Key present:", !!this.apiKey);
      console.log("Resume text length:", resumeText?.length || 0);

      const response = await this.withRetry(() =>
        axios.post(
          this.apiUrl,
          {
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content:
                  "You are a technical interview assistant. Generate 6 technical interview questions based on the skills, projects, and educational background mentioned in the resume. Focus on:\n- Technical skills and technologies mentioned\n- Projects and work experience described\n- Educational background and certifications\n- Programming languages, frameworks, tools listed\n\nCreate questions that test practical knowledge and experience with the technologies mentioned. Return ONLY a valid JSON array with objects containing id, question, category, and difficulty fields. Mix of easy (2), medium (2), and hard (2) questions.",
              },
              {
                role: "user",
                content: `Resume content: "${resumeText}"\n\nAnalyze the resume and generate 6 technical interview questions that focus on:\n1. Programming languages, frameworks, and technologies mentioned\n2. Projects and work experience described\n3. Educational background and certifications\n4. Technical skills and tools listed\n\nCreate questions that test practical knowledge and hands-on experience with the specific technologies mentioned in the resume.`,
              },
            ],
            temperature: 0.7,
            max_tokens: 1500,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              "Content-Type": "application/json",
            },
          }
        )
      );

      const content =
        response.data?.choices?.[0]?.message?.content ||
        response.data?.choices?.[0]?.messages?.[0]?.content ||
        "";

      let cleanContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      if (!cleanContent.startsWith("[")) {
        const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) cleanContent = jsonMatch[0];
      }

      let questionsData = this.safeJSONParse(cleanContent);

      // If JSON parsing failed, fallback to text-based extraction
      if (!questionsData || !Array.isArray(questionsData)) {
        console.warn("Failed JSON parsing. Extracting from text...");
        const questionMatches = content.match(/\d+\.\s*([^?\n]+[?])/g);
        if (questionMatches && questionMatches.length >= 3) {
          questionsData = questionMatches.map((match, index) => ({
            id: index + 1,
            question: match.replace(/^\d+\.\s*/, "").trim(),
            category: "General",
            difficulty:
              index < 2 ? "easy" : index < 4 ? "medium" : "hard",
          }));
        } else {
          return this.getFallbackQuestions();
        }
      }

      const mappedQuestions = questionsData.map((q, index) => ({
        id: q.id || index + 1,
        question: q.question || `Question ${index + 1}`,
        category: q.category || "General",
        difficulty:
          q.difficulty ||
          (index < 2 ? "easy" : index < 4 ? "medium" : "hard"),
        timeLimit:
          q.difficulty === "easy"
            ? 20
            : q.difficulty === "medium"
            ? 60
            : 120,
      }));

      if (mappedQuestions.length < 3) {
        console.warn("Too few questions generated. Using fallback.");
        return this.getFallbackQuestions();
      }

      return mappedQuestions;
    } catch (error) {
      console.error("Error fetching interview questions:", error.message);
      return this.getFallbackQuestions();
    }
  }

  // Fallback questions
  getFallbackQuestions() {
    return [
      {
        id: 1,
        question:
          "Tell me about your technical background and the programming languages you're most comfortable with.",
        category: "Technical Skills",
        difficulty: "easy",
        timeLimit: 20,
      },
      {
        id: 2,
        question:
          "Describe a technical project you've worked on recently. What technologies did you use and what challenges did you face?",
        category: "Projects",
        difficulty: "easy",
        timeLimit: 20,
      },
      {
        id: 3,
        question:
          "Explain a complex technical problem you solved. Walk me through your approach and the solution you implemented.",
        category: "Problem Solving",
        difficulty: "medium",
        timeLimit: 60,
      },
      {
        id: 4,
        question:
          "How do you stay updated with the latest technologies and trends in your field? Give examples of recent learning.",
        category: "Learning",
        difficulty: "medium",
        timeLimit: 60,
      },
      {
        id: 5,
        question:
          "Describe your experience with version control, testing, and deployment processes. How do you ensure code quality?",
        category: "Development Practices",
        difficulty: "hard",
        timeLimit: 120,
      },
      {
        id: 6,
        question:
          "Explain a time when you had to learn a new technology quickly for a project. How did you approach the learning process?",
        category: "Adaptability",
        difficulty: "hard",
        timeLimit: 120,
      },
    ];
  }

  // Score answer
  async scoreAnswer(question, answer) {
    // Always check for invalid answers first, regardless of API availability
    const answerLength = answer.length;
    const answerText = answer.toLowerCase().trim();
    
    // Check for invalid or very poor answers first
    if (answerLength < 3 || answerText === 'jkl' || answerText === 'asd' || answerText === 'test' || answerText === 'hello') {
      return {
        score: 10,
        feedback: "This appears to be a test input or invalid response. Please provide a proper technical answer to the question.",
        matchedKeywords: [],
        answerLength,
      };
    }

    if (!this.apiKey || this.apiKey === "your_groq_api_key_here") {
      console.warn("Groq API key not configured. Using fallback scoring.");
      return this.getFallbackScore(question, answer);
    }

    try {
      const response = await this.withRetry(() =>
        axios.post(
          this.apiUrl,
          {
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content:
                  "You are a technical interview evaluator. Score the candidate's answer on a scale of 0-100 based on:\n- Technical accuracy and depth of knowledge\n- Practical experience demonstrated\n- Problem-solving approach\n- Communication of technical concepts\n- Code quality and implementation details\n\nBe strict with scoring:\n- 0-20: Invalid/test responses, completely off-topic\n- 21-40: Very poor answers with no technical content\n- 41-60: Basic answers lacking technical depth\n- 61-80: Good answers with some technical details\n- 81-100: Excellent answers with comprehensive technical knowledge\n\nProvide constructive feedback focusing on technical aspects. Return JSON with score, feedback, and matchedKeywords fields.",
              },
              {
                role: "user",
                content: `Question: ${
                  question?.question || "Interview question"
                }\nDifficulty: ${
                  question?.difficulty || "medium"
                }\nAnswer: ${answer}\n\nPlease evaluate this answer and provide a score with feedback.`,
              },
            ],
            temperature: 0.3,
            max_tokens: 500,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              "Content-Type": "application/json",
            },
          }
        )
      );

      const content =
        response.data?.choices?.[0]?.message?.content ||
        response.data?.choices?.[0]?.messages?.[0]?.content ||
        "";

      let cleanContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      let scoreData = this.safeJSONParse(cleanContent);

      if (!scoreData) {
        console.warn("Failed scoring JSON parse. Using fallback.");
        return this.getFallbackScore(question, answer);
      }

      // Validate the score from AI
      const aiScore = scoreData.score || 75;
      const validatedScore = Math.min(100, Math.max(0, aiScore));

      return {
        score: validatedScore,
        feedback: scoreData.feedback || "Answer evaluated successfully.",
        matchedKeywords: scoreData.matchedKeywords || [],
        answerLength: answer.length,
      };
    } catch (error) {
      console.error("Error scoring answer:", error.message);
      return this.getFallbackScore(question, answer);
    }
  }

  // Fallback scoring
  getFallbackScore(question, answer) {
    const answerLength = answer.length;
    const difficulty = question?.difficulty || "medium";
    const answerText = answer.toLowerCase().trim();

    // Check for invalid or very poor answers
    if (answerLength < 3 || answerText === 'jkl' || answerText === 'asd' || answerText === 'test' || answerText === 'hello') {
      return {
        score: 10,
        feedback: "This appears to be a test input or invalid response. Please provide a proper technical answer to the question.",
        matchedKeywords: [],
        answerLength,
      };
    }

    // Check for very short answers
    if (answerLength < 10) {
      return {
        score: 20,
        feedback: "Your answer is too short. Please provide a more detailed explanation with specific technical details and examples.",
        matchedKeywords: [],
        answerLength,
      };
    }

    // Check for non-technical answers
    const technicalKeywords = ['function', 'code', 'algorithm', 'data', 'structure', 'programming', 'python', 'javascript', 'java', 'optimize', 'performance', 'complexity', 'loop', 'variable', 'method', 'class', 'array', 'list', 'database', 'api', 'framework'];
    const hasTechnicalContent = technicalKeywords.some(keyword => answerText.includes(keyword));
    
    if (!hasTechnicalContent && answerLength < 50) {
      return {
        score: 30,
        feedback: "Your answer lacks technical depth. Please provide specific technical details, code examples, or programming concepts relevant to the question.",
        matchedKeywords: [],
        answerLength,
      };
    }

    // Calculate base score based on answer quality
    let baseScore = 40;
    
    // Length-based scoring
    if (answerLength >= 50) baseScore += 15;
    if (answerLength >= 100) baseScore += 15;
    if (answerLength >= 200) baseScore += 10;
    
    // Technical content scoring
    if (hasTechnicalContent) baseScore += 20;
    
    // Difficulty adjustment
    if (difficulty === "easy") baseScore += 5;
    if (difficulty === "hard") baseScore -= 5;
    
    // Check for code examples or specific technical details
    const hasCodeExample = answerText.includes('def ') || answerText.includes('function') || answerText.includes('return') || answerText.includes('for ') || answerText.includes('if ');
    if (hasCodeExample) baseScore += 10;
    
    // Check for optimization or complexity discussion
    const hasOptimization = answerText.includes('optimize') || answerText.includes('complexity') || answerText.includes('performance') || answerText.includes('efficient');
    if (hasOptimization) baseScore += 10;

    const score = Math.min(100, Math.max(0, baseScore));

    let feedback = "";
    if (score >= 85) {
      feedback = "Excellent technical response! You demonstrated strong technical knowledge with specific details and examples.";
    } else if (score >= 70) {
      feedback = "Good technical answer! You provided relevant technical information with some specific details.";
    } else if (score >= 50) {
      feedback = "Adequate answer. Consider adding more specific technical details, code examples, or implementation details.";
    } else if (score >= 30) {
      feedback = "Your answer needs more technical depth. Please provide specific programming concepts, code examples, or technical implementation details.";
    } else {
      feedback = "Please provide a proper technical answer with specific details, code examples, or programming concepts relevant to the question.";
    }

    return {
      score,
      feedback,
      matchedKeywords: [],
      answerLength,
    };
  }

  // Final summary
  generateFinalSummary({ candidate, questions, scores }) {
    const totalScore = scores.reduce(
      (sum, s) => sum + (s.score || 0),
      0
    );
    const averageScore = Math.round(totalScore / (scores.length || 1));

    // Determine overall rating
    const overallRating = this.getOverallRating(averageScore);
    
    // Generate detailed scores with proper structure
    const detailedScores = scores.map((s, i) => ({
      questionNumber: i + 1,
      question: s.question?.question || `Question ${i + 1}`,
      difficulty: s.question?.difficulty || 'medium',
      score: s.score || 0,
      feedback: s.feedback || 'No feedback provided',
      answer: s.answer || 'No answer provided'
    }));

    // Generate strengths and areas for improvement
    const { strengths, areasForImprovement } = this.analyzePerformance(scores);

    // Generate comprehensive summary
    const summary = this.generateComprehensiveSummary(averageScore, strengths, areasForImprovement);

    return {
      candidateName: candidate?.name || "Unknown",
      overallScore: averageScore,
      overallRating: overallRating,
      totalQuestions: scores.length,
      summary: summary,
      strengths: strengths,
      areasForImprovement: areasForImprovement,
      detailedScores: detailedScores,
      answers: scores.map((s, i) => ({
        question: questions?.[i]?.question || `Question ${i + 1}`,
        score: s.score,
        feedback: s.feedback,
      })),
      completedAt: new Date().toISOString(),
      feedback: `Interview completed with an average score of ${averageScore}/100. ${
        averageScore >= 80
          ? "Excellent performance!"
          : averageScore >= 60
          ? "Good performance with room for improvement."
          : "Consider practicing more interview questions."
      }`,
    };
  }

  // Get overall rating based on score
  getOverallRating(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  }

  // Analyze performance to extract strengths and areas for improvement
  analyzePerformance(scores) {
    const strengths = [];
    const areasForImprovement = [];

    // Analyze scores by difficulty
    const easyScores = scores.filter(s => s.question?.difficulty === 'easy').map(s => s.score || 0);
    const mediumScores = scores.filter(s => s.question?.difficulty === 'medium').map(s => s.score || 0);
    const hardScores = scores.filter(s => s.question?.difficulty === 'hard').map(s => s.score || 0);

    // Check strengths
    if (easyScores.length > 0 && easyScores.every(s => s >= 80)) {
      strengths.push('Strong performance on fundamental questions');
    }
    if (mediumScores.length > 0 && mediumScores.every(s => s >= 75)) {
      strengths.push('Good understanding of intermediate concepts');
    }
    if (hardScores.length > 0 && hardScores.every(s => s >= 70)) {
      strengths.push('Excellent problem-solving skills on complex questions');
    }

    // Check areas for improvement
    if (easyScores.length > 0 && easyScores.some(s => s < 70)) {
      areasForImprovement.push('Review fundamental concepts and basic technical knowledge');
    }
    if (mediumScores.length > 0 && mediumScores.some(s => s < 65)) {
      areasForImprovement.push('Practice intermediate-level problem solving');
    }
    if (hardScores.length > 0 && hardScores.some(s => s < 60)) {
      areasForImprovement.push('Focus on advanced technical concepts and complex problem solving');
    }

    // General feedback based on overall performance
    const avgScore = scores.reduce((sum, s) => sum + (s.score || 0), 0) / scores.length;
    
    if (avgScore >= 85) {
      strengths.push('Consistent high performance across all question types');
    } else if (avgScore < 60) {
      areasForImprovement.push('Consider additional study and practice with technical interview questions');
    }

    // Ensure we have at least some feedback
    if (strengths.length === 0) {
      strengths.push('Completed all interview questions successfully');
    }
    if (areasForImprovement.length === 0) {
      areasForImprovement.push('Continue practicing to maintain current performance level');
    }

    return { strengths, areasForImprovement };
  }

  // Generate comprehensive summary text
  generateComprehensiveSummary(overallScore, strengths, areasForImprovement) {
    let summary = `The candidate achieved an overall score of ${overallScore}/100. `;
    
    if (overallScore >= 90) {
      summary += "This represents an outstanding performance with excellent technical knowledge and communication skills. ";
    } else if (overallScore >= 80) {
      summary += "This demonstrates strong technical competency with good problem-solving abilities. ";
    } else if (overallScore >= 70) {
      summary += "This shows solid technical understanding with room for growth in certain areas. ";
    } else if (overallScore >= 60) {
      summary += "This indicates basic technical knowledge with significant opportunities for improvement. ";
    } else {
      summary += "This suggests the need for additional technical preparation and practice. ";
    }

    if (strengths.length > 0) {
      summary += `Key strengths include: ${strengths.join(', ')}. `;
    }

    if (areasForImprovement.length > 0) {
      summary += `Areas for improvement include: ${areasForImprovement.join(', ')}. `;
    }

    summary += "Overall, this interview provides valuable insights into the candidate's technical capabilities and areas for continued development.";

    return summary;
  }
}

const aiServiceInstance = new AIService();
export default aiServiceInstance;
