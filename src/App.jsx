import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Code2, Calculator, Flame, Calendar, ChevronRight, Play, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import './App.css'

// Learning data from learning-progress.json
const learningData = {
  python_cs50p: {
    name: "Python (CS50P)",
    icon: <Code2 size={20} />,
    color: "#3776ab",
    gradient: "linear-gradient(135deg, #3776ab 0%, #ffd43b 100%)",
    current_week: 5,
    current_topic: "File I/O - Reading/Writing Files",
    total_lessons: 12,
    lessons_completed: 12,
    streak_days: 13,
    started: "2026-02-09",
    last_completed: "2026-02-21",
    lessons: [
      { day: 1, title: "Intro to Functions", done: true },
      { day: 2, title: "Parameters + Return Values", done: true },
      { day: 3, title: "Conditionals (if/elif/else)", done: true },
      { day: 4, title: "Loops (for/while)", done: true },
      { day: 5, title: "Nested Loops + Loop Control", done: true },
      { day: 6, title: "Exceptions - try/except", done: true },
      { day: 7, title: "Libraries - Standard Library", done: true },
      { day: 8, title: "Third-Party Libraries - PyPI", done: true },
      { day: 9, title: "APIs with requests", done: true },
      { day: 10, title: "OOP Basics - Classes", done: true },
      { day: 11, title: "Unit Testing - pytest", done: true },
      { day: 12, title: "File I/O - open(), CSV", done: true }
    ],
    todayLesson: {
      title: "File I/O Mastery",
      description: "Learn to read/write files, work with CSV data, and use context managers.",
      code: `# Reading a file line by line
with open('data.txt', 'r') as file:
    for line in file:
        print(line.strip())

# Writing to a file
with open('output.txt', 'w') as file:
    file.write('Hello, World!')

# Working with CSV
import csv

with open('data.csv', 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(row['name'])`,
      exercise: "Write a function that reads a CSV file and returns the sum of a numeric column."
    }
  },
  math_for_ai: {
    name: "Math for AI/ML",
    icon: <Calculator size={20} />,
    color: "#ff6b6b",
    gradient: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
    current_module: "probability_stats",
    current_topic: "Bayes' Theorem - Updating beliefs with evidence",
    total_lessons: 12,
    lessons_completed: 12,
    streak_days: 13,
    started: "2026-02-09",
    last_completed: "2026-02-21",
    module_progress: {
      "Linear Algebra": 100,
      "Calculus": 100,
      "Probability & Statistics": 75,
      "Optimization": 0
    },
    lessons: [
      { day: 1, title: "What is a Vector?", done: true },
      { day: 2, title: "Dot Product + Cosine Similarity", done: true },
      { day: 3, title: "Matrices + Matrix Multiplication", done: true },
      { day: 4, title: "Derivatives", done: true },
      { day: 5, title: "Chain Rule", done: true },
      { day: 6, title: "Partial Derivatives", done: true },
      { day: 7, title: "Gradient Vector", done: true },
      { day: 8, title: "Gradient Descent", done: true },
      { day: 9, title: "Convexity", done: true },
      { day: 10, title: "Train/Validation/Test Split", done: true },
      { day: 11, title: "Normal Distribution", done: true },
      { day: 12, title: "Bayes' Theorem", done: true }
    ],
    todayLesson: {
      title: "Bayes' Theorem Deep Dive",
      description: "Update your beliefs with evidence using P(A|B) = P(B|A) × P(A) / P(B)",
      code: `# Bayes' Theorem in Python
# P(Disease|Positive) = P(Positive|Disease) * P(Disease) / P(Positive)

def bayes_theorem(prior, likelihood, evidence):
    """
    prior: P(A) - initial belief
    likelihood: P(B|A) - probability of evidence given hypothesis
    evidence: P(B) - total probability of evidence
    """
    posterior = (likelihood * prior) / evidence
    return posterior

# Example: Medical test
p_disease = 0.01  # 1% prevalence
p_pos_given_disease = 0.95  # 95% true positive rate
p_pos = 0.059  # Total positive rate

p_disease_given_pos = bayes_t(p_disease, p_pos_given_disease, p_pos)
print(f"P(Disease|Positive) = {p_disease_given_pos:.1%}")  # ~16.1%`,
      exercise: "A spam filter has 95% accuracy. If 10% of emails are spam, what's the probability an email is spam given it's flagged?"
    }
  }
}

const ProgressBar = ({ progress, color, gradient }) => (
  <div className="progress-container">
    <motion.div 
      className="progress-bar"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      style={{ 
        background: gradient || color,
        boxShadow: `0 0 20px ${color}40`
      }}
    />
  </div>
)

