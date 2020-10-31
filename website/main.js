"use strict";

angular
  .module("longibot", ["ngMaterial"])
  .controller("AppCtrl", function ($scope, $mdDialog) {
    $scope.selectedVoice = null;
    $scope.voiceSpeed = 10;
    $scope.messages = [
      {
        username: "AntuV",
        message: "hola",
      },
    ];

    $scope.onVoiceChange = () => {
      localStorage.setItem("voice", $scope.selectedVoice.name);
      localStorage.setItem("speed", $scope.voiceSpeed);
    };

    if (speechSynthesis) {
      speechSynthesis.onvoiceschanged = function () {
        $scope.voices = speechSynthesis.getVoices();

        const lastVoice = localStorage.getItem("voice");
        if (lastVoice) {
          let foundVoice = null;
          $scope.voices.forEach(function (voice, index) {
            if (voice.name === lastVoice) {
              foundVoice = voice;
            }
          });

          if (foundVoice) {
            $scope.selectedVoice = foundVoice;
          }
        }

        const voiceSpeed = localStorage.getItem("speed");
        if (voiceSpeed) {
          $scope.voiceSpeed = Number.parseInt(voiceSpeed, 10);
        }
      };
    } else {
      alert(
        "Bad news!  Your browser doesn't have the Speech Synthesis API this project requires.  Try opening this webpage using the newest version of Google Chrome."
      );
    }

    $scope.socket = io.connect("http://localhost:3700", {
      forceNew: true,
    });

    $scope.socket.on("tts", function (data) {
      if (!$scope.selectedVoice) {
        return;
      }

      var speech = new SpeechSynthesisUtterance();
      speech.text = data.message;
      speech.voice = $scope.selectedVoice;
      speech.rate = $scope.voiceSpeed / 10;
      window.speechSynthesis.speak(speech);
      $scope.messages.unshift(data);
      $scope.$apply();
    });

    $scope.onBlockUser = (message, ev) => {
      var confirm = $mdDialog
        .confirm()
        .title("¿Seguro de bloquear del TTS a " + message.username + "?")
        .textContent("No se le permitirá más usar el comando !tts")
        .ariaLabel("bloquear usuario")
        .targetEvent(ev)
        .ok("Sí, estoy seguro")
        .cancel("No, mejor no");

      $mdDialog.show(confirm).then(
        function () {
          $scope.socket.emit('block', message.username);
        },
        function () {
          //
        }
      );
    };
  });
