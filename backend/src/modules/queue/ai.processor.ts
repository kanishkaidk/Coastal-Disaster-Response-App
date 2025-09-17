import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
@Processor('sync-queue')
export class AiProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: any): Promise<any> {
    const { type, postId, content, language } = job.data;

    switch (type) {
      case 'forum_post_ai':
        return this.processForumPost(postId, content, language);
      case 'report_ai':
        return this.processReport(postId, content, language);
      case 'social_post_ai':
        return this.processSocialPost(postId, content, language);
      default:
        return { ok: true, jobId: job.id, message: 'Unknown job type' };
    }
  }

  private async processForumPost(postId: string, content: string, language: string) {
    try {
      // Simulate AI processing - in production, call actual AI microservices
      const trustScore = this.calculateTrustScore(content);
      const urgencyScore = this.calculateUrgencyScore(content);
      const moderationFlags = this.detectModerationFlags(content);
      const summary = this.generateSummary(content, language);
      const translations = this.generateTranslations(content, language);
      const rationale = this.generateRationale(trustScore, moderationFlags);

      await this.prisma.forumPost.update({
        where: { id: postId },
        data: {
          trustScore,
          urgencyScore,
          moderationFlags,
          summary,
          translations,
          rationale,
          aiStatus: 'ready',
        }
      });

      return { 
        ok: true, 
        postId, 
        trustScore, 
        urgencyScore, 
        moderationFlags,
        summary: summary[language] || summary.en,
        rationale
      };
    } catch (error) {
      await this.prisma.forumPost.update({
        where: { id: postId },
        data: { aiStatus: 'error' }
      });
      throw error;
    }
  }

  private async processReport(postId: string, content: string, language: string) {
    // Similar AI processing for reports
    const trustScore = this.calculateTrustScore(content);
    const urgencyScore = this.calculateUrgencyScore(content);
    const moderationFlags = this.detectModerationFlags(content);
    const summary = this.generateSummary(content, language);
    const rationale = this.generateRationale(trustScore, moderationFlags);

    await this.prisma.report.update({
      where: { id: postId },
      data: {
        trustScore,
        // Add other AI fields as needed
      }
    });

    return { ok: true, postId, trustScore, urgencyScore };
  }

  private async processSocialPost(postId: string, content: string, language: string) {
    // Similar AI processing for social posts
    const trustScore = this.calculateTrustScore(content);
    const moderationFlags = this.detectModerationFlags(content);
    const summary = this.generateSummary(content, language);

    await this.prisma.socialPost.update({
      where: { id: postId },
      data: {
        trustScore,
        // Add other AI fields as needed
      }
    });

    return { ok: true, postId, trustScore };
  }

  private calculateTrustScore(content: string): number {
    // Simulate trust score calculation
    // In production, call AI microservice for trust analysis
    let score = 50; // Base score

    // Simple heuristics for demo
    const positiveWords = ['help', 'need', 'emergency', 'urgent', 'flood', 'cyclone'];
    const negativeWords = ['spam', 'fake', 'scam', 'money', 'bitcoin'];
    
    const contentLower = content.toLowerCase();
    
    positiveWords.forEach(word => {
      if (contentLower.includes(word)) score += 10;
    });
    
    negativeWords.forEach(word => {
      if (contentLower.includes(word)) score -= 20;
    });

    // Check for suspicious patterns
    if (content.length < 10) score -= 15;
    if (content.includes('http://') || content.includes('https://')) score -= 5;
    if (content.match(/\d{10,}/)) score -= 10; // Phone numbers

    return Math.max(0, Math.min(100, score));
  }

  private calculateUrgencyScore(content: string): number {
    // Simulate urgency score calculation
    const urgentWords = ['urgent', 'emergency', 'help', 'flood', 'cyclone', 'danger', 'critical'];
    const contentLower = content.toLowerCase();
    
    let score = 0;
    urgentWords.forEach(word => {
      if (contentLower.includes(word)) score += 15;
    });

    return Math.min(100, score);
  }

  private detectModerationFlags(content: string): string[] {
    // Simulate moderation flag detection
    const flags = [];
    const contentLower = content.toLowerCase();

    const spamWords = ['spam', 'fake', 'scam'];
    const abuseWords = ['hate', 'abuse', 'threat'];
    const offTopicWords = ['bitcoin', 'crypto', 'investment'];

    if (spamWords.some(word => contentLower.includes(word))) {
      flags.push('spam');
    }
    if (abuseWords.some(word => contentLower.includes(word))) {
      flags.push('abuse');
    }
    if (offTopicWords.some(word => contentLower.includes(word))) {
      flags.push('off-topic');
    }

    return flags;
  }

  private generateSummary(content: string, language: string): Record<string, string> {
    // Simulate summary generation for multiple languages
    const summaries = {
      en: `Summary: ${content.substring(0, 100)}...`,
      hi: `सारांश: ${content.substring(0, 100)}...`,
      bn: `সারসংক্ষেপ: ${content.substring(0, 100)}...`,
      ta: `சுருக்கம்: ${content.substring(0, 100)}...`,
      te: `సారాంశం: ${content.substring(0, 100)}...`,
      mr: `सारांश: ${content.substring(0, 100)}...`,
    };

    return summaries;
  }

  private generateTranslations(content: string, sourceLanguage: string): Record<string, string> {
    // Simulate translation generation
    const translations = {
      en: content,
      hi: `[Hindi] ${content}`,
      bn: `[Bengali] ${content}`,
      ta: `[Tamil] ${content}`,
      te: `[Telugu] ${content}`,
      mr: `[Marathi] ${content}`,
    };

    return translations;
  }

  private generateRationale(trustScore: number, moderationFlags: string[]): Record<string, any> {
    return {
      trustScore: {
        value: trustScore,
        explanation: trustScore > 70 
          ? 'High trust score based on content analysis and user history'
          : trustScore > 40 
          ? 'Medium trust score - some concerns detected'
          : 'Low trust score - multiple red flags detected',
        factors: [
          'Content quality analysis',
          'User behavior patterns',
          'Community feedback'
        ]
      },
      moderation: {
        flags: moderationFlags,
        explanation: moderationFlags.length > 0
          ? `Content flagged for: ${moderationFlags.join(', ')}`
          : 'Content appears safe and appropriate',
        confidence: moderationFlags.length > 0 ? 0.8 : 0.9
      }
    };
  }
}
