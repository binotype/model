import { Clean } from "../Clean"
import { binotype } from "../index"
import { Modes } from "../Modes"

describe("binotype.Context", () => {
	it.each(["/", "/about", "/nonexistent", "invalid-path"])("create(site, %s)", path =>
		expect(
			binotype.Context.create(
				{
					url: "https://example.com",
					language: "en-US",
					title: "Test Site",
					tagline: "A test tagline",
					description: "A test description",
					keywords: ["test", "example", "site"],
					author: "Test Author",
					design: {
						logotype: "/logo.svg",
						icon: "/favicon.ico",
						navigation: "header",
						styles: ["/style.css"],
						scripts: ["/script.js"],
						list: "summary"
					},
					page: { pages: { about: { title: "About", content: "About page content" } } }
				},
				path
			)
		).toMatchSnapshot())
	it.each([
		{ path: "/" },
		{ path: "/about" },
		{ path: "/article" },
		{ path: "/article", reduction: { list: { limit: 5 } } },
		{ path: "/article/to-live" }
	] satisfies { path: string; reduction?: Modes }[])("create(simonmika.com, $path, $reduction)", ({
		path,
		reduction
	}) => {
		const context = binotype.Context.create(
			{
				url: "https://simonmika.com",
				language: "en-US",
				title: "Simon Says",
				tagline: "truths, opinions and preconceptions",
				description:
					"Simon says contains opinionated articles on subjects such as software development, software startups and engineering recruitment.\nThe articles convey lessons learned during work as software engineer, engineering manager and a consultant.",
				keywords: ["simon mika", "blog", "personal", "tech", "programming"],
				author: "Simon Mika",
				design: {
					logotype: "assets/logotype.svg",
					icon: "icon/favicon.ico",
					styles: ["//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.6.0/styles/default.min.css"],
					scripts: [
						"//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.6.0/highlight.min.js",
						"/assets/share-blockquote.js"
					],
					navigation: "header",
					mode: "full",
					list: "header",
					home: "article"
				},
				page: {
					pages: {
						article: {
							title: "Articles",
							pages: {
								naming: {
									title: "Naming",
									subtitle: [],
									meta: {},
									published: "2016-10-27T16:12:00+02:00",
									tags: ['["software architecture"', '"communication"]'],
									content:
										"The power of naming extends far beyond programming. From ancient myths where knowing something's true name gave power over it, to modern branding where companies spend millions on finding the right name, to parents carefully choosing names for their children – our ability to name things shapes how we think and communicate about them.\nIn software development, this universal human trait becomes absolutely crucial. Unlike physical engineering where you can point to concrete objects, programming deals entirely with mental constructs and abstract concepts. We can't touch or see our constructs directly – we can only refer to them by name. Almost all concepts programming languages provide to create abstractions have one really important thing in common. They all have the ability to name the abstraction. This is among others true for variables, functions, classes and namespaces.\n\n> The name is the most important part of a good abstraction.\nIn fact, the name is their most important feature. Without a descriptive name it wouldn't be an abstraction anymore. Every time we needed to use an unnamed abstraction we would need to lookinside it to find out which one it is. That totally defeats thepurpose of creating abstractions in the first place.\nFor many problem domains there does not exist a good and stringent enoughnomenclature. We therefore usually need tocreate one. When we do that we should take that taskseriously. Getting it right will not only make it easier for the programmers following in our footsteps but also for ourselves. Goodnames help us toreason about a problem. We should also spend effort todocument our definitions of the different names used as a reminder to ourselves and to help future programmers.\n> By putting more effort intonaming you can avoid a lot oftrouble andrefactoring later.\nGettingnaming right is one of the reallyhard parts of programming. It is at the core of why it sometimes is easier tostart over from scratch than to incrementally improve code written by others. By putting more effort into the naming you can avoid a lot of trouble and refactoring later.\n",
									blocks: {},
									pages: {}
								},
								optimizingDatabases: {
									title: "Optimizing Databases",
									subtitle: [],
									meta: {},
									draft: true,
									tags: ['[""]'],
									content: [],
									blocks: {},
									pages: {}
								},
								optimizingExecutionSpeed: {
									title: "Optimizing Execution Speed",
									subtitle: [],
									meta: {},
									draft: true,
									tags: ['[""]'],
									content: [],
									blocks: {},
									pages: {}
								},
								optimizingSoftware: {
									title: "Optimizing Software",
									subtitle: [],
									meta: {},
									published: "2016-11-24T08:15:46+02:00",
									tags: ['["software optimization"', '"performance"]'],
									content:
										"Many programmers, especially those early in their careers, focus heavily on optimizing their code for execution speed. They do this because they take pride in their work and want to do it well - which is admirable. However, when programmers optimize for speed, they often get it wrong, particularly when applying theoretical concepts learned in university algorithm courses.\n\n> Most attempts at optimizing for speed end up being counterproductive.\n\nAll too often, developers sacrifice readability and maintainability to achieve marginal - sometimes unmeasurable - improvements in execution speed. In the worst case, the \"optimized\" code actually performs worse or introduces bugs. In the best case, they succeed only in optimizing for a specific CPU architecture, making their code less portable and harder to maintain.\n But why is performance optimization so challenging?\n Code locality\n> Only optimize the parts of the code base you know are critical for perceived performance.\nMost programs spend 80-90% of their execution time in just 10-20% of their code (this is known as the 90/10 rule or the Pareto principle applied to performance). Optimizing code outside these critical paths rarely yields noticeable improvements. Therefore, focus your optimization efforts only on the parts of your codebase that profiling shows are critical for perceived performance.\nData locality> How our algorithms access memory often has a bigger impact on performance than CPU optimizations.\nIn modern computers, there's a significant speed disparity between CPU and memory operations. CPUs are so fast that it takes multiple clock cycles just for an electrical signal to travel from one end of the chip to the other - we're literally constrained by the speed of light through copper! This means that accessing main memory will always be orders of magnitude slower than CPU operations.\nTo mitigate this, processors use a complex cache hierarchy. How our algorithms access memory - their data access patterns - often has a more significant impact on performance than algorithmic complexity. The key principle is spatial locality: try to store data that will be accessed together close to each other in memory, allowing the CPU to make better use of its cache.\nI/O and User Experience> Design for asynchronous I/O to create responsive applications.\nIn most applications, I/O operations are the major performance bottleneck. Storage devices, network connections, and other I/O interfaces operate at speeds thousands or millions of times slower than CPU operations. Here's a rough comparison:\nThe solution isn't just to move I/O operations to background threads - that's only half the battle. The real challenge is architecting your application to handle I/O asynchronously while maintaining a responsive user interface. Implement techniques like:\nThe Bottom Line> Writing code is cheap, but maintaining it is expensive.\nRemember: premature optimization is the root of all evil. Before optimizing anything, ensure you have:\n2. Actual performance measurements\n3. Profiling data to identify bottlenecks\nFocus first on writing clear, maintainable code. Only optimize when you have evidence that a specific part of your code is causing performance issues. Your future self (and your colleagues) will thank you.\n",
									blocks: {},
									pages: {}
								},
								programmingInterview: {
									title: "The Programming Interview",
									subtitle: [],
									meta: {},
									published: "2016-10-05T17:32:00+02:00",
									tags: ['["recruiting"]'],
									content:
										"When recruiting an artist like a designer or architect, you ask to see their portfolio. When you recruit a scientist, you take a look at the papers they authored. Why? Because they are all professions where the individual's brilliance matters a lot for the results they produce. That is also the case with programmers.\nSo why do we not spend more time looking at a candidate's past programming achievements? The answer is probably due to a combination of factors:\nProgramming RiddlesSo how do we get around this? We let the candidate program something for us - something where the interviewer already knows the problem and, as the available time is limited, the amount of code produced will be too. So all is fine, isn't it? Not really. Many times the available time is too short, so we resort to creating programming riddles. In fact, there are even books filled with these so you can train for them. Another sign that things aren't perfect is that recruiters encourage candidates to spend significant time on preparations.\n> We resort to creating programming riddles.\nAsking a programmer to solve these riddles is at best like asking a newspaper journalist to write poems, and at worst like asking them to solve crossword puzzles. Although they all involve writing words, the skills needed to excel are really different from writing a news article. Even if some of the skills are somewhat useful for doing journalistic work, poem writing and crossword puzzle solving are still bad predictors of a good journalist. The same is true for writing real software and these interviewing riddles.\nExactly like writing poems totally misses the journalistic side of writing a news article, programming riddles typically totally miss one of the absolutely hardest parts of programming: structuring code and data by creating the right abstraction.\nSimulating Real WorkThe solution, instead of small hard to crack riddles, is to create a simulation of what real work is like as a programmer at your company. For that you will firstly need more time. At least 3-4 hours for just one single task. The task should preferably be void of any domain specific knowledge.\n> The programming interview should try to emulate real work.\nInstead of grading the end result, the interviewer should during the programming process spend time to find out on what grounds the candidate makes their design choices. Just make sure to also leave the candidates alone for awhile every now and then so that they get something done to. From this you will not only learn how skilled of a programmer they are but also how they are to work with:\nThis style of programming interview will also help the candidate to get a feeling of how working with you at your company will be. It full fills the criteria of reciprocity.\n",
									blocks: {},
									pages: {}
								},
								recruitingProcess: {
									title: "Recruiting Process",
									subtitle: [],
									meta: {},
									published: "2016-09-27T23:18:43+02:00",
									tags: ['["recruiting"]'],
									content:
										"Good programmers are more like artists than sweatshop workers. If we are serious about recruiting good programmers, we should not treat them like sweatshop workers.\nAn employment is somewhat like a marriage. The relationship starts by finding a partner on a dating/job listing site or through the referral of a trusted friend. After that, you start dating/interviewing. After a period of dating/interviewing, you end up writing a marriage/employment contract.\nOne of the keys to a successful dating/interviewing is for it to be reciprocal. You tell me something about you and I tell you something about me. We both spend time together.\nSome, mostly bigger, companies forget the reciprocal part. For them, it is all about efficient selection, like they are buyers on some kind of slave market. \"Send us your resume. Fill out this form. Do this task.\" They forget about courting the future employee and inspiring them to join.\n> They forget about courting the future employee and inspiring them to join.\nAt every step in our recruiting process, we should not only think about what new information we will get about the candidate, but we should also think hard about what the candidate will learn about us. If we don't, we will likely end up losing the best, most qualified, and most attractive candidates. It is, after all, an employee's market.\n",
									blocks: {},
									pages: {}
								},
								rockStarProgrammers: {
									title: "Rock Star Programmers",
									subtitle: [],
									meta: {},
									published: "2016-09-27T23:18:43+02:00",
									tags: ['["recruiting"', '"team"]'],
									content:
										"Sometimes I come across programmers that view themselves as rock stars. Some even label themselves code ninjas, as if they are some kind of programming superhero with special powers.\nWhile I do realize where this comes from - a good programmer can easily be more than ten times as productive as an average one - we do also need good role models and front figures for our profession.\n> Programming is not a one man show.\nBut programming is almost never a one-man show. Most real-world projects are impossible to finish by yourself within a reasonable time. They are team efforts. Therefore, a real programming hero is someone who not only is a very productive expert but who also helps the rest of the team to reach their full potential by mentoring and encouraging them.\nThe rock star attitude is the opposite of the humble and encouraging attitude of a good mentor. So let us stop talking about code ninjas as a good thing and instead let us celebrate the mentors.\n",
									blocks: {},
									pages: {}
								},
								takingRiskWhenDying: {
									title: "Taking Risk When Dying",
									subtitle: [],
									meta: {},
									published: "2017-08-23T09:15:00+02:00",
									tags: ['["startup"]'],
									content:
										"In the beginning, most startups are like fatally ill patients. They are companies without a business.\n> A startup without product-market fit is like a patient without a cure – both are fighting against time.\nWhen people are fatally ill with a deadly disease with no cure, they tend to be willing to try any potential cure, no matter how untested, experimental, or even dangerous and life-threatening it might be. After all, they are already dying, so they have nothing to lose and can therefore take immense risks.\nA startup which has not yet achieved product-market fit in a market big enough to sustain the company long-term is dying. Paul Graham calls this state \"default dead\". Just like a patient who knows they will die within months if a new miraculous cure doesn't work, a startup in this phase knows that their money in the bank will only last a certain amount of time. Before that runs out, they either need to find a cure or at least a treatment that will prolong their life another year or so. Like the dying patient, they might have to choose between a potentially deadly cure or a treatment that might, at best, give them some extra time before the inevitable.\n> Take small doses to find the cure, but once found, don't hold back – there's no such thing as being half cured.\nThis is why startups in this phase need to take risks. If they don't, they die. But they should always take calculated risks. Try a small dose of the untested drug and look for signs of improvement in the patient's health. If there are none, then keep trying others. Once you think you've found the cure, stop all other experiments and take the full dose. There's no way to take a half dose and become half cured, so bet everything on it and don't hold back. You can consider revisiting your pet ideas once the patient is actually cured.\n",
									blocks: {},
									pages: {}
								},
								toLive: {
									title: "To Live",
									subtitle: [],
									meta: {},
									published: "2016-08-18T21:31:21+02:00",
									tags: ['["life"', '"personal-growth"', '"philosophy"]'],
									content:
										"Life is about three fundamental activities:\nThese three pillars are deeply interconnected. When we create, we inevitably learn from the process. When we learn, we become better equipped to help others. And when we help others, we often end up creating something valuable in the process.\nThey are all about improving ourselves and the world around us. Each day presents opportunities to engage in these activities, even in small ways. The magic happens when we consciously combine them:\n> We make a living by what we get, but we make a life by what we give.\nThe choice is yours: Will you be a passive observer of life, or an active participant? Will you consume what others create, or contribute something of your own? Will you stay in your comfort zone, or push its boundaries?\nBecause tomorrow isn't guaranteed - but today's actions shape all our tomorrows.\n",
									blocks: {},
									pages: {}
								}
							}
						},
						talk: {
							title: "Talks",
							pages: {
								onProgramming: {
									title: "On Programming",
									subtitle: [],
									meta: {},
									published: "2017-09-26T19:00:00+02:00",
									tags: ['["Uppsala.JS"]'],
									content:
										'This talk looks into all the different aspects of programming language and programmer habits. The headlines are:\n* Productivity vs Efficiency\n* The Blub Paradox\n* Superstitious Programmers\n* Encapsulating & Abstracting\n* Lowest Common Denominator\n* Design Patterns Instead of a Better Language\nSlides\nNavigate using the orange arrows.\n<iframe style="width: 100%; height: 21em; max-height: 100vh; margin: 0" src="./talks-ss01-On Programming.html"></iframe>\n<a target="blank" href="./talks-ss01-On Programming.html">Open</a> in a new tab.\n',
									blocks: {},
									pages: {}
								},
								howIUseTypescript: {
									title: "How I Use TypeScript",
									subtitle: [],
									meta: {},
									published: "2018-03-22T19:00:00+02:00",
									tags: ['["Uppsala.JS"]'],
									content:
										'This talk gives an overview of the benefits of using TypeScript and how to achieve them. It covers the following subjects:\n* Tooling Benefits\n* Configuration\n* Type System\n* Object Orientation\nSlides\nNavigate using the orange arrows.\n<iframe style="width: 100%; height: 21em; max-height: 100vh; margin: 0" src="./talks-ss02-Typescript.html"></iframe>\n<a target="blank" href="./talks-ss02-Typescript.html">Open</a> in a new tab.\n',
									blocks: {},
									pages: {}
								},
								egenKonsult: {
									title: "Egenanställd Konsult",
									subtitle: [],
									meta: {},
									published: "2025-11-28T10:00:00+02:00",
									tags: ['["Uppsala', 'Tech"]'],
									content:
										'Att vara självanställd konsult.\nSlides\nNavigate using the orange arrows.\n<iframe style="width: 100%; height: 21em; max-height: 100vh; margin: 0" src="./talks-ss10 Egen konsult.html"></iframe>\n<a target="blank" href="./talks-ss10 Egen konsult.html">Open</a> in a new tab.\n',
									blocks: {},
									pages: {}
								},
								recruiting: {
									title: "Recruiting and Become Recruited",
									subtitle: [],
									meta: {},
									published: "2018-05-24T19:00:00+02:00",
									tags: ['["Uppsala.JS"]'],
									content:
										'A step by step guide on how to recruit programmers including checklists and what to do and not to do. It also covers some insight what you can do to improve the likelihood of becoming recruited.\nSlides\nNavigate using the orange arrows.\n<iframe style="width: 100%; height: 21em; max-height: 100vh; margin: 0" src="./talks-ss03-Recruiting.html"></iframe>\n<a target="blank" href="./talks-ss03-Recruiting.html">Open</a> in a new tab.\n',
									blocks: {},
									pages: {}
								},
								recruiting2025: {
									title: "Recruiting and Become Recruited 2025",
									subtitle: [],
									meta: {},
									published: "2025-06-05T10:00:00+02:00",
									tags: ['["Uppsala', 'Tech"]'],
									content:
										'An updated step by step guide on how to recruit programmers including checklists and what to do and not to do. It also covers some insight what you can do to improve the likelihood of becoming recruited.\nSlides\nNavigate using the orange arrows.\n<iframe style="width: 100%; height: 21em; max-height: 100vh; margin: 0" src="./talks-ss09-Recruiting.html"></iframe>\n<a target="blank" href="./talks-ss09-Recruiting.html">Open</a> in a new tab.\n',
									blocks: {},
									pages: {}
								},
								retroGameModernUiTools: {
									title: "Retro Game w/ Modern UI Tools",
									subtitle: [],
									meta: {},
									published: "2025-11-28T10:00:00+02:00",
									tags: ["Uppsala Tech"],
									content:
										'A way to create a simple old school game using modern user interface tools. Perfect for side projects. Get the <a href="https://github.com/simonmika/adventures-of-aron">code</a>.\nSlides\nNavigate using the orange arrows.\n<iframe style="width: 100%; height: 21em; max-height: 100vh; margin: 0" src="./talks-ss11 Retro Game.html"></iframe>\n<a target="blank" href="./talks-ss11 Retro Game.html">Open</a> in a new tab.\n',
									blocks: {},
									pages: {}
								}
							}
						},
						about: {
							weight: 200,
							title: "About",
							subtitle: ["About Simon Mika"],
							meta: {},
							author: "Simon Mika",
							content:
								"I am Simon Mika, and I create things. Professionally I create software products. Either hands on or by creating the organization that builds the products.\nI live in Uppsala, Sweden with my wife Sannah and my four kids in a house from 1937 that we have been renovating since 2009.\nI write about building software and building companies.\nCurrently, I help companies as a consultant with everything from software architecture to business development. If you are interested in my services please contact me. When I don't work for money I also spend time on SysPL and TypeUp.\nYou can find out more about me on my page on LinkedIn and on GitHub.\n",
							blocks: {},
							pages: {}
						},
						contact: {
							title: "Contact",
							subtitle: [],
							meta: { menu: "false" },
							content:
								'<form method="post">\n<label for="name">Name</label>\n<input type="text" name="name" />\n<label for="email">Email</label>\n<input type="email" name="email" />\n<label for="message">Message</label>\n<textarea name="message"></textarea>\n<button type="submit">Send</button>\n</form>\n',
							blocks: {},
							pages: {}
						},
						description: {
							title: "Description",
							subtitle: [],
							meta: { menu: "false" },
							content:
								"Simon says contains opinionated articles on subjects such as software development, software startups and engineering recruitment.\nThe articles convey lessons learned during work as software engineer, engineering manager and a consultant.\n",
							blocks: {},
							pages: {}
						},
						subscribe: {
							title: "Subscribe",
							subtitle: [],
							meta: { menu: "false" },
							content: '<script type="text/javascript" src="\n',
							blocks: {},
							pages: {}
						}
					}
				}
			},
			path
		)
		expect(context).toMatchSnapshot("context")
		expect(Clean.clean(context.load(path, reduction) as unknown)).toMatchSnapshot("context.load")
	})
})
