# Little Wins

A task management app designed specifically for neurodivergent people (ADHD, autism, and other neurodivergent conditions).

## What is Little Wins?

Little Wins helps neurodivergent people manage tasks in a way that works with how their brains function. Traditional task managers can be overwhelming, but Little Wins breaks tasks down into manageable steps, provides gentle support, and celebrates small victories.

### Key Features

- **AI-Powered Task Breakdown**: Automatically breaks large tasks into smaller, manageable steps
- **Gentle Reminders**: Supportive, non-judgmental language throughout
- **Energy-Aware**: Adapts to your current energy level (low, moderate, high)
- **Task Warrior**: Gamified progress tracking that rewards consistency, not perfection
- **Brain Dump**: Quick capture of thoughts and tasks without judgment
- **Snooze Feature**: Take breaks when you need them without guilt
- **Overwhelmed Support**: Built-in breathing exercises and supportive options when tasks feel too big
- **Visual Calm**: Soft colors and minimal design to reduce sensory overwhelm

## Who is this for?

Little Wins is designed for people who are:
- Neurodivergent (ADHD, autism, dyslexia, etc.)
- Overwhelmed by traditional productivity apps
- Looking for a gentler, more supportive approach to task management
- Wanting to celebrate small wins, not just big achievements

## Getting Started

### Prerequisites

You need Docker installed on your machine:

**macOS:**
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Install and launch Docker Desktop
3. Verify: `docker --version`

**Windows:**
1. Install WSL 2: `wsl --install`
2. Download Docker Desktop for Windows
3. Enable "Use WSL 2 based engine" during installation
4. Restart and verify: `docker --version`

**Linux:**
1. Install Docker using your distribution's package manager
2. Verify: `docker --version`

### Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd little-wins
```

2. **Set up your Groq API key:**
   - Get your API key from [Groq Console](https://console.groq.com)
   - Create a `.env` file in the project root:
   ```bash
   REACT_APP_GROQ_API_KEY=your_api_key_here
   ```

3. **Run with Docker:**
```bash
docker-compose up --build
```

4. **Access the app:**
   Open your browser to `http://localhost:3000`

## How It Works

1. **Onboarding**: Tell the app how you're feeling and your energy level
2. **Add Tasks**: Type what you need to do - the AI will analyze and break it down if needed
3. **Work Through Tasks**: Focus on one task at a time, with breaks when you need them
4. **Track Progress**: Watch your Task Warrior level up as you complete tasks
5. **Review**: See your accomplishments and celebrate your wins

## Features Explained

### AI Task Breakdown
When you add a task, the AI analyzes it and:
- Estimates difficulty and time
- Breaks large tasks (30+ minutes) into smaller steps
- Provides ADHD-friendly tips
- Limits breakdowns to 5 steps maximum to prevent overwhelm

### Task Warrior
A gamification system that tracks:
- **XP**: Earned by completing tasks
- **Focus**: Increases with consistency
- **Energy**: Grows when you complete tasks early or tackle hard tasks
- **Momentum**: Builds with streaks and fast completions

### Snooze Feature
If a task feels too much right now, you can snooze it. It'll come back later when you're ready.

### Overwhelmed Support
Click "I feel overwhelmed" to get:
- A breathing exercise
- Option to snooze the task
- Encouragement to try anyway

## Development

For local development without Docker:
```bash
npm install
npm start
```

## Project Structure

```
little-wins/
├── src/
│   ├── components/
│   │   ├── dashboard/      # Main dashboard components
│   │   ├── onboarding/     # Onboarding flow
│   │   └── common/         # Reusable components
│   ├── services/
│   │   └── groqService.ts  # AI integration
│   └── styles/             # Theme and styling
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Groq AI Integration

Little Wins uses Groq AI for:
- Task analysis and difficulty assessment
- Breaking down complex tasks
- Generating motivational quotes
- Providing ADHD-friendly tips

### Getting Your API Key

1. Visit [Groq Console](https://console.groq.com)
2. Sign up or log in
3. Create a new API key
4. Add it to your `.env` file as `REACT_APP_GROQ_API_KEY`

### Available Models

Default: `llama-3.1-8b-instant` (fastest). You can change this in `src/services/groqService.ts`.

## Common Commands

**Start:** `docker-compose up -d`  
**Stop:** `docker-compose down`  
**View logs:** `docker-compose logs -f`  
**Rebuild:** `docker-compose up --build -d`

## Troubleshooting

**Port 3000 in use?** Change the port in `docker-compose.yml`

**Container issues?** Check logs: `docker-compose logs`

**Clean rebuild:** `docker-compose down && docker-compose build --no-cache && docker-compose up -d`

## Security Note

⚠️ For production, API keys should be stored on a backend server. The current implementation embeds keys at build time via environment variables.

## Philosophy

Little Wins is built on the understanding that:
- Small steps are still progress
- Rest is valid
- Everyone's pace is different
- Overwhelm is real and okay
- Celebrating small wins matters

This app is designed to support, not pressure. You're doing enough.
