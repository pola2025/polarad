import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WorkflowStatus } from "@prisma/client";

// GET: 워크플로우 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            clientName: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        logs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: "워크플로우를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: workflow,
    });
  } catch (error) {
    console.error("Get workflow error:", error);
    return NextResponse.json(
      { error: "워크플로우 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// PATCH: 워크플로우 상태 업데이트
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      status,
      designUrl,
      finalUrl,
      courier,
      trackingNumber,
      revisionNote,
      adminNote,
      changedBy,
    } = body;

    // 워크플로우 존재 확인
    const existingWorkflow = await prisma.workflow.findUnique({
      where: { id },
    });

    if (!existingWorkflow) {
      return NextResponse.json(
        { error: "워크플로우를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 상태 변경 시 타임스탬프 업데이트
    const updateData: Record<string, unknown> = {};
    const now = new Date();

    if (status && status !== existingWorkflow.status) {
      updateData.status = status;

      // 상태별 타임스탬프 설정
      switch (status as WorkflowStatus) {
        case "SUBMITTED":
          updateData.submittedAt = now;
          break;
        case "IN_PROGRESS":
          updateData.designStartedAt = now;
          break;
        case "DESIGN_UPLOADED":
          updateData.designUploadedAt = now;
          break;
        case "ORDER_REQUESTED":
          updateData.orderRequestedAt = now;
          break;
        case "ORDER_APPROVED":
          updateData.orderApprovedAt = now;
          break;
        case "COMPLETED":
          updateData.completedAt = now;
          break;
        case "SHIPPED":
          updateData.shippedAt = now;
          break;
      }
    }

    if (designUrl !== undefined) updateData.designUrl = designUrl;
    if (finalUrl !== undefined) updateData.finalUrl = finalUrl;
    if (courier !== undefined) updateData.courier = courier;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (adminNote !== undefined) updateData.adminNote = adminNote;

    // 수정 요청 시 카운트 증가
    if (revisionNote) {
      updateData.revisionNote = revisionNote;
      updateData.revisionCount = existingWorkflow.revisionCount + 1;
    }

    // 워크플로우 업데이트
    const workflow = await prisma.workflow.update({
      where: { id },
      data: updateData,
    });

    // 상태 변경 로그 생성
    if (status && status !== existingWorkflow.status) {
      await prisma.workflowLog.create({
        data: {
          workflowId: id,
          fromStatus: existingWorkflow.status,
          toStatus: status,
          changedBy: changedBy || "admin",
          note: adminNote || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: workflow,
      message: "워크플로우가 업데이트되었습니다",
    });
  } catch (error) {
    console.error("Update workflow error:", error);
    return NextResponse.json(
      { error: "워크플로우 업데이트 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// DELETE: 워크플로우 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 워크플로우 존재 확인
    const existingWorkflow = await prisma.workflow.findUnique({
      where: { id },
    });

    if (!existingWorkflow) {
      return NextResponse.json(
        { error: "워크플로우를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 워크플로우 삭제 (관련 로그도 cascade로 삭제됨)
    await prisma.workflow.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "워크플로우가 삭제되었습니다",
    });
  } catch (error) {
    console.error("Delete workflow error:", error);
    return NextResponse.json(
      { error: "워크플로우 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
