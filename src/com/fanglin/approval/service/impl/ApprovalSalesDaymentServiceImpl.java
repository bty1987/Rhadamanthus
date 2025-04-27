package com.fanglin.approval.service.impl;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalSalesDaymentDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.po.ApprovalSalesDaymentPO;
import com.fanglin.approval.service.ApprovalSalesDaymentService;
import com.fanglin.approval.vo.ApprovalSalesDaymentVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.sales.dao.SalesBalanceDao;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.po.SalesBalancePO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.service.SalesActivityService;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalSalesDaymentService")
@Transactional(readOnly = true)
public class ApprovalSalesDaymentServiceImpl implements ApprovalSalesDaymentService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private ApprovalSalesDaymentDao approvalSalesDaymentDao;

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private SalesBalanceDao salesBalanceDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SalesActivityService salesActivityService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForSalesDayment(ApprovalVO approvalVO, ApprovalSalesDaymentVO approvalSalesDaymentVO, String userId, int company) throws FLException {

		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		Long sid = approvalSalesDaymentVO.getSid();

		SalesPO salesPO = salesDao.get(sid);

		if (salesPO == null) {
			throw new FLException(330001, "销售单不存在");
		}

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_SALESDAYMENT_INT, String.valueOf(sid));

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		SalesPaymentPO depositpay = salesPaymentDao.querySalesPayment(sid, Arrays.asList(SalesPaymentPO.TYPE_DEPOSITREFUND_INT));

		if (depositpay != null) {
			throw new FLException(150037, "定金已存在");
		}

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		String content = String.format("销售不退定金,销售单号:%s,品牌:%s", salesPO.getNo(), salesPO.getBrand().getName());

		approvalPO = new ApprovalPO().init(sender, receiver, salesPO.getOrderId(), String.valueOf(sid), ApprovalPO.APPROVAL_TYPE_SALESDAYMENT_INT, content, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		ApprovalSalesDaymentPO approvalSalesDaymentPO = new ApprovalSalesDaymentPO();

		BeanUtil.copyPropertie(approvalSalesDaymentVO, approvalSalesDaymentPO);

		approvalSalesDaymentPO.setAid(approvalPO.getAid());

		approvalSalesDaymentDao.save(approvalSalesDaymentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForSalesDayment(ApprovalPO approvalPO) throws FLException {

		ApprovalSalesDaymentPO approvalSalesDaymentPO = approvalSalesDaymentDao.querySalesDaymentByAid(approvalPO.getAid());

		if (approvalSalesDaymentPO == null) {
			throw new FLException(240001, "审批信息不存在");
		}

		long sid = approvalSalesDaymentPO.getSid();

		SalesPO salesPO = salesDao.get(sid);

		if (salesPO == null) {
			throw new FLException(330001, "销售单不存在");
		}

		SalesPaymentPO depositpay = salesPaymentDao.querySalesPayment(sid, Arrays.asList(SalesPaymentPO.TYPE_NOTDEPOSITREFUND_INT));

		if (depositpay == null) {
			throw new FLException(150037, "定金不存在");
		}

		if (depositpay.getStatus() != SalesPaymentPO.STATUS_CONFIRMED_INT) {
			throw new FLException(150036, "款项状态不可操作");
		}

		if (salesPaymentDao.countSalesPayment(sid, Arrays.asList(SalesPaymentPO.TYPE_REPLENISHMENT_INT, SalesPaymentPO.TYPE_MAKEAREFUND_INT)) != 0) {
			throw new FLException(150040, "补款已存在");
		}

		// 判断销售单款项积分以及领取活动物品积分比较结果
		salesActivityService.checkSalesActivity(sid, depositpay.getReferMoney());

		SalesPaymentPO salesPaymentPO = new SalesPaymentPO(new UserPO(), new SalesPO());

		salesPaymentPO.setSales(salesPO);
		salesPaymentPO.setType(SalesPaymentPO.TYPE_DEPOSITREFUND_INT);
		salesPaymentPO.setStatus(SalesPaymentPO.STATUS_INITIAL_INT);
		salesPaymentPO.setCategory(salesPO.getCategory());
		salesPaymentPO.setBrand(salesPO.getBrand().getName());

		salesPaymentPO.setCreater(approvalPO.getReceiver());
		salesPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salesPaymentPO.setReferMoney(depositpay.getReferMoney());
		salesPaymentPO.setCompany(salesPO.getCompany());

		salesPaymentDao.save(salesPaymentPO);

		salesPO.setDepositpay(0);
		salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_INIT_SHORT);
		salesPO.setStatus(SalesPO.STATUS_WAST_SHORT);

		salesDao.update(salesPO);

		SalesBalancePO salesBalancePO = salesBalanceDao.querySalesBalance(sid, SalesBalancePO.TYPE_DEPOSITPAY_INT, SalesBalancePO.ONETYPE_INIT_INT);

		if (salesBalancePO != null) {

			long depospay = salesPO.getDepositpay();
			long balance = salesBalancePO.getBalance();

			SalesBalancePO reveBalancePO = new SalesBalancePO();

			BeanUtil.copyPropertie(salesBalancePO, reveBalancePO);

			long vbalance = Arith.sub(Arith.round(depospay, 0, Arith.ROUND_FLOOR), Arith.round(balance, 0, Arith.ROUND_CEILING));

			reveBalancePO.setStatus(SalesBalancePO.STATUS_PREBALANCE_INT);
			reveBalancePO.setOnetype(SalesBalancePO.ONETYPE_REFUND_INT);

			reveBalancePO.setBalance(-balance);
			reveBalancePO.setPbalance(-vbalance);
			reveBalancePO.setVbalance(-vbalance);
			reveBalancePO.setTotal(-salesBalancePO.getTotal());

			salesBalanceDao.save(reveBalancePO);
		}

		return 0;
	}
}
