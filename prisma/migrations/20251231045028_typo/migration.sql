/*
  Warnings:

  - You are about to drop the column `WorkflowId` on the `connection` table. All the data in the column will be lost.
  - You are about to drop the column `WorkflowId` on the `node` table. All the data in the column will be lost.
  - Added the required column `workflowId` to the `connection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workflowId` to the `node` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "connection" DROP CONSTRAINT "connection_WorkflowId_fkey";

-- DropForeignKey
ALTER TABLE "node" DROP CONSTRAINT "node_WorkflowId_fkey";

-- AlterTable
ALTER TABLE "connection" DROP COLUMN "WorkflowId",
ADD COLUMN     "workflowId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "node" DROP COLUMN "WorkflowId",
ADD COLUMN     "workflowId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "node" ADD CONSTRAINT "node_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
