#Bachelor-Projekt

##Frontend
Das Frontend ist, wie mit dem Betreuer besprochen, nicht für die Abgabe, sondern allein für die Veranschaulichung des Codes in der Abschlusspräsentation gedacht. Wodurch die Implementierung dessen sich auf eine sehr rohe und nicht für den Endbenutzer taugliche Fassung beschränkt.

Um das Frontend der jeweiligen Use Cases starten zu können müssen folgende Schritte ausgeführt werden.

1. Starten einer Blockchain-Simulation (bevorzugt Ganache-Cli) ```$ ganache-cli ```. (hierfür muss Ganache-Cli auf dem System installiert sein)

Folgende Punkte müssen im Ordner (./battery/peer/ oder ./p2p/peer) des jeweiligen Frontends ausgeführt werden.

2. Installieren der Dependencies über ```$ npm install ``` (hierfür muss NPM auf dem System installiert sein)

3. Deployen der Smart Contracts ```$ truffle migrate``` (hierfür muss Truffle auf dem System installiert sein)

4. Starten des http Servers um die ABI bereitzustellen ```$ node server.js``` (hierfür muss Node auf dem System installiert sein)

5. Und letztlich das Starten des Frontends über ```$ ng serve```

Falls die Fehlermeldung: "Error: Node Sass does not yet support your current environment" auftritt, so kann sie über ```$ npm rebuild node-sass``` behoben werden.

Nun kann das Frontend über Internetbrowser erreicht werden.

Um die Sicht eines Benutzers zu öffenen muss folgender Link aufgerufen werden ```localhost:4200/pages/user/1```hierbei ist es möglich verschiedene Benutzer zu wählen, indem man die letzte Zahl durch eine nächst höhere ersetzt.
Um die Sicht des Netzbetreibers oder einer Autorität zu öffenen muss der Linke ```localhost:4200/pages/betreiber``` geöffnet werden.

#Smart Contracts
Um die Funktionalität der Smart Contracts (siehe ./p2p/Contracts.sol oder ./battery/Contracts.sol) testen zu können, können diese einfach auf der Remix IDE von Ethereum ausgeführt werden. Hierfür muss der Haken für Optimization beim Compilieren gesetzt werden. Der zu deployende Smart Contract ist entweder VirtualBattery oder Energy. Alle weiteren Abhängigkeiten sind aus der beigefügten Bachelor-Projekt-Thesis ersichtlich und würden den Rahmen dieser README sprengen.
