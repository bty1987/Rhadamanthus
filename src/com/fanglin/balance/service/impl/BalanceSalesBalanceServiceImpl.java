package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceDao;
import com.fanglin.balance.dao.BalanceSalesBalanceDao;
import com.fanglin.balance.dao.BalanceSalesDao;
import com.fanglin.balance.po.BalancePO;
import com.fanglin.balance.po.BalanceSalesBalancePO;
import com.fanglin.balance.po.BalanceSalesPO;
import com.fanglin.balance.service.BalanceSalesBalanceService;
import com.fanglin.balance.service.BalanceSalesService;
import com.fanglin.balance.vo.BalanceSalesBalanceVO;
import com.fanglin.balance.vo.BalanceSalesVO;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesBalanceDao;
import com.fanglin.sales.po.SalesBalancePO;
import com.fanglin.sales.vo.SalesBalanceVO;
import com.fanglin.sales.vo.SalesRefundsVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("balanceSalesBalanceService")
@Transactional(readOnly = true)
public class BalanceSalesBalanceServiceImpl implements BalanceSalesBalanceService {

	@Autowired
	private BalanceSalesBalanceDao balanceSalesBalanceDao;

	@Autowired
	private BalanceSalesDao balanceSalesDao;

	@Autowired
	private SalesBalanceDao salesBalanceDao;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private BalanceDao balanceDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private BalanceSalesService balanceSalesService;

	@Override
	public void pageBalanceSalesBalance(Paging paging, List<Filter> filters, BalanceSalesBalanceVO balanceSalesBalance) throws FLException {

		List<BalanceSalesBalancePO> balanceSalesBalancePOs = balanceSalesBalanceDao.pageBalanceSalesBalance(paging, filters, balanceSalesBalance.getBsid());
		List<BalanceSalesBalanceVO> balanceSalesBalanceVOs = new ArrayList<BalanceSalesBalanceVO>();

		for (BalanceSalesBalancePO balanceSalesBalancePO : balanceSalesBalancePOs) {
			balanceSalesBalanceVOs.add(balanceSalesBalancePO.ptv(new BalanceSalesBalanceVO(new SalesBalanceVO(new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new BrandVO()), new SalesRefundsVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO()))));
		}

