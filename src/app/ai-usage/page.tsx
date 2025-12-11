import { AccessibleLink } from '../components/ui/Link/Link';

export default function About() {
  return (
    <>
      <main>
        <div className="content-block content-block--xy-only site-padding-bottom">
          <div className="content-block__wrap">
            <h1 className="page-title">AI usage</h1>
            <div className="prose">
              <p className="intro">
                This page outlines how I use Large Language Models (LLMs) on
                this site. I believe in transparency around AI usage, especially
                as it becomes more prevalent in content creation.
              </p>
              <p>
                Whenever I use LLMs on this site, I manually review suggestions
                before I accept them and verify that outputs are accurate and
                functional, and done the way I would do them myself.
              </p>
              <h2>Code and engineering</h2>
              <p>
                It might be hard for me to quantify how much of my code has been
                written using LLMs. Primarily, I am using LLMs here as
                playground to help me better understand how I can use them in my
                work. I try to write to as much as possible about the process
                and how I’m thinking about it along the way.
              </p>
              <p>
                I still write all of my own CSS and make all decisions about
                interaction design, particularly where accessibility is
                concerned. My experience with agentic coding here has not been
                great.
              </p>
              <p>
                As a front-end developer, I have found that using an LLM is
                helpful to me in working through issues that are outside of my
                wheelhouse. For example, handling issues related to image
                optimization and uploading to the CDN in a way that optimizes
                developer experience.
              </p>
              <h2>Content writing</h2>
              <p>
                I do not use LLMs to write any content on this site. The only
                time I use it in writing is correct grammar mistakes when I am
                done writing a post. I include instructions not change content,
                voice, or tone; only fix grammar.
              </p>
              <h2>Image creation</h2>
              <p>None unless it is contextually relevant.</p>
              <h2>Alt text</h2>
              <p>
                I will often use LLMs to write alt text for images, particularly
                when it comes to screen shots, graphics, or images for photo
                essays. I always review and edit the alt text to ensure it is
                accurate and descriptive.
              </p>
              <p>
                <AccessibleLink href="/blog/writing-alt-text-with-ai">
                  Learn more about how I use AI for alt text
                </AccessibleLink>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
