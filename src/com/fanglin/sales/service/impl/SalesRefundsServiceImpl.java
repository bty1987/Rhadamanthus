package com.fanglin.sales.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.service.BalanceSalesBalanceService;
import com.fanglin.balance.vo.BalanceSalesBalanceVO;
import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.dao.SalesReceiptDao;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.payment.po.SalesReceiptPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.sales.dao.SalesBalanceDao;
import com.fanglin.sales.dao.SalesBalanceItemDao;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesRefundsDao;
import com.fanglin.sales.dao.SalesRefundsItemDao;
import com.fanglin.sales.po.SalesBalanceItemPO;
import com.fanglin.sales.po.SalesBalancePO;
import com.fanglin.sales.po.SalesItemPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.po.SalesRefundsItemPO;
import com.fanglin.sales.po.SalesRefundsPO;
import com.fanglin.sales.service.SalesRefundsService;
import com.fanglin.sales.vo.SalesBalanceVO;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.sales.vo.SalesRefundsItemVO;
import com.fanglin.sales.vo.SalesRefundsVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.wechat.service.WeChatAppService;
import com.fanglin.wechat.vo.WeChatPhoneInfoVO;

@Service("SalesRefundsService")
@Transactional(readOnly = true)
public class SalesRefundsServiceImpl implements SalesRefundsService {

	@Autowired
	private SalesRefundsDao salesRefundsDao;

	@Autowired
	private SalesRefundsItemDao salesRefundsItemDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private WeChatAppService weChatAppService;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private SalesReceiptDao salesReceiptDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private SalesBalanceDao salesBalanceDao;

	@Autowired
	private SalesBalanceItemDao salesBalanceItemDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private BalanceSalesBalanceService balanceSalesBalanceService;

	@Override
	public void pageSalesRefunds(Paging paging, List<Filter> filters) throws FLException {

		List<SalesRefundsVO> refundsVOs = new ArrayList<SalesRefundsVO>();
		List<SalesRefundsPO> refundsPOs = salesRefundsDao.pageSalesRefunds(paging, filters);

		for (SalesRefundsPO refundsPO : refundsPOs) {
			refundsVOs.add(refundsPO.ptv(new SalesRefundsVO(new UserVO(), new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new BrandVO()))));
		}

