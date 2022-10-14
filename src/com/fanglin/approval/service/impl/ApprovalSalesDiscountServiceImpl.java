package com.fanglin.approval.service.impl;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalSalesDiscountDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.po.ApprovalSalesDiscountPO;
import com.fanglin.approval.service.ApprovalSalesDiscountService;
import com.fanglin.approval.vo.ApprovalSalesDiscountVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.service.SalesActivityService;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("ApprovalSalesDiscountService")
@Transactional(readOnly = true)
public class ApprovalSalesDiscountServiceImpl implements ApprovalSalesDiscountService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private ApprovalSalesDiscountDao approvalSalesDiscountDao;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private SalesActivityService salesActivityService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalSalesDiscount(ApprovalVO approvalVO, ApprovalSalesDiscountVO approvalSalesDiscountVO, String userId, int company) throws FLException {

		long sid = approvalSalesDiscountVO.getSid();

		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_SALES_DIACOUNT_INT, String.valueOf(sid));

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		SalesPO salesPO = salesDao.get(sid);

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesPO.getFullpayStatus() != SalesPO.FULLPAYSTATUS_INIT_SHORT) {
			throw new FLException(260012, "销售订单当前状态不能提交补款");
		}

		salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_APPROVAL_INT);

		salesDao.update(salesPO);

		approvalPO = new ApprovalPO();

		BeanUtil.copyProperties(approvalVO, approvalPO, Arrays.asList("receiver", "sender"));
		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		String content = String.format("装修单号:%s,销售单号:%s,应收金额:%.3f", salesPO.getOrderId(), salesPO.getNo(), Arith.div(approvalSalesDiscountVO.getReferMoney(), 1000.0));

		approvalPO = new ApprovalPO().init(sender, receiver, salesPO.getOrderId(), String.valueOf(sid), ApprovalPO.APPROVAL_TYPE_SALES_DIACOUNT_INT, content, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		ApprovalSalesDiscountPO approvalSalesDiscountPO = new ApprovalSalesDiscountPO();

		approvalSalesDiscountPO.setAid(approvalPO.getAid());
		approvalSalesDiscountPO.setSid(sid);
		approvalSalesDiscountPO.setReferMoney(approvalSalesDiscountVO.getReferMoney());
		approvalSalesDiscountPO.setPaymentType(approvalSalesDiscountVO.getPaymentType());

		approvalSalesDiscountDao.save(approvalSalesDiscountPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForSalesDiscount(ApprovalPO approvalPO) throws FLException {

		ApprovalSalesDiscountPO approvalSalesDiscountPO = approvalSalesDiscountDao.queryApprovalSalesDiscountByAId(approvalPO.getAid());

		if (approvalSalesDiscountPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		SalesPO salesPO = salesDao.get(approvalSalesDiscountPO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesPO.getFullpayStatus() != SalesPO.FULLPAYSTATUS_APPROVAL_INT) {
			throw new FLException(260012, "销售订单当前状态不能提交补款");
		}

		if (approvalSalesDiscountPO.getPaymentType() == SalesPaymentPO.TYPE_MAKEAREFUND_INT) {
			salesActivityService.checkSalesActivity(approvalSalesDiscountPO.getSid(), approvalSalesDiscountPO.getReferMoney());
		}

		UserPO sender = approvalPO.getSender();

		SalesPaymentPO salesPaymentPO = new SalesPaymentPO();
		salesPaymentPO.setSales(salesPO);
		salesPaymentPO.setType(approvalSalesDiscountPO.getPaymentType());
		salesPaymentPO.setStatus(SalesPaymentPO.STATUS_INITIAL_INT);// 0.销售单初始状态
		salesPaymentPO.setCategory(salesPO.getCategory());
		salesPaymentPO.setBrand(salesPO.getBrand());
		salesPaymentPO.setCreater(sender);
		salesPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salesPaymentPO.setReferMoney(approvalSalesDiscountPO.getReferMoney());

		salesPaymentDao.save(salesPaymentPO);

		salesPO.setFullpay(approvalSalesDiscountPO.getPaymentType() == SalesPaymentPO.TYPE_MAKEAREFUND_INT ? -approvalSalesDiscountPO.getReferMoney() : approvalSalesDiscountPO.getReferMoney());
		salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_UNPAY_SHORT);// 0: 未付款

		salesDao.update(salesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refuseForSalesDiscount(ApprovalPO approvalPO) throws FLException {

		ApprovalSalesDiscountPO approvalSalesDiscountPO = approvalSalesDiscountDao.queryApprovalSalesDiscountByAId(approvalPO.getAid());

		if (approvalSalesDiscountPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		SalesPO salesPO = salesDao.get(approvalSalesDiscountPO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesPO.getFullpayStatus() == SalesPO.FULLPAYSTATUS_APPROVAL_INT) {

			salesPO.setFullpay(0);
			salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_INIT_SHORT);

			salesDao.update(salesPO);
		}

		return 0;
	}
}