		paging.setData(balanceSalesBalanceVOs);
	}

	@Override
	public List<BalanceSalesBalanceVO> queryBalanceSalesBalance(BalanceSalesBalanceVO balanceSalesBalance) {

		List<BalanceSalesBalancePO> balanceSalesBalancePOs = balanceSalesBalanceDao.queryBalanceSalesBalance(balanceSalesBalance.getBsid());
		List<BalanceSalesBalanceVO> balanceSalesBalanceVOs = new ArrayList<BalanceSalesBalanceVO>();

		for (BalanceSalesBalancePO balanceSalesBalancePO : balanceSalesBalancePOs) {
			balanceSalesBalanceVOs.add(balanceSalesBalancePO.ptv(new BalanceSalesBalanceVO(new SalesBalanceVO(new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new BrandVO()), new SalesRefundsVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO()))));
		}

		return balanceSalesBalanceVOs;
	}

	@Override
	public int countBalanceSalesBalance(BalanceSalesVO balanceSales) {
		return balanceSalesBalanceDao.countBalanceSalesBalance(balanceSales.getBsid());
	}

	@Override
	public int submitBalanceSalesBalance(BalanceSalesVO balanceSalesVO, BalanceSalesBalanceVO balanceSalesBalanceVO, String userId, int company) throws FLException {

		if (balanceSalesBalanceVO == null) {
			throw new FLException(350017, "结算销售不存在");
		}

		if (balanceSalesBalanceVO.getSalesBalance() == null) {
			throw new FLException(260037, "销售结算不存在");
		}

		SalesBalancePO salesBalancePO = salesBalanceDao.get(balanceSalesBalanceVO.getSalesBalance().getSbid());

		if (salesBalancePO == null) {
			throw new FLException(260037, "销售结算不存在");
		}

		int pompany = salesBalancePO.getSales().getPompany();

		BalanceSalesPO balanceSalesPO = null;

		if (balanceSalesVO != null && balanceSalesVO.getBsid() != null) {
			balanceSalesPO = balanceSalesDao.get(balanceSalesVO.getBsid());
		}

		if (balanceSalesVO == null) {
			balanceSalesVO = new BalanceSalesVO(new UserBaseVO(salesBalancePO.getSales().getSupplier().getUid()));
		}

		if (balanceSalesPO == null) {
			balanceSalesPO = balanceSalesDao.queryBalanceSales(salesBalancePO.getSales().getBrand().getBid(), balanceSalesVO.getSupplier().getUid(), "A", BalanceSalesPO.STATUS_INIT_INT, BalanceSalesPO.STATUS_INIT_INT, pompany);
		}

		if (balanceSalesPO == null) {
			balanceSalesService.createBalanceSales(new BalanceSalesVO(new BrandVO(salesBalancePO.getSales().getBrand().getBid()), new UserBaseVO(userId), new UserBaseVO(salesBalancePO.getSales().getSupplier().getUid())), userId, pompany);

			balanceSalesDao.flush();

			balanceSalesPO = balanceSalesDao.queryBalanceSales(salesBalancePO.getSales().getBrand().getBid(), balanceSalesVO.getSupplier().getUid(), "A", BalanceSalesPO.STATUS_INIT_INT, BalanceSalesPO.STATUS_INIT_INT, pompany);
		}

		if (balanceSalesPO == null) {
			throw new FLException(350017, "结算销售不存在");
		}

		balanceSalesVO.setBsid(balanceSalesPO.getBsid());

		UserPO operater = userDao.queryUserByUserId(userId);

		BalanceSalesBalancePO balanceSalesBanlancePO = new BalanceSalesBalancePO();

		balanceSalesBanlancePO.setBsid(balanceSalesPO.getBsid());
		balanceSalesBanlancePO.setSalesBalance(salesBalancePO);

		balanceSalesBalanceDao.save(balanceSalesBanlancePO);
		balanceSalesBalanceDao.flush();

		balanceSalesService.amountBalanceSales(balanceSalesVO);

		salesBalancePO.setChecker(operater);
		salesBalancePO.setCheckStatus(SalesBalancePO.CHECKSTATUS_CHECK_INT);
		salesBalancePO.setCheckTime(DateUtil.getDateToTimestamp(new Date()));

		if (salesBalancePO.getVenderTime() == null) salesBalancePO.setVenderTime(DateUtil.getDateToTimestamp(new Date()));
		if (salesBalancePO.getPostTime() == null) salesBalancePO.setPostTime(DateUtil.getDateToTimestamp(new Date()));

		if (salesBalancePO.getType() == SalesBalancePO.TYPE_INIT_INT) {

			SalesPaymentPO deposit = salesPaymentDao.querySalesPayment(salesBalancePO.getSales().getSid(), Arrays.asList(SalesPaymentPO.TYPE_DEPOSIT_INT, SalesPaymentPO.TYPE_NOTDEPOSITREFUND_INT));
			if (deposit != null && deposit.getSalesReceipt() != null) salesBalancePO.setCoupon(Arith.add(salesBalancePO.getCoupon(), deposit.getSalesReceipt().getCoupon()));

			SalesPaymentPO fullpay = salesPaymentDao.querySalesPayment(salesBalancePO.getSales().getSid(), Arrays.asList(SalesPaymentPO.TYPE_REPLENISHMENT_INT));
			if (fullpay != null && fullpay.getSalesReceipt() != null) salesBalancePO.setCoupon(Arith.add(salesBalancePO.getCoupon(), fullpay.getSalesReceipt().getCoupon()));

			SalesPaymentPO refpay = salesPaymentDao.querySalesPayment(salesBalancePO.getSales().getSid(), Arrays.asList(SalesPaymentPO.TYPE_MAKEAREFUND_INT));
			if (refpay != null && refpay.getSalesReceipt() != null) salesBalancePO.setCoupon(Arith.sub(salesBalancePO.getCoupon(), refpay.getSalesReceipt().getCoupon()));

		} else if (salesBalancePO.getType() == SalesBalancePO.TYPE_DEPOSITPAY_INT && salesBalancePO.getOnetype() == SalesBalancePO.ONETYPE_INIT_INT) {

			SalesPaymentPO deposit = salesPaymentDao.querySalesPayment(salesBalancePO.getSales().getSid(), Arrays.asList(SalesPaymentPO.TYPE_DEPOSIT_INT, SalesPaymentPO.TYPE_NOTDEPOSITREFUND_INT));
			if (deposit != null && deposit.getSalesReceipt() != null) salesBalancePO.setCoupon(deposit.getSalesReceipt().getCoupon());
		} else if (salesBalancePO.getRefunds() != null) {
			SalesPaymentPO refpay = salesPaymentDao.get(salesBalancePO.getRefunds().getSpid());
			if (refpay != null && refpay.getSalesReceipt() != null) salesBalancePO.setCoupon(refpay.getSalesReceipt().getCoupon());
		}

		salesBalanceDao.update(salesBalancePO);

		BalancePO balancePO = balanceDao.get(balanceSalesPO.getBid());

		if (balancePO == null) return 0;

		balancePO.setAmount(balanceSalesPO.getPayment());
		balancePO.setSurplus(Arith.sub(balanceSalesPO.getPayment(), balancePO.getCutpay()));

		balanceDao.update(balancePO);

		return 0;
	}
}
