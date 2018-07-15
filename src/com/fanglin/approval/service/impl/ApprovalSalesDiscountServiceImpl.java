package com.fanglin.approval.service.impl;

import java.util.Arrays;
import java.util.Date;

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

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalSalesDiscount(ApprovalVO approvalVO,ApprovalSalesDiscountVO approvalSalesDiscountVO, String userId,int company)throws FLException {

		long sid = approvalSalesDiscountVO.getSid();

		ApprovalPO approvalPO = approvalDao.queryApproval(ApprovalPO.APPROVAL_STATUS_INIT_INT,ApprovalPO.APPROVAL_TYPE_SALES_DIACOUNT_INT,String.valueOf(sid));

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		SalesPO salesPO = salesDao.get(sid);

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}
		if (salesPO.getFullpayStatus() != SalesPO.FULLPAYSTATUS_INIT_SHORT && salesPO.getFullpayStatus() != (short)3) {// 不等于-1
			throw new FLException(260012, "销售订单当前状态不能提交补款");
		}
		salesPO.setFullpayStatus((short) 3);

		salesDao.update(salesPO);

		approvalPO = new ApprovalPO();

		BeanUtil.copyProperties(approvalVO, approvalPO,Arrays.asList("receiver","sender"));

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_SALES_DIACOUNT_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		approvalPO.setIdent(String.valueOf(sid));
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setApprovalTime(DateUtil.getDateToTimestamp(new Date()));
		// 订单号:%s,销售单号:%s,应收金额:%s
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_SALES_DISCOUNT_STR,salesPO.getOrderId(), salesPO.getNo(),approvalSalesDiscountVO.getReferMoney()));
		approvalPO.setReceiver(receiver);
		approvalPO.setSender(sender);
		approvalPO.setCompany(company);
		
		approvalDao.save(approvalPO);

		ApprovalSalesDiscountPO approvalSalesDiscountPO = new ApprovalSalesDiscountPO();

		approvalSalesDiscountPO.setAid(approvalPO.getAid());
		approvalSalesDiscountPO.setSid(sid);
		approvalSalesDiscountPO.setReferMoney(approvalSalesDiscountVO.getReferMoney());

		approvalSalesDiscountDao.save(approvalSalesDiscountPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approvalForSalesDiscount(ApprovalPO approvalPO)throws FLException {

		ApprovalSalesDiscountPO approvalSalesDiscountPO = approvalSalesDiscountDao.queryApprovalSalesDiscountByAId(approvalPO.getAid());

		if (approvalSalesDiscountPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}
		long sid = approvalSalesDiscountPO.getSid();

		SalesPO salesPO = salesDao.get(sid);

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		int fullStatus = salesPO.getFullpayStatus();

		if (fullStatus != SalesPO.FULLPAYSTATUS_INIT_SHORT&& fullStatus != (short)3) {
			throw new FLException(260012, "销售订单当前状态不能提交补款");
		}

		UserPO sender = approvalPO.getSender();

		SalesPaymentPO salesPaymentPO = new SalesPaymentPO();
		salesPaymentPO.setSales(salesPO);
		salesPaymentPO.setType(SalesPaymentPO.COLUMN_REPLENISHMENTTYPE_INT);// 3:
																			// 补款
		salesPaymentPO.setStatus(SalesPaymentPO.COLUMN_SALES_INITIALSTATUS_INT);// 0.销售单初始状态
		salesPaymentPO.setCategory(salesPO.getCategory());
		salesPaymentPO.setBrand(salesPO.getBrand());
		salesPaymentPO.setCreater(sender);
		salesPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salesPaymentPO.setReferMoney(approvalSalesDiscountPO.getReferMoney());

		salesPaymentDao.save(salesPaymentPO);

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

		long sid = approvalSalesDiscountPO.getSid();
		SalesPO salesPO = salesDao.get(sid);

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_INIT_SHORT);
		salesDao.update(salesPO);

		return 0;
	}
}
