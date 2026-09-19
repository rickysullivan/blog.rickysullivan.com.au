---
title: "Don't become VSF because you scud-ran VFR into IMC."
excerpt: "Aviation has a useful warning for anyone letting an AI invent their requirements."
category: Software
date: 2026-05-29T02:36:47.000Z
updatedDate: 2026-05-29T02:36:47.000Z
author:
  name: Ricky Sullivan
  role: Developer, dad, drongo
featured: true
draft: false
---

## Into the Soup

![A small single-engine aircraft flies low through a narrow mountain valley beneath a heavy cloud ceiling, with rocky terrain close below and the valley ahead fading into fog.](/media/images/2026/05/Stormy-valley-flight-through-rugged-terrain.png)Scud running through unclear requirements: it works right up until the path disappears.

You paste three sentences into `/specify`.

The model thinks for a second. Back comes a beautifully structured `spec.md`. Personas. Success criteria. Scope. User journeys. It reads like a senior PM wrote it after two weeks of stakeholder interviews.

You didn't say half this stuff. The model made it up, with conviction.

You merge the spec anyway. Three weeks later you're rewriting the feature because the personas were wrong, the success criteria were fiction, and the user journeys were fabricated.

That's not Spec Kit failing. That's Spec Kit doing exactly what it was built to do, with the limited inputs you gave it.

---

Pilots have acronyms for this.

**VFR** — Visual Flight Rules. You look out the window. You don't fly into things. You may file no plan and go.

**IMC** — Instrument Meteorological Conditions. Cloud. Fog. Anything you can't see through. Flying in IMC needs instruments, instrument training, and a flight plan filed with ATC under **IFR** — Instrument Flight Rules.

VFR into IMC is what happens when a VFR pilot ends up in instrument conditions anyway. They didn’t intend to. They eyeballed it, the weather closed in, the visibility dropped, and now they’re in soup they may not be trained or equipped to navigate. NTSB reports are full of it. It is one of the classic fatal traps in general aviation, especially in weather-related accidents.

The behaviour that gets you there has a name too: **scud running**. Pushing low under deteriorating weather, hugging terrain to keep visual reference, betting the cloud base holds. Sometimes you make it. Sometimes you fly into a mountain.

