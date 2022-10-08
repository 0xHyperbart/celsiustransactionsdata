#!/bin/bash

grep -r 🟥 json-pass-2/ | wc -l
jq length json-pass-2/* | grep --line-buffered -v 221
