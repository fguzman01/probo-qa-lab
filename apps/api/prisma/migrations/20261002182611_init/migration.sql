-- CreateEnum
CREATE TYPE "TestTechnique" AS ENUM ('HAPPY_PATH', 'EQUIVALENCE_PARTITION', 'BOUNDARY_VALUE', 'DECISION_TABLE', 'NEGATIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "TestPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "TestCaseStatus" AS ENUM ('PENDING', 'APPROVED', 'DISCARDED');

-- CreateEnum
CREATE TYPE "TestCaseOrigin" AS ENUM ('AI', 'MANUAL');

-- CreateEnum
CREATE TYPE "AiGenerationResult" AS ENUM ('SUCCESS', 'PROVIDER_ERROR', 'RATE_LIMITED', 'INVALID_RESPONSE');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" UUID NOT NULL,
    "number" SERIAL NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "asA" VARCHAR(200) NOT NULL,
    "iWant" VARCHAR(500) NOT NULL,
    "soThat" VARCHAR(500) NOT NULL,
    "ownerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcceptanceCriterion" (
    "id" UUID NOT NULL,
    "storyId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "text" VARCHAR(500) NOT NULL,

    CONSTRAINT "AcceptanceCriterion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCase" (
    "id" UUID NOT NULL,
    "storyId" UUID NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "preconditions" TEXT NOT NULL DEFAULT '',
    "steps" TEXT[],
    "expectedResult" TEXT NOT NULL,
    "technique" "TestTechnique" NOT NULL,
    "priority" "TestPriority" NOT NULL,
    "status" "TestCaseStatus" NOT NULL DEFAULT 'PENDING',
    "origin" "TestCaseOrigin" NOT NULL,
    "editedAt" TIMESTAMP(3),
    "generationId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCaseCoverage" (
    "testCaseId" UUID NOT NULL,
    "criterionId" UUID NOT NULL,

    CONSTRAINT "TestCaseCoverage_pkey" PRIMARY KEY ("testCaseId","criterionId")
);

-- CreateTable
CREATE TABLE "AiGeneration" (
    "id" UUID NOT NULL,
    "storyId" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "result" "AiGenerationResult" NOT NULL,
    "casesCreated" INTEGER NOT NULL DEFAULT 0,
    "casesReplaced" INTEGER NOT NULL DEFAULT 0,
    "durationMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Story_number_key" ON "Story"("number");

-- CreateIndex
CREATE UNIQUE INDEX "AcceptanceCriterion_storyId_position_key" ON "AcceptanceCriterion"("storyId", "position");

-- CreateIndex
CREATE INDEX "TestCase_storyId_status_idx" ON "TestCase"("storyId", "status");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcceptanceCriterion" ADD CONSTRAINT "AcceptanceCriterion_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "AiGeneration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseCoverage" ADD CONSTRAINT "TestCaseCoverage_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseCoverage" ADD CONSTRAINT "TestCaseCoverage_criterionId_fkey" FOREIGN KEY ("criterionId") REFERENCES "AcceptanceCriterion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiGeneration" ADD CONSTRAINT "AiGeneration_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
