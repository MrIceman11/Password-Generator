const specialCharacters = "!@#$%^&*";

function loadWordsFromFile(filename, callback) {
    fetch(filename)
        .then(response => response.text())
        .then(data => {
            const words = data.split('\n').map(word => word.trim());
            callback(words);
        })
        .catch(error => {
            console.error(error);
            callback([]);
        });
}

function generatePassword(event) {
    event.preventDefault();

    const wordCount = parseInt(document.getElementById("wordCount").value, 10);
    const useNumbers = document.getElementById("useNumbers").checked;
    const useSpecialChars = document.getElementById("useSpecialChars").checked;

    if (wordCount < 2) {
        alert("Bitte wählen Sie mindestens 2 Wörter.");
        return;
    }

    loadWordsFromFile("lustige_woerter.txt", function (lustigeWoerter) {
        loadWordsFromFile("tiernamen.txt", function (tiernamen) {
            if (lustigeWoerter.length === 0 || tiernamen.length === 0) {
                alert("Fehler beim Laden der Wörter.");
                return;
            }

            let password = "";
            let tiernamenIncluded = false;

            for (let i = 0; i < wordCount; i++) {
                let wort;

                if (!tiernamenIncluded && i < wordCount - 1) {
                    // Wenn ein Tiername benötigt wird, fügen Sie einen aus der Liste hinzu
                    const randomIndex = Math.floor(Math.random() * tiernamen.length);
                    wort = tiernamen[randomIndex];
                    tiernamenIncluded = true;
                } else {
                    // Die restlichen Wörter können aus "lustige_woerter.txt" stammen
                    const randomIndex = Math.floor(Math.random() * lustigeWoerter.length);
                    wort = lustigeWoerter[randomIndex];
                }

                password += wort;

                if (i < wordCount - 1) {
                    if (useSpecialChars && useNumbers) {
                        password += specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length));
                        password += Math.floor(Math.random() * 10);
                    } else if (useSpecialChars) {
                        password += specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length));
                    } else if (useNumbers) {
                        password += Math.floor(Math.random() * 10);
                    }
                }
            }

            const passwordElement = document.getElementById("password");
            passwordElement.textContent = password;

            const copyMessage = document.getElementById("copyMessage");
            copyMessage.style.display = "block";

            copyMessage.addEventListener("animationend", () => {
                copyMessage.style.display = "none";
            });

            const textArea = document.createElement("textarea");
            textArea.value = password;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
        });
    });
}

const generateForm = document.getElementById("passwordForm");
generateForm.addEventListener("submit", generatePassword);