// Mock AI service for question generation and scoring
export class AIService {
  constructor() {
    this.questionBank = {
      easy: [
        {
          id: 'easy_1',
          question: "Tell me about yourself and your background.",
          category: "Introduction",
          expectedKeywords: ["experience", "background", "education", "skills"]
        },
        {
          id: 'easy_2', 
          question: "Why are you interested in this position?",
          category: "Motivation",
          expectedKeywords: ["interested", "passion", "career", "growth", "company"]
        },
        {
          id: 'easy_3',
          question: "What are your greatest strengths?",
          category: "Self-assessment",
          expectedKeywords: ["strengths", "skills", "positive", "contribute"]
        },
        {
          id: 'easy_4',
          question: "Describe a time when you worked well in a team.",
          category: "Teamwork",
          expectedKeywords: ["team", "collaboration", "together", "group"]
        }
      ],
      medium: [
        {
          id: 'medium_1',
          question: "Tell me about a challenging project you worked on and how you overcame the obstacles.",
          category: "Problem Solving",
          expectedKeywords: ["challenge", "problem", "solution", "overcome", "learned"]
        },
        {
          id: 'medium_2',
          question: "How do you handle tight deadlines and multiple priorities?",
          category: "Time Management",
          expectedKeywords: ["deadline", "prioritize", "organize", "manage", "efficient"]
        },
        {
          id: 'medium_3',
          question: "Describe a situation where you had to learn something new quickly.",
          category: "Learning Ability",
          expectedKeywords: ["learn", "quickly", "adapt", "new", "skill"]
        },
        {
          id: 'medium_4',
          question: "Give me an example of when you had to deal with a difficult colleague or client.",
          category: "Communication",
          expectedKeywords: ["difficult", "communication", "resolve", "conflict", "professional"]
        }
      ],
      hard: [
        {
          id: 'hard_1',
          question: "Describe a time when you failed at something and what you learned from it.",
          category: "Resilience",
          expectedKeywords: ["failure", "mistake", "learned", "improve", "growth"]
        },
        {
          id: 'hard_2',
          question: "How would you approach a situation where you disagree with your manager's decision?",
          category: "Leadership",
          expectedKeywords: ["disagree", "respectful", "discuss", "alternative", "professional"]
        },
        {
          id: 'hard_3',
          question: "Tell me about a time when you had to make a difficult decision with limited information.",
          category: "Decision Making",
          expectedKeywords: ["decision", "limited", "information", "risk", "analysis"]
        },
        {
          id: 'hard_4',
          question: "Describe how you would handle a situation where a project you're leading is behind schedule.",
          category: "Project Management",
          expectedKeywords: ["behind", "schedule", "leadership", "plan", "communicate"]
        }
      ]
    };
  }

  // Generate questions for the interview
  generateInterviewQuestions() {
    const easyQuestions = this.getRandomQuestions(this.questionBank.easy, 2);
    const mediumQuestions = this.getRandomQuestions(this.questionBank.medium, 2);
    const hardQuestions = this.getRandomQuestions(this.questionBank.hard, 2);

    return [
      ...easyQuestions.map(q => ({ ...q, difficulty: 'easy', timeLimit: 20 })),
      ...mediumQuestions.map(q => ({ ...q, difficulty: 'medium', timeLimit: 60 })),
      ...hardQuestions.map(q => ({ ...q, difficulty: 'hard', timeLimit: 120 }))
    ];
  }

  getRandomQuestions(questions, count) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Score an individual answer
  scoreAnswer(question, answer) {
    const { expectedKeywords, difficulty } = question;
    const answerText = answer.toLowerCase();
    
    // Count keyword matches
    const matchedKeywords = expectedKeywords.filter(keyword => 
      answerText.includes(keyword.toLowerCase())
    );
    
    // Base score calculation
    const keywordScore = (matchedKeywords.length / expectedKeywords.length) * 40;
    
    // Length bonus (encouraging detailed answers)
    const lengthScore = Math.min(answer.length / 100, 20);
    
    // Difficulty multiplier
    const difficultyMultiplier = {
      easy: 1.0,
      medium: 1.1,
      hard: 1.2
    };
    
    const baseScore = (keywordScore + lengthScore) * difficultyMultiplier[difficulty];
    
    // Add some randomness to make it more realistic
    const randomFactor = 0.8 + (Math.random() * 0.4);
    const finalScore = Math.min(Math.round(baseScore * randomFactor), 100);
    
    return {
      score: finalScore,
      feedback: this.generateFeedback(question, answer, matchedKeywords),
      matchedKeywords,
      answerLength: answer.length
    };
  }

