import { Metadata } from 'next';
import { PhotoGrid, PhotoGridItem } from '../components/ui/PhotoGrid/PhotoGrid';

export const metadata: Metadata = {
  title: 'About me | Jared Cunha',
  description: 'Information about me.',
};

export default function About() {
  return (
    <>
      <main>
        <div className="content-block content-block--xy-only site-padding-bottom">
          <div className="content-block__wrap">
            <h1 className="page-title">About me</h1>
            <div className="prose">
              <p>
                It all began with punk rock. Never did I imagine that when I
                made my first website to promote my band in the mid nineties, it
                would form the basis of a career spanning almost 30 years.
                Today, I serve as Senior Director of Creative Technology at{' '}
                <a href="https://coforma.io">Coforma</a>. Over the course of my
                career, I’ve worn many hats—metaphorically as a hybrid
                designer/engineer, and literally as both the cause of and
                solution to my hairline.
              </p>
              <p>
                My commitment runs deep when it comes to using my skills for
                building things that help others, improving accessibility, and
                centering inclusivity from conception to completion. And there’s
                nothing better than leading or working with teams to join me in
                this endeavor.
              </p>
              <p>
                I am one of 700,000 people without congressional representation
                as a resident of Washington, DC.
              </p>
              <p>
                <strong>Pronouns:</strong> He/Him
              </p>
            </div>
            <PhotoGrid>
              <PhotoGridItem
                cols="6"
                src="/images/jared-obama.jpg"
                alt="Me shaking hands with President Obama on the Navy Steps of the Eisenhower Executive Office Building, outside the West Wing of the White House."
              />
              <PhotoGridItem
                cols="6"
                src="/images/me-beard.jpg"
                alt="Portrait of me with a beard, wearing a black shirt and glasses, smiling at the camera."
              />
            </PhotoGrid>
          </div>
        </div>
        <section className="content-block">
          <div className="content-block__wrap prose">
            <h2 id="career-thus-far" className="content-block__heading">
              A couple things I’ve done
            </h2>
            <p>
              Nothing here would have been possible to without the talent and
              dedication of so many of my incredible teammates. I’m forever
              grateful to have had the opportunity to be associated with any of
              these projects, so you if you come across this page and we worked
              together on any of this, thank you.
            </p>
            <h3>2019-Now: Coforma</h3>
            <ul>
              <li>
                <p>
                  Led the creation of{' '}
                  <a href="https://coforma.io/resources/playbooks/accessibility-playbook">
                    Coforma’s Accessibility Playbook
                  </a>
                  .
                </p>
              </li>
              <li>
                <p>
                  Founding member of{' '}
                  <a href="https://coforma.io/case-studies/irs-direct-file">
                    IRS Direct File
                  </a>
                  , the government’s first tool allowing people to file taxes
                  directly to the IRS for free. I helped build the pilot and
                  continued supporting the 2024 tax filing season. My role
                  included everything from front-end development, accessibility,
                  and even some design work.
                </p>
              </li>
              <li>
                <p>
                  Front-end developer on{' '}
                  <a href="http://together.gov">Together.gov</a>, a website that
                  helped reunite families separated at the border by the U.S.
                  Government’s zero-tolerance policy from January 20, 2017 and
                  January 20, 2021.
                </p>
              </li>
              <li>
                <p>
                  Design and coded multiple components for the{' '}
                  <a href="https://designsystem.digital.gov">
                    U.S. Web Design System (USWDS)
                  </a>
                  , including modal windows, icons, and various form controls.
                </p>
              </li>
              <li>
                <p>
                  Helped Veterans
                  <a href="https://coforma.io/case-studies/improving-veteran-benefits-tools-for-accessible-streamlined-claims-processes">
                    download their VA decision letters
                  </a>
                  . It was one of the most requested features from Veterans, and
                  now tens of millions of millions of letters have been
                  downloaded since its launch.
                </p>
              </li>
              <li>
                <p>
                  Built the engineering department from a team of two to over
                  50. I think I’ll need to reflect on this more in the future,
                  but I’m proud of the work we did to create a culture of
                  collaboration and support, where engineers can thrive and do
                  their best work.
                </p>
              </li>
            </ul>
            <hr />
            <h3>
              2016-2019:{' '}
              <a href="https://usds.gov">United States Digital Service</a>{' '}
              (USDS).
            </h3>
            <p>
              I was a member of the design community of practice, but I’d say
              nearly 50% of my work was engineering. Highlights include:
            </p>
            <ul>
              <li>
                <p>
                  <a href="https://design.va.gov">VA.gov design system</a> -
                  Creator and product owner. I had built the documentation site
                  working closely with other designers and engineers to ensure
                  the guidance and principles were well-understood and helpful
                  to achieving the goal of designing the best possible digital
                  services to veterans.
                </p>
              </li>
              <li>
                <p>
                  <a href="https://dpc.cms.gov/">Data at the point of care</a> -
                  Front-end developer, UX design. This pilot program is a
                  game-changer for healthcare providers and patients who often
                  struggle to maintain a complete picture of their medical
                  history.
                </p>
              </li>
              <li>
                <p>
                  <a href="https://certify.sba.gov">Certify</a> - Designer,
                  front-end developer. After 40 years and multiple failed
                  attempts, we managed to get the Small Business
                  Administration’s 8(a) Business Development Program off paper
                  forms and into an online platform used by both small business
                  and the business opportunity specialists receiving their
                  applications. In conjunction with this work, I also put
                  together a{' '}
                  <a href="https://ussba.github.io/certify-design-system-documentation/">
                    design system
                  </a>{' '}
                  for the platform.
                </p>
              </li>
              <li>
                <p>
                  <a href="https://usds.gov">USDS.gov</a> - Front-end developer.
                </p>
              </li>
              <li>
                <p>
                  <a href="https://usds.github.io/benefits-enrollment-prototype/">
                    Multi-benefit enrollment application
                  </a>{' '}
                  A template for benefits administrators to customize their
                  enrollment programs, simplifying a complex application process
                  and allowing users to apply to multiple benefits, such as
                  Supplement Nutritional Assistance Program (SNAP) and Medicaid
                  in a single application.
                </p>
              </li>
              <li>
                <p>
                  I regularly participated in hiring designers, which involved
                  reviewing resumes and phone interviews. It is impossible to
                  overstate how critical this is to success of the organization,
                  and by extension, the outcomes we deliver to the public.
                </p>
              </li>
            </ul>
            <hr />
            <h3>2012-2016: LivingSocial</h3>
            <p>
              Senior product designer (2012-2015) and front-end engineer
              (2015-2016) for LivingSocial.
            </p>
            <hr />
            <h3>2007-2012: POLITICO</h3>
            <p>
              First designer at <a href="https://politico.com">POLITICO</a>.
              Designed and built the main website along with applications for
              mobile and tablets. Designed live election results for 2008 and
              2012 presidential elections, as well as the 2010 midterm
              elections.
            </p>
          </div>
        </section>
        <section className="content-block">
          <div className="content-block__wrap prose">
            <h2
              className="content-block__heading"
              id="various-speaking-interviews-and-things-in-the-press"
            >
              Various speaking, interviews, and things in the press
            </h2>
            <ul>
              <li>
                <a href="https://www.youtube.com/watch?v=CcJrEux4KXo">
                  Continuing To Do Good Work in Challenging Times - May 2025
                </a>{' '}
                Participated in a panel discussion with other experts where we
                shared insights on staying true to our mission, advocating for
                equity, and finding strength in community.
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=S0tf7doKH-E&amp;t=10s&amp;ab_channel=HexagonUXDC">
                  Collaborating for Accessibility - September 2022
                </a>{' '}
                - A virtual talk I did for Hexagon UX’s DC Chapter.
              </li>
              <li>
                <a href="https://digital.gov/event/2020/07/16/uswds-monthly-call-july-2020/">
                  Monthly United States Web Design System Call - July 2020
                </a>{' '}
                - Team members and I showcasing some new components we’ve
                contributed to the design system (date picker, file input, and
                tooltip).
              </li>
              <li>
                <a href="https://digital.gov/event/2020/05/21/uswds-monthly-call-may-2020/">
                  Monthly United States Web Design System Call - May 2020
                </a>{' '}
                - Team members and I showcasing some new components we’ve
                contributed to the design system (button group, character count,
                and combo box), including updated guidance on using numeric
                fields and data visualizations.
              </li>
              <li>
                <a href="https://www.fedscoop.com/mobile-web-design-benefits-desktop/">
                  FedScoop: How designing federal websites for mobile may
                  benefit the desktop user experience as well
                </a>{' '}
                - In which we talk about how taking a mobile-first approach
                helps distill down what is most essential to the user.
              </li>
              <li>
                <a href="https://podcasts.apple.com/us/podcast/human-centered-government-us-digital-services-jared-cunha/id1365331033?i=1000436220571">
                  Kotecki on Tech: Human-centered Government
                </a>{' '}
                - James Kotecki’s podcast focuses on technology, where we are
                and where we’re going. I enjoyed the opportunity to speak about
                the work we doing at the U.S. Digital Service.
              </li>
              <li>
                <a href="https://dc.aiga.org/event-internal/office-hours-u-s-digital-service/">
                  AIGA After hours
                </a>{' '}
                - Participated in a panel discussion about what it’s like to be
                a designer in the federal government. This panel took place in
                the historic Eisenhower Executive Office Building inside the
                White House campus.
              </li>
              <li>
                <a href="https://www.usds.gov/report-to-congress/2017/07/certify/">
                  Modernizing Small Business Certification for Government
                  Contracting
                </a>{' '}
                - Summary on the U.S. Digital Service website about modernizing
                the 8(a) Business Development Program, which was included in our
                2017 report to Congress.
              </li>
              <li>
                <a href="https://medium.com/the-u-s-digital-service/redesigning-the-journey-to-critical-benefits-for-americans-in-poverty-2ca068591f32">
                  Redesigning the journey to critical benefits for Americans in
                  poverty
                </a>{' '}
                - A U.S. Digital Service post on Medium about the work we did on
                benefits enrollment.
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
