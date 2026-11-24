// pumpfun-paper-sprint-bot: a launch-chase bot for the pump.fun replay
// (agent-fun/replay/v2). The grader runs `node /bot/main.ts`; the strategy lives in
// strategy.ts and the SDK shim is the kit's sdk/ts/makefun-bot.ts, vendored byte for byte.
//
// How the bot works, one batch at a time: the harness sends a hello line first (capital
// 10 SOL, the caps, the fees, the seed), then one batch per slot — the slot's chain events,
// the marks for held curves, the fills of orders decided two slots ago — and the bot
// answers each batch with one reply carrying its orders for that slot (at most 16 orders,
// each buy capped at 1% of the mint's real SOL reserve, at most 5 open positions). Orders
// decided on the batch for slot s fill at slot s + 2. Buys chase clean launch tapes on
// curves already holding >= 5 SOL of real SOL; sells cut losers, bank winners, and exit
// on creator sells. See strategy.ts for the tuned numbers and the grading history
// (v1 momentum -2.09 SOL, v3 RQ-rider -3.35 SOL, this launch-chase +0.015 SOL on dev).

import { runBot } from './vendor/makefun-bot.ts';
import { createStrategy, DEFAULT_PARAMS } from './strategy.ts';

await runBot(createStrategy(DEFAULT_PARAMS));
