package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalSalesRefundDao;
import com.fanglin.approval.dao.ApprovalSalesRefundItemDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.po.ApprovalSalesRefundAO;
import com.fanglin.approval.po.ApprovalSalesRefundItemPO;
import com.fanglin.approval.po.ApprovalSalesRefundPO;
import com.fanglin.approval.service.ApprovalSalesRefundService;
import com.fanglin.approval.vo.ApprovalSalesRefundItemVO;
import com.fanglin.approval.vo.ApprovalSalesRefundVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.decoration.service.DecorationAdditionService;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.dingding.service.DingTalkApprovalService;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.payment.service.SalesPaymentService;
import com.fanglin.payment.vo.SalesPaymentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesItemDao;
import com.fanglin.sales.dao.SalesRefundsDao;
import com.fanglin.sales.dao.SalesRefundsItemDao;
import com.fanglin.sales.po.SalesItemPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.po.SalesRefundsItemPO;
import com.fanglin.sales.po.SalesRefundsPO;
import com.fanglin.sales.service.SalesActivityService;
import com.fanglin.sales.service.SalesBalanceService;
import com.fanglin.sales.vo.SalesBalanceVO;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.sales.vo.SalesRefundsVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

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
	private SalesRefundsDao salesRefundsDao;

	@Autowired
	private SalesRefundsItemDao salesRefundsItemDao;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SalesPaymentService salesPaymentService;

	@Autowired
	private SalesBalanceService salesBalanceService;

	@Autowired
	private SalesActivityService salesActivityService;

	@Autowired
	private DingTalkApprovalService approvalService;

	@Autowired
	private DecorationAdditionService decorationAdditionService;

	@Override
	public void pageApprovalSalesRefund(Paging paging, List<Filter> filters, int company) throws FLException {

		List<ApprovalSalesRefundAO> approvalSalesRefundAOs = approvalSalesRefundDao.pageApprovalSalesRefund(paging, filters, company);
		List<ApprovalSalesRefundVO> approvalSalesRefundVOs = new ArrayList<ApprovalSalesRefundVO>();

		for (ApprovalSalesRefundAO approvalSalesRefundAO : approvalSalesRefundAOs) {

			ApprovalSalesRefundVO approvalSalesRefundVO = new ApprovalSalesRefundVO();

			approvalSalesRefundVO.setApproval(new ApprovalVO(new UserBaseVO(), new UserBaseVO()));
			approvalSalesRefundVO.setSales(new SalesVO(new HouseVO(new VillageVO(new CityProperVO(new CityVO()))), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO(), new BrandVO()));

			approvalSalesRefundVOs.add(approvalSalesRefundAO.ptv(approvalSalesRefundVO));
		}

		paging.setData(approvalSalesRefundVOs);
	}

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
	public int submitApprovalForSalesRefund(ApprovalVO approvalVO, ApprovalSalesRefundVO approvalSalesRefundVO, List<ApprovalSalesRefundItemVO> approvalSalesRefundItemVOs, String userId, int company, String code, String forms) throws FLException {

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

		if (salesPO.getAmount() < approvalSalesRefundVO.getRefund()) throw new FLException(370003, "销售总额不足");

		// 判断销售单款项积分以及领取活动物品积分比较结果
		salesActivityService.checkSalesActivity(sid, approvalSalesRefundVO.getRefund());

		approvalPO = new ApprovalPO();

		BeanUtil.copyProperties(approvalVO, approvalPO, Arrays.asList("receiver", "sender"));

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		String refundType = approvalSalesRefundVO.getType() == SalesPO.STATUS_ALLBACK_SHORT ? "全退" : approvalSalesRefundVO.getType() == SalesPO.STATUS_DBACKORDER_SHORT ? "倒单" : "退货";
		String content = String.format("装修单号:%s,销售单号:%s,品牌:%s,退款金额:%.3f,类型:%s", salesPO.getOrderId(), salesPO.getNo(), salesPO.getBrand().getName(), Arith.div(approvalSalesRefundVO.getRefund(), 1000.0), refundType);

		approvalPO = new ApprovalPO().init(sender, receiver, salesPO.getOrderId(), String.valueOf(sid), ApprovalPO.APPROVAL_TYPE_SALESREFUND_PAYMENT_INT, content, approvalVO.getComment(), company);

		approvalDao.save(approvalPO);

		ApprovalSalesRefundPO approvalSalesRefundPO = new ApprovalSalesRefundPO();
		approvalSalesRefundPO.setAid(approvalPO.getAid());
		approvalSalesRefundPO.setSid(sid);
		approvalSalesRefundPO.setRefund(approvalSalesRefundVO.getRefund());
		approvalSalesRefundPO.setType(approvalSalesRefundVO.getType());

		approvalSalesRefundDao.save(approvalSalesRefundPO);

		List<Long> psiids = new ArrayList<Long>();

		for (ApprovalSalesRefundItemVO approvalSalesRefundItemVO : approvalSalesRefundItemVOs) {

			if (approvalSalesRefundItemVO == null) continue;

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

			if (salesItemPO.getPsiid() != 0 && !psiids.contains(salesItemPO.getPsiid())) psiids.add(salesItemPO.getPsiid());
		}

		for (Long siid : psiids) {
			SalesItemPO salesItemPO = salesItemDao.get(siid);

			if (salesItemPO == null) continue;

			ApprovalSalesRefundItemPO approvalSalesRefundItemPO = new ApprovalSalesRefundItemPO();

			approvalSalesRefundItemPO.setNum(0);// 退货数量
			approvalSalesRefundItemPO.setTotal(approvalSalesRefundVO.getRefund());// 退货金额
			approvalSalesRefundItemPO.setAsrid(approvalSalesRefundPO.getAsrid());
			approvalSalesRefundItemPO.setSid(sid);
			approvalSalesRefundItemPO.setSalesItem(salesItemPO);// 销售单型号信息类

			approvalSalesRefundItemDao.save(approvalSalesRefundItemPO);

			salesItemPO.setTotal(Arith.sub(salesItemPO.getTotal(), approvalSalesRefundVO.getRefund()));

			salesItemDao.update(salesItemPO);
		}

		if (code != null && !"".equals(code)) {
			String piid = approvalService.initiateApproval(code, userId, null, null, null, JSONArray.parseArray(forms), company);

			approvalPO.setPiid(piid);

			approvalDao.update(approvalPO);
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

		UserPO userPO = userDao.queryUserByUserId(approvalPO.getSender().getUserId());

		SalesRefundsPO salesRefundsPO = new SalesRefundsPO();

		salesRefundsPO.setSales(salesPO);
		salesRefundsPO.setCreater(userPO);
		salesRefundsPO.setTotal(approvalSalesRefundPO.getRefund());
		salesRefundsPO.setType(approvalSalesRefundPO.getType());
		salesRefundsPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salesRefundsPO.setStatus(SalesRefundsPO.STATUS_TYPE_REFUNDS_INT);
		salesRefundsPO.setIsAffirm(SalesRefundsPO.ISAFFIRM_NONE_INT);
		salesRefundsPO.setComment(approvalPO.getComment());

		salesRefundsDao.save(salesRefundsPO);

		List<ApprovalSalesRefundItemPO> approvalSalesRefundItemPOs = approvalSalesRefundItemDao.queryApprovalSalesRefundItemByAsrId(approvalSalesRefundPO.getAsrid());

		for (ApprovalSalesRefundItemPO approvalSalesRefundItemPO : approvalSalesRefundItemPOs) {

			SalesItemPO salesItemPO = approvalSalesRefundItemPO.getSalesItem();

			SalesRefundsItemPO salesRefundsItemPO = new SalesRefundsItemPO();

			long num = approvalSalesRefundItemPO.getNum();// 退货数量
			long total = approvalSalesRefundItemPO.getTotal();// 退货金额

			BeanUtil.copyProperties(salesItemPO, salesRefundsItemPO);
			salesRefundsItemPO.setRid(salesRefundsPO.getRid());
			salesRefundsItemPO.setTotal(total);
			salesRefundsItemPO.setNum(num);
			salesRefundsItemPO.setSid(approvalSalesRefundItemPO.getSid());
			salesRefundsItemPO.setSalesItem(approvalSalesRefundItemPO.getSalesItem());

			salesRefundsItemDao.save(salesRefundsItemPO);
		}

		if (approvalSalesRefundPO.getType() != ApprovalSalesRefundPO.TYPE_REFUND_INT) {
			salesPO.setStatus(approvalSalesRefundPO.getType());
		}

		salesPO.setAmount(salesItemDao.amountSalesItem(salesPO.getSid()));

		salesDao.update(salesPO);

		decorationAdditionService.updateDecorationForSaleScale(new DecorationVO(salesPO.getOrderId()));

		SalesPaymentPO salesPaymentPO = salesPaymentDao.querySalesPaymentByRid(salesRefundsPO.getRid());

		if (salesPaymentPO != null) {
			return 0;
		}

		if (salesPO.getType() == SalesPO.TYPE_INIT_INT) return 0;

		SalesPaymentVO salesPaymentVO = new SalesPaymentVO();

		salesPaymentVO.setSales(new SalesVO(salesRefundsPO.getSales().getSid()));
		salesPaymentVO.setSalesRefunds(new SalesRefundsVO(salesRefundsPO.getRid()));
		salesPaymentVO.setReferMoney(salesRefundsPO.getTotal());

		salesPaymentService.addSalesPaymentForRefunds(salesPaymentVO, salesRefundsPO.getCreater().getUserId());

		salesRefundsPO.setSpid(salesPaymentVO.getSpid());

		salesRefundsDao.update(salesRefundsPO);

		SalesBalanceVO salesBalanceVO = new SalesBalanceVO();

		salesBalanceVO.setSales(new SalesVO(salesRefundsPO.getSales().getSid()));
		salesBalanceVO.setRefunds(new SalesRefundsVO(salesRefundsPO.getRid()));

		salesBalanceService.refundSalesBalance(salesBalanceVO, salesRefundsPO.getCreater().getUserId());

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