		paging.setData(refundsVOs);
	}

	@Override
	public List<SalesRefundsVO> querySalesRefundsBySid(SalesRefundsVO refundsVO) {

		List<SalesRefundsVO> refundsVOs = new ArrayList<SalesRefundsVO>();
		List<SalesRefundsPO> refundsPOs = salesRefundsDao.querySalesRefundsBySid(refundsVO.getSales().getSid());

		for (SalesRefundsPO refundsPO : refundsPOs) {
			refundsVOs.add(refundsPO.ptv(new SalesRefundsVO(new UserVO(), new SalesVO())));
		}

		return refundsVOs;
	}

	@Override
	public SalesRefundsVO querySalesRefundsByRid(SalesRefundsVO refundsVO) {

		SalesRefundsPO refundsPO = salesRefundsDao.get(refundsVO.getRid());

		return refundsPO.ptv(new SalesRefundsVO(new UserVO(), new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new BrandVO())));
	}

	@Override
	public List<SalesRefundsItemVO> querySalesRefundsItemBySid(SalesRefundsVO refundsVO) {

		List<SalesRefundsItemPO> refundsItemPOs = salesRefundsItemDao.querySalesRefundsItemBySid(refundsVO.getSales().getSid());
		List<SalesRefundsItemVO> refundsItemVOs = new ArrayList<SalesRefundsItemVO>();

		for (SalesRefundsItemPO refundsItemPO : refundsItemPOs) {
			refundsItemVOs.add(refundsItemPO.ptv(new SalesRefundsItemVO(new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO()))));
		}

		return refundsItemVOs;
	}

	@Override
	public List<SalesRefundsItemVO> querySalesRefundsItemByRid(SalesRefundsVO refundsVO) {

		List<SalesRefundsItemPO> refundsItemPOs = salesRefundsItemDao.querySalesRefundsItemByRid(refundsVO.getRid());
		List<SalesRefundsItemVO> refundsItemVOs = new ArrayList<SalesRefundsItemVO>();

		for (SalesRefundsItemPO refundsItemPO : refundsItemPOs) {
			refundsItemVOs.add(refundsItemPO.ptv(new SalesRefundsItemVO(new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO()))));
		}

		return refundsItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int sendSalesRefunds(SalesRefundsVO refundsVO, String userId) throws FLException {

		SalesRefundsPO salesRefundsPO = salesRefundsDao.get(refundsVO.getRid());

		if (salesRefundsPO == null) {
			throw new FLException(370016, "退货单不存在");
		}

		SalesPO salesPO = salesDao.get(salesRefundsPO.getSales().getSid());

		if (salesPO == null) {
			throw new FLException(370001, "销售单不存在");
		}

		String orderId = salesPO.getOrderId();

		UserPO sender = userDao.queryUserByUserId(userId);

		System.out.println(String.format("pages/sales/refunds/refunds?sid=%s&rid=%s&orderId=%s", salesPO.getSid(), refundsVO.getRid(), orderId));

		decorationService.sendMessage(orderId, "装修单", String.format("装修单号: %s, 退货单信息确认. ", orderId), String.format("pages/sales/refunds/refunds?sid=%s&rid=%s&orderId=%s", salesPO.getSid(), refundsVO.getRid(), orderId), sender);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int affirmSalesRefunds(SalesRefundsVO refundsVO, String securityCode, String verifyCode, String phoneCode, String company) throws FLException {

		if (securityCode != null && verifyCode != null && !FormatUtil.checkVode(verifyCode, securityCode)) {
			throw new FLException(330012, "验证失败,请重新验证");
		}

		SalesRefundsPO salesRefundsPO = salesRefundsDao.get(refundsVO.getRid());

		if (salesRefundsPO == null) {
			throw new FLException(370016, "退货单不存在");
		}

		SalesPO salesPO = salesDao.get(salesRefundsPO.getSales().getSid());

		if (salesPO == null) {
			throw new FLException(370001, "销售单不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(salesPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (refundsVO.getSales() == null && refundsVO.getSales().getCustomer() == null) {
			throw new FLException(130002, "客户不存在");
		}

		WeChatPhoneInfoVO weChatPhoneInfoVO = null;

		if (phoneCode != null) {
			weChatPhoneInfoVO = weChatAppService.queryPhoneInfo(phoneCode, company);
		}

		if (weChatPhoneInfoVO != null && weChatPhoneInfoVO.getPhoneNumber() != null) {
			refundsVO.getSales().getCustomer().setPhone(weChatPhoneInfoVO.getPhoneNumber());
		}

		if (refundsVO.getSales().getCustomer().getPhone() != null && !decorationPO.getCustomer().getPhone().equals(FormatUtil.encodePhone(refundsVO.getSales().getCustomer().getPhone()))) {
			throw new FLException(130115, "客户电话不匹配");
		}

		com.fanglin.customer.vo.DecorationVO cusDecorationVO = new com.fanglin.customer.vo.DecorationVO();

		cusDecorationVO.setOrderId(decorationPO.getOrderId());
		cusDecorationVO.setUnionId(refundsVO.getSales().getCustomer().getNo());

		if (refundsVO.getSales().getCustomer().getNo() != null && decorationService.queryDecoration(cusDecorationVO).getOrderId() == null) {
			throw new FLException(330017, "装修单未绑定");
		}

		UserPO operater = salesRefundsPO.getCreater();

		SalesPaymentPO salesPaymentPO = new SalesPaymentPO();

		salesPaymentPO.setSales(salesPO);
		salesPaymentPO.setOrderId(salesPO.getOrderId());
		salesPaymentPO.setCreater(operater);
		salesPaymentPO.setCategory(salesPO.getCategory());
		salesPaymentPO.setReferMoney(salesRefundsPO.getTotal());// 退款金额
		salesPaymentPO.setBrand(salesPO.getBrand().getName());// 品牌
		salesPaymentPO.setStatus(SalesPO.STATUS_INIT_SHORT);
		salesPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salesPaymentPO.setType(SalesPaymentPO.TYPE_REFUNDS_INT);

		salesPaymentPO.setSalesRefunds(salesRefundsPO);

		salesPaymentDao.save(salesPaymentPO);
		salesPaymentDao.flush();

		salesRefundsPO.setSpid(salesPaymentPO.getSpid());

		salesRefundsPO.setIsAffirm(SalesRefundsPO.ISAFFIRM_AFFIRM_INT);
		salesRefundsPO.setAffirmTime(DateUtil.getDateToTimestamp(new Date()));

		salesRefundsDao.update(salesRefundsPO);

		short balanceStatus = salesPO.getBalanceStatus();

		if (salesPO.getType() == SalesPO.TYPE_PROFIT_INT) {

			Timestamp current = DateUtil.getDateToTimestamp(new Date());

			SalesReceiptPO salesReceiptPO = new SalesReceiptPO();

			salesReceiptPO.setCollecter(operater);
			salesReceiptPO.setCollecterName(operater.getUserName());
			salesReceiptPO.setCollectTime(current);
			salesReceiptPO.setConfirmer(operater);
			salesReceiptPO.setConfirmerName(operater.getUserName());
			salesReceiptPO.setConfirmTime(current);
			salesReceiptPO.setBankInfo("");
			salesReceiptPO.setCheckvBank("");
			salesReceiptPO.setCouponInfo("");
			salesReceiptPO.setComment("");
			salesReceiptPO.setRealMoney(salesPO.getTotal());

			salesReceiptDao.save(salesReceiptPO);

			salesPaymentPO.setOrderId(salesPO.getOrderId());
			salesPaymentPO.setSalesReceipt(salesReceiptPO);

			salesPaymentPO.setStatus(SalesPaymentPO.STATUS_CONFIRMED_INT);
			salesPaymentPO.setCategory(salesPO.getCategory());
			salesPaymentPO.setBrand(salesPO.getBrand().getName());
			salesPaymentPO.setCreater(operater);
			salesPaymentPO.setCreateTime(current);
			salesPaymentPO.setReferMoney(Math.abs(salesPO.getTotal()));
			salesPaymentPO.setCompany(salesPO.getCompany());

			salesPaymentDao.update(salesPaymentPO);
		}

		List<Short> balanceStatuses = Arrays.asList(SalesPO.BALANCESTATUS_PRESETTLEMENT_SHORT, SalesPO.BALANCESTATUS_SETTLEMENT_SHORT, SalesPO.BALANCESTATUS_VENDORSETTLEMENT_SHORT);

		// 准备工作：查询所有退货项并按品牌分组
		List<SalesRefundsItemPO> salesRefundItemPOs = salesRefundsItemDao.querySalesRefundsItemByRid(salesRefundsPO.getRid());

		// 按品牌分组退货项
		Map<Long, List<SalesRefundsItemPO>> brandRefundItemsMap = new HashMap<Long, List<SalesRefundsItemPO>>();
		for (SalesRefundsItemPO salesRefundItemPO : salesRefundItemPOs) {
			SalesItemPO salesItemPO = salesRefundItemPO.getSalesItem();

			// 跳过套餐项
			if (salesItemPO.getPsiid() == 0 && salesItemPO.getType() == SalesItemPO.TYPE_PACKAGE_INT) continue;

			long bid = salesItemPO.getGoods().getBid();

			// 将退货项添加到对应品牌的列表中
			if (!brandRefundItemsMap.containsKey(bid)) {
				brandRefundItemsMap.put(bid, new ArrayList<SalesRefundsItemPO>());
			}
			brandRefundItemsMap.get(bid).add(salesRefundItemPO);
		}

		// 创建品牌维度的结算单映射
		Map<Long, SalesBalancePO> brandBalanceMap = new HashMap<Long, SalesBalancePO>();

		// 为每个品牌创建对应的退货结算数据
		for (Map.Entry<Long, List<SalesRefundsItemPO>> entry : brandRefundItemsMap.entrySet()) {
			Long bid = entry.getKey();
			List<SalesRefundsItemPO> brandRefundItems = entry.getValue();

			// 创建该品牌的退款结算单
			SalesBalancePO salesBalancePO = new SalesBalancePO();

			if (balanceStatuses.contains(balanceStatus)) { // 结算状态为预结算/厂商结算/结算
				salesBalancePO.setSales(salesPO);
				salesBalancePO.setRefunds(salesRefundsPO);
				salesBalancePO.setCreater(operater);
				salesBalancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

				salesBalancePO.setType(balanceStatus == SalesPO.BALANCESTATUS_SETTLEMENT_SHORT ? SalesBalancePO.TYPE_BALANCEREFUNDS_INT : SalesBalancePO.TYPE_PREBALANCEREFUNDS_INT);
				salesBalancePO.setOnetype(salesRefundsPO.getType());
				salesBalancePO.setStatus(SalesBalancePO.STATUS_PREBALANCE_INT);

				salesBalancePO.setSalesman(salesPO.getSalesman());
				salesBalancePO.setDept(salesPO.getSalesman().getDept());
				salesBalancePO.setRegion(salesPO.getSalesman().getDept().getFatherDept());

				BrandPO brandPO = brandDao.get(bid);

				if (brandPO == null) continue;

				salesBalancePO.setBrand(brandPO);
				salesBalancePO.setCompany(brandPO.getCompany());

				// 初始化金额
				long brandTotal = 0;
				long brandBalance = 0;
				long brandAllowance = 0;

				// 计算该品牌的各项金额
				for (SalesRefundsItemPO salesRefundItemPO : brandRefundItems) {
					SalesItemPO salesItemPO = salesRefundItemPO.getSalesItem();

					int price = salesItemPO.getPrice();// 折让价
					int disPrice = salesItemPO.getDisPrice();// 折扣价
					long num = salesRefundItemPO.getNum();// 退货数量

					// 计算结算金额（负值）
					short ctype = salesItemPO.getCtype();
					int cvalue = salesItemPO.getCvalue();

					if (ctype == SalesItemPO.CTYPE_RESERVEPRICE_INT) {
						// 0: 底价
						brandBalance = Arith.sub(brandBalance, Arith.mul(Arith.sub(price, cvalue), num));
					} else if (ctype == SalesItemPO.CTYPE_POINT_INT) {
						// 1: 点位
						brandBalance = Arith.sub(brandBalance, Arith.mul(Arith.sub(Arith.mul(disPrice, cvalue), Arith.sub(disPrice, price)), num));
					}

					// 累加优惠金额
					brandAllowance = Arith.sub(brandAllowance, Arith.mul(Arith.sub(salesItemPO.getDisPrice(), salesItemPO.getPrice()), num));

					// 累加总金额
					brandTotal = Arith.sub(brandTotal, salesRefundItemPO.getTotal());
				}

				// 计算应付和实付金额
				long vbalance = Arith.sub(Arith.round(brandTotal, 0, Arith.ROUND_DOWN), Arith.round(brandBalance, 0, Arith.ROUND_DOWN));

				// 设置金额信息

				if (brandRefundItemsMap.keySet().size() == 1) { // 非套餐
					salesBalancePO.setTotal(Arith.sub(0, salesRefundsPO.getTotal()));
				} else {
					salesBalancePO.setTotal(Arith.round(brandTotal, 0, Arith.ROUND_HALF_UP));
				}

				salesBalancePO.setBalance(Arith.round(brandBalance, 0, Arith.ROUND_HALF_UP));
				salesBalancePO.setAllowance(brandAllowance);
				salesBalancePO.setVbalance(vbalance);
				salesBalancePO.setPbalance(vbalance);
				salesBalancePO.setRate(1000);

				salesBalanceDao.save(salesBalancePO);

				brandBalanceMap.put(bid, salesBalancePO);

				SystemConfigPO taggle = systemConfigDao.querySystemConfig("SALES_AUTO_BALANCE_INT", salesPO.getCompany());

				int count = salesBalanceDao.countSalesBalance(salesPO.getSid(), SalesBalancePO.TYPE_INIT_INT, SalesBalancePO.ONETYPE_INIT_INT, SalesBalancePO.CHECKSTATUS_CHECK_INT);

				if (taggle != null && taggle.getValue() != null && count > 0) {
					balanceSalesBalanceService.submitBalanceSalesBalance(null, new BalanceSalesBalanceVO(new SalesBalanceVO(salesBalancePO.getSbid())), operater.getUserId(), salesPO.getCompany());
				}
			}
		}

		for (SalesRefundsItemPO salesRefundItemPO : salesRefundItemPOs) {

			SalesItemPO salesItemPO = salesRefundItemPO.getSalesItem();

			if (balanceStatuses.contains(balanceStatus)) { // 结算状态为预结算/厂商结算/结算
				// 获取该品牌对应的结算单
				long bid = salesItemPO.getGoods().getBid();
				SalesBalancePO brandSalesBalancePO = brandBalanceMap.get(bid);

				if (brandSalesBalancePO != null) {
					SalesBalanceItemPO salesBalanceItemPO = new SalesBalanceItemPO();
					salesBalanceItemPO.setCtype(salesItemPO.getCtype());
					salesBalanceItemPO.setCvalue(salesItemPO.getCvalue());
					salesBalanceItemPO.setNum(salesRefundItemPO.getNum());
					salesBalanceItemPO.setRawCvalue(salesItemPO.getRawCvalue());
					salesBalanceItemPO.setSalesItem(salesItemPO);
					salesBalanceItemPO.setRawCtype(salesItemPO.getRawCtype());
					salesBalanceItemPO.setSbid(brandSalesBalancePO.getSbid());
					salesBalanceItemPO.setTotal(Arith.sub(0, salesRefundItemPO.getTotal()));

					salesBalanceItemDao.save(salesBalanceItemPO);
				}
			}
		}

		return 0;
	}

}
