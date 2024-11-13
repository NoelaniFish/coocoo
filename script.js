/* General reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #000; /* Black background */
    font-family: 'Helvetica', sans-serif;
    color: #f0f0f0; /* Light gray text */
}

.container {
    text-align: center;
    background-color: #1a1a1a; /* Dark gray for the container */
    padding: 40px;
    border-radius: 20px; /* Rounded corners */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    max-width: 600px;
    width: 100%;
}

h1 {
    font-size: 28px;
    margin-bottom: 30px;
    color: #00ffcc; /* Teal accent for the title */
    border-bottom: 2px solid #00ffcc;
    padding-bottom: 10px;
}

p#transcript {
    font-size: 20px;
    margin-bottom: 30px;
    color: #cccccc; /* Slightly lighter gray for the transcript */
    min-height: 60px;
    background-color: #262626;
    padding: 20px;
    border-radius: 15px; /* Rounded corners */
    box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.2);
}

button {
    background-color: #00ffcc; /* Teal button color */
    color: #000;
    border: none;
    padding: 15px 25px;
    font-size: 18px;
    border-radius: 15px; /* Rounded corners */
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 6px 15px rgba(0, 255, 204, 0.3);
}

button:hover {
    background-color: #009977; /* Darker teal on hover */
    box-shadow: 0 8px 20px rgba(0, 255, 204, 0.5);
}

button:active {
    transform: translateY(2px);
}
