package com.fanglin.approval.service;

import java.util.List;


import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalManifestDBItemVO;
import com.fanglin.approval.vo.ApprovalManifestDBVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalManifestDBService {
	
	public List<ApprovalManifestDBItemVO> queryApprovalManifestDBItem(ApprovalVO approvalVO) throws FLException;
	
    public int submitApprovalForManifestDB(ApprovalVO approvalVO,ApprovalManifestDBVO approvalManifestDBVO,List<ApprovalManifestDBItemVO> approvalManifestDBItemVOs,String userId) throws FLException;
	
	public int approvalManifestDB(ApprovalPO approvalPO) throws FLException;
	
	public int refuseManifestDB(ApprovalPO approvalPO) throws FLException;
}
