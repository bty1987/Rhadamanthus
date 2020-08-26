package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalSalesRefundDao;
import com.fanglin.approval.dao.ApprovalSalesRefundItemDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.po.ApprovalSalesRefundItemPO;
import com.fanglin.approval.po.ApprovalSalesRefundPO;
import com.fanglin.approval.service.ApprovalSalesRefundService;
import com.fanglin.approval.vo.ApprovalSalesRefundItemVO;
import com.fanglin.approval.vo.ApprovalSalesRefundVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.sales.dao.RefundsDao;
import com.fanglin.sales.dao.RefundsItemDao;
import com.fanglin.sales.dao.SalesBalanceDao;
import com.fanglin.sales.dao.SalesBalanceItemDao;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesItemDao;
import com.fanglin.sales.po.RefundsItemPO;
import com.fanglin.sales.po.RefundsPO;
import com.fanglin.sales.po.SalesBalanceItemPO;
import com.fanglin.sales.po.SalesBalancePO;
import com.fanglin.sales.po.SalesItemPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.service.SalesActivityService;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalSalesRefundService")
@Transactional(readOnly = true)
public class ApprovalSalesRefundServiceImpl implements ApprovalSalesRefundService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private ApprovalSalesRefundDao approvalSalesRefundDao;

	@Autowired
	private ApprovalSalesRefundItemDao approvalSalesRefundItemDao;

	@Autowired
	private SalesItemDao salesItemDao;

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private RefundsItemDao refundsItemDao;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private RefundsDao refundsDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SalesBalanceDao salesBalanceDao;

	@Autowired
	private SalesBalanceItemDao salesBalanceItemDao;

	@Autowired
	private SalesActivityService salesActivityService;

	// 获取销售退货审批向信息
	@Override
	public List<ApprovalSalesRefundItemVO> queryApprovalSalesRefundItem(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		ApprovalSalesRefundPO approvalSalesRefundPO = approvalSalesRefundDao.queryApprovalSalesRefundByAId(approvalPO.getAid());

		if (approvalSalesRefundPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		List<ApprovalSalesRefundItemPO> approvalSalesRefundItemPOs = approvalSalesRefundItemDao.queryApprovalSalesRefundItemByAsrId(approvalSalesRefundPO.getAsrid());
		List<ApprovalSalesRefundItemVO> approvalSalesRefundItemVOs = new ArrayList<ApprovalSalesRefundItemVO>();

		ApprovalSalesRefundItemVO approvalSalesRefundItemVO;

		for (ApprovalSalesRefundItemPO approvalSalesRefundItemPO : approvalSalesRefundItemPOs) {

			approvalSalesRefundItemVO = new ApprovalSalesRefundItemVO(new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO()));

			BeanUtil.copyProperties(approvalSalesRefundItemPO, approvalSalesRefundItemVO, Arrays.asList("salesItem"));
			BeanUtil.copyProperties(approvalSalesRefundItemPO.getSalesItem(), approvalSalesRefundItemVO.getSalesItem(), Arrays.asList("goods", "color", "format"));
			BeanUtil.copyProperties(approvalSalesRefundItemPO.getSalesItem().getGoods(), approvalSalesRefundItemVO.getSalesItem().getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(approvalSalesRefundItemPO.getSalesItem().getColor(), approvalSalesRefundItemVO.getSalesItem().getColor());
			BeanUtil.copyProperties(approvalSalesRefundItemPO.getSalesItem().getFormat(), approvalSalesRefundItemVO.getSalesItem().getFormat());
			approvalSalesRefundItemVOs.add(approvalSalesRefundItemVO);
		}

		return approvalSalesRefundItemVOs;
	}

	// 提交销售退货审批
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForSalesRefund(ApprovalVO approvalVO, ApprovalSalesRefundVO approvalSalesRefundVO, List<ApprovalSalesRefundItemVO> approvalSalesRefundItemVOs, String userId, int company) throws FLException {

		long sid = approvalSalesRefundVO.getSid();

		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		ApprovalPO approvalPO = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_SALESREFUND_PAYMENT_INT, String.valueOf(sid));

		if (approvalPO != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		SalesPO salesPO = salesDao.get(sid);

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		// 判断销售单款项积分以及领取活动物品积分比较结果
		salesActivityService.checkSalesActivity(sid, approvalSalesRefundVO.getRefund());

		approvalPO = new ApprovalPO();

		BeanUtil.copyProperties(approvalVO, approvalPO, Arrays.asList("receiver", "sender"));

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		String refundType = approvalSalesRefundVO.getType() == SalesPO.STATUS_ALLBACK_SHORT ? "全退" : approvalSalesRefundVO.getType() == SalesPO.STATUS_DBACKORDER_SHORT ? "倒单" : "退货";
		String content = String.format("装修单号:%s,销售单号:%s,品牌:%s,退款金额:%.3f,类型:%s", salesPO.getOrderId(), salesPO.getNo(), salesPO.getBrand(), Arith.div(approvalSalesRefundVO.getRefund(), 1000.0), refundType);

		approvalPO = new ApprovalPO().init(sender, receiver, String.valueOf(sid), ApprovalPO.APPROVAL_TYPE_SALESREFUND_PAYMENT_INT, content, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		ApprovalSalesRefundPO approvalSalesRefundPO = new ApprovalSalesRefundPO();
		approvalSalesRefundPO.setAid(approvalPO.getAid());
		approvalSalesRefundPO.setSid(sid);
		approvalSalesRefundPO.setRefund(approvalSalesRefundVO.getRefund());
		approvalSalesRefundPO.setType(approvalSalesRefundVO.getType());

		approvalSalesRefundDao.save(approvalSalesRefundPO);

		for (ApprovalSalesRefundItemVO approvalSalesRefundItemVO : approvalSalesRefundItemVOs) {

			if (approvalSalesRefundItemVO == null)
				continue;

			SalesItemPO salesItemPO = salesItemDao.get(approvalSalesRefundItemVO.getSalesItem().getSiid());

			salesItemPO.setNum(Arith.sub(salesItemPO.getNum(), approvalSalesRefundItemVO.getNum()));
			salesItemPO.setTotal(Arith.sub(salesItemPO.getTotal(), approvalSalesRefundItemVO.getTotal()));

			salesItemDao.update(salesItemPO);

			ApprovalSalesRefundItemPO approvalSalesRefundItemPO = new ApprovalSalesRefundItemPO();

			approvalSalesRefundItemPO.setNum(approvalSalesRefundItemVO.getNum());// 退货数量
			approvalSalesRefundItemPO.setTotal(approvalSalesRefundItemVO.getTotal());// 退货金额
			approvalSalesRefundItemPO.setAsrid(approvalSalesRefundPO.getAsrid());
			approvalSalesRefundItemPO.setSid(sid);
			approvalSalesRefundItemPO.setSalesItem(salesItemPO);// 销售单型号信息类

			approvalSalesRefundItemDao.save(approvalSalesRefundItemPO);
		}

		return 0;
	}

	// 批准销售退款
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForSalesRefund(ApprovalPO approvalPO) throws FLException {

		ApprovalSalesRefundPO approvalSalesRefundPO = approvalSalesRefundDao.queryApprovalSalesRefundByAId(approvalPO.getAid());

		if (approvalSalesRefundPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		SalesPO salesPO = salesDao.get(approvalSalesRefundPO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		// 判断销售单款项积分以及领取活动物品积分比较结果
		salesActivityService.checkSalesActivity(approvalSalesRefundPO.getSid(), approvalSalesRefundPO.getRefund());

		long balance = 0;
		long allowance = 0;
		short balanceStatus = salesPO.getBalanceStatus();

		SalesPaymentPO salesPaymentPO = new SalesPaymentPO();

		salesPaymentPO.setSales(salesPO);
		salesPaymentPO.setCreater(approvalPO.getSender());
		salesPaymentPO.setCategory(salesPO.getCategory());
		salesPaymentPO.setReferMoney(approvalSalesRefundPO.getRefund());// 退款金额
		salesPaymentPO.setBrand(salesPO.getBrand());// 品牌
		salesPaymentPO.setStatus(SalesPO.STATUS_INIT_SHORT);
		salesPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salesPaymentPO.setType(SalesPaymentPO.TYPE_REFUNDS_INT);

		salesPaymentDao.save(salesPaymentPO);

		UserPO userPO = userDao.queryUserByUserId(approvalPO.getSender().getUserId());
		RefundsPO refundsPO = new RefundsPO();

		refundsPO.setSid(salesPO.getSid());
		refundsPO.setSpid(salesPaymentPO.getSpid());
		refundsPO.setCreater(userPO);
		refundsPO.setTotal(approvalSalesRefundPO.getRefund());
		refundsPO.setType(approvalSalesRefundPO.getType());
		refundsPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		refundsPO.setStatus(RefundsPO.STATUS_TYPE_REFUNDS_INT);
		refundsPO.setComment(approvalPO.getContents());

		refundsDao.save(refundsPO);

		List<Short> balanceStatuses = Arrays.asList(SalesPO.BALANCESTATUS_PRESETTLEMENT_SHORT, SalesPO.BALANCESTATUS_SETTLEMENT_SHORT, SalesPO.BALANCESTATUS_VENDORSETTLEMENT_SHORT);

		SalesBalancePO salesBalancePO = new SalesBalancePO();

		if (balanceStatuses.contains(balanceStatus)) { // 结算状态为预结算/厂商结算/结算

			salesBalancePO.setSales(salesPO);
			salesBalancePO.setRefunds(refundsPO);
			salesBalancePO.setCreater(approvalPO.getReceiver());
			salesBalancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			salesBalancePO.setTotal(Arith.sub(0, approvalSalesRefundPO.getRefund()));
			salesBalancePO.setBalance(balance);
			salesBalancePO.setVbalance(0);
			salesBalancePO.setPbalance(0);
			salesBalancePO.setType(balanceStatus == SalesPO.BALANCESTATUS_SETTLEMENT_SHORT ? SalesBalancePO.TYPE_BALANCEREFUNDS_INT : SalesBalancePO.TYPE_PREBALANCEREFUNDS_INT);
			salesBalancePO.setStatus(SalesBalancePO.STATUS_PREBALANCE_INT);
			salesBalancePO.setComment(salesPO.getComment());

			salesBalancePO.setSalesman(salesPO.getSalesman());
			salesBalancePO.setDept(salesPO.getSalesman().getDept());
			salesBalancePO.setRegion(salesPO.getSalesman().getDept().getFatherDept());

			salesBalanceDao.save(salesBalancePO);
		}

		List<ApprovalSalesRefundItemPO> approvalSalesRefundItemPOs = approvalSalesRefundItemDao.queryApprovalSalesRefundItemByAsrId(approvalSalesRefundPO.getAsrid());

		for (ApprovalSalesRefundItemPO approvalSalesRefundItemPO : approvalSalesRefundItemPOs) {

			SalesItemPO salesItemPO = approvalSalesRefundItemPO.getSalesItem();

			int price = salesItemPO.getPrice();// 折让价
			int disPrice = salesItemPO.getDisPrice();// 折扣价

			RefundsItemPO refundsItemPO = new RefundsItemPO();

			long num = approvalSalesRefundItemPO.getNum();// 退货数量
			long total = approvalSalesRefundItemPO.getTotal();// 退货金额

			BeanUtil.copyProperties(salesItemPO, refundsItemPO);
			refundsItemPO.setRid(refundsPO.getRid());
			refundsItemPO.setTotal(total);
			refundsItemPO.setNum(num);
			refundsItemPO.setSid(approvalSalesRefundItemPO.getSid());
			refundsItemPO.setSalesItem(approvalSalesRefundItemPO.getSalesItem());

			refundsItemDao.save(refundsItemPO);

			if (balanceStatuses.contains(balanceStatus)) { // 结算状态为预结算/厂商结算/结算

				short ctype = salesItemPO.getCtype(); // 0: 底价 , 1: 点位
				int cvalue = salesItemPO.getCvalue(); // 结算值

				if (ctype == SalesItemPO.CTYPE_RESERVEPRICE_INT) {
					// 0: 底价
					// 利润 = (折让价 - 底价) * 数量
					balance = Arith.sub(balance, Arith.mul(Arith.sub(price, cvalue), num));
				} else if (ctype == SalesItemPO.CTYPE_POINT_INT) { //
					// 1: 点位
					// 利润 = (折让价 - 折扣价 * (1 - 点位)) * 数量
					// 利润 = (折让价 - 折扣价 + 折扣价 *点位) * 数量
					balance = Arith.sub(balance, Arith.mul(Arith.sub(Arith.mul(disPrice, cvalue), Arith.sub(disPrice, price)), num));
				}

				SalesBalanceItemPO salesBalanceItemPO = new SalesBalanceItemPO();
				salesBalanceItemPO.setCtype(salesItemPO.getCtype());
				salesBalanceItemPO.setCvalue(cvalue);
				salesBalanceItemPO.setNum(approvalSalesRefundItemPO.getNum());
				salesBalanceItemPO.setRawCvalue(salesItemPO.getRawCvalue());
				salesBalanceItemPO.setSalesItem(salesItemPO);
				salesBalanceItemPO.setRawCtype(salesItemPO.getRawCtype());
				salesBalanceItemPO.setSbid(salesBalancePO.getSbid());
				salesBalanceItemPO.setTotal(Arith.sub(0, approvalSalesRefundItemPO.getTotal()));

				salesBalanceItemDao.save(salesBalanceItemPO);
			}

			allowance = Arith.sub(allowance, Arith.mul(Arith.sub(salesItemPO.getDisPrice(), salesItemPO.getPrice()), num));
		}

		if (balanceStatuses.contains(balanceStatus)) { // 结算状态为预结算/厂商结算/结算

			long vbalance = Arith.sub(Arith.round(-refundsPO.getTotal(), 0, Arith.ROUND_FLOOR), Arith.round(balance, 0, Arith.ROUND_CEILING));

			salesBalancePO.setAllowance(allowance);
			salesBalancePO.setBalance(balance);
			salesBalancePO.setOnetype(approvalSalesRefundPO.getType());

			salesBalancePO.setVbalance(vbalance);
			salesBalancePO.setPbalance(vbalance);

			salesBalanceDao.update(salesBalancePO);
		}

		if (approvalSalesRefundPO.getType() != ApprovalSalesRefundPO.TYPE_REFUND_INT) {
			salesPO.setStatus(approvalSalesRefundPO.getType());
		}

		salesPO.setAmount(salesItemDao.countSalesItemForAmount(salesPO.getSid()));

		salesDao.update(salesPO);

		return 0;
	}

	// 拒绝销售退款
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refuseForSalesRefund(ApprovalPO approvalPO) throws FLException {

		ApprovalSalesRefundPO approvalSalesRefundPO = approvalSalesRefundDao.queryApprovalSalesRefundByAId(approvalPO.getAid());

		if (approvalSalesRefundPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		SalesPO salesPO = salesDao.get(approvalSalesRefundPO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		salesPO.setStatus(SalesPO.STATUS_INIT_SHORT);

		salesDao.update(salesPO);

		List<ApprovalSalesRefundItemPO> approvalSalesRefundItemPOs = approvalSalesRefundItemDao.queryApprovalSalesRefundItemByAsrId(approvalSalesRefundPO.getAsrid());

		for (ApprovalSalesRefundItemPO approvalSalesRefundItemPO : approvalSalesRefundItemPOs) {
			SalesItemPO salesItemPO = salesItemDao.get(approvalSalesRefundItemPO.getSalesItem().getSiid());

			salesItemPO.setNum(Arith.add(salesItemPO.getNum(), approvalSalesRefundItemPO.getNum()));
			salesItemPO.setTotal(Arith.add(salesItemPO.getTotal(), approvalSalesRefundItemPO.getTotal()));

			salesItemDao.update(salesItemPO);
		}

		return 0;
	}

}
