# deluxe

A simple Philips Hue app. 

## Install

If you are using macOS with Homebrew or Linux with Linuxbrew: 

```bash=
brew install njlr/deluxe
deluxe --version
dlx --version
```

## Usage

First, you must connect to the Philips Hue Bridge: 

```bash=
deluxe
```

To view your lights: 

```bash=
deluxe status
```

To switch lights on and off: 

```bash=
# Switches lights 1, 2 and 3 on
deluxe on 1 2 3

# Switches light 4 off
deluxe off 4
```

To set the color of your lights (and switch them on): 

```bash=
# Sets lights 1 and 2 to red
deluxe set 1 2 red

# Sets light 3 to #f5ee6b
deluxe set 3 #f5ee6b

# Sets light 4 to rgb(255, 160, 40)
deluxe set 4 rgb(255, 160, 40)
```

You can also use `all` in place of a light number: 

```bash=
# Set all lights to purple
deluxe set all purple 
```

Or a light name: 

```bash=
deluxe set bedside-lamp green
```

Or even a room name: 

```bash=
deluxe set kitchen cyan 
```

## Build

```bash=
yarn install
yarn build
node ./dist/index.js
```

## Develop

```bash=
yarn babel-node ./src/index.js
```
