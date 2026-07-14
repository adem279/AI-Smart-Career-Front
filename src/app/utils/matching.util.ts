import { JobOffer } from '../models/job-offer.model';
import { CandidateSkill } from '../models/candidate-skill.model';

export function computeMatchScore(offer: JobOffer, skills: CandidateSkill[]): number {
  if (skills.length === 0) return 0;

  const offerText = `${offer.title} ${offer.description}`.toLowerCase();

  const matchedSkills = skills.filter(skill =>
    offerText.includes(skill.skillName.toLowerCase())
  );

  return Math.round((matchedSkills.length / skills.length) * 100);
}

export function getMatchLabel(score: number): string {
  if (score >= 70) return 'Excellent match';
  if (score >= 40) return 'Bon match';
  if (score > 0) return 'Match partiel';
  return 'Peu de correspondance';
}

export function getMatchClass(score: number): string {
  if (score >= 70) return 'match-high';
  if (score >= 40) return 'match-medium';
  return 'match-low';
}