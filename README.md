Task

Create a grid of 50x50. When you click on a cell, all values in the
cells in the same row and column are increased  by 1. If a cell is
empty, it will get a value of 1. After each change a cell will briefly
turn yellow. If 5 consecutive numbers in the Fibonacci sequence
are next to each other, these cells will briefly turn green and will
be cleared.

----------------------------------------------------------------------

I took this task a bit further and added a history of actions, where 
you can undo and redo your steps. In the future I want to change this
simple solution into a game, where the main goal is to clear the whole
grid. I wish to add dificulty levels, scoreboard and more.

----------------------------------------------------------------------

## Getting Started

Follow these steps to set up and run the application locally.

### 1. Clone the Repository

Clone the repository to your local machine:

git clone <repository-url>
cd <repository-folder>

### 2. Install Dependencies
Install the required dependencies using npm:

npm install

### 3. Run the Development Server
To launch the application in development mode, run:

npm start

This will start the development server and open the app in your default browser. By default, the app will be available at http://localhost:3000/.