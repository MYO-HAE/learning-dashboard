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
    current_week: 7,
    current_topic: "OOP Inheritance & Special Methods - Extending classes with super()",
    total_lessons: 14,
    lessons_completed: 14,
    streak_days: 15,
    started: "2026-02-09",
    last_completed: "2026-02-23",
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
      { day: 12, title: "File I/O - open(), CSV", done: true },
      { day: 13, title: "Regular Expressions - re module", done: true },
      { day: 14, title: "OOP Inheritance - super(), __str__", done: true }
    ],
    todayLesson: {
      title: "OOP Inheritance Mastery",
      description: "Extend classes with inheritance, use super() to call parent methods, and implement special methods like __str__ and __repr__.",
      code: `# Inheritance in Python - Extending classes

class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def speak(self):
        raise NotImplementedError("Subclasses must implement speak()")
    
    def __str__(self):
        return f"{self.name} ({self.age} years old)"

class Dog(Animal):
    def __init__(self, name, age, breed):
        super().__init__(name, age)  # Call parent constructor
        self.breed = breed
    
    def speak(self):
        return f"{self.name} says Woof!"
    
    def __repr__(self):
        return f"Dog('{self.name}', {self.age}, '{self.breed}')"

# Usage
buddy = Dog("Buddy", 3, "Golden Retriever")
print(buddy)        # Uses __str__: Buddy (3 years old)
print(repr(buddy))  # Uses __repr__: Dog('Buddy', 3, 'Golden Retriever')
print(buddy.speak())  # Buddy says Woof!`,
      exercise: "Create a Cat class that inherits from Animal. Add a 'color' attribute and override speak() to return 'Meow!'."
    }
  },
  math_for_ai: {
    name: "Math for AI/ML",
    icon: <Calculator size={20} />,
    color: "#ff6b6b",
    gradient: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
    current_module: "probability_stats",
    current_topic: "Covariance and Correlation - Measuring relationships between variables",
    total_lessons: 14,
    lessons_completed: 14,
    streak_days: 15,
    started: "2026-02-09",
    last_completed: "2026-02-23",
    module_progress: {
      "Linear Algebra": 100,
      "Calculus": 100,
      "Probability & Statistics": 100,
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
      { day: 12, title: "Bayes' Theorem", done: true },
      { day: 13, title: "Expectation and Variance", done: true },
      { day: 14, title: "Covariance and Correlation", done: true }
    ],
    todayLesson: {
      title: "Covariance & Correlation Deep Dive",
      description: "Measure how two variables move together. Essential for feature selection and understanding data relationships.",
      code: `# Covariance and Correlation in Python
import numpy as np

# Sample data: Study hours vs Exam scores
study_hours = np.array([1, 2, 3, 4, 5, 6, 7, 8])
exam_scores = np.array([50, 55, 65, 70, 75, 85, 90, 95])

# Calculate covariance
covariance = np.cov(study_hours, exam_scores)[0, 1]
print(f"Covariance: {covariance:.2f}")
# Positive covariance: as study hours increase, scores tend to increase

# Calculate correlation coefficient (-1 to 1)
correlation = np.corrcoef(study_hours, exam_scores)[0, 1]
print(f"Correlation: {correlation:.4f}")
# 0.99 = very strong positive relationship

# Manual calculation of correlation
def correlation_coefficient(x, y):
    """Pearson correlation coefficient"""
    x_mean, y_mean = np.mean(x), np.mean(y)
    numerator = np.sum((x - x_mean) * (y - y_mean))
    denominator = np.sqrt(np.sum((x - x_mean)**2) * np.sum((y - y_mean)**2))
    return numerator / denominator

print(f"Manual correlation: {correlation_coefficient(study_hours, exam_scores):.4f}")`,
      exercise: "Given temperature [20, 22, 25, 28, 30] and ice cream sales [100, 120, 150, 180, 200], calculate the correlation. Is it positive or negative?"
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
          const isActive = idx >= 15 // Last 15 days active based on data
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
      <p className="streak-text">15 days strong! Module 3 complete!</p>
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
                <span className="summary-number">28</span>
                <span className="summary-label">Lessons Completed</span>
              </div>
              <div className="summary-stat">
                <span className="summary-number">15</span>
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
                <li>Practice OOP inheritance problems</li>
                <li>Build a class hierarchy project</li>
                <li>Review covariance/correlation</li>
                <li>Start Optimization module (Module 4)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Built by Alice | Nightly Build 2026-02-24 | v2.0 - Week 7 Complete</p>
      </footer>
    </div>
  )
}

export default App
