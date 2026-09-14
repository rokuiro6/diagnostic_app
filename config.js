<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>歩行者交通マナー違反タイプ診断</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- FontAwesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- App Stylesheet -->
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- App Main Content -->
  <main class="app-main">
    <section class="diagnostic-sandbox" id="diagnostic-view">
      <div class="diagnostic-card">

        <!-- INTRO SCREEN -->
        <div class="screen active" id="screen-intro">
          <h1 class="intro-title" id="intro-title">歩行者交通マナー
違反タイプ診断</h1>
          <button class="btn" id="start-btn">
            診断を開始する
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <!-- QUESTION SCREEN -->
        <div class="screen" id="screen-question">
          <div class="progress-container">
            <div class="progress-header">
              <span id="question-progress-text"></span>
              <span id="question-progress-percent"></span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" id="question-progress-bar"></div>
            </div>
          </div>

          <div class="question-box">
            <h2 class="question-text" id="question-text"></h2>
          </div>

          <!-- Likert 5-choice Scale -->
          <div class="likert-scale">
            <span class="likert-label-extreme agree">そう思う</span>
            <div class="likert-option" data-value="3"><div class="likert-dot"></div></div>
            <div class="likert-option" data-value="1"><div class="likert-dot"></div></div>
            <div class="likert-option" data-value="0"><div class="likert-dot"></div></div>
            <div class="likert-option" data-value="-1"><div class="likert-dot"></div></div>
            <div class="likert-option" data-value="-3"><div class="likert-dot"></div></div>
            <span class="likert-label-extreme disagree">そう思わない</span>
          </div>

          <div class="question-footer-nav">
            <button class="btn-outline" id="prev-btn" disabled>
              <i class="fa-solid fa-arrow-left"></i>
              前へ
            </button>
            <button class="btn-outline" id="reset-test-btn">
              やり直す
            </button>
          </div>
        </div>

        <!-- RESULT SCREEN -->
        <div class="screen" id="screen-result">
          <div style="text-align: center; margin-bottom: 24px;">
            <div class="result-type-code" id="result-code"></div>
            <h2 class="result-title" id="result-title"></h2>
            <div class="result-quote" id="result-quote"></div>
          </div>

          <div class="result-description-card" id="result-desc"></div>

          <!-- Undefined Code Warning -->
          <div class="result-undefined-warning" id="result-warning" style="display: none;">
            <i class="fa-solid fa-circle-exclamation"></i>
            <div>
              <strong>未定義タイプです</strong><br>
              <span id="result-warning-text"></span>
            </div>
          </div>

          <h3 class="result-axes-title">特性の割合</h3>
          <div class="axis-chart-list" id="axis-charts"></div>

          <div class="result-actions">
            <button class="btn" id="restart-btn">診断をもう一度受ける</button>
          </div>
        </div>

      </div>
    </section>
  </main>

  <!-- Configuration data (edit this file to customize the diagnostic) -->
  <script src="config.js"></script>
  <!-- Application logic -->
  <script src="app.js"></script>
</body>
</html>
