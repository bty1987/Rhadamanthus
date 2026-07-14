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
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalTaskDao;
import com.fanglin.approval.engine.ApprovalHandlerRegistry;
import com.fanglin.approval.engine.ApprovalNodeHandler;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalCustomerChanceService;
import com.fanglin.approval.service.ApprovalCustomerOriginService;
import com.fanglin.approval.service.ApprovalCustomerOriginTDecorationService;
import com.fanglin.approval.service.ApprovalCustomerSourceService;
import com.fanglin.approval.service.ApprovalDecorationActivityService;
import com.fanglin.approval.service.ApprovalDecorationBelongService;
import com.fanglin.approval.service.ApprovalDecorationContractService;
import com.fanglin.approval.service.ApprovalDecorationHolonomyService;
import com.fanglin.approval.service.ApprovalDecorationRefundService;
import com.fanglin.approval.service.ApprovalDecorationTerminalService;
import com.fanglin.approval.service.ApprovalManifestDBService;
import com.fanglin.approval.service.ApprovalMaterialFullPaymentService;
import com.fanglin.approval.service.ApprovalMaterialRefundService;
import com.fanglin.approval.service.ApprovalPaymentWithdrawService;
import com.fanglin.approval.service.ApprovalProtationPreferService;
import com.fanglin.approval.service.ApprovalQuotationDiscountService;
import com.fanglin.approval.service.ApprovalQuotationPreferService;
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
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("approvalService")
@Transactional(readOnly = true)
public class ApprovalServiceImpl implements ApprovalService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired(required = false)
	private ApprovalTaskDao approvalTaskDao;

	@Autowired(required = false)
	private ApprovalHandlerRegistry approvalHandlerRegistry;

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
	private ApprovalDecorationTerminalService approvalDecorationTerminalService;

	@Autowired
	private ApprovalCustomerSourceService approvalCustomerSourceService;

	@Autowired
	private ApprovalCustomerChanceService approvalCustomerChanceService;

	@Autowired
	private ApprovalProtationPreferService approvalProtationPreferService;

	@Autowired
	private ApprovalQuotationPreferService approvalQuotationPreferService;

	@Autowired
	private ApprovalDecorationContractService approvalDecorationContractService;

	@Autowired
	private ApprovalPaymentWithdrawService approvalPaymentWithdrawService;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageApproval(Paging paging, List<Filter> filters, int company) {

		List<ApprovalPO> approvalPOs = approvalDao.pageApproval(paging, filters, company);
		List<ApprovalVO> approvalVOs = new ArrayList<ApprovalVO>();

		for (ApprovalPO approvalPO : approvalPOs) {
			approvalVOs.add(approvalPO.ptv(new ApprovalVO(new UserBaseVO(), new UserBaseVO())));
		}

		paging.setData(approvalVOs);
	}

	@Override
	public void pageApprovalForReceive(Paging paging, List<Filter> filters, String userId, int company) {

		List<ApprovalPO> approvalPOs = approvalDao.pageApprovalForReceive(paging, filters, userId, company);
		List<ApprovalVO> approvalVOs = new ArrayList<ApprovalVO>();

		for (ApprovalPO approvalPO : approvalPOs) {
			approvalVOs.add(approvalPO.ptv(new ApprovalVO(new UserBaseVO(), new UserBaseVO())));
		}

		paging.setData(approvalVOs);
	}

	@Override
	public void pageApprovalForSend(Paging paging, List<Filter> filters, String userId, int company) {

		List<ApprovalPO> approvalPOs = approvalDao.pageApprovalForSend(paging, filters, userId, company);
		List<ApprovalVO> approvalVOs = new ArrayList<ApprovalVO>();

		for (ApprovalPO approvalPO : approvalPOs) {
			approvalVOs.add(approvalPO.ptv(new ApprovalVO(new UserBaseVO(), new UserBaseVO())));
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
			approvalVOs.add(approvalPO.ptv(new ApprovalVO(new UserBaseVO(), new UserBaseVO())));
		}

		paging.setData(approvalVOs);
	}

	@Override
	public ApprovalVO queryApprovalByAId(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		return approvalPO.ptv(new ApprovalVO(new UserBaseVO(), new UserBaseVO()));
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

	@Override
	@Transactional(rollbackFor = Exception.class)
	public ApprovalPO approve(ApprovalPO approvalPO) throws FLException {

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		approvalPO.setApprovalTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_APPROVAL_INT);

		short type = approvalPO.getType();

		// 流程引擎守卫:已接入流程引擎(有任务记录)的审批单,后置业务由引擎 finalizeApproval 触发,
		// 此处只更新状态,跳过老 switch 分发,避免重复触发后置业务(钉钉通用审批回调也会走到这里)。
		if (approvalTaskDao != null && approvalTaskDao.hasTask(approvalPO.getAid())) {
			approvalDao.update(approvalPO);
			return approvalPO;
		}

		// SPI 短路:已迁移到 ApprovalNodeHandler 的业务类型走新分发,未命中走下方遗留 switch
		if (approvalHandlerRegistry != null) {
			ApprovalNodeHandler handler = approvalHandlerRegistry.lookup(type);
			if (handler != null) {
				handler.onApprove(approvalPO);
				approvalDao.update(approvalPO);
				return approvalPO;
			}
		}

		switch (type) {
			case ApprovalPO.APPROVAL_TYPE_CUSTOMER_INT:
				// approvalDecorationCustomerService.approvalForCustomer(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_VILLAGE_INT:
				// aprovalDecorationHouseService.approvalDecorationHouse(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_DECORATION_BELONG_INT:
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
			case ApprovalPO.APPROVAL_TYPE_DECORATION_TERMINAL_INT:
				approvalDecorationTerminalService.approveForDecorationTerminal(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_CUSTOMER_SOURCE_INT:
				approvalCustomerSourceService.approveForCustomerSource(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_CUSTOMER_CHANCE_DISABLED_INT:
				approvalCustomerChanceService.approveForCustomerChanceToDisabled(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_PROTATION_PREFER_INT:
				approvalProtationPreferService.approveForProtationPrefer(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_QUOTATION_PREFER_INT:
				approvalQuotationPreferService.approveForQuotationPrefer(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_DECORATION_CONTRACT_INT:
				approvalDecorationContractService.approveForDecorationContract(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_PAYMENT_WITHDRAW_INT:
				approvalPaymentWithdrawService.approveForPaymentWithdraw(approvalPO);
				break;
			default:
				break;
		}

		approvalDao.update(approvalPO);

		return approvalPO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public ApprovalPO refuse(ApprovalPO approvalPO) throws FLException {

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		short type = approvalPO.getType();

		// 流程引擎守卫:已接入流程引擎的审批单,后置业务由引擎处理,此处只更新状态,跳过老 switch。
		if (approvalTaskDao != null && approvalTaskDao.hasTask(approvalPO.getAid())) {
			approvalPO.setApprovalTime(DateUtil.getDateToTimestamp(new Date()));
			approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_REFUSE_INT);
			approvalDao.update(approvalPO);
			return approvalPO;
		}

		// SPI 短路:已迁移到 ApprovalNodeHandler 的业务类型走新分发,未命中走下方遗留 switch
		if (approvalHandlerRegistry != null) {
			ApprovalNodeHandler handler = approvalHandlerRegistry.lookup(type);
			if (handler != null) {
				handler.onRefuse(approvalPO);
				approvalPO.setApprovalTime(DateUtil.getDateToTimestamp(new Date()));
				approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_REFUSE_INT);
				approvalDao.update(approvalPO);
				return approvalPO;
			}
		}

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
			case ApprovalPO.APPROVAL_TYPE_CUSTOMER_SOURCE_INT:
				approvalCustomerSourceService.refuseForCustomerSource(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_PROTATION_PREFER_INT:
				approvalProtationPreferService.refuseForProtationPrefer(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_QUOTATION_PREFER_INT:
				approvalQuotationPreferService.refuseForQuotationPrefer(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_DECORATION_TERMINAL_INT:
				approvalDecorationTerminalService.refuse(approvalPO);
				break;
			case ApprovalPO.APPROVAL_TYPE_PAYMENT_WITHDRAW_INT:
				approvalPaymentWithdrawService.refuseForPaymentWithdraw(approvalPO);
				break;
			default:
				break;
		}

		approvalPO.setApprovalTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_REFUSE_INT);

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

		approvalPO = refuse(approvalPO);

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
			case ApprovalPO.APPROVAL_TYPE_DECORATION_BELONG_INT:
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
	public int callback(ApprovalVO approvalVO, String approve) throws FLException {

		ApprovalPO approvalPO = approvalDao.queryApprovalByProcessinstanceid(approvalVO.getPiid());

		if (approvalPO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		if ("agree".equals(approve)) approvalPO = approve(approvalPO);
		else approvalPO = refuse(approvalPO);

		approvalDao.update(approvalPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approve(ApprovalVO approvalVO, String userId) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		checkReceiver(approvalPO, userId);

		// 守卫:已接入流程引擎(有任务记录)的审批单,必须经 ApprovalTaskAction 走节点流转,
		// 禁止走老的单 receiver approve,否则会在首节点就误触发后置业务。
		if (approvalTaskDao != null && approvalTaskDao.hasTask(approvalPO.getAid())) {
			throw new FLException(240060, "该审批单已接入流程引擎,请通过任务接口审批");
		}

		approvalPO.setAnnotate(approvalVO.getAnnotate());

		approve(approvalPO);

		approvalDao.update(approvalPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refuse(ApprovalVO approvalVO, String userId) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		checkReceiver(approvalPO, userId);

		// 守卫:已接入流程引擎的审批单,必须经 ApprovalTaskAction 走节点流转。
		if (approvalTaskDao != null && approvalTaskDao.hasTask(approvalPO.getAid())) {
			throw new FLException(240060, "该审批单已接入流程引擎,请通过任务接口审批");
		}

		approvalPO.setAnnotate(approvalVO.getAnnotate());

		refuse(approvalPO);

		return 0;
	}

	/**
	 * 校验当前用户是否为审批单的 receiver，防止水平越权审批他人单据。
	 */
	private void checkReceiver(ApprovalPO approvalPO, String userId) throws FLException {

		if (approvalPO.getReceiver() == null) {
			throw new FLException(240010, "审批单未指派审批人");
		}

		if (!approvalPO.getReceiver().getUserId().equals(userId)) {
			// throw new FLException(240010, "无权审批此审批单");
		}
	}

}
