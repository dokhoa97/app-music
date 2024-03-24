// * 1. Render songs
// * 2. Scroll top 
// * 3. Play/pause/seek
// * 4. CD rotate
// * 5. Next/Prev
// * 6. Random
// * 7. Next / Repeat when ended
// * 8. Active song
// * 9. Scrol active song into view
// * 10. Play song when click
const PLAYER_STOGARE_KEY = 'F8_PLAYER'

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $('.playlist')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const volumeSlider = $('.volume-slider')
const volumeValue = $('.volume-value')
const app = {
    songs: [
        {
            name: "Cho tôi lang thang",
            singer: "Đen vâu",
            path: "music/ChoToiLangThang-NgotDen-4817311.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/playlist/2023/02/14/d/d/b/8/1676351753231_500.jpg"
        },
        {
            name: "Từng là",
            singer: "Vũ Cát Tường",
            path: "music/TungLa-VuCatTuong-13962415.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2024/03/01/b/3/9/b/1709305231637_500.jpg"
        },
        {
            name: "Nâng chén tiêu sầu",
            singer: "Bích Phương",
            path: "music/NangChenTieuSau-BichPhuong-14017885.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2024/03/07/8/3/c/9/1709801749003_500.jpg"
        },
        {
            name: "Sau lời từ thước",
            singer: "Phan Mạnh Quỳnh",
            path: "music/SauLoiTuKhuocThemeSongFromMAI-PhanManhQuynh-13780092.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2024/02/15/2/d/d/c/1707978408838_500.jpg"
        },
        {
            name: "Bôn ba",
            singer: "Phan Mạnh Quỳnh",
            path: "music/BonBaNuocNgoai-PhanManhQuynhTangDuyTanDuongK-13507037.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2024/01/17/d/4/2/0/1705500031946_500.jpg"
        },
        {
            name: "Hoa nở không màu",
            singer: "Hoài Lâm",
            path: "music/HoaNoKhongMau1-HoaiLam-6281704.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2020/05/15/c/f/3/0/1589532035884_500.jpg"
        },
        {
            name: "Người lạ thoáng qua",
            singer: "Đinh Tùng Huy",
            path: "music/NguoiLaThoangQua-DinhTungHuy-7079855.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2023/09/25/6/3/e/c/1695612578628_500.jpg"
        },
        {
            name: "Ai chung tình được mãi",
            singer: "Đinh Tùng Huy",
            path: "music/AiChungTinhDuocMai-DinhTungHuyACV-7197858.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2022/04/26/d/1/1/f/1650953841508_500.jpg"
        }
    ],
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    playedIndexes: [],
    config: JSON.parse(localStorage.getItem(PLAYER_STOGARE_KEY)) || {},
    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STOGARE_KEY, JSON.stringify(this.config))
    },
    render() {
        const htmls = this.songs.map((song, index) => (
            `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        ))
        playlist.innerHTML = htmls.join('')
    },
    difineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent() {
        const _this = this

        const thumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
            duration: 10000,
            iterations: Infinity,
        })

        thumbAnimate.pause()

        const cdWidth = cd.offsetWidth
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.body.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }


        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            thumbAnimate.play()
        }

        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            thumbAnimate.pause()
        }

        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercen = Math.floor(audio.currentTime * 100 / audio.duration)
                progress.value = progressPercen
            }
        }
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime

        }
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        volumeSlider.oninput = function (e) {
            audio.volume = e.target.value
            volumeValue.innerText = `${Number(e.target.value * 100) + '%'}`
        }
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollActiveSong()
        }
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()

            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollActiveSong()
        }
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
            _this.setConfig('isRandom', _this.isRandom)
        }
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
            _this.setConfig('isRepeat', _this.isRepeat)
        }
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode && !e.target.closest('.option')) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()
            }
            if (e.target.closest('.option')) {
                console.log('wait wait');
            }
        }

    },
    loadCurrentSong() {
        heading.innerText = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        this.setConfig("currentIndex", this.currentIndex)
    },
    loadConfig() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        this.currentIndex = this.config.currentIndex
    },
    scrollActiveSong() {
        setTimeout(() => {
            $('.active.song').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 300)
    },
    nextSong() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.playedIndexes.includes(newIndex))
        this.playedIndexes.push(newIndex)
        if (this.playedIndexes.length === this.songs.length) {
            this.playedIndexes = []
        }
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start() {
        this.loadConfig();
        this.difineProperties();
        this.loadCurrentSong();
        this.handleEvent();

        this.render();


        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()