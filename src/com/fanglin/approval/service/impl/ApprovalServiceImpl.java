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
import com.fanglin.approval.service.ApprovalCustomerOriginService;
import com.fanglin.approval.service.ApprovalCustomerOriginTDecorationService;
import com.fanglin.approval.service.ApprovalDecorationActivityService;
import com.fanglin.approval.service.ApprovalDecorationBelongService;
import com.fanglin.approval.service.ApprovalDecorationHolonomyService;
import com.fanglin.approval.service.ApprovalDecorationRefundService;
import com.fanglin.approval.service.ApprovalManifestDBService;
import com.fanglin.approval.service.ApprovalMaterialFullPaymentService;
import com.fanglin.approval.service.ApprovalMaterialRefundService;
import com.fanglin.approval.service.ApprovalQuotationDiscountService;
import com.fanglin.approval.service.ApprovalSalesDaymentService;
import com.fanglin.approval.service.ApprovalSalesDiscountService;
import com.fanglin.approval.service.ApprovalSalesRefundService;
import com.fanglin.approval.service.ApprovalService;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("approvalService")
@Transactional(readOnly = true)
public class ApprovalServiceImpl implements ApprovalService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private ApprovalDecorationActivityService approvalDecorationActivityService;

	// @Autowired
	// private ApprovalDecorationCustomerService
	// approvalDecorationCustomerService;

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

	// @Autowired
	// private ApprovalDecorationHouseService aprovalDecorationHouseService;
	//
	@Autowired
	private ApprovalManifestDBService approvalManifestDBService;

	@Autowired
	private ApprovalSalesRefundService approvalSalesRefundService;

	@Autowired
	private ApprovalSalesDiscountService approvalSalesDiscountService;

	@Autowired
	private ApprovalCustomerOriginTDecorationService approvalCustomerOriginTDecorationService;

	@Autowired
	private ApprovalDecorationHolonomyService approvalDecorationHolonomyService;

	@Autowired
	private ApprovalCustomerOriginService approvalCustomerOriginService;

	@Autowired
	private ApprovalSalesDaymentService approvalSalesDaymentService;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageApprovalForReceive(Paging paging, List<Filter> filters, String userId, int company) {

		List<ApprovalPO> approvalPOs = approvalDao.pageApprovalForReceive(paging, filters, userId, company);
		List<ApprovalVO> approvalVOs = new ArrayList<ApprovalVO>();

		for (ApprovalPO approvalPO : approvalPOs) {
			approvalVOs.add(convertBean(approvalPO));
		}

		paging.setData(approvalVOs);
	}

	@Override
	public void pageApprovalForSend(Paging paging, List<Filter> filters, String userId, int company) {

		List<ApprovalPO> approvalPOs = approvalDao.pageApprovalForSend(paging, filters, userId, company);
		List<ApprovalVO> approvalVOs = new ArrayList<ApprovalVO>();

		for (ApprovalPO approvalPO : approvalPOs) {
			approvalVOs.add(convertBean(approvalPO));
		}

		paging.setData(approvalVOs);
	}

	@Override
	public void pageApprovalForReceiveDept(Paging paging, List<Filter> filters, String userId, int company) {

		UserPO user = userDao.queryUserByUserId(userId);
		int department = user.getDept().getDid();
		List<ApprovalPO> approvalPOs = approvalDao.pageApprovalForReceiveDept(paging, filters, department, company);
		List<ApprovalVO> approvalVOs = new ArrayList<ApprovalVO>();

		for (ApprovalPO approvalPO : approvalPOs) {

			approvalVOs.add(convertBean(approvalPO));

		}

		paging.setData(approvalVOs);
	}

	@Override
	public ApprovalVO queryApprovalByAId(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		return convertBean(approvalPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public ApprovalPO approve(ApprovalPO approvalPO) throws FLException {

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		approvalPO.setApprovalTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_APPROVAL_INT);

		short type = approvalPO.getType();

		switch (type) {
		case ApprovalPO.APPROVAL_TYPE_CUSTOMER_INT:
			// approvalDecorationCustomerService.approvalForCustomer(approvalPO);
			break;
		case ApprovalPO.APPROVAL_TYPE_VILLAGE_INT:
			// aprovalDecorationHouseService.approvalDecorationHouse(approvalPO);
			break;
		case ApprovalPO.APPROVAL_TYPE_ORDER_BELONG_INT:
			approvalDecorationBelongService.approveForDecorationBelong(approvalPO);
			break;
		case ApprovalPO.APPROVAL_TYPE_QUOTATION_DISCOUNT_INT:
			approvalQuotationDiscountService.approveForQuotationDiscount(approvalPO);
			break;
		case ApprovalPO.APPROVAL_TYPE_DECORATION_REFUND_INT:
			approvalDecorationRefundService.approveForDecorationRefund(approvalPO);
			break;
		case ApprovalPO.APPROVAL_TYPE_MATERIAL_REFUND_INT:
			approvalMaterialRefundService.approveForMaterialRefund(approvalPO);
			break;
		case ApprovalPO.APPROVAL_TYPE_DECORATION_ACTIVITY_INT:
			approvalDecorationActivityService.approveForDecorationActivity(approvalPO);
			break;
		case ApprovalPO.APPROVAL_TYPE_MATERIAL_FULL_PAYMENT_INT:
			approvalMaterialFullPaymentService.approveForMaterialFullPayment(approvalPO);
			break;
		case ApprovalPO.APPROVAL_TYPE_SALESREFUND_PAYMENT_INT:
			approvalSalesRefundService.approveForSalesRefund(approvalPO);
			break;
		case ApprovalPO.APPROVAL_TYPE_MANIFESTDB_INT:
			approvalManifestDBService.approvalManifestDB(approvalPO);
			break;
		case ApprovalPO.APPROVAL_TYPE_SALES_DIACOUNT_INT:
			approvalSalesDiscountService.approveForSalesDiscount(approvalPO);
			break;
		case ApprovalPO.APPROVAL_TYPE_CUSTOMER_ORIGIN_T_DECORATION_INT:
			approvalCustomerOriginTDecorationService.approveForCustomerOriginTDecoration(approvalPO);
			break;
		case ApprovalPO.APPROVAL_TYPE_DECORATION_HOLONOMY_INT:
			approvalDecorationHolonomyService.approveForDecorationHolonomy(approvalPO);
			break;
		case ApprovalPO.APPROVAL_TYPE_CUSTOMER_ORIGIN_INT:
			approvalCustomerOriginService.approveForCustomerOrigin(approvalPO);
			break;
		case ApprovalPO.APPROVAL_TYPE_SALESDAYMENT_INT:
			approvalSalesDaymentService.approveForSalesDayment(approvalPO);
			break;
		default:
			break;
		}

		approvalDao.update(approvalPO);

		return approvalPO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approve(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());
		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		if (approvalPO.getStatus() == ApprovalPO.APPROVAL_STATUS_APPROVAL_INT) {
			throw new FLException(240009, "审批状态不可操作");
		}

		if (approvalPO.getStatus() == ApprovalPO.APPROVAL_STATUS_REFUSE_INT) {
			throw new FLException(240009, "审批状态不可操作");
		}

		if (approvalPO.getStatus() == ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT) {
			throw new FLException(240009, "审批状态不可操作");
		}
		approvalPO.setAnnotate(approvalVO.getAnnotate());

		approvalPO = approve(approvalPO);

		approvalDao.update(approvalPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int affirm(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO.getStatus() != ApprovalPO.APPROVAL_STATUS_INIT_INT) {
			throw new FLException(240001, "审批状态不可操作");
		}

		short type = approvalPO.getType();

		switch (type) {
		case ApprovalPO.APPROVAL_TYPE_ORDER_BELONG_INT:
			approvalDecorationBelongService.confirmForDecorationBelong(approvalPO);
			break;
		default:
			break;
		}

		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT);

		approvalDao.update(approvalPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approvalCallback(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.queryApprovalByProcessinstanceid(approvalVO.getProcessinstanceid());

		if (approvalPO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		approvalPO = approve(approvalPO);

		approvalDao.update(approvalPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refuse(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		if (approvalPO.getStatus() == ApprovalPO.APPROVAL_STATUS_APPROVAL_INT) {
			throw new FLException(240009, "审批状态不可操作");
		}

		if (approvalPO.getStatus() == ApprovalPO.APPROVAL_STATUS_REFUSE_INT) {
			throw new FLException(240009, "审批状态不可操作");
		}

		if (approvalPO.getStatus() == ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT) {
			throw new FLException(240009, "审批状态不可操作");
		}
		approvalPO.setAnnotate(approvalVO.getAnnotate());

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
		case ApprovalPO.APPROVAL_TYPE_SALES_DIACOUNT_INT:
			approvalSalesDiscountService.refuseForSalesDiscount(approvalPO);
			break;
		case ApprovalPO.APPROVAL_TYPE_CUSTOMER_ORIGIN_T_DECORATION_INT:
			approvalCustomerOriginTDecorationService.refuseForCustomerOriginTDecoration(approvalPO);
			break;
		case ApprovalPO.APPROVAL_TYPE_CUSTOMER_ORIGIN_INT:
			approvalCustomerOriginService.refuseForCustomerOrigin(approvalPO);
			break;
		default:
			break;
		}

		approvalPO.setApprovalTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_REFUSE_INT);

		approvalDao.update(approvalPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int countApprovalForReceive(String userId, int company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);
		int ruId = userPO.getUid();

		int count = approvalDao.countApprovalForReceive(ApprovalPO.APPROVAL_STATUS_INIT_INT, ruId, company);

		return count;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int countApprovalForSend(String userId, int company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);
		int suId = userPO.getUid();

		int count = approvalDao.countApprovalForSend(ApprovalPO.APPROVAL_STATUS_INIT_INT, suId, company);

		return count;
	}

	private ApprovalVO convertBean(ApprovalPO approvalPO) {

		ApprovalVO approvalVO = new ApprovalVO(new UserBaseVO(), new UserBaseVO());

		BeanUtil.copyProperties(approvalPO, approvalVO, Arrays.asList("receiver", "sender"));
		BeanUtil.copyProperties(approvalPO.getReceiver(), approvalVO.getReceiver(), Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(approvalPO.getSender(), approvalVO.getSender(), Arrays.asList("dept", "duty"));

		return approvalVO;
	}

}
