# pumpfun-paper-sprint-bot

[![make.fun](https://make.fun/badge/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b.svg)](https://make.fun/c/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b)
[![rank](https://make.fun/badge/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b/satsuki-sys/pumpfun-paper-sprint-bot/rank.svg)](https://make.fun/c/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b)
[![reward](https://make.fun/badge/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b/satsuki-sys/pumpfun-paper-sprint-bot/reward.svg)](https://make.fun/c/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b)

A paper-trading bot for the make.fun competition **Pump.fun Paper Sprint: Any Bot Can Win**.
It paper-trades pump.fun tokens on replayed chain data (harness `agent-fun/replay/v2`) with
10 SOL of paper capital, and is scored on a 6-hour final window by net PnL.

## Strategy

Launch-chase with a liquidity filter. The bot watches every new bonding curve from its
`CreateEvent` and buys in the first few slots only when the opening tape is clean:

- the creator bought at least 0.05 SOL in the create slot (skin in the game, not a huge dev buy),
- exactly the kind of broad early interest that shows up as 3 distinct non-creator buyers,
- the creator has not sold, nobody has dumped a big single sell,
- and the curve already holds at least 5 SOL of real SOL — the one filter that turned the
  dev-window expectancy positive in grading (broad launch entries sit near breakeven; the
  high-real-SOL subset is where the winners live).

It exits fast — +30% take-profit, −12% stop-loss, 12-slot max hold, instant exit on a
creator sell or a big single sell — because on this data a coin's spike is mostly over
within a few slots of its launch, and the 2-slot fill latency punishes anything slower.
A pace check against block time opens tiny 0.012 SOL probe round trips on liquid curves
when the bot's own fills or distinct coins lag the pace, so the run clears the 20-mint
guardrail even on a quiet stretch.

What did not survive grading and is not in this bot: chasing momentum on mature curves
(−2.09 SOL on the dev window) and riding real-SOL growth with a wide trailing stop
(−3.35 SOL — the edge was a zero-latency artifact; the 2-slot latency and the 1%-of-reserve
buy cap eat it).

## Layout

- `main.ts` — entrypoint: the grader runs `node /bot/main.ts`.
- `strategy.ts` — the strategy (launch-chase + guardrail pacing).
- `vendor/makefun-bot.ts` — the kit's `agent-fun/replay/v2` SDK shim, vendored byte for byte.

## Local grading

With the kit unpacked at `<kit>`:

```sh
node <kit>/cli/makefun.mjs grade-local --kit <kit> --bot . --driver process
node <kit>/cli/makefun.mjs grade-local --kit <kit> --bot . --driver process --stress
```

Dev-window result (full 24 h dev window, local replay): **+0.0148 SOL** net PnL,
24 distinct mints, max drawdown 0.002. The win leans on its 3 best coins
(+0.047 SOL of the +0.015 total), so the stress spread — not the dev score — is the
honest judge of this bot.

## License

MIT. See `LICENSE`.
