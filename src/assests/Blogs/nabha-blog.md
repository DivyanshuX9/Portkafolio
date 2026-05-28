# Nabha: What Happens When Technology Stops Assuming

Most hackathon projects start with an idea.

Nabha started with a statistic that made us uncomfortable: **one hospital, serving 173 villages, critically understaffed.**

That was the Nabha Civil Hospital in Punjab the problem at the heart of Smart India Hackathon 2025's Problem Statement SIH25018. The brief called it a telemedicine challenge. But the more we dug in, the more we realized telemedicine was just the surface.

The real problem was something older and harder: **when getting help is exhausting enough, people stop trying.**



## The Actual Problem

Picture this. You live two hours from the nearest hospital. Going means losing a full day's wage. You'll wait in a crowded queue. You might not even get seen. So you wait. You hope the illness passes.

Sometimes it does. Sometimes it becomes something much worse.

This is what "limited healthcare access" actually looks like on the ground. Not a missing feature. A broken chain of trust between patients and the system that's supposed to help them.

Any solution that ignored this reality was going to fail.



## The Insight That Changed Our Design

Most healthcare apps are built on a set of quiet assumptions: stable internet, a smartphone you know how to use, the ability to navigate a multi-step interface under stress.

Rural Punjab, as the problem statement itself noted, has limited connectivity. So we made a decision early: **we would not build something that required the internet to work.**

That constraint forced us to think differently. And it led to the most interesting part of Nabha.



## What If You Could Just Call?

Even in areas with weak data connectivity, voice call infrastructure usually still works. It's older, more reliable, more widely understood.

So I proposed an AI-powered healthcare call agent. A villager dials a number and speaks naturally, in their own words, about what they're experiencing. The system listens, understands, offers first-aid guidance, and decides whether this is something it can handle or something that needs a real doctor.

If the AI isn't confident, or if the symptoms sound serious, the call escalates immediately to a medical professional.

We built a working prototype of this using Twilio for the phone infrastructure and Bolna AI for the voice agent workflow. It wasn't theoretical. People could actually call it.

For elderly rural users especially, speaking into a phone is just... familiar. It doesn't require learning anything new. That matters more than any feature we could have added.



## The Wristband Problem (And How We Solved It)

One of our teammates proposed a health-monitoring wristband for farmers. I'll be honest: my first reaction was skepticism.

A farmer in peak summer doing physically intense work is going to have an elevated heart rate, stress markers, all of it. A standard monitoring system would be screaming alerts constantly. It would be useless.

But then we reframed the question. The problem isn't measuring health. It's measuring *deviation from normal* and normal looks completely different for a farmer than it does for an office worker.

So instead of comparing users to generic averages, we designed a system that learns each person's patterns over 10–30 days. High heartbeat during field work? Classified as expected. Abnormal spike during rest? That's worth flagging.

Since we were building a software prototype, we simulated the entire wristband system inside the app, demonstrating the logic, the adaptive alerts, and the escalation pathways without needing actual hardware. The concept was what mattered, and it held up.



## Healthcare Is an Ecosystem

One thing you realize quickly when you think seriously about rural healthcare: there's no single point of failure. It's the whole chain.

So Nabha wasn't just a patient-facing app. We built separate interfaces for doctors and pharmacies too.

Doctors could review escalated cases remotely, reducing the need for patients to physically travel. Pharmacies could update medicine availability in real time, so a villager wouldn't travel two hours only to find the medication wasn't in stock.

Every piece connected. That interconnection was, honestly, what made the project feel real rather than just a hackathon submission.



## What It Taught Us

Somewhere during the build, Nabha stopped feeling like a competition.

We were 20-year-olds trying to design a healthcare system for people facing situations we'd never personally experienced. That's a humbling position to be in.

It pushed us to question every assumption. Does this require WiFi? Does this interface work for someone who's never used a smartphone? Does this alert make sense to someone who doesn't read health data? 

The best technology is the kind that fits into someone's life without requiring them to change it. Nabha forced us to build with that constraint from the very beginning.



The future of rural healthcare in India isn't going to look like urban healthcare made smaller. It's going to look like something built from scratch around the actual constraints: intermittent connectivity, limited literacy, overloaded hospitals, and communities that need trust before they need technology.

Nabha was our attempt to imagine that. One phone call, one wristband, one village at a time.




