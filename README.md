# Magmattic (dev) Frontend
This is where the code for the web client is.
# Instructions 
## 0. Prerequisites
- Ensure you have Nodejs 22 or greater installed -> [https://nodejs.org/en](https://nodejs.org/en)
- Make sure you have npm (often installed with Nodejs)
- Have the magmattic backend running

## 1. Clone this repo onto your machine using:
```bash
git clone git@github.com:mbocsi/magmattic_frontend.git
```
## 1. Navigate into project directory
## 2. Install Node modules (only need to do this the first time or when packages change)
```bash
npm install
```
## 3. Run the web app
```bash
npm run dev
```
## 4. Find the link printed in console and paste it into your browser
Probably [http://localhost:5173/](http://localhost:5173/)
## 5. Enter address of backend on the left and connect.
Find the IP address of the running backend and paste it into the connection field. For example, if you are running the backend locally, you can input ```ws://localhost:44444```. For any other case, replace "localhost" with the IP address of the raspberry pi or hosting device.