package com.fanglin.approval.service;

import java.util.List;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalDecorationTerminalItemVO;
import com.fanglin.approval.vo.ApprovalDecorationTerminalVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalDecorationTerminalService {

	public int submitApprovalForDecorationTerminal(ApprovalVO approvalVO, ApprovalDecorationTerminalVO approvalDecorationTerminalVO, List<ApprovalDecorationTerminalItemVO> approvalDecorationTerminalItemVOs, String userId, int company, String code, String forms) throws FLException;

	public int approveForDecorationTerminal(ApprovalPO approvalPO) throws FLException;

	public int refuse(ApprovalPO approvalPO) throws FLException;

}
