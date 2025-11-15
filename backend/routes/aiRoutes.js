import express from 'express';
import * as aiController from '../controllers/aiController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(userAuth);

// Code Analysis Routes
router.post('/code/review', aiController.reviewCode);
router.post('/code/bugs', aiController.detectBugs);
router.post('/code/explain', aiController.explainCode);
router.post('/code/documentation', aiController.generateDocumentation);
router.post('/code/refactor', aiController.refactorCode);
router.post('/code/tests', aiController.generateTests);
router.post('/code/suggest', aiController.suggestCode);
router.post('/code/smells', aiController.detectCodeSmells);
router.post('/code/convert', aiController.convertCode);

// Developer Tools Routes
router.post('/sql/generate', aiController.generateSQLQuery);
router.post('/regex/generate', aiController.generateRegex);
router.post('/api/documentation', aiController.generateAPIDocumentation);
router.post('/snippet/generate', aiController.generateSnippet);
router.post('/git/commit-message', aiController.generateCommitMessage);

// Architecture & Optimization Routes
router.post('/architecture/suggest', aiController.suggestArchitecture);
router.post('/performance/optimize', aiController.optimizePerformance);
router.post('/security/scan', aiController.scanSecurity);
router.post('/techstack/advise', aiController.adviseTechStack);

// Learning Routes
router.post('/algorithm/explain', aiController.explainAlgorithm);

// Chat Routes
router.post('/chat', aiController.chat);
router.post('/chat/stream', aiController.streamChat);

export default router;
