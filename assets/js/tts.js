(() => {
  document.addEventListener("DOMContentLoaded", function () {
    const aksaraList = [
      { aksara: "ᨀ", latin: "KA", audio: "ka.mp3" },
      { aksara: "ᨁ", latin: "GA", audio: "ga.mp3" },
      { aksara: "ᨂ", latin: "NGA", audio: "nga.mp3" },
      { aksara: "ᨃ", latin: "NGKA", audio: "ngka.mp3" },
      { aksara: "ᨄ", latin: "PA", audio: "pa.mp3" },
      { aksara: "ᨅ", latin: "BA", audio: "ba.mp3" },
      { aksara: "ᨆ", latin: "MA", audio: "ma.mp3" },
      { aksara: "ᨇ", latin: "MPA", audio: "mpa.mp3" },
      { aksara: "ᨈ", latin: "TA", audio: "ta.mp3" },
      { aksara: "ᨉ", latin: "DA", audio: "da.mp3" },
      { aksara: "ᨊ", latin: "NA", audio: "na.mp3" },
      { aksara: "ᨋ", latin: "NRA", audio: "nra.mp3" },
      { aksara: "ᨌ", latin: "CA", audio: "ca.mp3" },
      { aksara: "ᨍ", latin: "JA", audio: "ja.mp3" },
      { aksara: "ᨎ", latin: "NYA", audio: "nya.mp3" },
      { aksara: "ᨏ", latin: "NCA", audio: "nca.mp3" },
      { aksara: "ᨐ", latin: "YA", audio: "ya.mp3" },
      { aksara: "ᨑ", latin: "RA", audio: "ra.mp3" },
      { aksara: "ᨒ", latin: "LA", audio: "la.mp3" },
      { aksara: "ᨓ", latin: "WA", audio: "wa.mp3" },
      { aksara: "ᨔ", latin: "SA", audio: "sa.mp3" },
      { aksara: "ᨕ", latin: "A", audio: "a.mp3" },
      { aksara: "ᨖ", latin: "HA", audio: "ha.mp3" },
    ];

    let cardIndex = 0;

    function showCard(index) {
      document.getElementById("aksaraDisplay").innerText = aksaraList[index].aksara;
      document.getElementById("latinDisplay").innerText = aksaraList[index].latin;
    }

    window.nextCard = function () {
      cardIndex = (cardIndex + 1) % aksaraList.length;
      showCard(cardIndex);
    };

    window.prevCard = function () {
      cardIndex = (cardIndex - 1 + aksaraList.length) % aksaraList.length;
      showCard(cardIndex);
    };

    window.playAudio = function () {
      const audio = new Audio('assets/sounds/' + aksaraList[cardIndex].audio);
      audio.play();
    };


    const canvas = document.getElementById("drawCanvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    resizeCanvas();
    window.addEventListener("resize", () => {
      resizeCanvas();
      clearCanvas();
    });

    let drawing = false;

    function getCanvasCoordinates(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if (e.touches) {
        const touch = e.touches[0];
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY
        };
      } else {
        return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY
        };
      }
    }

    canvas.addEventListener("mousedown", (e) => {
      drawing = true;
      const pos = getCanvasCoordinates(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!drawing) return;
      const pos = getCanvasCoordinates(e);
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    });

    canvas.addEventListener("mouseup", () => {
      drawing = false;
      ctx.beginPath();
    });

    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      drawing = true;
      const pos = getCanvasCoordinates(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    });

    canvas.addEventListener("touchmove", (e) => {
      if (!drawing) return;
      const pos = getCanvasCoordinates(e);
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    });

    canvas.addEventListener("touchend", () => {
      drawing = false;
      ctx.beginPath();
    });

    window.clearCanvas = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };


    showCard(cardIndex);
  });
})();