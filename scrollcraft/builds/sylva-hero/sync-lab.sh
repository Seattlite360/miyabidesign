#!/usr/bin/env bash
# Copy the site into the lab, keeping the lab's VP9 clips (headless Chromium has no H.264).
set -e
cd "$(dirname "$0")"
find lab/site -mindepth 1 -maxdepth 1 ! -name media -exec rm -rf {} +
for f in /home/user/miyabidesign/sylva/*; do [ "$(basename "$f")" = media ] || cp -r "$f" lab/site/; done
cp /home/user/miyabidesign/sylva/media/*.webp lab/site/media/