const LessonTimeline = ({ lessons, color }) => (
  <div className="timeline">
    {lessons.map((lesson, idx) => (
      <motion.div 
        key={idx}
        className={`timeline-item ${lesson.done ? 'done' : ''}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.05 }}
      >
        <div className="timeline-dot" style={{ 
          background: lesson.done ? color : '#2a2a3a',
          boxShadow: lesson.done ? `0 0 10px ${color}60` : 'none'
        }}>
          {lesson.done && <CheckCircle size={12} />}
        </div>
        <div className="timeline-content">
          <span className="timeline-day">Day {lesson.day}</span>
          <span className="timeline-title">{lesson.title}</span>
        </div>
      </motion.div>
    ))}
  </div>
)

const CodeBlock = ({ code, language }) => (
  <div className="code-block">
    <div className="code-header">
      <span className="code-lang">{language}</span>
      <div className="code-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
    <pre className="code-content code-font">{code}</pre>
  </div>
)

const TrackCard = ({ track, data }) => {
  const [expanded, setExpanded] = useState(false)
  const progress = (data.lessons_completed / data.total_lessons) * 100
  
  return (
    <motion.div 
      className="track-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <div className="track-header">
        <div className="track-icon" style={{ 
          background: `${data.color}20`,
          color: data.color 
        }}>
          {data.icon}
        </div>
        <div className="track-info">
          <h3>{data.name}</h3>
          <p>{data.current_topic}</p>
        </div>
        <div className="track-progress">
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>
      
      <ProgressBar progress={progress} color={data.color} gradient={data.gradient} />
      
      <div className="track-stats">
        <div className="stat">
          <Flame size={16} style={{ color: '#ff6b6b' }} />
          <span>{data.streak_days} day streak</span>
        </div>
        <div className="stat">
          <CheckCircle size={16} style={{ color: '#4ade80' }} />
          <span>{data.lessons_completed} lessons done</span>
        </div>
        <div className="stat">
          <Clock size={16} style={{ color: '#60a5fa' }} />
          <span>Week {data.current_week}</span>
        </div>
      </div>
      
      <div className="today-section">
        <div className="today-header">
          <Play size={16} style={{ color: data.color }} />
          <span>Today's Focus</span>
        </div>
        <h4>{data.todayLesson.title}</h4>
        <p className="today-desc">{data.todayLesson.description}</p>
        <CodeBlock code={data.todayLesson.code} language={track === 'python_cs50p' ? 'python' : 'python'} />
        <div className="exercise-box">
          <span className="exercise-label">Practice Exercise:</span>
          <p>{data.todayLesson.exercise}</p>
        </div>
      </div>
      
      <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Hide' : 'Show'} All Lessons
        <ChevronRight size={16} className={expanded ? 'rotate' : ''} />
      </button>
      
      {expanded && <LessonTimeline lessons={data.lessons} color={data.color} />}
    </motion.div>
  )
}

const StreakCalendar = () => {
  // Generate last 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date
  })
  
  return (
    <div className="streak-calendar">
      <h3><Flame size={18} style={{ color: '#ff6b6b' }} /> Learning Streak</h3>
      <div className="calendar-grid">
        {days.map((date, idx) => {
          const isActive = idx >= 17 // Last 13 days active based on data
          return (
            <motion.div
              key={idx}
              className={`calendar-day ${isActive ? 'active' : ''}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.02 }}
              title={date.toLocaleDateString()}
            >
              {isActive && <Flame size={12} />}
            </motion.div>
          )
        })}
      </div>
      <p className="streak-text">13 days strong! Keep it up!</p>
    </div>
  )
}

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <motion.div 
          className="header-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1><BookOpen size={28} /> Learning Dashboard</h1>
          <p className="header-subtitle">Track your journey through CS50P & Math for AI</p>
        </motion.div>
      </header>
      
      <main className="app-main">
        <div className="dashboard-grid">
          <div className="tracks-column">
            <TrackCard track="python_cs50p" data={learningData.python_cs50p} />
            <TrackCard track="math_for_ai" data={learningData.math_for_ai} />
          </div>
          
          <div className="sidebar">
            <StreakCalendar />
            
            <div className="summary-card">
              <h3><TrendingUp size={18} /> Overall Progress</h3>
              <div className="summary-stat">
                <span className="summary-number">24</span>
                <span className="summary-label">Lessons Completed</span>
              </div>
              <div className="summary-stat">
                <span className="summary-number">13</span>
                <span className="summary-label">Day Streak</span>
              </div>
              <div className="summary-stat">
                <span className="summary-number">2</span>
                <span className="summary-label">Active Tracks</span>
              </div>
            </div>
            
            <div className="next-steps">
              <h3><Calendar size={18} /> Recommended Next</h3>
              <ul>
                <li>Complete File I/O exercises</li>
                <li>Practice Bayes' Theorem problems</li>
                <li>Review Gradient Descent</li>
                <li>Start Optimization module</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Built by Alice | Nightly Build 2026-02-22</p>
      </footer>
    </div>
  )
}

export default App
