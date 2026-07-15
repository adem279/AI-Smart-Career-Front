export interface Portfolio {
  id: number;
  title: string;
  description: string;
  projectUrl: string;
  githubUrl: string;
}

export interface PortfolioRequest {
  title: string;
  description: string;
  projectUrl: string;
  githubUrl: string;
}