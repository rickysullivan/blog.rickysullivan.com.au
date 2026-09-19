---
title: "It's the Vibe of it"
excerpt: "Why AI-assisted software needs a gut check alongside the green checks."
category: Software
date: 2026-02-19T08:18:05.000Z
updatedDate: 2026-05-28T22:45:26.000Z
author:
  name: Ricky Sullivan
  role: Developer, dad, drongo
cover:
  src: "/media/images/2026/02/8BE5F841-23F3-4C0E-8323-DEED36F28FE7.png"
  alt: "Feature image for It's the Vibe of it"
featured: true
draft: false
---

**Why your AI agent pipeline needs a "gut check" — and why a fictional Australian solicitor from 1997 is the best framework we've got.**

---

In 1997, a low-budget Australian comedy gave us one of the most accidentally profound statements about software quality ever uttered.

Dennis Denuto never wrote a line of code. He barely wrote a line of legal argument. But he understood something that most AI-assisted development pipelines still don't:

_Sometimes the thing passes every test and still isn't right._

---

## The Scene

If you haven't seen _The Castle_ — first of all, [fix that](https://www.workingdog.com/the-castle). Second, here's the setup.

The Kerrigan family is fighting the compulsory acquisition of their home. The government wants to bulldoze their house to expand Melbourne Airport. Their lawyer is Dennis Denuto: a suburban solicitor whose usual workload is conveyancing, wills, and the occasional neighbourhood dispute. He operates out of a shopfront office next to a pizza joint. His photocopier is always broken.

Dennis is not a constitutional lawyer. Dennis is not any kind of specialist. Dennis is a man who said "yeah, I reckon I can do that" when he absolutely could not do that.

But he takes the case to the Federal Court anyway.

The judge asks him to articulate his constitutional argument. Which section of the Constitution is being violated? What's the legal basis?

Dennis freezes. He shuffles papers. And then he delivers what has become the most quoted line in Australian legal cinema:

> "It's the Constitution. It's Mabo. It's justice. It's law. It's the vibe and... ahh, no, that's it. It's the vibe."

<figure>
  <a href="https://www.youtube.com/watch?v=97IiPli_uXw" rel="noreferrer">
    <img src="/media/images/2026/02/the-castle.jpg" alt="Dennis Denuto arguing in court in The Castle" />
  </a>
  <figcaption><a href="https://www.youtube.com/watch?v=97IiPli_uXw" rel="noreferrer">Watch the “It’s the vibe” courtroom scene from <em>The Castle</em> on YouTube.</a></figcaption>
</figure>

The judge is unimpressed. Dennis loses the case.

But here's the thing that everyone forgets about _The Castle_:

**Dennis was right.**

