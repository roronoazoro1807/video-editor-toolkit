# Video Editor's Toolkit

![Video Editor's Toolkit](https://placeholder.svg?height=300&width=800)

A professional suite of interactive tools designed specifically for video editors, filmmakers, and content creators. This toolkit provides calculators and generators that streamline your workflow and help you make better technical decisions.

## Table of Contents

- [Video Editor's Toolkit](#video-editors-toolkit)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Tools](#tools)
    - [Aspect Ratio Calculator](#aspect-ratio-calculator)
    - [Export Settings Optimizer](#export-settings-optimizer)
    - [Storage Calculator](#storage-calculator)
    - [Shot List Generator](#shot-list-generator)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Development](#development)
    - [Troubleshooting](#troubleshooting)

## Overview

Video Editor's Toolkit is a Next.js application that provides a collection of interactive tools to help video editors with common technical calculations and planning tasks. The toolkit features a clean, dark-themed interface designed for readability and ease of use, with responsive layouts that work well on all devices.

The project aims to handle the technical details so you can focus on what matters most - telling compelling stories through video.

## Features

- **Dark Theme**: Easy on the eyes for long editing sessions
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Client-Side Calculations**: Immediate results without server delays
- **Interactive Visualizations**: Visual representations of aspect ratios and other data
- **Export Functionality**: Save or copy results for use in other applications
- **Modern UI**: Clean, intuitive interface with subtle animations

## Tools

### Aspect Ratio Calculator

![Aspect Ratio Calculator](https://placeholder.svg?height=200&width=400)

The Aspect Ratio Calculator helps you determine the optimal dimensions when converting between different aspect ratios.

**Features:**
- Input original width and height
- Select from common aspect ratios (16:9, 1:1, 9:16, 4:3, etc.) or create custom ratios
- Choose between crop or pad methods
- Visualize how the frame will be cropped or padded
- View common export resolutions for different platforms
- Copy results with one click

**Usage:**
1. Enter your original width and height
2. Select your target aspect ratio
3. Choose between crop or pad method
4. View the calculated dimensions and visualization
5. Click on common resolutions to quickly set them as your original dimensions

**Technical Details:**
- Calculations happen client-side for immediate results
- Canvas-based visualization shows exactly how your content will be affected
- Maintains pixel count as much as possible when cropping

### Export Settings Optimizer

![Export Settings Optimizer](https://placeholder.svg?height=200&width=400)

The Export Settings Optimizer provides recommended export settings based on your destination platform, content type, and quality requirements.

**Features:**
- Select destination platform (YouTube, Instagram, TikTok, etc.)
- Choose content type (live action, animation, screen recording, etc.)
- Set quality preset (draft, standard, high quality, maximum)
- Specify video duration to estimate file size
- Get platform-specific tips and recommendations
- Export or copy settings

**Usage:**
1. Select your destination platform
2. Choose your content type
3. Set your quality preset
4. Adjust the video duration slider
5. View recommended codec, resolution, bitrate, and audio settings
6. Export or copy the settings

**Technical Details:**
- Intelligent recommendations based on platform requirements
- Adjusts settings based on content type (e.g., lower bitrate for animation)
- Calculates estimated file size based on bitrate and duration
- Platform-specific tips provide additional context and best practices

### Storage Calculator

![Storage Calculator](https://placeholder.svg?height=200&width=400)

The Storage Calculator helps you estimate storage requirements for different video formats and calculate how much footage can fit on your drives.

**Features:**
- Calculate storage requirements based on codec, resolution, and duration
- Compare different codecs in an interactive chart
- Calculate how many minutes of footage can fit on a specified drive
- Get storage recommendations and tips
- Toggle between "Calculate Storage" and "Calculate Duration" modes

**Usage:**
1. Select your codec, resolution, and frame rate
2. In "Calculate Storage" mode, enter the duration to see required storage
3. In "Calculate Duration" mode, select storage size to see available recording time
4. Compare different codecs by selecting them in the comparison section
5. View storage tips for optimal workflow

**Technical Details:**
- Accurate bitrate data for various codecs and resolutions
- Interactive chart using Recharts for visual comparison
- Calculations account for both video and audio data
- Recommendations based on industry best practices

### Shot List Generator

![Shot List Generator](https://placeholder.svg?height=200&width=400)

The Shot List Generator helps you create professional shot lists with time estimates and storyboard layouts.

**Features:**
- Input project information (title, director, DoP, shoot date)
- Add scenes and shots with detailed information
- Select shot types, camera movements, and equipment
- Estimate time needed for each shot
- Toggle between shot list and storyboard views
- Calculate total estimated time
- Export shot list as PDF

**Usage:**
1. Enter project information
2. Add shots with scene number, shot number, and description
3. Select shot type, camera movement, and equipment
4. Estimate time needed for each shot
5. Add notes for specific requirements
6. Toggle to storyboard view to visualize the sequence
7. Export the completed shot list as PDF

**Technical Details:**
- Dynamic form with add/remove functionality
- Intelligent scene/shot numbering
- Equipment selection with toggle buttons
- Summary statistics for total shots, scenes, and time
- Storyboard view for visual planning

## Installation

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/video-editors-toolkit.git
cd video-editors-toolkit
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

### Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

**Avoiding Port Conflicts**

If you're experiencing issues with port conflicts or multiple server instances, use:

```bash
npm run dev:clean
# or
yarn dev:clean
```

This command will:
1. Remove the `.next` directory to prevent permission issues
2. Start the server on the default port

**Important: Properly Starting and Stopping the Server**

To avoid issues with multiple server instances and port conflicts:

1. **Starting the server**: Always ensure no other Next.js instances are running before starting a new one.

2. **Stopping the server**: 
   - Press `Ctrl+C` in the terminal where the server is running to properly terminate it.
   - If you closed the terminal without stopping the server, you may need to kill the Node.js processes.

3. **Killing Node.js processes (Windows)**:
   ```bash
   # In Command Prompt
   taskkill /F /IM node.exe
   
   # In Git Bash or similar
   taskkill //F //IM node.exe
   ```

4. **Killing Node.js processes (Mac/Linux)**:
   ```bash
   pkill -f node
   ```

### Troubleshooting

**Port Already in Use**

If you see a message like `Port 3000 is in use, trying 3001 instead`, it means there's already a Node.js process running on that port. To fix this:

1. Stop all Node.js processes as described above.
2. Clear the `.next` directory to resolve any permission issues:
   ```bash
   rm -rf .next
   ```
3. Start the development server again.

**Permission Errors**

If you encounter permission errors like `EPERM: operation not permitted`, try:

1. Stop all Node.js processes.
2. Delete the `.next` directory:
   ```bash
   rm -rf .next
   ```
3. Start the development server again.

**Black Screen or 404 Errors**

If you see a black screen or 404 errors when accessing the application:

1. Check the terminal for any error messages.
2. Ensure you're using the correct port (check the terminal output for the URL).
3. Try clearing your browser cache or opening in an incognito window.
4. Restart the development server after stopping all Node.js processes.
