package com.fanglin.right.service;

import java.util.List;

import com.fanglin.right.vo.ApprovalFunctionRightVO;

public interface ApprovalFunctionRightService {

	public List<ApprovalFunctionRightVO> queryApprovalFunctionRight(ApprovalFunctionRightVO approvalFunctionRight);

	public void updateApprovalFunctionRight(ApprovalFunctionRightVO approvalFunctionRight, List<Long> cfids, int company);

}
