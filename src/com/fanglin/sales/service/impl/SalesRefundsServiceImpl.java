package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.payment.service.SalesPaymentService;
import com.fanglin.payment.vo.SalesPaymentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesRefundsDao;
import com.fanglin.sales.dao.SalesRefundsItemDao;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.po.SalesRefundsItemPO;
import com.fanglin.sales.po.SalesRefundsPO;
import com.fanglin.sales.service.SalesBalanceService;
import com.fanglin.sales.service.SalesRefundsService;
import com.fanglin.sales.vo.SalesBalanceVO;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.sales.vo.SalesRefundsItemVO;
import com.fanglin.sales.vo.SalesRefundsVO;
import com.fanglin.sales.vo.SalesVO;
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
	private SalesPaymentService salesPaymentService;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private SalesBalanceService salesBalanceService;

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
	public int affirmSalesRefunds(SalesRefundsVO refundsVO, String securityCode, String verifyCode, String phoneCode, String company, String userId) throws FLException {

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

		if (salesRefundsPO.getIsAffirm() == SalesRefundsPO.ISAFFIRM_AFFIRM_INT) {
			return 0;
		}

		UserPO operater = salesRefundsPO.getCreater();

		// 查询确认人信息
		UserPO affirmer = userDao.queryUserByUserId(userId);
		if (affirmer != null) {
			salesRefundsPO.setAffirmer(affirmer);
		}

		salesRefundsPO.setIsAffirm(SalesRefundsPO.ISAFFIRM_AFFIRM_INT);
		salesRefundsPO.setAffirmTime(DateUtil.getDateToTimestamp(new Date()));

		salesRefundsDao.update(salesRefundsPO);

		SalesPaymentPO salesPaymentPO = salesPaymentDao.querySalesPaymentByRid(salesRefundsPO.getRid());

		if (salesPaymentPO != null) {
			return 0;
		}

		if (salesPO.getType() == SalesPO.TYPE_PROFIT_INT) return 0;

		SalesPaymentVO salesPaymentVO = new SalesPaymentVO();

		salesPaymentVO.setSales(new SalesVO(salesRefundsPO.getSales().getSid()));
		salesPaymentVO.setSalesRefunds(new SalesRefundsVO(salesRefundsPO.getRid()));
		salesPaymentVO.setReferMoney(salesRefundsPO.getTotal());

		salesPaymentService.addSalesPaymentForRefunds(salesPaymentVO, operater.getUserId());

		salesRefundsPO.setSpid(salesPaymentVO.getSpid());

		salesRefundsDao.update(salesRefundsPO);

		SalesBalanceVO salesBalanceVO = new SalesBalanceVO();

		salesBalanceVO.setSales(new SalesVO(salesRefundsPO.getSales().getSid()));
		salesBalanceVO.setRefunds(new SalesRefundsVO(salesRefundsPO.getRid()));

		salesBalanceService.refundSalesBalance(salesBalanceVO, salesRefundsPO.getCreater().getUserId());

		return 0;
	}
}
