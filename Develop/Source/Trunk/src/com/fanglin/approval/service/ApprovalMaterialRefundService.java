/**
 * @File Name		: ApprovalMaterialRefundService.java
 * @Package   	: com.fanglin.approval.service
 * @Version		: 1.0
 * @Date			: 2015-11-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service;

import java.util.List;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalMaterialRefundItemVO;
import com.fanglin.approval.vo.ApprovalMaterialRefundVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

/**
 * 审批材料退款Service接口(用于主材退货审批)
 * @author lenovo
 *
 */
public interface ApprovalMaterialRefundService {
	
	/**
	 * 获取主材退货审批项信息
	 * @param approvalVO -审批类
	 * @return
	 * @throws FLException
	 */
	public List<ApprovalMaterialRefundItemVO> queryApprovalMaterialRefundItem(ApprovalVO approvalVO) throws FLException;
	
	/**
	 * 提交主材退货审批
	 * @param approvalVO -审批类
	 * @param approvalMaterialRefundVO -审批材料退款类
	 * @param approvalMaterialRefundItemVOs -退税项目的审批材料类
	 * @param userId -用户ID
	 * @return
	 * @throws FLException
	 */
	public int submitApprovalForMaterialRefund(ApprovalVO approvalVO, ApprovalMaterialRefundVO approvalMaterialRefundVO, List<ApprovalMaterialRefundItemVO> approvalMaterialRefundItemVOs, String userId, int company) throws FLException;
	
	/**
	 * 批准主材退款
	 * @param approvalPO -审批类
	 * @return
	 * @throws FLException
	 */
	public int approvalForMaterialRefund(ApprovalPO approvalPO) throws FLException;
	
	/**
	 * 拒绝主材退款
	 * @param approvalPO -审批类
	 * @return
	 * @throws FLException
	 */
	public int refuseForMaterialRefund(ApprovalPO approvalPO) throws FLException;
	
}