**VSF** — [Very Severely Fucked](https://youtu.be/JyaYyr9Ou0U?t=118). It's from [_Air America_](https://www.imdb.com/title/tt0099005): Mel Gibson and Robert Downey Jr. as bush pilots flying contraband in Laos. Their plane's in trouble and Babo turns to Billy:

> _"We're VSF, man. We're VSF."_
>
> "What?"
>
> _"*Very Severely Fucked.*"_

It's what you are when the flight plan you didn't file would no longer have helped you anyway. The plane is in the trees.

![Black-and-white screen grab from Air America showing two pilots hanging upside down in the wreckage of a crashed aircraft, still strapped into their seats amid twisted metal, broken panels, exposed wiring, and debris.](/media/images/2026/05/MV5BMTMxMTI2NjIwMF5BMl5BanBnXkFtZTcwMTU1MDAxMw@@._V1_FMjpg_UX1024_.jpg)When VFR into IMC becomes VSF. Photo by Carolco Pictures - © 1990, courtesy of [https://www.imdb.com/](https://www.imdb.com/title/tt0099005)

Here's the sequence:

> You **scud-run** because you're in a hurry.
> You go **VFR into IMC** because the model's output looks fine until it doesn't.
> Three weeks later you're **VSF**.

An unchecked vibe-coded spec can run the same sequence.

The discipline that prevents it is the same kind of discipline that prevents the aviation version: don’t trust visibility you haven’t verified.

**File a flight plan.**

---

## The Flight Plan

![A completed flight plan on a kneeboard sits beside a laptop showing an abstract structured document, with a small aircraft waiting on the runway in warm early morning light.](/media/images/2026/05/Golden-hour-preflight-planning-at-airfield.png)Planned, checked, and ready for departure.

> A flight plan isn't a vibe. It's a form.

Origin. Destination. Route. Alternates. Fuel. Souls on board. Twenty-something fields. In serious operations, the pilot doesn’t treat the form as folklore. They work through a dispatcher, flight service, or filing tool that knows the fields and forces the missing details into the open.

The pilot knows where they want to go. The dispatcher knows what the system needs: what ATC needs for clearance, what dispatch needs for release, and what search-and-rescue needs if the flight goes missing.

**These are the requirements you file before wheels up.**

In our world the form is a **Feature Definition Document**. The destination is _the thing you actually want to build_. The dispatcher is a conversational agent — we call it the **Feature Discovery Agent** — that knows the form, asks the questions, fills the boxes, and hands the finished plan to Spec Kit.

Spec Kit is clearance delivery. It takes the filed plan, checks it against the structure it needs, and returns the cleared route: `spec.md`.

Now you can fly through weather you can't see. Now the model has enough context that it isn't inventing personas and fabricating success criteria, because you actually told it what they are.

The clever bit isn't _that_ we built a dispatcher. The clever bit is _how we decided what questions it should ask_.

---

We didn't whiteboard discovery phases. We didn't sit around imagining what good intake looks like.

We took the **output** Spec Kit wants to produce — its `spec.md` template — and read it backwards.

Every section in `spec.md` exists because Spec Kit needs that information to do its job.

User roles and personas exist because the model needs to know who uses the thing.

_Success criteria_ exist because "done" without metrics is opinion. _Scope_ exists because every feature definition that doesn't explicitly say what's _out_ will silently include everything.

Each section implies a question. Each question implies a phase. Ten phases later you have the Feature Discovery Agent — not designed, _deduced_.

Read the cleared route. Reverse-engineer the flight plan. Reverse-engineer the conversation that fills the flight plan.

That's the whole trick.

---

## Give the Agent Charts

![Dense aeronautical chart spread across a dark aviation operations desk, with route lines, weather overlays, airport diagrams, highlighted alternates, and a small runway-closure warning, suggesting the operational context an AI agent needs before advising.](/media/images/2026/05/Aviation-chart-and-navigation-tools.png)Agents reason safely when the charts, constraints, hazards, and procedures are already on the table.

The first version of the agent shipped with one fatal gap: it had no idea who we were.

The model could reason. It could structure ambiguity. It could ask sharp questions. But it had no domain knowledge.

Every persona had to be explained from scratch. Every architectural quirk. Every scar-tissue decision. Every reason we do this and not that.

We had built a dispatcher with no charts.

No NOTAMs. No AIP. No company op-specs. Just a clipboard and a smile.

They can fill in the flight plan. They can’t catch what you didn’t know to mention. They can’t say, “Hang on — your alternate has a closed runway. We need to revise.”

That first run was exhausting. The agent asked good questions, but every answer became a mini-onboarding document. Domain terms the company had known for years had to be re-taught in a chat window.

We weren’t doing discovery anymore. We were onboarding the dispatcher.

Then we connected it to our brains.

---

We had a parallel project running: a knowledge base we called **Brains**.

Markdown vaults distilling years of meeting notes, architecture decisions, slide decks, and SharePoint sludge into structured, linkable notes. Some written by humans. A lot captured by AI agents during conversations, then cleaned up.

Each Brain is its own vault for its own domain: architectural decisions, user and installer insights, business strategy, and the squad’s own institutional history.

There’s a separate post coming about the brains. This one is already long enough.

MCP — Model Context Protocol — is how the dispatcher gets to the charts. We exposed the brains as MCP tools: search this brain, pull this concept, find what the architecture group decided about pattern X.

The important part: the tools return context, not conclusions. The model does the reasoning. The brains supply the memory.

The dispatcher now had charts.

In the first phase of any new feature, the agent reaches into the workspace tools and pulls the repo context: what this codebase is for, who works on it, what architectural conventions it follows, what already exists, and what’s in flight.

Before it asks the first question, it already knows more about the repo than you remembered when you sat down.

Mid-conversation, the agent uses everything it's pulled from the brains to do the drafting for you. Here’s a real exchange:

> **Feature Discovery Agent:** Let me propose a core problem statement based on what the brains revealed:
>
> _"The web client has no dedicated backend layer, leaving it unable to aggregate data across multiple backend servers, directly coupled to upstream APIs, and unable to receive real-time event-driven updates — resulting in a fragmented operator experience and a blocked dependency on another foundational feature."_
>
> Does that capture the core problem accurately, or would you like to adjust it?
>
> **User:** Almost. "Backend servers" would be "backend services".
>
> **Feature Discovery Agent:** Got it! Updated.

Three things to notice.

First: the agent didn’t ask the user to write the problem statement. It drafted one. The user came in expecting to compose that paragraph. The agent had already done it from context pulled earlier in the same session.

Second: the correction was one word. The brains supplied the structure of the problem — no dedicated backend layer, aggregation across services, coupling to upstream APIs, real-time updates, and a blocked downstream dependency. The human supplied the terminology fix: **servers** became **services**. Everything else stood.

Third: that is the work-shift the Agent exists for. Most of the intake can come from the organisation’s accumulated memory. The human should be spending their judgement on the parts only they know.

That is the ratio you want: memory does the lifting, humans do the correcting.

It is not the ratio you get from a blank Word doc and a calendar invite.

---

A reasonable counter-argument: couldn’t you just give the LLM the `spec.md` template and ask it to fill it in?

Yes. We did.

It fills the gaps. Confidently.

That’s the problem.

> The conversation isn’t primarily for the LLM’s benefit. It’s there to force the human to surface the decisions they haven’t made yet.

The dispatcher isn’t there because the pilot can’t read the form. The dispatcher is there because the pilot will skip the boxes that feel obvious — until they’re in the soup, fuel is no longer theoretical, and the skipped box is the whole flight.

The brains aren’t there to replace the human either. They’re there to remember the things the company knows but the person in the room doesn’t.

---

## Same Flight Plan, Different Cockpit

![Three-panel cinematic triptych showing different aircraft cockpits: a commercial jet before departure, a small plane flying through cloudy low-visibility weather, and an advanced aircraft cockpit at night. Each cockpit includes a clipped flight plan or chart, suggesting the same plan carried across different flying environments.](/media/images/2026/05/Cockpits-in-contrast--a-triptych-collection.png)Different cockpits, same flight plan — a reminder that the interface may change, but the underlying architecture, intent, and intelligence remain portable.

Today the Agent is built in Microsoft Copilot Studio and deployed where our stakeholders already are: Teams, Copilot, M365 — the tools they already pay attention to.

Telling people to “go log into our custom AI tool” would be a tax on adoption, and the cheapest version of this thing would not survive contact with the calendar.

But Copilot Studio is the build surface. It is not where the durable intelligence lives.

The intelligence lives in the MCP tools: the brains, the schema validator, the markdown converter, the repo-context loader.

Tomorrow, the same Agent could run through Claude, ChatGPT, or our own custom platform. Same brains. Same form. Same flight plan. Different cockpit.

That is the architectural bet:

> Put the durable intelligence in tools, not in the chat surface.

The Agent is the interface — useful, visible, and replaceable. The tools are the memory, validators, schemas, and data — expensive, accumulated, and hard to recreate.

Keep the asymmetry honest.

---

The plumbing is deliberately boring.

The validator and Markdown converter live in n8n. The Feature Definition Document has a JSON schema. n8n validates against it.

Pass, and the converter renders the FDD as Markdown for Spec Kit’s `/specify`.

Fail, and the validator returns the missing fields so the Agent can ask the next useful question.

That loop matters: the Agent does not guess its way past missing structure. It keeps the aircraft on the ground until the plan is filed.

---

The pattern generalises.

Find the artifact your downstream tool actually needs. Read it backwards. Build the Agent that fills it in conversationally. Connect the Agent to whatever institutional memory you have. Run it where your stakeholders already work.

Don’t scud-run.
Don’t go VFR into IMC.
Don’t end up VSF.

**File the flight plan.**

kg-card-begin: html
**AI disclosure:**

This article was written with AI assistance. AI tools helped with drafting, editing, validation, and refinement.

The argument, final judgement, and responsibility for the piece are mine.

Unless otherwise credited, images in this article were AI-generated.
kg-card-end: html