The Kerrigans eventually win on appeal. A proper QC — the kind of lawyer who owns more than one suit — takes the case to the High Court and wins on exactly the principle Dennis was fumbling towards: [Section 51(xxxi) of the Australian Constitution](https://classic.austlii.edu.au/au/legis/cth/consol_act/coaca430/s51.html), which requires the government to acquire property on "just terms."

Dennis couldn't articulate it. He couldn't structure it. He couldn't cite it. But his instinct — his _vibe_ — was correct. The acquisition wasn't just. The process wasn't fair. Something was fundamentally wrong, and he could feel it even if he couldn't prove it.

He needed a framework to turn that feeling into a winning argument.

---

## What This Has to Do With Your AI Pipeline

You're shipping features with AI agents now. Maybe Claude Code, maybe Cursor, maybe a custom harness. The agent reads the spec, implements the feature, runs the tests, passes the build, clears the security gate, and opens a PR.

Everything is green.

And sometimes you look at the result and think: _this isn't what I meant._

The code is correct. The tests pass. The acceptance criteria are met. But the interaction feels heavy. The flow is slightly wrong. The feature technically does what was asked but misses the point of _why_ it was asked. It's like ordering a flat white and getting a technically-correct coffee-flavoured beverage that is not, in any meaningful sense, a flat white.

You're having a Dennis Denuto moment. You can feel that something is off, but your pipeline has no way to express that. Your pipeline speaks in binaries: build pass/fail, test pass/fail, security gate pass/fail. It doesn't speak in _vibes_.

And so either you ship something that's subtly wrong, or you manually intervene every time with feedback you can't quite articulate, and your AI-assisted velocity advantage evaporates because a human is now the bottleneck for feelings.

---

## The Problem With Correctness

Here's a truth that's uncomfortable for anyone who's spent their career writing test suites:

**Correctness is necessary but not sufficient.**

An AI agent can produce code that is:

- Functionally correct
- Fully tested
- Security-reviewed
- Performant
- Accessible
- Documented

And still _wrong_.

Wrong because the modal appears when the user doesn't expect it. Wrong because the error message is technically accurate but emotionally hostile. Wrong because the feature works exactly as specified but the specification missed the point. Wrong because the flow has seven steps when the user's mental model has three.

These aren't bugs. They're alignment failures. And they're the hardest class of problem in AI-assisted development because they exist in the gap between what you wrote in the spec and what you actually meant.

Traditional QA won't catch them — the acceptance criteria pass. Analytics won't catch them until it's too late — you need users to bounce first. Code review won't catch them — the code is clean.

What catches them is a human looking at the result and saying "yeah, nah."

---

## Introducing the Dennis Denuto Metric

The Dennis Denuto Metric (DDM) is a structured vibe check.

That sentence is doing a lot of work, so let me break it apart:

- **Structured**: It's a weighted rubric with defined dimensions, not a thumbs-up/thumbs-down.
- **Vibe**: It evaluates experiential alignment — does the thing _feel_ like what was intended?
- **Check**: It's a gate. It produces a score. It can block a release.

It's what Dennis needed in that courtroom: a framework to turn "it's the vibe" into something actionable.

### The Rubric

| Dimension              | Weight | The Question                                               |
| ---------------------- | ------ | ---------------------------------------------------------- |
| Clarity of User Intent | 10%    | Can you immediately tell what this feature is for?         |
| Emotional Resonance    | 10%    | Does it feel like it was built by someone who cared?       |
| Consistency with Spec  | 15%    | Did we drift from what was actually asked?                 |
| Flow and Usability     | 15%    | Is the interaction natural, or is it an obstacle course?   |
| Trust and Credibility  | 10%    | Does it feel solid, or does it feel like a house of cards? |
| Cognitive Load         | 10%    | Can a human process this without a manual?                 |
| Surprise and Delight   | 5%     | Is there any evidence of taste?                            |
| Sense of Belonging     | 5%     | Does it look like it belongs in this product?              |
| The Dennis Dimension   | 20%    | The raw, unstructured human vibe. The residual.            |

An AI agent evaluates the first eight dimensions by comparing the original spec against the implementation — reading the intent, reading the code, reading the user-facing output, and scoring each axis.

Then it hands the result to a human for the final 20%. This isn't just another dimension alongside the others — it's the escape valve. The admission that the rubric is incomplete. More on why it's weighted this heavily in a moment.

### Reading the Score

- **Below 60%** — Iterate. Something fundamental is misaligned.
- **60-75%** — Acceptable with friction. Works, but doesn't feel right. Specific dimensions will tell you where.
- **75-85%** — Good. Minor polish items. Ship with awareness.
- **85-95%** — Strong alignment. The spec was clear, the agent delivered, the experience lands.
- **95%+** — "It's the vibe." Everything clicks. Ship it yesterday.

---

## "But Isn't This Just Subjective?"

Yes. That's the point.

Software development has spent decades trying to eliminate subjectivity from quality assessment. And we've gotten very good at it for the things that can be objectively measured: does it compile, does it pass tests, does it handle edge cases, is it secure, is it fast.

But product quality has always had a subjective dimension. We just used to handle it implicitly — through design reviews, product manager sign-offs, hallway usability tests, and experienced engineers saying "I don't love this" in code review.

AI-assisted development is moving so fast that those informal checkpoints are getting skipped. The agent ships three features before the product manager finishes their coffee. And each feature is _correct_ in a way that makes it hard to push back on.

DDM makes the subjective dimension explicit. It gives it a structure. It gives it a score. And crucially, it gives it a _vocabulary_ — so when you say "the flow is wrong," you're pointing at a specific rubric dimension with a specific score, not just waving your hands.

Dennis Denuto waved his hands and lost the case. The QC had a framework and won.

---

## "So It's Just a Gut Feeling?"

Not exactly. But it's related, and the distinction matters.

There are three things people conflate when they talk about intuitive quality assessment, and they're each doing different work:

**A gut feeling** is the raw signal. It's pre-verbal, holistic pattern recognition — your brain matching the current situation against thousands of prior experiences before you can consciously process why. Kahneman's System 1. You look at a feature and _feel_ something is off before you can explain what. An experienced builder has seen enough shipped products that their nervous system has learned to detect misalignment the way a sommelier detects a corked wine — instantly, automatically, and often before the conscious mind catches up.

**A sniff test** is applying that signal as a binary gate. Pass or fail. "Does this smell right?" It takes the rich, multidimensional gut feeling and compresses it to a single bit: yes or no. Useful for speed. Useless for diagnosis. When the sniff test fails, you know something is wrong but you can't tell anyone _what_.

**DDM** is an attempt to decompose the gut feeling into its constituent signals _after the fact_. It's System 2 analysis of System 1 output. It asks: when an experienced builder says "something is off," what are they actually detecting? The answer is usually some combination of flow friction, spec drift, cognitive load, tonal mismatch, and a handful of other recurring patterns. The rubric names those patterns and scores them individually.

So the relationship is:

```
Gut Feeling          → The raw intuitive signal (what you feel)
Sniff Test           → The binary gate (pass / fail)
Dennis Denuto Metric → The decomposition (why you feel it, scored)
```

But here's where it gets honest.

### The rubric is incomplete, and it knows it

You could score 75%+ on every individual dimension and still have a gut feeling that something is wrong. That's because gut feelings also capture **interaction effects** — the emergent properties that arise from the combination of dimensions, not from any single one.

A feature can have clear intent, low cognitive load, and good flow _individually_, but the combination produces something that feels clinical. Sterile. Like a hospital waiting room that is clean and functional and well-lit and makes you want to leave. The individual scores are fine. The whole is less than the sum of its parts.

No rubric with eight dimensions can capture every interaction between those dimensions. That's not a flaw to be engineered away — it's a fundamental property of trying to decompose holistic judgement into discrete axes.

Which is exactly why the "Dennis Dimension" carries 20% of the total weight.

### Why 20% for a feeling

That 20% isn't just another row in the rubric. It's the **residual** — everything the eight named dimensions miss. Interaction effects. Contextual factors. The "I've seen this pattern before and it didn't end well" signal that doesn't decompose neatly into flow or cognitive load or spec consistency.

At 20%, the human gut check creates a swing of up to 20 points on a 100-point scale. That's enough to move a feature across threshold boundaries — from "acceptable with friction" to "strong alignment," or from "ship with awareness" to "iterate." The human's vibe can meaningfully change the outcome.

At 5%, it's a rounding error. A decoration. A token gesture toward human involvement that the rubric could discard without anyone noticing. If the whole point of DDM is that vibes matter, underweighting the actual vibe to make the metric look more "objective" would be self-defeating.

At 50%, the rubric becomes a suggestion and the human is just making a subjective call with extra steps. We're back to the sniff test with a spreadsheet attached.

20% is the balance point: the rubric does most of the analytical work, but the human has enough weight to override it when the decomposition misses something that the gut doesn't.

Dennis couldn't articulate Section 51(xxxi). But he could feel that the acquisition wasn't just. The QC provided the framework — but without Dennis's instinct, nobody would have taken the case in the first place.

The rubric is the QC. The 20% is Dennis. You need both.

---

## Where This Fits

DDM is not a replacement for anything in your pipeline. Your tests still matter. Your security gates still matter. Your code review still matters.

DDM is the _last_ thing that runs. After everything is green. After the feature is "done." It's the reflective pause between "ready to ship" and "shipped" — the moment where you ask not "does it work?" but "is it right?"

<figure class="flow-diagram" aria-labelledby="ddm-flow-title">
  <figcaption id="ddm-flow-title">The Dennis Denuto Metric decision flow</figcaption>
  <div class="flow-diagram-stages" aria-label="Delivery pipeline">
    <span class="flow-diagram-node">Spec</span><span class="flow-diagram-arrow" aria-hidden="true">→</span>
    <span class="flow-diagram-node">AI implementation</span><span class="flow-diagram-arrow" aria-hidden="true">→</span>
    <span class="flow-diagram-node">Tests</span><span class="flow-diagram-arrow" aria-hidden="true">→</span>
    <span class="flow-diagram-node">Security</span><span class="flow-diagram-arrow" aria-hidden="true">→</span>
    <span class="flow-diagram-node">Code review</span>
  </div>
  <div class="flow-diagram-connector" aria-hidden="true">↓</div>
  <div class="flow-diagram-checkpoint"><span>DDM</span> Vibe check</div>
  <div class="flow-diagram-connector" aria-hidden="true">↓</div>
  <div class="flow-diagram-outcomes">
    <span><strong>Ship</strong><small>high confidence</small></span>
    <i aria-hidden="true">or</i>
    <span><strong>Iterate</strong><small>misaligned</small></span>
  </div>
</figure>

If you're using an orchestrated agent pipeline — where a planner breaks work into tasks, workers implement, reviewers verify, and a checkpoint gates the result — DDM is the post-checkpoint evaluation that asks the question none of the other agents are asking:

_Would Dennis be proud of this?_

(Dennis would be proud of anything that works, honestly. The bar is low. But you get the idea.)

---

## The Meta-Irony

I'm aware of what's happening here.

I'm proposing a metric for evaluating vibes. And I'm asking you — the community — to give me a vibe check on it.

Does this concept resonate? Is there something here, or is it over-engineered navel-gazing dressed up with a movie reference? Is the rubric useful or is it trying to quantify the unquantifiable? Would you actually use this in a pipeline, or would you read this blog post, nod thoughtfully, and never think about it again?

In other words: what's the vibe?

I'm building this as an optional agent in an closed-source orchestration plugin for Claude Code. The idea is that after your AI agents finish implementing a feature — after the tests pass, after the security gates clear, after the docs are generated — this agent does one final evaluation. It reads the original spec, reads the implementation, scores the rubric, and presents the result to a human for the gut-check override.

If the score is high, you ship with confidence. If it's low, you get a dimensional breakdown that tells you _where_ the misalignment is — not just "it's wrong" but "the flow is heavy and the feature doesn't feel like it belongs in the rest of the product."

It's Dennis Denuto's argument, with a framework.

---

## Try It, Roast It, Improve It

This is early. The rubric weights are debatable. The dimension definitions need pressure-testing. The scoring thresholds are first-pass. The entire concept might be solving a problem that doesn't exist at scale.

But if you've ever looked at AI-generated output and thought "this is technically fine but something is off" — that's the problem space. And if you've ever wished you had a structured way to express that instead of a vague PR comment that says "idk feels weird" — that's the solution space.

I'd love your feedback:

- Does the rubric capture the right dimensions?
- Are the weights reasonable?
- Would you actually wire this into a pipeline?
- Is there prior art I'm missing?
- Is the name terrible or perfect? (There is no middle ground with _The Castle_ references.)

Drop your thoughts in the comments. Or just tell me "it's the vibe" and leave. That works too.

---

_The Dennis Denuto Metric is being considered as part of the Neuraxis Workflow project — a closed-source orchestration layer for AI-assisted development workflows (based on_[_Spec Kit_](https://speckit.org)_) currently being developed at Gallagher. The plugin itself is closed-source, but the concepts here follow open-source principles and are intended for public discussion and iteration._

_Dennis Denuto is a fictional character from_[_The Castle (1997)_](https://www.workingdog.com/the-castle)_, directed by_[_Rob Sitch_](https://en.wikipedia.org/wiki/Rob_Sitch)_. No solicitors were harmed in the making of this metric._[_His photocopier is still broken_](https://www.youtube.com/watch?v=iEp3Ig3isxc).

<aside class="article-card article-card--small" aria-label="AI disclosure">
  <p class="article-card-title">AI disclosure</p>
  <p>This article was written with AI assistance. AI tools helped with drafting, editing, validation, and refinement.</p>
  <p>The argument, final judgement, and responsibility for the piece are mine.</p>
  <p>Unless otherwise credited, images in this article were AI-generated.</p>
</aside>