  generateFeedback(question, answer, matchedKeywords) {
    const feedback = [];
    
    if (matchedKeywords.length === 0) {
      feedback.push("Consider addressing the key aspects of the question more directly.");
    } else if (matchedKeywords.length < question.expectedKeywords.length / 2) {
      feedback.push("Good start, but try to cover more relevant points.");
    } else {
      feedback.push("Well-structured answer that covers key points.");
    }
    
    if (answer.length < 50) {
      feedback.push("Try to provide more detail in your response.");
    } else if (answer.length > 500) {
      feedback.push("Good detail, but consider being more concise.");
    }
    
    return feedback.join(' ');
  }

  // Generate final interview summary
  generateFinalSummary(interviewData) {
    const { candidate, answers, scores } = interviewData;
    
    const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
    const averageScore = Math.round(totalScore / scores.length);
    
    const strengths = this.identifyStrengths(answers, scores);
    const areasForImprovement = this.identifyImprovements(answers, scores);
    
    const overallRating = this.getOverallRating(averageScore);
    
    return {
      candidateId: candidate.id,
      candidateName: candidate.name,
      overallScore: averageScore,
      overallRating,
      totalQuestions: answers.length,
      strengths,
      areasForImprovement,
      detailedScores: scores.map((score, index) => ({
        questionNumber: index + 1,
        question: answers[index].question,
        score: score.score,
        feedback: score.feedback,
        difficulty: answers[index].difficulty
      })),
      summary: this.generateSummaryText(candidate, averageScore, strengths, areasForImprovement),
      completedAt: new Date().toISOString()
    };
  }

  identifyStrengths(answers, scores) {
    const strengths = [];
    const highScores = scores.filter((score, index) => score.score >= 80);
    
    highScores.forEach((score, index) => {
      const question = answers[index];
      switch (question.category) {
        case 'Problem Solving':
          strengths.push('Strong problem-solving abilities');
          break;
        case 'Communication':
          strengths.push('Excellent communication skills');
          break;
        case 'Leadership':
          strengths.push('Demonstrates leadership qualities');
          break;
        case 'Teamwork':
          strengths.push('Collaborative team player');
          break;
        default:
          strengths.push(`Strong performance in ${question.category.toLowerCase()}`);
      }
    });
    
    return [...new Set(strengths)];
  }

  identifyImprovements(answers, scores) {
    const improvements = [];
    const lowScores = scores.filter((score, index) => score.score < 60);
    
    lowScores.forEach((score, index) => {
      const question = answers[index];
      switch (question.category) {
        case 'Problem Solving':
          improvements.push('Work on structured problem-solving approach');
          break;
        case 'Communication':
          improvements.push('Practice clear and concise communication');
          break;
        case 'Leadership':
          improvements.push('Develop leadership and decision-making skills');
          break;
        case 'Time Management':
          improvements.push('Improve time management and prioritization');
          break;
        default:
          improvements.push(`Focus on ${question.category.toLowerCase()} skills`);
      }
    });
    
    return [...new Set(improvements)];
  }

  getOverallRating(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  }

  generateSummaryText(candidate, score, strengths, improvements) {
    let summary = `${candidate.name} completed the interview with an overall score of ${score}/100. `;
    
    if (strengths.length > 0) {
      summary += `Key strengths include ${strengths.join(', ')}. `;
    }
    
    if (improvements.length > 0) {
      summary += `Areas for development include ${improvements.join(', ')}. `;
    }
    
    summary += `The candidate demonstrated ${this.getOverallRating(score).toLowerCase()} performance overall.`;
    
    return summary;
  }
}

export default new AIService();
