/**
 * @File Name		: ApprovalServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalDecorationActivityService;
//import com.fanglin.approval.service.ApprovalDecorationCustomerService;
import com.fanglin.approval.service.ApprovalDecorationRefundService;
import com.fanglin.approval.service.ApprovalManifestDBService;
import com.fanglin.approval.service.ApprovalMaterialFullPaymentService;
import com.fanglin.approval.service.ApprovalMaterialRefundService;
import com.fanglin.approval.service.ApprovalDecorationBelongService;
import com.fanglin.approval.service.ApprovalQuotationDiscountService;
import com.fanglin.approval.service.ApprovalSalesDiscountService;
import com.fanglin.approval.service.ApprovalSalesRefundService;
import com.fanglin.approval.service.ApprovalService;
//import com.fanglin.approval.service.ApprovalDecorationHouseService;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("approvalService")
@Transactional(readOnly=true)
public class ApprovalServiceImpl implements ApprovalService {

	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalDecorationActivityService approvalDecorationActivityService;
	
//	@Autowired
//	private ApprovalDecorationCustomerService approvalDecorationCustomerService;
	
	@Autowired
	private ApprovalDecorationRefundService approvalDecorationRefundService;
	
	@Autowired
	private ApprovalMaterialFullPaymentService approvalMaterialFullPaymentService;
	
	@Autowired
	private ApprovalMaterialRefundService approvalMaterialRefundService;
	
	@Autowired
	private ApprovalDecorationBelongService approvalDecorationBelongService;
	
	@Autowired
	private ApprovalQuotationDiscountService approvalQuotationDiscountService;
	
//	@Autowired
//	private ApprovalDecorationHouseService aprovalDecorationHouseService;
//	
	@Autowired
	private ApprovalManifestDBService approvalManifestDBService;
	
	@Autowired
	private ApprovalSalesRefundService approvalSalesRefundService;
	
	@Autowired
	private ApprovalSalesDiscountService approvalSalesDiscountService;
	
	@Override
	public void pageApprovalByReceiveId(Paging paging, List<Filter> filters, String userId,int company){
		
		List<ApprovalPO> approvalPOs = approvalDao.pageApprovalByReceiveId(paging, filters, userId,company);
		List<ApprovalVO> approvalVOs = new ArrayList<ApprovalVO>();
		
		for(ApprovalPO approvalPO: approvalPOs){
			approvalVOs.add(convertBean(approvalPO));
		}
		
		paging.setData(approvalVOs);
	}
	
	@Override
	public void pageApprovalBySenderId(Paging paging, List<Filter> filters, String userId,int company){
		
		List<ApprovalPO> approvalPOs = approvalDao.pageApprovalBySenderId(paging, filters, userId,company);
		List<ApprovalVO> approvalVOs = new ArrayList<ApprovalVO>();
		
		for(ApprovalPO approvalPO: approvalPOs){
			approvalVOs.add(convertBean(approvalPO));
		}	
		
		paging.setData(approvalVOs);
	}
	
	@Override
	public ApprovalVO queryApprovalByAId(ApprovalVO approvalVO) throws FLException {
		
		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());
		
		ApprovalVO approval = new ApprovalVO(new UserBaseVO(),new UserBaseVO());
		
		if(approvalPO == null){
			throw new FLException(240009, "审批信息不存在");
		}
		
		BeanUtil.copyProperties(approvalPO, approvalVO,Arrays.asList("receiver", "sender"));
		BeanUtil.copyProperties(approvalPO.getReceiver(), approval.getReceiver(),Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(approvalPO.getSender(), approval.getSender(),Arrays.asList("dept", "duty"));
		
		return approval;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approve(ApprovalVO approvalVO) throws FLException {
	
		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());
		
		if(approvalPO == null){
			throw new FLException(240009, "审批信息不存在");
		}
		
		if(approvalPO.getStatus() != ApprovalPO.APPROVAL_STATUS_INIT_INT){
			throw new FLException(240001, "不能重复审批");
		}

		approvalPO.setApprovalTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_APPROVAL_INT);

		short type = approvalPO.getType();
		
		switch (type) {
			case ApprovalPO.APPROVAL_TYPE_CUSTOMER_INT:
//				approvalDecorationCustomerService.approvalForCustomer(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_VILLAGE_INT:
//				aprovalDecorationHouseService.approvalDecorationHouse(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_ORDER_BELONG_INT:
				approvalDecorationBelongService.approvalForDecorationBelong(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_QUOTATION_DISCOUNT_INT:
				approvalQuotationDiscountService.approvalForQuotationDiscount(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_DECORATION_REFUND_INT:
				approvalDecorationRefundService.approvalForDecorationRefund(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_MATERIAL_REFUND_INT:
				approvalMaterialRefundService.approvalForMaterialRefund(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_DECORATION_ACTIVITY_INT:
				approvalDecorationActivityService.approvalForDecorationActivity(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_MATERIAL_FULL_PAYMENT_INT:
				approvalMaterialFullPaymentService.approvalForMaterialFullPayment(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_SALESREFUND_PAYMENT_INT:
				approvalSalesRefundService.approvalForSalesRefund(approvalPO);
				break;	
			case ApprovalPO.APPROVAL_TYPE_MANIFESTDB_INT:
				approvalManifestDBService.approvalManifestDB(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_SALES_DIACOUNT_INT:
				approvalSalesDiscountService.approvalForSalesDiscount(approvalPO);
			    break;
			default:
				break;
		}

		approvalDao.update(approvalPO);
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refuse(ApprovalVO approvalVO) throws FLException {
		
		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());
		
		if(approvalPO == null){
			throw new FLException(240009, "审批信息不存在");
		}
		
		if(approvalPO.getStatus() != ApprovalPO.APPROVAL_STATUS_INIT_INT){
			throw new FLException(240001, "不能重复审批");
		}
		
		short type = approvalPO.getType();
		
		switch (type) {
			case ApprovalPO.APPROVAL_TYPE_MATERIAL_FULL_PAYMENT_INT:
				approvalMaterialFullPaymentService.refuseForMaterialFullPayment(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_MATERIAL_REFUND_INT:
				approvalMaterialRefundService.refuseForMaterialRefund(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_DECORATION_REFUND_INT:
				approvalDecorationRefundService.refuseForDecorationRefund(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_SALESREFUND_PAYMENT_INT:
				approvalSalesRefundService.refuseForSalesRefund(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_MANIFESTDB_INT:
				approvalManifestDBService.refuseManifestDB(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_SALES_DIACOUNT_INT:
				approvalSalesDiscountService.refuseForSalesDiscount(approvalPO);
				break;
			default:
				break;
		}
		
		approvalPO.setApprovalTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_REFUSE_INT);
		
		approvalDao.update(approvalPO);
		
		return 0;
	}
	
	private ApprovalVO convertBean(ApprovalPO approvalPO) {
		
		ApprovalVO approvalVO = new ApprovalVO(new UserBaseVO(),new UserBaseVO());
		
		BeanUtil.copyProperties(approvalPO, approvalVO,Arrays.asList("receiver", "sender"));
		BeanUtil.copyProperties(approvalPO.getReceiver(), approvalVO.getReceiver(),Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(approvalPO.getSender(), approvalVO.getSender(),Arrays.asList("dept", "duty"));

		return approvalVO;
	}

}
