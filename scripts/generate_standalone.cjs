const fs = require('fs');
const path = require('path');

const boardB64 = fs.readFileSync('board.b64.txt', 'utf8').trim();
const titleB64 = fs.readFileSync('title.b64.txt', 'utf8').trim();
const avatarB64 = fs.readFileSync('avatar.b64.txt', 'utf8').trim();

console.log('Generating standalone HTML with verified assets...');

const htmlContent = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Snakes and Ladder</title>
  <meta name="description" content="Educational Snakes and Ladder learning game with customizable questions, trophies, and realistic 3D dice.">
  <meta property="og:title" content="Snakes and Ladder">
  <meta property="og:description" content="Educational Snakes and Ladder learning game with customizable questions, trophies, and realistic 3D dice.">
  <style>
    /* CSS RESET & SYSTEM ROUNDED FONTS */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    :root {
      --color-bg-deep: #030a1c;
      --color-royal-blue: #0876ed;
      --color-cyan: #40e8ff;
      --color-purple: #582bc2;
      --color-navy: #061c52;
      --color-gold: #ffd85b;
      --color-cream: #fffdf5;
      --color-cream-subtle: #f8f1de;
      --p1-color: #ff5d66;
      --p2-color: #1878ee;
      --p3-color: #18a75b;
      --p4-color: #8a4de1;
      --p5-color: #ef8b20;
      --font-stack: "Trebuchet MS", "Arial Rounded MT Bold", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    body {
      font-family: var(--font-stack);
      background: radial-gradient(circle at 50% 15%, #0c2d73 0%, #061e4f 35%, #030d22 100%);
      color: #f1f5f9;
      min-height: 100vh;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1.4;
    }

    /* FOCUS ACCESSIBILITY */
    button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
      outline: 3px solid var(--color-cyan);
      outline-offset: 2px;
    }

    /* HEADER */
    .app-header {
      width: 100%;
      max-width: 1320px;
      padding: 12px 20px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: nowrap;
    }

    .title-image-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
    }

    .title-image {
      width: min(72vw, 720px);
      height: 120px;
      object-fit: cover;
      object-position: left 40%;
      filter: drop-shadow(0 6px 14px rgba(2, 14, 40, 0.85));
      border-radius: 8px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .header-btn {
      background: linear-gradient(135deg, #0d3882 0%, #061c52 100%);
      color: #ffffff;
      border: 2px solid var(--color-cyan);
      border-radius: 9999px;
      padding: 10px 18px;
      font-size: 15px;
      font-weight: bold;
      font-family: inherit;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3);
      transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
      white-space: nowrap;
    }

    .header-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(64, 232, 255, 0.35);
      border-color: #79f1ff;
    }

    .header-btn:active {
      transform: translateY(0);
    }

    /* CONTAINER */
    .main-container {
      width: 100%;
      max-width: 1320px;
      padding: 10px 20px 40px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* SETTINGS SCREEN */
    .settings-panel {
      background: linear-gradient(180deg, rgba(8, 30, 78, 0.94) 0%, rgba(4, 17, 46, 0.97) 100%);
      border: 3px solid var(--color-cyan);
      box-shadow: 0 0 30px rgba(8, 118, 237, 0.5), inset 0 0 20px rgba(64, 232, 255, 0.2);
      border-radius: 24px;
      padding: 28px 32px;
      margin-bottom: 20px;
      backdrop-filter: blur(10px);
    }

    .settings-panel h1 {
      font-size: clamp(24px, 3.5vw, 36px);
      color: #ffffff;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6), 0 0 20px rgba(64, 232, 255, 0.6);
      margin-bottom: 6px;
    }

    .settings-panel .subtitle {
      color: #9ac2f8;
      font-size: 16px;
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: var(--color-gold);
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-shadow: 0 0 10px rgba(255, 216, 91, 0.4);
    }

    /* MODE CARDS */
    .mode-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .mode-card {
      background: linear-gradient(135deg, rgba(14, 46, 110, 0.8), rgba(7, 24, 66, 0.9));
      border: 2px solid rgba(64, 232, 255, 0.4);
      border-radius: 16px;
      padding: 16px 20px;
      color: #ffffff;
      font-size: 18px;
      font-weight: bold;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .mode-card:hover {
      border-color: var(--color-cyan);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(64, 232, 255, 0.3);
    }

    .mode-card[aria-pressed="true"] {
      border: 3px solid var(--color-gold);
      background: linear-gradient(135deg, rgba(24, 76, 175, 0.95), rgba(10, 36, 96, 0.95));
      box-shadow: 0 0 20px rgba(255, 216, 91, 0.6), inset 0 0 12px rgba(255, 216, 91, 0.2);
    }

    /* PLAYER COUNT BUTTONS */
    .player-count-group {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .count-btn {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: #092660;
      border: 2px solid rgba(64, 232, 255, 0.4);
      color: #ffffff;
      font-size: 18px;
      font-weight: bold;
      font-family: inherit;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: all 0.15s ease;
    }

    .count-btn:hover {
      border-color: var(--color-cyan);
    }

    .count-btn.active {
      background: var(--color-royal-blue);
      border-color: var(--color-gold);
      box-shadow: 0 0 12px rgba(255, 216, 91, 0.6);
      transform: scale(1.05);
    }

    /* PLAYER NAMES FORM */
    .names-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 14px;
      margin-bottom: 16px;
    }

    .name-input-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .name-label {
      font-size: 14px;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .name-input-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      display: inline-block;
      box-shadow: 0 0 6px currentColor;
    }

    .player-name-input {
      background: #05183f;
      border: 2px solid rgba(64, 232, 255, 0.4);
      border-radius: 10px;
      color: #ffffff;
      font-size: 15px;
      padding: 10px 14px;
      font-family: inherit;
      transition: border-color 0.2s;
    }

    .player-name-input:focus {
      border-color: var(--color-cyan);
    }

    .player-name-input:disabled {
      opacity: 0.65;
      background: #03102c;
      cursor: not-allowed;
    }

    .save-names-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .btn-green {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border: 2px solid #6ee7b7;
      color: #ffffff;
      border-radius: 12px;
      padding: 10px 22px;
      font-size: 16px;
      font-weight: bold;
      font-family: inherit;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .btn-green:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(16, 185, 129, 0.6);
    }

    .save-status-indicator {
      font-size: 15px;
      font-weight: bold;
      transition: color 0.2s ease;
    }

    .save-status-indicator.saved {
      color: #34d399;
    }

    .save-status-indicator.unsaved {
      color: #fbbf24;
    }

    /* QUESTION EDITOR DETAILS */
    .question-editor-details {
      background: rgba(4, 18, 48, 0.7);
      border: 2px solid rgba(64, 232, 255, 0.3);
      border-radius: 16px;
      padding: 16px 20px;
      margin-bottom: 28px;
    }

    .question-editor-details summary {
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      color: var(--color-cyan);
      user-select: none;
      list-style-position: inside;
      margin-bottom: 12px;
    }

    .bulk-editor-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 16px;
      margin-bottom: 16px;
    }

    .editor-col label {
      display: block;
      font-weight: bold;
      margin-bottom: 6px;
      color: #bfdbfe;
      font-size: 14px;
    }

    .bulk-textarea {
      width: 100%;
      height: 140px;
      background: #04122e;
      border: 2px solid rgba(64, 232, 255, 0.4);
      border-radius: 10px;
      color: #ffffff;
      padding: 10px;
      font-family: inherit;
      font-size: 14px;
      resize: vertical;
    }

    .bulk-actions {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .btn-blue {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      border: 2px solid var(--color-cyan);
      color: #ffffff;
      border-radius: 10px;
      padding: 9px 18px;
      font-size: 14px;
      font-weight: bold;
      font-family: inherit;
      cursor: pointer;
    }

    .btn-blue:hover {
      box-shadow: 0 0 12px rgba(64, 232, 255, 0.5);
    }

    .single-editor-box {
      background: rgba(10, 32, 78, 0.6);
      border: 1px solid rgba(64, 232, 255, 0.3);
      border-radius: 12px;
      padding: 16px;
    }

    .single-editor-row {
      display: grid;
      grid-template-columns: 100px 1fr 1fr auto;
      gap: 10px;
      align-items: center;
    }

    .single-input {
      background: #04122e;
      border: 1px solid rgba(64, 232, 255, 0.4);
      border-radius: 8px;
      color: #ffffff;
      padding: 8px 10px;
      font-family: inherit;
      font-size: 14px;
    }

    .status-feedback-msg {
      margin-top: 10px;
      font-size: 14px;
      font-weight: bold;
      min-height: 20px;
    }

    .status-feedback-msg.success { color: #34d399; }
    .status-feedback-msg.error { color: #f87171; }

    .start-game-btn {
      width: 100%;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border: 3px solid #a7f3d0;
      color: #ffffff;
      border-radius: 16px;
      padding: 18px;
      font-size: clamp(20px, 2.5vw, 24px);
      font-weight: bold;
      font-family: inherit;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4);
      transition: all 0.2s ease;
      letter-spacing: 0.5px;
    }

    .start-game-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(16, 185, 129, 0.7);
    }

    /* GAME SCREEN */
    .game-screen {
      display: none;
      width: 100%;
      flex-direction: column;
    }

    .game-screen.active {
      display: flex;
    }

    .top-controls-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }

    .top-nav-btn {
      background: linear-gradient(135deg, #0f326c 0%, #081d45 100%);
      border: 2px solid var(--color-cyan);
      color: #ffffff;
      border-radius: 12px;
      padding: 8px 18px;
      font-size: 15px;
      font-weight: bold;
      font-family: inherit;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
      transition: all 0.15s ease;
    }

    .top-nav-btn:hover {
      border-color: var(--color-gold);
      transform: translateY(-2px);
    }

    /* GAME MAIN LAYOUT: BOARD LEFT, CONTROL PANEL RIGHT */
    .game-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 300px;
      gap: 24px;
      align-items: start;
      width: 100%;
    }

    .board-column {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 100%;
      max-width: 860px;
    }

    /* BOARD METALLIC FRAME & PICTURE */
    .board-frame-container {
      position: relative;
      width: 100%;
      border-radius: 26px;
      padding: 10px;
      background: linear-gradient(135deg, #40e8ff 0%, #0876ed 35%, #582bc2 70%, #02a5eb 100%);
      box-shadow:
        0 0 35px rgba(255, 216, 91, 0.5),
        0 0 18px rgba(64, 232, 255, 0.6),
        inset 0 0 16px rgba(6, 28, 82, 0.8),
        0 14px 35px rgba(0, 0, 0, 0.7);
    }

    .board-inner {
      position: relative;
      width: 100%;
      aspect-ratio: 5 / 4;
      border-radius: 18px;
      overflow: hidden;
      background: #020b1f;
      box-shadow: inset 0 0 14px rgba(0, 0, 0, 0.85);
    }

    .board-bg-image {
      position: absolute;
      left: 49.5%;
      top: 52.8%;
      width: 120%;
      height: 123%;
      transform: translate(-50%, -50%);
      object-fit: fill;
      pointer-events: none;
      user-select: none;
      z-index: 1;
    }

    /* 5x4 GRID */
    .board-grid {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(4, 1fr);
      z-index: 2;
    }

    .board-square {
      position: relative;
      width: 100%;
      height: 100%;
      background: transparent;
      user-select: none;
      transition: background 0.15s ease;
    }

    .board-square:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    /* QUESTION MARK ICON */
    .square-question-btn {
      position: absolute;
      top: 11%;
      right: 7%;
      width: clamp(20px, 3.2vw, 32px);
      height: clamp(20px, 3.2vw, 32px);
      border-radius: 50%;
      border: 2px solid #ffffff;
      color: #ffffff;
      font-size: clamp(12px, 2vw, 17px);
      font-weight: 900;
      font-family: inherit;
      display: grid;
      place-items: center;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      z-index: 5;
    }

    .square-question-btn:hover {
      transform: scale(1.15);
    }

    /* Square 10 specific position so it does not cover the 10 */
    .board-square[data-square="10"] .square-question-btn {
      right: 24%;
    }

    .square-question-btn.has-question {
      background: #10b981 !important;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.9), 0 2px 6px rgba(0, 0, 0, 0.6) !important;
      border-color: #d1fae5;
    }

    /* TOKENS */
    .player-token {
      position: absolute;
      width: clamp(24px, 4vw, 42px);
      height: clamp(24px, 4vw, 42px);
      border-radius: 50%;
      border: 2.5px solid #ffffff;
      color: #ffffff;
      font-size: clamp(13px, 2vw, 19px);
      font-weight: 900;
      display: grid;
      place-items: center;
      box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.8), 0 4px 10px rgba(0, 0, 0, 0.6);
      z-index: 10;
      transition: top 0.24s cubic-bezier(0.25, 1, 0.5, 1), left 0.24s cubic-bezier(0.25, 1, 0.5, 1), transform 0.24s ease;
      pointer-events: none;
      user-select: none;
    }

    .player-token.hopping {
      transform: translate(-50%, -50%) translateY(-14px) scale(1.18);
    }

    /* SNAKE CRY OVERLAY */
    .snake-cry-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.5);
      font-size: clamp(60px, 12vw, 120px);
      z-index: 20;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .snake-cry-overlay.active {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.15);
    }

    /* STARTING DOCK */
    .starting-dock {
      background: linear-gradient(180deg, #071638 0%, #030c22 100%);
      border: 2.5px solid var(--color-cyan);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6), inset 0 0 10px rgba(64, 232, 255, 0.2);
      border-radius: 16px;
      padding: 12px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      position: relative;
    }

    .dock-title {
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 1px;
      color: var(--color-cyan);
      text-transform: uppercase;
      text-shadow: 0 0 8px rgba(64, 232, 255, 0.6);
    }

    .dock-slots {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      min-height: 48px;
      width: 100%;
    }

    /* CONTROL PANEL (RIGHT COLUMN) */
    .control-column-wrapper {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 100%;
      position: sticky;
      top: 16px;
    }

    .control-panel {
      background: linear-gradient(180deg, #fffdf4 0%, #f7eed8 100%);
      border: 3px solid var(--color-cyan);
      outline: 4px solid var(--color-royal-blue);
      border-radius: 22px;
      padding: 20px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(8, 118, 237, 0.4);
      color: #1e293b;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .turn-card {
      text-align: center;
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 14px;
      padding: 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    .turn-card .turn-label {
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 1px;
      color: #64748b;
      text-transform: uppercase;
    }

    .turn-card .current-player-name {
      font-size: 24px;
      font-weight: 900;
      margin: 4px 0;
    }

    .turn-card .turn-status {
      font-size: 14px;
      color: #334155;
      font-weight: 600;
      min-height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* DICE & AVATAR ROW */
    .dice-avatar-row {
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 12px;
    }

    /* AVATAR BOX WITH 3 ANIMATED QUESTION MARKS */
    .avatar-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .avatar-qmarks {
      display: flex;
      gap: 6px;
      margin-bottom: 2px;
    }

    .avatar-qmarks span {
      font-size: 16px;
      font-weight: 900;
      color: var(--color-royal-blue);
      text-shadow: 0 0 6px rgba(64, 232, 255, 0.8);
      animation: bounceQmark 1.2s infinite ease-in-out alternate;
    }

    .avatar-qmarks span:nth-child(2) {
      animation-delay: 0.25s;
      color: var(--color-purple);
    }

    .avatar-qmarks span:nth-child(3) {
      animation-delay: 0.5s;
      color: #ff5d66;
    }

    @keyframes bounceQmark {
      0% { transform: translateY(0); }
      100% { transform: translateY(-7px); }
    }

    .avatar-box {
      width: 76px;
      height: 76px;
      border-radius: 16px;
      border: 3px solid var(--color-cyan);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      background: #061c52;
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* STATIONARY 96x96 DICE BUTTON & 3D CUBE */
    .dice-stage {
      width: 96px;
      height: 96px;
      perspective: 600px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dice-btn {
      width: 96px;
      height: 96px;
      background: transparent;
      border: none;
      cursor: pointer;
      position: relative;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dice-cube {
      width: 76px;
      height: 76px;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 1s cubic-bezier(0.2, 0.9, 0.3, 1.1);
      /* Resting tilt */
      transform: rotateX(-12deg) rotateY(16deg);
    }

    .dice-face {
      position: absolute;
      width: 76px;
      height: 76px;
      border-radius: 15px;
      border: 2px solid var(--color-gold);
      background: linear-gradient(135deg, #32dfff 0%, #087cf4 40%, #0a439f 70%, #061c52 100%);
      box-shadow: inset 0 0 10px rgba(255, 216, 91, 0.4), 0 0 10px rgba(8, 124, 244, 0.5);
      display: grid;
      padding: 9px;
      box-sizing: border-box;
      backface-visibility: hidden;
    }

    /* Face orientations (translated by 38px) */
    .face-1 { transform: rotateY(0deg) translateZ(38px); }
    .face-2 { transform: rotateY(90deg) translateZ(38px); }
    .face-3 { transform: rotateX(90deg) translateZ(38px); }
    .face-4 { transform: rotateX(-90deg) translateZ(38px); }
    .face-5 { transform: rotateY(-90deg) translateZ(38px); }
    .face-6 { transform: rotateY(180deg) translateZ(38px); }

    /* PIPS */
    .pip {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: radial-gradient(circle, #fff7c2 15%, #ffd85b 55%, #c28800 100%);
      box-shadow: 0 0 6px #ffd85b, inset 0 1px 2px rgba(0, 0, 0, 0.6);
      align-self: center;
      justify-self: center;
    }

    /* Pip arrangements */
    .face-1 { display: flex; align-items: center; justify-content: center; }

    .face-2 {
      display: grid;
      grid-template: 1fr 1fr / 1fr 1fr;
    }
    .face-2 .pip:nth-child(1) { grid-column: 1; grid-row: 1; }
    .face-2 .pip:nth-child(2) { grid-column: 2; grid-row: 2; }

    .face-3 {
      display: grid;
      grid-template: 1fr 1fr 1fr / 1fr 1fr 1fr;
    }
    .face-3 .pip:nth-child(1) { grid-column: 1; grid-row: 1; }
    .face-3 .pip:nth-child(2) { grid-column: 2; grid-row: 2; }
    .face-3 .pip:nth-child(3) { grid-column: 3; grid-row: 3; }

    .face-4 {
      display: grid;
      grid-template: 1fr 1fr / 1fr 1fr;
    }

    .face-5 {
      display: grid;
      grid-template: 1fr 1fr 1fr / 1fr 1fr 1fr;
    }
    .face-5 .pip:nth-child(1) { grid-column: 1; grid-row: 1; }
    .face-5 .pip:nth-child(2) { grid-column: 3; grid-row: 1; }
    .face-5 .pip:nth-child(3) { grid-column: 2; grid-row: 2; }
    .face-5 .pip:nth-child(4) { grid-column: 1; grid-row: 3; }
    .face-5 .pip:nth-child(5) { grid-column: 3; grid-row: 3; }

    .face-6 {
      display: grid;
      grid-template: 1fr 1fr 1fr / 1fr 1fr;
    }

    /* GLOWING MOVE ACTION BUTTON */
    .move-action-btn {
      width: 100%;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border: 2px solid #a7f3d0;
      color: #ffffff;
      border-radius: 12px;
      padding: 12px;
      font-size: 16px;
      font-weight: 900;
      font-family: inherit;
      cursor: pointer;
      box-shadow: 0 0 18px rgba(16, 185, 129, 0.7);
      transition: all 0.15s ease;
      animation: pulseMoveBtn 1s infinite alternate;
    }

    @keyframes pulseMoveBtn {
      0% { box-shadow: 0 0 10px rgba(16, 185, 129, 0.6); }
      100% { box-shadow: 0 0 22px rgba(16, 185, 129, 0.95), 0 0 32px rgba(64, 232, 255, 0.5); }
    }

    .move-action-btn.hidden {
      display: none;
    }

    /* PLAYER SCOREBOARD LIST */
    .player-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .player-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .player-row.active {
      border: 2.5px solid currentColor;
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
      transform: scale(1.02);
    }

    .player-row-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .player-row-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .player-row-name {
      font-size: 15px;
      font-weight: 800;
      color: #1e293b;
    }

    .player-row-trophies {
      font-size: 14px;
      font-weight: 800;
      color: #b45309;
      white-space: nowrap;
    }

    /* FOOTER SIGNATURE OUTSIDE BOX */
    .footer-signature {
      text-align: center;
      padding-top: 6px;
    }

    .signature-name {
      font-size: 17px;
      font-weight: 900;
      color: var(--color-gold);
      text-shadow: 0 0 12px rgba(255, 216, 91, 0.6);
      margin-bottom: 2px;
    }

    .signature-title {
      font-size: 13px;
      color: #f1ebd8;
      font-weight: 600;
    }

    /* QUESTION MODAL */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(3, 10, 26, 0.85);
      backdrop-filter: blur(6px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 100;
    }

    .modal-overlay.active {
      display: flex;
    }

    .modal-card {
      background: linear-gradient(180deg, #092663 0%, #051842 100%);
      border: 3px solid var(--color-cyan);
      box-shadow: 0 0 35px rgba(8, 118, 237, 0.6), inset 0 0 20px rgba(64, 232, 255, 0.2);
      border-radius: 20px;
      width: 100%;
      max-width: 480px;
      padding: 24px;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      gap: 16px;
      animation: modalPop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes modalPop {
      0% { transform: scale(0.9); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    .modal-card h2 {
      font-size: 20px;
      color: var(--color-gold);
      text-shadow: 0 0 10px rgba(255, 216, 91, 0.5);
    }

    .modal-qtext {
      font-size: 17px;
      font-weight: 600;
      line-height: 1.4;
      background: rgba(2, 11, 31, 0.6);
      padding: 14px;
      border-radius: 12px;
      border: 1px solid rgba(64, 232, 255, 0.3);
    }

    .modal-input {
      background: #020b1f;
      border: 2px solid rgba(64, 232, 255, 0.5);
      border-radius: 10px;
      color: #ffffff;
      padding: 12px 14px;
      font-size: 16px;
      font-family: inherit;
    }

    .modal-input:focus {
      border-color: var(--color-cyan);
    }

    .modal-feedback {
      min-height: 24px;
      font-size: 14px;
      font-weight: 800;
    }

    .modal-feedback.success { color: #34d399; }
    .modal-feedback.info { color: #60a5fa; }
    .modal-feedback.error { color: #f87171; }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .btn-secondary {
      background: #1e293b;
      border: 2px solid #64748b;
      color: #ffffff;
      border-radius: 10px;
      padding: 10px 18px;
      font-size: 15px;
      font-weight: bold;
      font-family: inherit;
      cursor: pointer;
    }

    .btn-primary {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border: 2px solid #6ee7b7;
      color: #ffffff;
      border-radius: 10px;
      padding: 10px 20px;
      font-size: 15px;
      font-weight: bold;
      font-family: inherit;
      cursor: pointer;
    }

    /* VICTORY OVERLAY */
    .victory-overlay {
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at center, rgba(14, 46, 120, 0.96) 0%, rgba(4, 15, 42, 0.98) 100%);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 200;
      overflow: hidden;
    }

    .victory-overlay.active {
      display: flex;
    }

    .victory-card {
      background: linear-gradient(180deg, #092c73 0%, #04173d 100%);
      border: 4px solid var(--color-gold);
      box-shadow: 0 0 50px rgba(255, 216, 91, 0.7), inset 0 0 30px rgba(64, 232, 255, 0.4);
      border-radius: 28px;
      padding: 36px 40px;
      text-align: center;
      color: #ffffff;
      max-width: 480px;
      width: 100%;
      position: relative;
      z-index: 10;
      animation: victoryZoom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes victoryZoom {
      0% { transform: scale(0.7); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    .victory-trophy {
      font-size: 80px;
      margin-bottom: 10px;
      filter: drop-shadow(0 0 20px rgba(255, 216, 91, 0.8));
      animation: floatTrophy 1.5s infinite alternate ease-in-out;
    }

    @keyframes floatTrophy {
      0% { transform: translateY(0); }
      100% { transform: translateY(-10px); }
    }

    .victory-card h1 {
      font-size: 40px;
      color: var(--color-gold);
      text-shadow: 0 0 20px rgba(255, 216, 91, 0.7);
      margin-bottom: 8px;
    }

    .victory-card p {
      font-size: 20px;
      margin-bottom: 24px;
      color: #e2e8f0;
    }

    .play-again-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border: 3px solid #6ee7b7;
      color: #ffffff;
      border-radius: 14px;
      padding: 14px 32px;
      font-size: 20px;
      font-weight: bold;
      font-family: inherit;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
      transition: all 0.2s ease;
    }

    .play-again-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 26px rgba(16, 185, 129, 0.8);
    }

    /* CONFETTI */
    .confetti-container {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .confetti-piece {
      position: absolute;
      width: 10px;
      height: 14px;
      opacity: 0.85;
      animation: confettiFall linear infinite;
    }

    @keyframes confettiFall {
      0% {
        transform: translateY(-20px) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(105vh) rotate(720deg);
        opacity: 0.2;
      }
    }

    /* RESPONSIVE LAYOUT BREAKPOINTS */
    @media (max-width: 850px) {
      .game-layout {
        grid-template-columns: 1fr;
      }

      .board-column {
        max-width: 100%;
      }

      .control-column-wrapper {
        position: static;
        max-width: 500px;
        margin: 0 auto;
      }

      .bulk-editor-grid {
        grid-template-columns: 1fr;
      }

      .single-editor-row {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 480px) {
      .app-header {
        padding: 8px 12px;
      }

      .title-image {
        width: min(64vw, 250px);
        height: 46px;
      }

      .header-btn {
        padding: 6px 12px;
        font-size: 13px;
      }

      .main-container {
        padding: 6px 10px 30px;
      }

      .settings-panel {
        padding: 18px 16px;
        border-radius: 18px;
      }

      .board-frame-container {
        padding: 6px;
        border-radius: 18px;
      }

      .board-inner {
        border-radius: 12px;
      }

      .control-panel {
        padding: 14px;
        border-radius: 18px;
      }
    }

    /* PREFERS-REDUCED-MOTION */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <header class="app-header">
    <div class="title-image-wrapper">
      <img id="title-img" class="title-image" alt="SNAKES AND LADDER" src="${titleB64}">
    </div>
    <div class="header-actions">
      <button id="download-btn" class="header-btn" title="Download standalone offline HTML file">💾 Save HTML</button>
      <button id="sound-btn" class="header-btn" aria-pressed="true" aria-label="Toggle sound effects">🔊 Sound on</button>
    </div>
  </header>

  <main class="main-container">
    <!-- SETTINGS SCREEN -->
    <section id="settings-screen" class="settings-panel" aria-label="Game Settings">
      <h1>Set up your game</h1>
      <p class="subtitle">Choose how to play, save the player names, and add your learning questions.</p>

      <div class="section-title">Play Mode</div>
      <div class="mode-cards" role="radiogroup" aria-label="Play modes">
        <button type="button" id="mode-cpu-btn" class="mode-card" role="radio" aria-checked="true" aria-pressed="true">
          <span>🤖</span> Versus computer
        </button>
        <button type="button" id="mode-local-btn" class="mode-card" role="radio" aria-checked="false" aria-pressed="false">
          <span>👥</span> Various players
        </button>
      </div>

      <!-- LOCAL PLAYERS COUNT -->
      <div id="player-count-container" style="display: none;">
        <div class="section-title">Number of Players</div>
        <div class="player-count-group" role="group" aria-label="Number of players">
          <button type="button" class="count-btn active" data-count="2" aria-pressed="true">2</button>
          <button type="button" class="count-btn" data-count="3" aria-pressed="false">3</button>
          <button type="button" class="count-btn" data-count="4" aria-pressed="false">4</button>
          <button type="button" class="count-btn" data-count="5" aria-pressed="false">5</button>
        </div>
      </div>

      <!-- PLAYER NAMES -->
      <div class="section-title">Player Names (Optional)</div>
      <div class="names-grid" id="names-grid">
        <!-- populated by JS -->
      </div>

      <div class="save-names-bar">
        <button type="button" id="save-names-btn" class="btn-green">Save player names</button>
        <span id="save-names-status" class="save-status-indicator saved" aria-live="polite">✓ 2 names saved</span>
      </div>

      <!-- QUESTION EDITOR -->
      <details class="question-editor-details">
        <summary>Add or edit my questions</summary>
        <p style="color: #93c5fd; font-size: 14px; margin-bottom: 12px;">
          Maintain exactly 20 learning questions, one for each square. You can import lines in bulk or edit each square individually.
        </p>

        <div class="bulk-editor-grid">
          <div class="editor-col">
            <label for="bulk-questions-input">Questions, one per line (1 to 20):</label>
            <textarea id="bulk-questions-input" class="bulk-textarea" placeholder="What is 5 + 5?&#10;What planet is closest to the Sun?&#10;Capital of France?"></textarea>
          </div>
          <div class="editor-col">
            <label for="bulk-answers-input">Answers, one per line (1 to 20):</label>
            <textarea id="bulk-answers-input" class="bulk-textarea" placeholder="10&#10;Mercury&#10;Paris"></textarea>
          </div>
        </div>

        <div class="bulk-actions">
          <button type="button" id="bulk-import-btn" class="btn-blue">Import bulk questions</button>
          <div id="bulk-feedback" class="status-feedback-msg" aria-live="polite"></div>
        </div>

        <div class="single-editor-box">
          <div class="section-title" style="font-size: 15px; margin-bottom: 8px;">Edit single square</div>
          <div class="single-editor-row">
            <select id="single-square-select" class="single-input" aria-label="Select square number">
              <!-- Options 1 to 20 populated by JS -->
            </select>
            <input type="text" id="single-question-input" class="single-input" placeholder="Question for this square">
            <input type="text" id="single-answer-input" class="single-input" placeholder="Exact answer">
            <div style="display: flex; gap: 6px;">
              <button type="button" id="single-save-btn" class="btn-green" style="padding: 8px 12px; font-size: 13px;">Save</button>
              <button type="button" id="single-clear-btn" class="btn-secondary" style="padding: 8px 12px; font-size: 13px;">Clear</button>
            </div>
          </div>
          <div id="single-feedback" class="status-feedback-msg" aria-live="polite"></div>
        </div>
      </details>

      <button type="button" id="start-game-btn" class="start-game-btn">Start the game ▶</button>
    </section>

    <!-- GAME SCREEN -->
    <section id="game-screen" class="game-screen" aria-label="Game Board and Controls">
      <div class="top-controls-bar">
        <button type="button" id="back-to-settings-btn" class="top-nav-btn">← Back to settings</button>
        <button type="button" id="restart-game-btn" class="top-nav-btn">↻ Restart game</button>
      </div>

      <div class="game-layout">
        <!-- BOARD COLUMN (LEFT) -->
        <div class="board-column">
          <div class="board-frame-container" id="board-container">
            <div class="board-inner" id="board-inner">
              <img class="board-bg-image" alt="Snakes and Ladder Game Board" src="${boardB64}">
              <div class="board-grid" id="board-grid" role="region" aria-label="Snakes and Ladder Squares">
                <!-- 20 squares rendered by JS -->
              </div>
              <div id="snake-cry" class="snake-cry-overlay" aria-hidden="true">😭</div>
            </div>
          </div>

          <!-- STARTING DOCK -->
          <div class="starting-dock" id="starting-dock" aria-label="Starting Dock">
            <div class="dock-title">STARTING DOCK</div>
            <div class="dock-slots" id="dock-slots">
              <!-- Tokens at pos 0 placed here -->
            </div>
          </div>
        </div>

        <!-- CONTROL COLUMN (RIGHT) -->
        <div class="control-column-wrapper">
          <aside class="control-panel" aria-label="Player Turn and Dice Controls">
            <div class="turn-card">
              <div class="turn-label">CURRENT TURN</div>
              <div id="current-player-name" class="current-player-name">P1</div>
              <div id="turn-status-text" class="turn-status" aria-live="polite">Click the dice to roll.</div>
            </div>

            <div class="dice-avatar-row">
              <!-- AVATAR BOX WITH 3 ANIMATED QMARKS -->
              <div class="avatar-wrapper" aria-label="Snake Mascot">
                <div class="avatar-qmarks" aria-hidden="true">
                  <span>?</span>
                  <span>?</span>
                  <span>?</span>
                </div>
                <div class="avatar-box">
                  <img class="avatar-img" alt="Snake Mascot" src="${avatarB64}">
                </div>
              </div>

              <!-- 3D DICE IN 96x96 STATIONARY BUTTON -->
              <div class="dice-stage">
                <button type="button" id="dice-btn" class="dice-btn" aria-label="Roll the 3D dice">
                  <div id="dice-cube" class="dice-cube">
                    <!-- Face 1 -->
                    <div class="dice-face face-1"><div class="pip"></div></div>
                    <!-- Face 2 -->
                    <div class="dice-face face-2"><div class="pip"></div><div class="pip"></div></div>
                    <!-- Face 3 -->
                    <div class="dice-face face-3"><div class="pip"></div><div class="pip"></div><div class="pip"></div></div>
                    <!-- Face 4 -->
                    <div class="dice-face face-4"><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div></div>
                    <!-- Face 5 -->
                    <div class="dice-face face-5"><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div></div>
                    <!-- Face 6 -->
                    <div class="dice-face face-6"><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div></div>
                  </div>
                </button>
              </div>
            </div>

            <!-- GLOWING MOVE ACTION BUTTON -->
            <button type="button" id="move-action-btn" class="move-action-btn hidden" aria-live="polite">Move 1 space</button>

            <!-- PLAYER SCOREBOARD LIST -->
            <div class="player-list" id="player-scoreboard" aria-label="Player Scores">
              <!-- Populated by JS -->
            </div>
          </aside>

          <!-- SIGNATURE OUTSIDE CONTROL BOX -->
          <footer class="footer-signature">
            <div class="signature-name">Dr.Abir Wafa</div>
            <div class="signature-title">Head of EdTech at Edulixa</div>
          </footer>
        </div>
      </div>
    </section>
  </main>

  <!-- QUESTION MODAL -->
  <div id="question-modal-overlay" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-square-title">
    <div class="modal-card">
      <h2 id="modal-square-title">Square 1 question</h2>
      <div id="modal-question-body" class="modal-qtext">Question goes here</div>
      <input type="text" id="modal-answer-input" class="modal-input" placeholder="Type your answer here..." autocomplete="off">
      <div id="modal-feedback-msg" class="modal-feedback" aria-live="assertive"></div>
      <div class="modal-actions">
        <button type="button" id="modal-close-btn" class="btn-secondary">Close</button>
        <button type="button" id="modal-check-btn" class="btn-primary">Check my answer</button>
      </div>
    </div>
  </div>

  <!-- VICTORY OVERLAY -->
  <div id="victory-overlay" class="victory-overlay" role="dialog" aria-modal="true" aria-labelledby="victory-heading">
    <div class="victory-card">
      <div class="victory-trophy" aria-hidden="true">🏆</div>
      <h1 id="victory-heading">Victory!</h1>
      <p id="victory-message"><strong>P1</strong> reached square 20!</p>
      <button type="button" id="play-again-btn" class="play-again-btn">Play again</button>
    </div>
    <div id="confetti-container" class="confetti-container" aria-hidden="true"></div>
  </div>

  <!-- JAVASCRIPT GAME ENGINE -->
  <script>
    (function() {
      'use strict';

      // 1. DATA STATE OBJECT
      const state = {
        mode: 'cpu', // 'cpu' | 'local'
        playerCount: 2,
        savedNames: {},
        players: [],
        activeIndex: 0,
        rolledValue: 1,
        busy: false,
        soundEnabled: true,
        questions: Array(20).fill(null).map(() => ({ q: '', a: '' })),
        openSquare: null,
        gameOver: false,
        diceRotX: -12,
        diceRotY: 16
      };

      // Player color definitions
      const PLAYER_COLORS = [
        '#ff5d66', // 1: coral
        '#1878ee', // 2: blue
        '#18a75b', // 3: green
        '#8a4de1', // 4: purple
        '#ef8b20'  // 5: orange
      ];

      // Board routes
      const LADDERS = {
        2: 9,
        7: 14,
        12: 19
      };

      const SNAKES = {
        11: 10,
        13: 8,
        15: 6
      };

      // WEB AUDIO API SOUND SYSTEM
      let audioCtx = null;
      function getAudioContext() {
        if (!state.soundEnabled) return null;
        if (!audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        return audioCtx;
      }

      function playTone(freq, duration, type = 'sine', startGain = 0.15, endGain = 0.001) {
        const ctx = getAudioContext();
        if (!ctx) return;
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(startGain, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(Math.max(endGain, 0.0001), ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + duration);
        } catch (e) {}
      }

      function playSaveSound() {
        playTone(523.25, 0.1, 'sine', 0.15);
        setTimeout(() => playTone(659.25, 0.15, 'sine', 0.15), 100);
      }

      function playRollSound() {
        const ctx = getAudioContext();
        if (!ctx) return;
        for (let i = 0; i < 7; i++) {
          setTimeout(() => {
            playTone(180 + Math.random() * 120, 0.06, 'triangle', 0.08);
          }, i * 90);
        }
      }

      function playStepSound() {
        playTone(493.88, 0.09, 'sine', 0.15);
      }

      function playBlockedSound() {
        playTone(140, 0.25, 'sawtooth', 0.12);
      }

      function playLadderSound() {
        const notes = [329.63, 440, 554.37, 659.25];
        notes.forEach((freq, idx) => {
          setTimeout(() => playTone(freq, 0.18, 'triangle', 0.18), idx * 110);
        });
      }

      function playSnakeSound() {
        const ctx = getAudioContext();
        if (!ctx) return;
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(580, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.45);
          gain.gain.setValueAtTime(0.16, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.45);
        } catch(e) {}
      }

      function playWrongSound() {
        playTone(220, 0.22, 'sawtooth', 0.14);
        setTimeout(() => playTone(207.65, 0.28, 'sawtooth', 0.14), 100);
      }

      function playCorrectSound() {
        playTone(587.33, 0.12, 'sine', 0.15);
        setTimeout(() => playTone(880, 0.22, 'sine', 0.18), 120);
      }

      function playTrophySound() {
        const notes = [659.25, 880, 1174.66, 1567.98];
        notes.forEach((freq, idx) => {
          setTimeout(() => playTone(freq, 0.25, 'triangle', 0.2), idx * 90);
        });
      }

      function playVictorySound() {
        const fanfare = [
          { f: 523.25, d: 0.18 },
          { f: 659.25, d: 0.18 },
          { f: 783.99, d: 0.24 },
          { f: 1046.5, d: 0.6 }
        ];
        let delay = 0;
        fanfare.forEach(item => {
          setTimeout(() => playTone(item.f, item.d, 'triangle', 0.25), delay);
          delay += item.d * 1000 + 40;
        });
      }

      // 2. STORAGE RECOVERY & PERSISTENCE
      function loadSavedData() {
        try {
          const namesRaw = localStorage.getItem('snakeTrailNames');
          if (namesRaw) state.savedNames = JSON.parse(namesRaw) || {};
        } catch (e) {
          state.savedNames = {};
        }

        try {
          const qRaw = localStorage.getItem('snakeTrailQuestions');
          if (qRaw) {
            const parsed = JSON.parse(qRaw);
            if (Array.isArray(parsed) && parsed.length === 20) {
              state.questions = parsed;
            }
          }
        } catch (e) {}
      }

      function saveQuestionsToStorage() {
        try {
          localStorage.setItem('snakeTrailQuestions', JSON.stringify(state.questions));
        } catch (e) {}
      }

      // DOM ELEMENTS
      const soundBtn = document.getElementById('sound-btn');
      const downloadBtn = document.getElementById('download-btn');
      const settingsScreen = document.getElementById('settings-screen');
      const gameScreen = document.getElementById('game-screen');
      const modeCpuBtn = document.getElementById('mode-cpu-btn');
      const modeLocalBtn = document.getElementById('mode-local-btn');
      const playerCountContainer = document.getElementById('player-count-container');
      const countBtns = document.querySelectorAll('.count-btn');
      const namesGrid = document.getElementById('names-grid');
      const saveNamesBtn = document.getElementById('save-names-btn');
      const saveNamesStatus = document.getElementById('save-names-status');
      const startGameBtn = document.getElementById('start-game-btn');
      const backToSettingsBtn = document.getElementById('back-to-settings-btn');
      const restartGameBtn = document.getElementById('restart-game-btn');
      const boardGrid = document.getElementById('board-grid');
      const dockSlots = document.getElementById('dock-slots');
      const currentPlayerNameEl = document.getElementById('current-player-name');
      const turnStatusText = document.getElementById('turn-status-text');
      const diceBtn = document.getElementById('dice-btn');
      const diceCube = document.getElementById('dice-cube');
      const moveActionBtn = document.getElementById('move-action-btn');
      const scoreboardEl = document.getElementById('player-scoreboard');
      const snakeCryEl = document.getElementById('snake-cry');

      // Modals
      const modalOverlay = document.getElementById('question-modal-overlay');
      const modalSquareTitle = document.getElementById('modal-square-title');
      const modalQuestionBody = document.getElementById('modal-question-body');
      const modalAnswerInput = document.getElementById('modal-answer-input');
      const modalFeedbackMsg = document.getElementById('modal-feedback-msg');
      const modalCloseBtn = document.getElementById('modal-close-btn');
      const modalCheckBtn = document.getElementById('modal-check-btn');

      const victoryOverlay = document.getElementById('victory-overlay');
      const victoryMessage = document.getElementById('victory-message');
      const playAgainBtn = document.getElementById('play-again-btn');
      const confettiContainer = document.getElementById('confetti-container');

      // Question Editor Inputs
      const bulkQuestionsInput = document.getElementById('bulk-questions-input');
      const bulkAnswersInput = document.getElementById('bulk-answers-input');
      const bulkImportBtn = document.getElementById('bulk-import-btn');
      const bulkFeedback = document.getElementById('bulk-feedback');
      const singleSquareSelect = document.getElementById('single-square-select');
      const singleQuestionInput = document.getElementById('single-question-input');
      const singleAnswerInput = document.getElementById('single-answer-input');
      const singleSaveBtn = document.getElementById('single-save-btn');
      const singleClearBtn = document.getElementById('single-clear-btn');
      const singleFeedback = document.getElementById('single-feedback');

      // INITIAL SETUP
      loadSavedData();

      // SOUND TOGGLE
      soundBtn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        soundBtn.setAttribute('aria-pressed', state.soundEnabled ? 'true' : 'false');
        soundBtn.textContent = state.soundEnabled ? '🔊 Sound on' : '🔇 Sound off';
        if (state.soundEnabled) {
          playStepSound();
        }
      });

      // DOWNLOAD STANDALONE HTML FILE
      downloadBtn.addEventListener('click', () => {
        const fullHtml = '<!doctype html>' + '\\n' + document.documentElement.outerHTML;
        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'snake-learning-game-latest-edition.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      // 3. SETTINGS UI & LOGIC
      function renderPlayerInputs() {
        namesGrid.innerHTML = '';
        const count = state.mode === 'cpu' ? 2 : state.playerCount;

        for (let i = 1; i <= count; i++) {
          const row = document.createElement('div');
          row.className = 'name-input-row';

          const label = document.createElement('label');
          label.className = 'name-label';
          label.style.color = PLAYER_COLORS[i - 1];

          const dot = document.createElement('span');
          dot.className = 'name-input-dot';
          dot.style.backgroundColor = PLAYER_COLORS[i - 1];

          const title = document.createTextNode(state.mode === 'cpu' && i === 2 ? 'Player 2 (Computer)' : 'Player ' + i);
          label.appendChild(dot);
          label.appendChild(title);

          const input = document.createElement('input');
          input.type = 'text';
          input.className = 'player-name-input';
          input.maxLength = 22;
          input.dataset.playerIdx = i;

          if (state.mode === 'cpu' && i === 2) {
            input.value = 'CPU';
            input.disabled = true;
          } else {
            input.placeholder = 'P' + i;
            input.value = state.savedNames['p' + i] || '';
            input.addEventListener('input', () => {
              saveNamesStatus.textContent = 'Unsaved changes';
              saveNamesStatus.className = 'save-status-indicator unsaved';
            });
          }

          row.appendChild(label);
          row.appendChild(input);
          namesGrid.appendChild(row);
        }

        updateSavedIndicator();
      }

      function updateSavedIndicator() {
        const count = state.mode === 'cpu' ? 2 : state.playerCount;
        saveNamesStatus.textContent = '✓ ' + count + ' names saved';
        saveNamesStatus.className = 'save-status-indicator saved';
      }

      modeCpuBtn.addEventListener('click', () => {
        state.mode = 'cpu';
        modeCpuBtn.setAttribute('aria-pressed', 'true');
        modeCpuBtn.setAttribute('aria-checked', 'true');
        modeLocalBtn.setAttribute('aria-pressed', 'false');
        modeLocalBtn.setAttribute('aria-checked', 'false');
        playerCountContainer.style.display = 'none';
        renderPlayerInputs();
        playStepSound();
      });

      modeLocalBtn.addEventListener('click', () => {
        state.mode = 'local';
        modeLocalBtn.setAttribute('aria-pressed', 'true');
        modeLocalBtn.setAttribute('aria-checked', 'true');
        modeCpuBtn.setAttribute('aria-pressed', 'false');
        modeCpuBtn.setAttribute('aria-checked', 'false');
        playerCountContainer.style.display = 'block';
        renderPlayerInputs();
        playStepSound();
      });

      countBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          countBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
          state.playerCount = parseInt(btn.dataset.count, 10);
          renderPlayerInputs();
          playStepSound();
        });
      });

      saveNamesBtn.addEventListener('click', () => {
        const count = state.mode === 'cpu' ? 2 : state.playerCount;
        const inputs = namesGrid.querySelectorAll('.player-name-input');
        inputs.forEach(input => {
          const idx = input.dataset.playerIdx;
          if (state.mode === 'cpu' && idx === '2') {
            state.savedNames['p2'] = 'CPU';
          } else {
            const val = input.value.trim().slice(0, 22);
            state.savedNames['p' + idx] = val;
          }
        });
        try {
          localStorage.setItem('snakeTrailNames', JSON.stringify(state.savedNames));
        } catch (e) {}
        updateSavedIndicator();
        playSaveSound();
      });

      // QUESTION EDITOR SETUP
      for (let i = 1; i <= 20; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = 'Square ' + i;
        singleSquareSelect.appendChild(opt);
      }

      function updateSingleEditorFields() {
        const sq = parseInt(singleSquareSelect.value, 10);
        const item = state.questions[sq - 1] || { q: '', a: '' };
        singleQuestionInput.value = item.q || '';
        singleAnswerInput.value = item.a || '';
      }

      singleSquareSelect.addEventListener('change', updateSingleEditorFields);

      singleSaveBtn.addEventListener('click', () => {
        const sq = parseInt(singleSquareSelect.value, 10);
        state.questions[sq - 1] = {
          q: singleQuestionInput.value.trim(),
          a: singleAnswerInput.value.trim()
        };
        saveQuestionsToStorage();
        singleFeedback.textContent = '✓ Square ' + sq + ' question saved!';
        singleFeedback.className = 'status-feedback-msg success';
        playSaveSound();
        renderBoardQuestionBadges();
      });

      singleClearBtn.addEventListener('click', () => {
        const sq = parseInt(singleSquareSelect.value, 10);
        state.questions[sq - 1] = { q: '', a: '' };
        singleQuestionInput.value = '';
        singleAnswerInput.value = '';
        saveQuestionsToStorage();
        singleFeedback.textContent = 'Cleared square ' + sq;
        singleFeedback.className = 'status-feedback-msg success';
        playSaveSound();
        renderBoardQuestionBadges();
      });

      bulkImportBtn.addEventListener('click', () => {
        const qLines = bulkQuestionsInput.value.split('\\n').map(l => l.trim()).filter(l => l.length > 0);
        const aLines = bulkAnswersInput.value.split('\\n').map(l => l.trim()).filter(l => l.length > 0);

        if (qLines.length === 0 || aLines.length === 0) {
          bulkFeedback.textContent = 'Please enter at least one question and matching answer.';
          bulkFeedback.className = 'status-feedback-msg error';
          playWrongSound();
          return;
        }

        if (qLines.length !== aLines.length) {
          bulkFeedback.textContent = 'Line count mismatch: ' + qLines.length + ' questions vs ' + aLines.length + ' answers.';
          bulkFeedback.className = 'status-feedback-msg error';
          playWrongSound();
          return;
        }

        const countToAssign = Math.min(20, qLines.length);
        for (let i = 0; i < countToAssign; i++) {
          state.questions[i] = { q: qLines[i], a: aLines[i] };
        }
        saveQuestionsToStorage();
        bulkFeedback.textContent = '✓ Successfully imported ' + countToAssign + ' questions!';
        bulkFeedback.className = 'status-feedback-msg success';
        playSaveSound();
        updateSingleEditorFields();
        renderBoardQuestionBadges();
      });

      renderPlayerInputs();
      updateSingleEditorFields();

      // 4. BOARD SERPENTINE MAPPING & RENDERING
      /*
        SERPENTINE ORDER:
        Row 0 (Top):    20, 19, 18, 17, 16
        Row 1:          11, 12, 13, 14, 15
        Row 2:          10,  9,  8,  7,  6
        Row 3 (Bottom):  1,  2,  3,  4,  5
      */
      function getSquareRowCol(num) {
        if (num >= 1 && num <= 5) {
          return { row: 3, col: num - 1 };
        } else if (num >= 6 && num <= 10) {
          return { row: 2, col: 10 - num };
        } else if (num >= 11 && num <= 15) {
          return { row: 1, col: num - 11 };
        } else {
          return { row: 0, col: 20 - num };
        }
      }

      function buildBoardSquares() {
        boardGrid.innerHTML = '';
        const questionColors = ['#10b981', '#1878ee', '#8a4de1', '#ff5d66', '#ef8b20'];

        for (let n = 1; n <= 20; n++) {
          const { row, col } = getSquareRowCol(n);
          const sqEl = document.createElement('div');
          sqEl.className = 'board-square';
          sqEl.dataset.square = n;
          sqEl.style.gridRow = (row + 1);
          sqEl.style.gridColumn = (col + 1);

          // Real question button
          const qBtn = document.createElement('button');
          qBtn.type = 'button';
          qBtn.className = 'square-question-btn';
          qBtn.setAttribute('aria-label', 'Open question for square ' + n);
          qBtn.textContent = '?';
          qBtn.style.backgroundColor = questionColors[(n - 1) % 5];
          qBtn.dataset.square = n;

          qBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            onSquareQuestionClick(n);
          });

          sqEl.appendChild(qBtn);
          boardGrid.appendChild(sqEl);
        }

        renderBoardQuestionBadges();
      }

      function renderBoardQuestionBadges() {
        const buttons = boardGrid.querySelectorAll('.square-question-btn');
        buttons.forEach(btn => {
          const sq = parseInt(btn.dataset.square, 10);
          const hasQ = state.questions[sq - 1] && state.questions[sq - 1].q.trim().length > 0;
          if (hasQ) {
            btn.classList.add('has-question');
          } else {
            btn.classList.remove('has-question');
          }
        });
      }

      // 5. GAME INITIALIZATION & PLAYER INSTANTIATION
      function initGamePlayers() {
        const count = state.mode === 'cpu' ? 2 : state.playerCount;
        state.players = [];

        for (let i = 1; i <= count; i++) {
          let name = '';
          if (state.mode === 'cpu' && i === 2) {
            name = 'CPU';
          } else {
            name = (state.savedNames['p' + i] || '').trim();
            if (!name) name = 'P' + i;
          }

          state.players.push({
            id: i - 1,
            num: i,
            name: name,
            isCpu: state.mode === 'cpu' && i === 2,
            color: PLAYER_COLORS[i - 1],
            pos: 0,
            trophies: 0,
            earnedSquares: new Set()
          });
        }

        state.activeIndex = 0;
        state.rolledValue = 1;
        state.busy = false;
        state.gameOver = false;
        moveActionBtn.classList.add('hidden');
      }

      function renderScoreboard() {
        scoreboardEl.innerHTML = '';
        state.players.forEach((p, idx) => {
          const row = document.createElement('div');
          row.className = 'player-row' + (idx === state.activeIndex ? ' active' : '');
          if (idx === state.activeIndex) {
            row.style.color = p.color;
          }

          const left = document.createElement('div');
          left.className = 'player-row-left';

          const dot = document.createElement('div');
          dot.className = 'player-row-dot';
          dot.style.backgroundColor = p.color;

          const name = document.createElement('div');
          name.className = 'player-row-name';
          name.textContent = p.name;

          left.appendChild(dot);
          left.appendChild(name);

          const trophies = document.createElement('div');
          trophies.className = 'player-row-trophies';
          trophies.textContent = '🏆 ' + p.trophies + '/5';

          row.appendChild(left);
          row.appendChild(trophies);
          scoreboardEl.appendChild(row);
        });

        const activePlayer = state.players[state.activeIndex];
        if (activePlayer) {
          currentPlayerNameEl.textContent = activePlayer.name;
          currentPlayerNameEl.style.color = activePlayer.color;
        }
      }

      // 6. TOKEN POSITIONING & PERFECT CENTERING
      /*
        When multiple players share a square:
        2 players: left and right of center.
        3 players: two above, one below.
        4 players: centered 2x2.
        5 players: centered four corners + one in the middle.
        A lone token: offset is EXACTLY (0px, 0px) from center.
      */
      function getTokenClusterOffsets(playerIdxInSquare, totalPlayersInSquare) {
        if (totalPlayersInSquare <= 1) {
          return { x: 0, y: 0 };
        }
        if (totalPlayersInSquare === 2) {
          return playerIdxInSquare === 0 ? { x: -16, y: 0 } : { x: 16, y: 0 };
        }
        if (totalPlayersInSquare === 3) {
          if (playerIdxInSquare === 0) return { x: -14, y: -12 };
          if (playerIdxInSquare === 1) return { x: 14, y: -12 };
          return { x: 0, y: 14 };
        }
        if (totalPlayersInSquare === 4) {
          const x = (playerIdxInSquare % 2 === 0) ? -14 : 14;
          const y = (playerIdxInSquare < 2) ? -13 : 13;
          return { x, y };
        }
        // 5 players
        if (playerIdxInSquare === 0) return { x: -16, y: -15 };
        if (playerIdxInSquare === 1) return { x: 16, y: -15 };
        if (playerIdxInSquare === 2) return { x: -16, y: 15 };
        if (playerIdxInSquare === 3) return { x: 16, y: 15 };
        return { x: 0, y: 0 };
      }

      function updateTokensPositions() {
        // Remove existing tokens on board
        const oldTokens = document.querySelectorAll('.player-token');
        oldTokens.forEach(t => t.remove());

        // Group players by position
        const squareGroups = {};
        state.players.forEach(p => {
          if (!squareGroups[p.pos]) squareGroups[p.pos] = [];
          squareGroups[p.pos].push(p);
        });

        // Dock tokens (pos 0)
        dockSlots.innerHTML = '';
        if (squareGroups[0]) {
          squareGroups[0].forEach(p => {
            const token = document.createElement('div');
            token.className = 'player-token';
            token.style.position = 'relative';
            token.style.backgroundColor = p.color;
            token.textContent = p.num;
            token.setAttribute('aria-label', p.name + ' in Starting Dock');
            dockSlots.appendChild(token);
          });
        }

        // Squares 1..20
        const boardInner = document.getElementById('board-inner');
        const boardRect = boardInner.getBoundingClientRect();

        for (let pos = 1; pos <= 20; pos++) {
          const group = squareGroups[pos];
          if (!group || group.length === 0) continue;

          const sqEl = boardGrid.querySelector('.board-square[data-square="' + pos + '"]');
          if (!sqEl) continue;
          const sqRect = sqEl.getBoundingClientRect();

          const centerX = (sqRect.left - boardRect.left) + sqRect.width / 2;
          const centerY = (sqRect.top - boardRect.top) + sqRect.height / 2;

          group.forEach((p, idxInGroup) => {
            const offset = getTokenClusterOffsets(idxInGroup, group.length);
            const token = document.createElement('div');
            token.className = 'player-token';
            token.id = 'token-player-' + p.id;
            token.style.backgroundColor = p.color;
            token.textContent = p.num;
            token.style.left = (centerX + offset.x) + 'px';
            token.style.top = (centerY + offset.y) + 'px';
            token.style.transform = 'translate(-50%, -50%)';
            token.setAttribute('aria-label', p.name + ' on Square ' + pos);
            boardInner.appendChild(token);
          });
        }
      }

      window.addEventListener('resize', updateTokensPositions);

      // 7. DICE ROLLING LOGIC & 3D CSS TRANSFORMS
      function rollDiceValue() {
        return Math.floor(Math.random() * 6) + 1;
      }

      function animateDiceToValue(targetVal, callback) {
        playRollSound();
        const extraTurnsX = (Math.floor(Math.random() * 2) + 2) * 360;
        const extraTurnsY = (Math.floor(Math.random() * 2) + 2) * 360;

        // Base angles for faces with resting tilt (-12deg X, 16deg Y)
        let targetX = -12;
        let targetY = 16;

        if (targetVal === 1) {
          targetX = -12;
          targetY = 16;
        } else if (targetVal === 2) {
          targetX = -12;
          targetY = -90 + 16;
        } else if (targetVal === 3) {
          targetX = -90 - 12;
          targetY = 16;
        } else if (targetVal === 4) {
          targetX = 90 - 12;
          targetY = 16;
        } else if (targetVal === 5) {
          targetX = -12;
          targetY = 90 + 16;
        } else if (targetVal === 6) {
          targetX = -12;
          targetY = 180 + 16;
        }

        state.diceRotX += extraTurnsX;
        state.diceRotY += extraTurnsY;

        const finalX = state.diceRotX + targetX;
        const finalY = state.diceRotY + targetY;

        diceCube.style.transform = 'rotateX(' + finalX + 'deg) rotateY(' + finalY + 'deg)';

        setTimeout(() => {
          if (callback) callback();
        }, 1050);
      }

      // 8. TURN FLOW & MOVEMENT ENGINE
      function onDiceClick() {
        if (state.busy || state.gameOver) return;
        const curPlayer = state.players[state.activeIndex];
        if (curPlayer.isCpu) return;

        state.busy = true;
        turnStatusText.textContent = curPlayer.name + ' is rolling...';

        const roll = rollDiceValue();
        state.rolledValue = roll;

        animateDiceToValue(roll, () => {
          turnStatusText.textContent = curPlayer.name + ' rolled a ' + roll + '! Click to move.';
          moveActionBtn.textContent = roll === 1 ? 'Move 1 space' : 'Move ' + roll + ' spaces';
          moveActionBtn.classList.remove('hidden');
          playStepSound();
        });
      }

      diceBtn.addEventListener('click', onDiceClick);

      moveActionBtn.addEventListener('click', () => {
        if (!state.busy || state.gameOver) return;
        moveActionBtn.classList.add('hidden');
        executeCurrentPlayerMove();
      });

      function executeCurrentPlayerMove() {
        const curPlayer = state.players[state.activeIndex];
        const startPos = curPlayer.pos;
        const roll = state.rolledValue;
        const targetPos = startPos + roll;

        if (targetPos > 20) {
          playBlockedSound();
          turnStatusText.textContent = curPlayer.name + ' needs an exact roll. The token stays put.';
          setTimeout(() => {
            finishTurn();
          }, 1500);
          return;
        }

        // Move step by step
        let step = startPos;
        function takeStep() {
          if (step < targetPos) {
            step++;
            curPlayer.pos = step;
            updateTokensPositions();
            playStepSound();

            const tokenEl = document.getElementById('token-player-' + curPlayer.id);
            if (tokenEl) {
              tokenEl.classList.add('hopping');
              setTimeout(() => tokenEl.classList.remove('hopping'), 180);
            }

            setTimeout(takeStep, 280);
          } else {
            // Reached targetPos
            handlePostMoveArrival(curPlayer, targetPos);
          }
        }

        takeStep();
      }

      function handlePostMoveArrival(curPlayer, pos) {
        // Check immediate win on square 20
        if (pos === 20) {
          triggerVictory(curPlayer, 'reached square 20!');
          return;
        }

        // Check Ladder
        if (LADDERS[pos]) {
          const dest = LADDERS[pos];
          turnStatusText.textContent = 'Ladder! ' + curPlayer.name + ' climbs to square ' + dest + '.';
          playLadderSound();
          setTimeout(() => {
            curPlayer.pos = dest;
            updateTokensPositions();
            setTimeout(finishTurn, 800);
          }, 600);
          return;
        }

        // Check Snake
        if (SNAKES[pos]) {
          const dest = SNAKES[pos];
          turnStatusText.textContent = 'Oh no! A snake bites ' + curPlayer.name + ' and slides the token down to square ' + dest + '.';
          playSnakeSound();
          snakeCryEl.classList.add('active');
          setTimeout(() => {
            snakeCryEl.classList.remove('active');
            curPlayer.pos = dest;
            updateTokensPositions();
            setTimeout(finishTurn, 900);
          }, 850);
          return;
        }

        // Ordinary move finish
        setTimeout(finishTurn, 500);
      }

      function finishTurn() {
        if (state.gameOver) return;
        state.busy = false;
        state.activeIndex = (state.activeIndex + 1) % state.players.length;
        renderScoreboard();

        const nextPlayer = state.players[state.activeIndex];
        if (nextPlayer.isCpu) {
          turnStatusText.textContent = 'CPU is thinking...';
          runCpuTurn();
        } else {
          turnStatusText.textContent = 'Click the dice to roll.';
        }
      }

      function runCpuTurn() {
        if (state.gameOver) return;
        state.busy = true;

        setTimeout(() => {
          if (state.gameOver) return;
          const roll = rollDiceValue();
          state.rolledValue = roll;
          turnStatusText.textContent = 'CPU is rolling...';

          animateDiceToValue(roll, () => {
            if (state.gameOver) return;
            turnStatusText.textContent = 'CPU rolled a ' + roll + '! Moving...';
            setTimeout(() => {
              if (state.gameOver) return;
              executeCurrentPlayerMove();
            }, 600);
          });
        }, 800);
      }

      // 9. QUESTION MODAL & TROPHY SYSTEM
      function onSquareQuestionClick(sq) {
        if (state.busy || state.gameOver) return;
        const curPlayer = state.players[state.activeIndex];
        if (curPlayer.isCpu) return;

        state.openSquare = sq;
        const qRecord = state.questions[sq - 1];

        if (!qRecord || !qRecord.q.trim()) {
          modalSquareTitle.textContent = 'Square ' + sq + ' question';
          modalQuestionBody.textContent = 'No question is saved for square ' + sq + ' yet. Add it in settings.';
          modalAnswerInput.style.display = 'none';
          modalCheckBtn.style.display = 'none';
          modalFeedbackMsg.textContent = '';
          modalOverlay.classList.add('active');
          modalCloseBtn.focus();
          return;
        }

        modalSquareTitle.textContent = 'Square ' + sq + ' question';
        modalQuestionBody.textContent = qRecord.q;
        modalAnswerInput.style.display = 'block';
        modalCheckBtn.style.display = 'block';
        modalAnswerInput.value = '';
        modalFeedbackMsg.textContent = '';
        modalOverlay.classList.add('active');
        setTimeout(() => modalAnswerInput.focus(), 60);
      }

      function checkModalAnswer() {
        if (!state.openSquare) return;
        const sq = state.openSquare;
        const qRecord = state.questions[sq - 1];
        if (!qRecord) return;

        const userAns = modalAnswerInput.value.trim().replace(/\\s+/g, ' ').toLowerCase();
        const expectedAns = qRecord.a.trim().replace(/\\s+/g, ' ').toLowerCase();

        if (userAns === expectedAns && expectedAns.length > 0) {
          const curPlayer = state.players[state.activeIndex];
          if (curPlayer.earnedSquares.has(sq)) {
            modalFeedbackMsg.textContent = 'Correct! You already earned the trophy for this square.';
            modalFeedbackMsg.className = 'modal-feedback info';
            playCorrectSound();
          } else {
            curPlayer.earnedSquares.add(sq);
            curPlayer.trophies = curPlayer.earnedSquares.size;
            renderScoreboard();
            playTrophySound();

            if (curPlayer.trophies >= 5) {
              closeQuestionModal();
              curPlayer.pos = 20;
              updateTokensPositions();
              triggerVictory(curPlayer, 'collected five trophies!');
            } else {
              modalFeedbackMsg.textContent = 'Correct! Trophy earned! ✨🏆';
              modalFeedbackMsg.className = 'modal-feedback success';
            }
          }
        } else {
          modalFeedbackMsg.textContent = 'Not quite—try again. Check spelling and spacing.';
          modalFeedbackMsg.className = 'modal-feedback error';
          playWrongSound();
        }
      }

      function closeQuestionModal() {
        modalOverlay.classList.remove('active');
        state.openSquare = null;
      }

      modalCheckBtn.addEventListener('click', checkModalAnswer);
      modalCloseBtn.addEventListener('click', closeQuestionModal);

      modalAnswerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          checkModalAnswer();
        }
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
          closeQuestionModal();
        }
      });

      // 10. VICTORY OVERLAY & MULTICOLORED CONFETTI
      function triggerVictory(winner, reason) {
        state.gameOver = true;
        state.busy = false;
        playVictorySound();

        victoryMessage.innerHTML = '<strong>' + escapeHtml(winner.name) + '</strong> ' + reason;
        generateConfetti();
        victoryOverlay.classList.add('active');
      }

      function generateConfetti() {
        confettiContainer.innerHTML = '';
        const colors = ['#ff5d66', '#1878ee', '#18a75b', '#ffd85b', '#40e8ff', '#8a4de1', '#ffffff'];

        for (let i = 0; i < 90; i++) {
          const p = document.createElement('div');
          p.className = 'confetti-piece';
          p.style.left = Math.random() * 100 + '%';
          p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          p.style.animationDelay = (Math.random() * 2.5) + 's';
          p.style.animationDuration = (2 + Math.random() * 2.5) + 's';
          p.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
          confettiContainer.appendChild(p);
        }
      }

      playAgainBtn.addEventListener('click', () => {
        victoryOverlay.classList.remove('active');
        restartGame();
      });

      function restartGame() {
        initGamePlayers();
        renderScoreboard();
        updateTokensPositions();
        turnStatusText.textContent = 'Click the dice to roll.';
      }

      restartGameBtn.addEventListener('click', () => {
        restartGame();
        playSaveSound();
      });

      backToSettingsBtn.addEventListener('click', () => {
        gameScreen.classList.remove('active');
        settingsScreen.style.display = 'block';
        playStepSound();
      });

      startGameBtn.addEventListener('click', () => {
        initGamePlayers();
        buildBoardSquares();
        renderScoreboard();
        updateTokensPositions();

        settingsScreen.style.display = 'none';
        gameScreen.classList.add('active');

        setTimeout(() => {
          updateTokensPositions();
        }, 100);

        playSaveSound();
      });

      function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
      }

      // Initial build
      buildBoardSquares();
    })();
  </script>
</body>
</html>`;

fs.writeFileSync('snake-learning-game-latest-edition.html', htmlContent);
fs.writeFileSync('public/snake-learning-game-latest-edition.html', htmlContent);
console.log('Successfully generated snake-learning-game-latest-edition.html and public/snake-learning-game-latest-edition.html');
