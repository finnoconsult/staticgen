#!/usr/bin/env bash
node minify.js
if [ -n "$1" ]; then
	node minify.js -p $1
fi
node render.js $1
