# The Night I Mapped Stars and Started Thinking About Systems

There's a specific kind of quiet that happens at 2 AM when everyone else is asleep and you're lying on a terrace with your phone pointed at the sky.

I wasn't doing anything productive. I was just using a stargazing app, dragging my phone across the dark, watching constellation lines snap into place over the actual stars. Orion. Scorpius. The Pleiades cluster, which I'd always thought was just a smudge.

And then I had a thought that I couldn't shake: *how does the app know which star is which?*



## The Problem of Naming Things That Move

Stars don't stay still. Not really. They drift slowly, over centuries relative to each other. The constellation shapes we recognize are a snapshot of a particular moment in cosmic time. In 50,000 years, the Big Dipper won't look like a dipper anymore.

But more immediately: from Earth, every star is just a point of light. The app has to figure out which point corresponds to which catalogued object, in real time, using only your phone's GPS, compass, and gyroscope.

That's a non-trivial matching problem. You have a sky full of points. You have a database of known positions. You have noisy sensor data. And you have to reconcile all three fast enough that the overlay feels live.

I started reading about how this actually works. Plate-solving algorithms. Star pattern matching. The Hipparcos catalogue. I went down a rabbit hole that lasted three nights.



## What Constellations Actually Are

Here's the thing that surprised me most: constellations are not astronomical objects. They're administrative boundaries.

The International Astronomical Union divided the sky into 88 regions in 1930. Every point in the sky belongs to exactly one constellation region, not because the stars in that region are related, but because astronomers needed a consistent way to say "that object is in Orion" without ambiguity.

Betelgeuse and Rigel are both "in Orion." But Betelgeuse is about 700 light-years away and Rigel is about 860. They have nothing to do with each other. They just happen to appear near each other from our particular vantage point on a particular planet.

The shape is a projection. The meaning is assigned.



## Why This Felt Familiar

I kept thinking about this in the context of software.

A lot of the systems I work with are like constellations. The components look connected; they're drawn with lines between them in architecture diagrams, but the connections are often projections. They're meaningful from one vantage point, at one moment in time, for one set of requirements.

Change the vantage point (a different team, a different scale, a different use case) and the same components might not form the same shape at all.

RideHub felt like this. Five transport services that looked like they should connect — buses, cabs, metro, autos, mixed routes — but the "connection" was something I had to construct. The services didn't know about each other. The unified layer was the projection I imposed on top.

NABHA felt like this too. A hospital, 173 villages, a phone network, a pharmacy system. None of these were designed to talk to each other. The telemedicine layer was the constellation I drew over them.



## The Useful Lie

Constellations are, in a sense, a useful lie. They don't describe physical reality. But they give navigators a way to find north. They give storytellers a canvas. They give astronomers a shared vocabulary.

The lie is loadbearing.

I think about this when I'm designing abstractions. The abstraction doesn't have to be "true" in some deep sense. It has to be useful, stable enough to build on, honest enough not to mislead, flexible enough to survive the next requirement.

The best APIs I've worked with feel like good constellations. They impose a shape on something that didn't have one. They make the arbitrary feel inevitable.



I still use that stargazing app. But now when I point it at the sky, I'm thinking about two things at once: the actual stars, scattered across three dimensions of space, ancient light arriving from impossible distances, and the lines someone drew between them, the names someone assigned, the story someone decided to tell.

Both are real. Both matter. The map is not the territory, but a good map is still worth making.




