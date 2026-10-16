# Unreal Engine 5 setup pack (owner decision 2026-10-16)

The owner chose **Unreal Engine 5, streamed to browsers over WebRTC (Pixel Streaming), on the 20 km map**, and asked me to set it up.

## Why I can't install it from the cloud session
- **No GPU:** `nvidia-smi` is missing. The session has 4 CPU cores, 15 GB RAM and about 23 GB free disk.
- **Epic hosts don't connect:** `cdn.unrealengine.com` and `epicgames.com` time out from here.
- **Accounts:** Unreal needs an Epic account, and I can't create accounts or sign in for you.
- **Your PC (azeem, Windows):** you told me it has no free disk. I have not opened any of its folders. Its connected folders are unrelated personal projects.

## What the GPU machine needs (my estimates; no provider priced)
- Windows with an NVIDIA GPU of at least 12 GB video memory, 8+ CPU cores, 32 GB RAM, 300 GB disk.
- Hourly rental, switched off when nobody is playing.
- Network: the signalling web page on TCP 80/443 and UDP for the video. A TURN server for friends behind strict networks.

## Your steps (about six)
1. Rent the machine from any cloud provider where you already have an account.
2. On it, create an Epic Games account, install the Epic Games Launcher, then install the newest Unreal Engine 5 release.
3. On it, install the Claude desktop app and sign in, or run `claude remote-control` in an empty folder such as `C:\castle-ue`.
4. Tell me here. I then start a session on that machine (you approve it on a card).
5. I work out the file transfer once connected. The Meshy zips are several hundred MB and are not in GitHub.
6. Turn the machine off when you are done.

## What I do once connected
1. Create the project **CastleOfStarlight** with Pixel Streaming, the Python editor scripting plugin and World Partition enabled.
2. Units: Unreal counts in centimetres, so the 20 km world is 2,000,000 cm. Unreal 5 uses large world coordinates, so this range is fine.
3. Import the kits in [import-manifest.csv](import-manifest.csv) by script: scale each model to its size, Nanite on, simple collision, and one master material with a hue and saturation control so each recolour is a material instance.
4. Build the world from owner-sketch-spec.md and the palace from builds/B01-princess-palace.md.
5. Streaming: one world server, with each player's view running as its own Unreal client on the GPU machine. A few clients fit on one GPU; I haven't measured how many.
6. Proximity voice stays in the browser page beside the video (the same way the web game does it today). Unreal sends each player's position to the page.

## What I could not check
- Everything above is untested: I can't run Unreal here, so the import script and the streaming set-up are written but unrun.
- The live web game at https://azim12086atmes-s.github.io/birthday-castle/ stays online as it is, but is no longer being developed.
