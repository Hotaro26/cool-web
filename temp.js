        const sections = document.querySelectorAll('section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, {
            threshold: 0.2 // Trigger when 20% of the section is visible
        });

        sections.forEach(section => {
            observer.observe(section);
        });

        // --- Hamburger Menu Logic ---
        const hamburgerBtn = document.getElementById('hamburger-menu');
        const menuOverlay = document.getElementById('menu-overlay');
        const menuLinks = menuOverlay.querySelectorAll('a');

        function toggleMenu(e) {
            e.stopPropagation(); // prevent triggering the click sound twice or bubbling
            hamburgerBtn.classList.toggle('open');
            menuOverlay.classList.toggle('open');
            playCutePop(); // Play pop sound on menu toggle
        }

        hamburgerBtn.addEventListener('click', toggleMenu);

        // Close menu when a link is clicked
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('open');
                menuOverlay.classList.remove('open');
                playCutePop();
            });
        });

        // --- Web Audio API: Cute Pop Sound ---
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        function playCutePop() {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            // A sine wave gives a soft, cute tone
            oscillator.type = 'sine';
            
            // Frequency sweep from mid to high creates a "pop/bloop"
            oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
            
            // Envelope for a snappy, quick sound
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.15);
        }

        // Add the click sound to the entire document
        document.addEventListener('click', playCutePop);

        // --- Flower Rotation on Scroll ---
        const flowers = document.querySelectorAll('.flower, .s4-bl-flower, .s4-br-flower');
        window.addEventListener('scroll', () => {
            const rotation = window.scrollY * 0.1;
            flowers.forEach(flower => {
                flower.style.setProperty('--scroll-rot', `${rotation}deg`);
            });
        });

        // --- Retro iPod & YouTube API Logic ---
        const musicIconBtn = document.getElementById('music-icon-btn');
        const ipodContainer = document.getElementById('ipod-container');
        
        musicIconBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            ipodContainer.classList.toggle('open');
            playCutePop();
        });

        // iPod Screen Elements
        const trackInfo = document.getElementById('ipod-track-info');
        const artistInfo = document.getElementById('ipod-artist');
        const statusTxt = document.querySelector('.ipod-status');

        function updateScreen(title, artist) {
            trackInfo.textContent = title;
            artistInfo.textContent = artist;
        }

        // --- Draggable iPod Logic ---
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        function startDrag(e) {
            if (e.target.classList.contains('wheel-btn')) return;
            isDragging = true;
            ipodContainer.style.transition = 'none';
            
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            
            const rect = ipodContainer.getBoundingClientRect();
            dragOffsetX = clientX - rect.left;
            dragOffsetY = clientY - rect.top;
        }

        function doDrag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            
            ipodContainer.style.left = `${clientX - dragOffsetX}px`;
            ipodContainer.style.top = `${clientY - dragOffsetY}px`;
            ipodContainer.style.transform = 'scale(1)';
        }

        function endDrag() {
            if (isDragging) {
                isDragging = false;
                ipodContainer.style.transition = '';
            }
        }

        ipodContainer.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', doDrag, { passive: false });
        document.addEventListener('mouseup', endDrag);

        ipodContainer.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', doDrag, { passive: false });
        document.addEventListener('touchend', endDrag);

        // --- HTML5 Local Audio Logic ---
        const audioPlayer = document.getElementById('audio-player');
        let isPlaying = false;

        // Local Playlist data (assuming you put these in the assets folder)
        const localPlaylist = [
            { src: 'assets/snowfall.mp3', title: 'Snowfall', artist: 'Oneheart & Reidenshi' },
            { src: 'assets/track2.mp3', title: 'Cute Track', artist: 'Local Artist' },
            { src: 'assets/track3.mp3', title: 'Background Music', artist: 'Unknown' }
        ];
        let currentTrackIndex = 0;

        // Render playlist menu pills
        const playlistMenu = document.getElementById('playlist-menu');
        localPlaylist.forEach((song, index) => {
            const btn = document.createElement('div');
            btn.className = 'song-btn';
            btn.textContent = song.title;
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // don't bubble
                playCutePop();
                playLocalSong(index);
            });
            playlistMenu.appendChild(btn);
        });

        function playLocalSong(index) {
            currentTrackIndex = index;
            updateScreen(localPlaylist[index].title, localPlaylist[index].artist);
            audioPlayer.src = localPlaylist[index].src;
            audioPlayer.play().then(() => {
                isPlaying = true;
                statusTxt.textContent = '▶ PLAYING';
            }).catch(e => {
                console.log('Audio file missing! Make sure the file exists in assets/.');
                statusTxt.textContent = 'FILE MISSING';
                isPlaying = false;
            });
        }

        audioPlayer.addEventListener('ended', () => {
            isPlaying = false;
            statusTxt.textContent = '❚❚ PAUSED';
        });

        // iPod Controls
        const playBtn = document.getElementById('ipod-play');
        const prevBtn = document.getElementById('ipod-prev');
        const nextBtn = document.getElementById('ipod-next');
        const menuBtn = document.querySelector('.menu-btn');
        
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playCutePop();
            if (!audioPlayer.src) return;
            
            if (isPlaying) {
                audioPlayer.pause();
                isPlaying = false;
                statusTxt.textContent = '❚❚ PAUSED';
            } else {
                audioPlayer.play();
                isPlaying = true;
                statusTxt.textContent = '▶ PLAYING';
            }
        });

        // Prev/Next skips tracks for the local playlist
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playCutePop();
            let newIndex = currentTrackIndex - 1;
            if(newIndex < 0) newIndex = localPlaylist.length - 1;
            playLocalSong(newIndex);
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playCutePop();
            let newIndex = currentTrackIndex + 1;
            if(newIndex >= localPlaylist.length) newIndex = 0;
            playLocalSong(newIndex);
        });
        
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playCutePop();
            ipodContainer.classList.remove('open');
        });
