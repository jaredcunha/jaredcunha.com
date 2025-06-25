interface IntroProps {
  children: string;
}

export default function Intro({ children }: IntroProps) {
  return <p className="intro">{children}</p>;
}
