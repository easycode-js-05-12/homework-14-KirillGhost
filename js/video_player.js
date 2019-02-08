class VideoPlayerBasic {
    constructor(settings) {
      this._settings = Object.assign(VideoPlayerBasic.getDefaultSettings(), settings);
      this._videoContainer = null;
      this._video = null;
      this._toggleBtn = null;
      this._progress = null;
      this._volume = null;
      this._playSpeed = null;
      this._skipPrevBtn = null;
      this._skipNextBtn = null;
      this._mouseDown = false;
    }

    /**
     * @desc Sets default player settings
     */
    _setDefaults() {
      this._video.volume = this._volume.value;
      this._video.playbackRate = this._playSpeed.value;
    }

    /**
     * @desc Adds player markup to the page and sets element listeners
     */
    init() {    
      // Проверить переданы ли видео и контейнер
      if (!this._settings.videoUrl) return console.error("Передайте адрес видео");
      if (!this._settings.videoPlayerContainer) return console.error("Передайте селектор контейнера");
      
      // Создадим разметку и добавим ее на страницу
      this._addTemplate();
      // Найти все элементы управления
      this._setElements();
      // Устанавливаем значения громкости и скорости воспроизведения из настроек (иначе сразу после запуска
      // они всегда будут стандартными для объекта Video, несмотря на указанные в объекте _settings)
      this._setDefaults();      
      // Установить обработчики событий
      this._setEvents();
    }

    /**
     * @desc Toggles video playback mode (play/pause)
     */
    toggle() {
      const method = this._video.paused ? 'play' : 'pause';
      this._toggleBtn.textContent = this._video.paused ? '❚ ❚' : '►';
      this._video[method]();
    }

    /**
     * @desc Shows video playback progress
     */
    _handlerProgress() {
      const percent = (this._video.currentTime / this._video.duration) * 100;
      this._progress.style.flexBasis = `${percent}%`;
      if (percent === 100) this._toggleBtn.textContent = '►';
    }

    /**
     * @desc Scrolls video to selected time
     * @param {event} e - Mouse event (click or move)
     */
    _scrub(e) {
      this._video.currentTime = (e.offsetX / this._progressContainer.offsetWidth) * this._video.duration;
    }

    /**
     * @desc Changes video volume
     */
    _changeVolume() {
      this._video.volume = this._volume.value;
    }

    /**
     * @desc Changes video playback speed
     */
    _changeSpeed() {
      this._video.playbackRate = this._playSpeed.value;
    }

    /**
     * @desc Skips video forward or backward
     * @param {event} e - Mouse event (double click)
     */
    _skip(e) {
      (e.offsetX > this._video.offsetWidth / 2) ? this._skipForward() : this._skipBack();
    }

    /**
     * @desc Skips video backward
     */    
    _skipBack() {
      this._video.currentTime -= this._settings.skipPrev;
    }

    /**
     * @desc Skips video forward
     */    
    _skipForward() {
      this._video.currentTime += this._settings.skipNext;
    }

    /**
     * @desc Sets element variables
     */
    _setElements() {
      this._videoContainer = document.querySelector(this._settings.videoPlayerContainer);
      this._video = this._videoContainer.querySelector('video');
      this._toggleBtn = this._videoContainer.querySelector('.toggle');
      this._progress = this._videoContainer.querySelector('.progress__filled');
      this._progressContainer = this._videoContainer.querySelector('.progress');
      this._volume = this._videoContainer.querySelector('.volume');
      this._playSpeed = this._videoContainer.querySelector('.playbackRate');
      this._skipPrevBtn = this._videoContainer.querySelector('.skipPrev');
      this._skipNextBtn = this._videoContainer.querySelector('.skipNext');
    }

    /**
     * @desc Sets element events
     */
    _setEvents() {
      this._video.addEventListener('click', () => this.toggle());
      this._toggleBtn.addEventListener('click', () => this.toggle());
      this._video.addEventListener('dblclick', (e) => this._skip(e));      
      this._video.addEventListener('timeupdate', () => this._handlerProgress());
      this._progressContainer.addEventListener('click', (e) => this._scrub(e));
      this._progressContainer.addEventListener('mousemove', (e) => this._mouseDown && this._scrub(e));
      this._progressContainer.addEventListener('mousedown', () => this._mouseDown = true);
      this._progressContainer.addEventListener('mouseup', () => this._mouseDown = false);
      this._volume.addEventListener('change', () => this._changeVolume());
      this._playSpeed.addEventListener('change', () => this._changeSpeed());
      this._skipPrevBtn.addEventListener('click', () => this._skipBack());
      this._skipNextBtn.addEventListener('click', () => this._skipForward());
    }

    /**
     * @desc Adds player markup to the page
     */
    _addTemplate() {
      const template = this._createVideoTemplate();
      const container = document.querySelector(this._settings.videoPlayerContainer);
      container ? container.insertAdjacentHTML("afterbegin", template) : console.error('контейнер не найден');
    }

    /**
     * @desc Returns player markup
     * @returns {string} Markup
     */
    _createVideoTemplate() {
      return `
      <div class="player">
        <video class="player__video viewer" src="${this._settings.videoUrl}"> </video>
        <div class="player__controls">
          <div class="progress">
          <div class="progress__filled"></div>
          </div>
          <button class="player__button toggle" title="Toggle Play">►</button>
          <input type="range" name="volume" class="player__slider volume" min=0 max="1" step="0.05" value="${this._settings.volume}">
          <input type="range" name="playbackRate" class="player__slider playbackRate" min="0.5" max="2" step="0.1" value="${this._settings.playSpeed}">
          <button data-skip="${this._settings.skipPrev}" class="player__button skipPrev">« ${this._settings.skipPrev}s</button>
          <button data-skip="${this._settings.skipNext}" class="player__button skipNext">${this._settings.skipNext}s »</button>
        </div>
      </div>
      `;
    }

    /**
     * @desc Gets default player settings
     * @returns {object} Settings
     */
    static getDefaultSettings() {
        /**
         * Список настроек
         * - адрес видео
         * - тип плеера "basic", "pro"
         * - controls - true, false
         */
        return {
          videoUrl: '',
          videoPlayerContainer: '.myplayer',
          volume: 1,
          playSpeed: 1
        }
    }
}

const myPlayer = new VideoPlayerBasic({
  videoUrl: 'video/mov_bbb.mp4',
  videoPlayerContainer: 'body',
  skipNext: 1,
  skipPrev: 1
});

myPlayer.init();