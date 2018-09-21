# virto-bot

Telegram antivirus bot

A Telegram bot to automatically scan files in Telegram groups/channels.

Scan of url, domain and file is supported through direct usage of bot.

## Disclaimer

This is an educational project. You need both [Telegram bot API key](https://t.me/botfather) and [Virustotal API key](https://virustotal.com/).

According to [Virustotal website](https://developers.virustotal.com/v2.0/reference) you cannot use their service commercially or even extensively:

>The VirusTotal API must not be used in commercial products or services, it can not be used as a substitute for antivirus products and it can not be integrated in any project that may harm the antivirus industry directly or indirectly. Noncompliance of these terms will result in immediate permanent ban of the infractor individual or organization. Under all circumstances VirusTotal's [Terms of Service](https://support.virustotal.com/hc/en-us/articles/115002145529-Terms-of-Service) and [Privacy Policy](https://support.virustotal.com/hc/en-us/articles/115002168385-Privacy-Policy) must be respected.

## Install

```bash
git clone https://github.com/remisa-yousefvand/virto-bot.git
cd virto-bot
VIRTOBOT_ADMIN=<TELEGRAM ADMIN USERNAME> TELEGRAM_APIKEY=<TELEGRAM API KEY> VIRUSTOTAL_APIKEY=<VIRUSTOTALL API KEY> node index.js
```

## Admin commands

- `shutdown`: Shutdown service after processing queued scans.
- `stat`: Total number of scan requests.

## Docker

Run your virto-bot using docker image.

```bash
docker run -d --name virtobot -e VIRTOBOT_ADMIN=<TELEGRAM ADMIN USERNAME> -e TELEGRAM_APIKEY=<TELEGRAM API KEY> -e VIRUSTOTAL_APIKEY=<VIRUSTOTALL API KEY> --restart always remisa/virto-bot
```

To check logs:

```bash
docker logs -f virtobot
```

### [demo](https://t.me/virtobot)

### To Do

- [ ] Statistics
- [ ] Admin commands
- [ ] Cache results in db

### Changes

#### **1.1.0**

- Support admin commands (shutdown, stat)

#### **1.0.0**

- Initial release
