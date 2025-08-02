#!/bin/bash
cd /home/kavia/workspace/code-generation/color-palette-generator-24946-56159/palette_generator_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

