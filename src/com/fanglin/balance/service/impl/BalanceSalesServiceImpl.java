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
import com.fanglin.balance.po.BalanceSalesBO;
import com.fanglin.balance.po.BalanceSalesBalancePO;
import com.fanglin.balance.po.BalanceSalesPO;
import com.fanglin.balance.service.BalanceSalesService;
import com.fanglin.balance.vo.BalanceSalesBalanceVO;
import com.fanglin.balance.vo.BalanceSalesVO;
import com.fanglin.balance.vo.BalanceVO;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesBalanceDao;
import com.fanglin.sales.po.SalesBalancePO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("balanceSalesService")
@Transactional(readOnly = true)
public class BalanceSalesServiceImpl implements BalanceSalesService {

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private BalanceSalesDao balanceSalesDao;

	@Autowired
	private BalanceDao balanceDao;

	@Autowired
	private BalanceSalesBalanceDao balanceSalesBalanceDao;

	@Autowired
	private SalesBalanceDao salesBalanceDao;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private BrandDao brandDao;

	@Override
	public void pageBalanceSales(Paging paging, List<Filter> filters, int company) {

		List<BalanceSalesBO> balanceSalesBOs = balanceSalesDao.pageBalanceSales(paging, filters, company);
		List<BalanceSalesVO> balanceSalesVOs = new ArrayList<BalanceSalesVO>();

		BalanceSalesVO balanceSalesVO;

		for (BalanceSalesBO balanceSalesBO : balanceSalesBOs) {

			balanceSalesVO = new BalanceSalesVO(new BrandVO(), new BalanceVO(new UserBaseVO(), new UserBaseVO()), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyPropertie(balanceSalesBO, balanceSalesVO, Arrays.asList("brand", "balance", "creater", "balancer"));

			BeanUtil.copyPropertie(balanceSalesBO.getCreater(), balanceSalesVO.getCreater(), Arrays.asList("duty", "dept"));
			BeanUtil.copyPropertie(balanceSalesBO.getBalancer(), balanceSalesVO.getBalancer(), Arrays.asList("duty", "dept"));
			BeanUtil.copyPropertie(balanceSalesBO.getBrand(), balanceSalesVO.getBrand(), Arrays.asList("category", "supplier"));

			BeanUtil.copyPropertie(balanceSalesBO.getBalance(), balanceSalesVO.getBalance(), Arrays.asList("belonger", "creater"));
			BeanUtil.copyPropertie(balanceSalesBO.getBalance().getBelonger(), balanceSalesVO.getBalance().getBelonger(), Arrays.asList("duty", "dept"));
			BeanUtil.copyPropertie(balanceSalesBO.getBalance().getCreater(), balanceSalesVO.getBalance().getCreater(), Arrays.asList("duty", "dept"));

			balanceSalesVOs.add(balanceSalesVO);

		}

		paging.setData(balanceSalesVOs);
	}

	@Override
	public void pageBalanceSalesForBalance(Paging paging, List<Filter> filters, BalanceSalesVO balanceSalesVO, int company) {

		List<BalanceSalesBO> balanceSalesBOs = balanceSalesDao.pageBalanceSalesForBalance(paging, filters, balanceSalesVO.getStatus(), company);
		List<BalanceSalesVO> balanceSalesVOs = new ArrayList<BalanceSalesVO>();

		for (BalanceSalesBO balanceSalesBO : balanceSalesBOs) {

			balanceSalesVO = new BalanceSalesVO(new BrandVO(), new BalanceVO(new UserBaseVO(), new UserBaseVO()), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyPropertie(balanceSalesBO, balanceSalesVO, Arrays.asList("brand", "balance", "creater", "balancer"));

			BeanUtil.copyPropertie(balanceSalesBO.getCreater(), balanceSalesVO.getCreater(), Arrays.asList("duty", "dept"));
			BeanUtil.copyPropertie(balanceSalesBO.getBalancer(), balanceSalesVO.getBalancer(), Arrays.asList("duty", "dept"));
			BeanUtil.copyPropertie(balanceSalesBO.getBrand(), balanceSalesVO.getBrand(), Arrays.asList("category", "supplier"));

			BeanUtil.copyPropertie(balanceSalesBO.getBalance(), balanceSalesVO.getBalance(), Arrays.asList("belonger", "creater"));
			BeanUtil.copyPropertie(balanceSalesBO.getBalance().getBelonger(), balanceSalesVO.getBalance().getBelonger(), Arrays.asList("duty", "dept"));
			BeanUtil.copyPropertie(balanceSalesBO.getBalance().getCreater(), balanceSalesVO.getBalance().getCreater(), Arrays.asList("duty", "dept"));

			balanceSalesVOs.add(balanceSalesVO);
		}

		paging.setData(balanceSalesVOs);
	}

	@Override
	public List<BalanceSalesVO> queryBalanceSales(BalanceSalesVO balanceSalesVO, int company) {

		List<BalanceSalesVO> balanceSalesVOs = new ArrayList<BalanceSalesVO>();
		List<BalanceSalesPO> balanceSalesPOs = balanceSalesDao.queryBalanceSales(balanceSalesVO.getName(), company);

		for (BalanceSalesPO balanceSalesPO : balanceSalesPOs) {

			balanceSalesVO = new BalanceSalesVO(new BrandVO(), new UserBaseVO());

			BeanUtil.copyPropertie(balanceSalesPO, balanceSalesVO, Arrays.asList("brand", "balance", "creater", "balancer"));
			BeanUtil.copyPropertie(balanceSalesPO.getBrand(), balanceSalesVO.getBrand(), Arrays.asList("supplier"));

			balanceSalesVOs.add(balanceSalesVO);
		}

		return balanceSalesVOs;
	}

	@Override
	public BalanceSalesVO queryBalanceSalesByBsid(BalanceSalesVO balanceSalesVO) {

		BalanceSalesPO balanceSalesPO = balanceSalesDao.get(balanceSalesVO.getBsid());

		balanceSalesVO = new BalanceSalesVO(new BrandVO(new UserBaseVO()), new UserBaseVO());

		BeanUtil.copyPropertie(balanceSalesPO, balanceSalesVO, Arrays.asList("brand", "balance", "creater", "balancer"));
		BeanUtil.copyPropertie(balanceSalesPO.getBrand(), balanceSalesVO.getBrand(), Arrays.asList("supplier"));
		BeanUtil.copyPropertie(balanceSalesPO.getCreater(), balanceSalesVO.getCreater(), Arrays.asList("dept", "duty"));

		BeanUtil.copyProperties(balanceSalesPO.getBrand().getSupplier(), balanceSalesVO.getBrand().getSupplier(), Arrays.asList("dept", "duty"));

		return balanceSalesVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createBalanceSales(BalanceSalesVO balanceSalesVO, String userId, int company) throws FLException {

		BrandPO brand = brandDao.queryBrandByBid(balanceSalesVO.getBrand().getBid());

		UserPO userPO = userDao.queryUserByUserId(userId);
		BalanceSalesPO balanceSalesPO = new BalanceSalesPO(brand);

		BeanUtil.copyPropertie(balanceSalesVO, balanceSalesPO, Arrays.asList("brand", "balance", "creater", "balancer"));

		balanceSalesPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		balanceSalesPO.setCreater(userPO);
		balanceSalesPO.setGrade(balanceSalesVO.getGrade());
		balanceSalesPO.setName(balanceSalesVO.getName());
		balanceSalesPO.setCompany(company);

		balanceSalesDao.save(balanceSalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitBalanceSales(BalanceSalesVO balanceSalesVO, List<BalanceSalesBalanceVO> balanceSalesBalance, String userId, int company) throws FLException {

		BalanceSalesPO balanceSalesPO = balanceSalesDao.get(balanceSalesVO.getBsid());

		if (balanceSalesPO == null) {
			throw new FLException(350017, "结算销售不存在");
		}

		if (balanceSalesPO.getStatus() != BalanceSalesPO.STATUS_INIT_INT) {
			throw new FLException(350018, "结算销售不可操作");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		for (BalanceSalesBalanceVO balanceSalesBalanceVO : balanceSalesBalance) {

			SalesBalancePO salesBalancePO = salesBalanceDao.get(balanceSalesBalanceVO.getSalesBalance().getSbid());

			if (salesBalancePO == null) continue;

			BalanceSalesBalancePO balanceSalesBanlancePO = new BalanceSalesBalancePO();

			balanceSalesBanlancePO.setBsid(balanceSalesVO.getBsid());
			balanceSalesBanlancePO.setSalesBalance(salesBalancePO);

			balanceSalesBalanceDao.save(balanceSalesBanlancePO);

			salesBalancePO.setChecker(operater);
			salesBalancePO.setCheckStatus(SalesBalancePO.CHECKSTATUS_CHECK_INT);
			salesBalancePO.setCheckTime(DateUtil.getDateToTimestamp(new Date()));

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
		}

		balanceSalesBalanceDao.flush();

		Object[] amount = balanceSalesDao.amountBalanceSales(balanceSalesVO.getBsid());

		long income = (Long) amount[0] == null ? 0 : (Long) amount[0];
		long cost = (Long) amount[1] == null ? 0 : (Long) amount[1];
		long payment = (Long) amount[2] == null ? 0 : (Long) amount[2];

		balanceSalesPO.setIncome(income);
		balanceSalesPO.setCost(cost);
		balanceSalesPO.setPayment(payment);
		balanceSalesPO.setProfit(Arith.sub(income, payment));

		balanceSalesDao.update(balanceSalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unbindBalanceSales(BalanceSalesVO balanceSalesVO, List<BalanceSalesBalanceVO> balanceSalesBalance, String userId, int company) throws FLException {

		BalanceSalesPO balanceSalesPO = balanceSalesDao.get(balanceSalesVO.getBsid());

		if (balanceSalesPO == null) {
			throw new FLException(350017, "结算销售不存在");
		}

		if (balanceSalesPO.getStatus() != BalanceSalesPO.STATUS_INIT_INT) {
			throw new FLException(350018, "结算销售不可操作");
		}

		for (BalanceSalesBalanceVO balanceSalesBalanceVO : balanceSalesBalance) {

			BalanceSalesBalancePO balanceSalesBalancePO = balanceSalesBalanceDao.get(balanceSalesBalanceVO.getBsbid());

			if (balanceSalesBalancePO == null) continue;

			SalesBalancePO salesBalancePO = balanceSalesBalancePO.getSalesBalance();

			if (salesBalancePO == null) continue;

			salesBalancePO.setCheckStatus(SalesBalancePO.CHECKSTATUS_INIT_INT);

			salesBalanceDao.update(salesBalancePO);

			balanceSalesBalanceDao.delete(balanceSalesBalancePO);
		}

		balanceSalesBalanceDao.flush();

		Object[] amount = balanceSalesDao.amountBalanceSales(balanceSalesVO.getBsid());

		long income = (Long) amount[0] == null ? 0 : (Long) amount[0];
		long cost = (Long) amount[1] == null ? 0 : (Long) amount[1];
		long payment = (Long) amount[2] == null ? 0 : (Long) amount[2];

		balanceSalesPO.setIncome(income);
		balanceSalesPO.setCost(cost);
		balanceSalesPO.setPayment(payment);
		balanceSalesPO.setProfit(Arith.sub(income, payment));

		balanceSalesDao.update(balanceSalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateBalanceSales(BalanceSalesVO balanceSales) throws FLException {

		BalanceSalesPO balanceSalesPO = balanceSalesDao.get(balanceSales.getBsid());

		if (balanceSalesPO == null) {
			throw new FLException(350017, "结算销售不存在");
		}

		if (balanceSalesPO.getStatus() != BalanceSalesPO.STATUS_INIT_INT) {
			throw new FLException(350018, "结算销售不可操作");
		}

		balanceSalesPO.setName(balanceSales.getName());

		balanceSalesDao.update(balanceSalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int balanceBalanceSales(BalanceSalesVO balanceSalesVO, String userId) throws FLException {

		BalanceSalesPO balanceSalesPO = balanceSalesDao.get(balanceSalesVO.getBsid());

		if (balanceSalesPO == null) {
			throw new FLException(350017, "结算销售不存在");
		}

		if (balanceSalesPO.getStatus() != BalanceSalesPO.STATUS_UNLOCK_INT) {
			throw new FLException(350018, "结算销售不可操作");
		}

		UserPO balancer = userDao.queryUserByUserId(userId);

		balanceSalesPO.setBalancer(balancer);
		balanceSalesPO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));
		balanceSalesPO.setStatus(BalanceSalesPO.STATUS_ENABLE_CHECK_INT);

		balanceSalesDao.update(balanceSalesPO);

		BalancePO balancePO = new BalancePO(new UserPO(), new UserPO());

		CompanyPO companyPO = companyDao.get(balanceSalesPO.getCompany());

		String currentDate = DateUtil.current("yyMMdd").toString();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_BALANCE_INT, currentDate, balanceSalesPO.getCompany());

		String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		balancePO.setNo(no);
		balancePO.setType(BalanceSalesPO.STATUS_INIT_INT);
		balancePO.setBelonger(balanceSalesPO.getCreater());
		balancePO.setCreater(balanceSalesPO.getCreater());
		balancePO.setCompany(balanceSalesPO.getCompany());
		balancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		balancePO.setAmount(balanceSalesVO.getPayment());
		balancePO.setSurplus(balanceSalesVO.getPayment());

		balanceDao.save(balancePO);

		balanceSalesPO.setBid(balancePO.getBid());

		balanceSalesDao.update(balanceSalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int lockBalanceSales(BalanceSalesVO balanceSalesVO) throws FLException {

		BalanceSalesPO balanceSalesPO = balanceSalesDao.get(balanceSalesVO.getBsid());

		if (balanceSalesPO == null) {
			throw new FLException(350017, "结算销售不存在");
		}

		if (balanceSalesPO.getStatus() != BalanceSalesPO.STATUS_INIT_INT) {
			throw new FLException(350018, "结算销售不可操作");
		}

		balanceSalesPO.setStatus(BalanceSalesPO.STATUS_UNLOCK_INT);
		balanceSalesPO.setLockTime(DateUtil.getDateToTimestamp(new Date()));

		Object[] amount = balanceSalesDao.amountBalanceSales(balanceSalesVO.getBsid());

		long income = (Long) amount[0] == null ? 0 : (Long) amount[0];
		long cost = (Long) amount[1] == null ? 0 : (Long) amount[1];
		long payment = (Long) amount[2] == null ? 0 : (Long) amount[2];

		balanceSalesPO.setIncome(income);
		balanceSalesPO.setCost(cost);
		balanceSalesPO.setPayment(payment);
		balanceSalesPO.setProfit(Arith.sub(income, payment));

		balanceSalesDao.update(balanceSalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unlockBalanceSales(BalanceSalesVO balanceSalesVO) throws FLException {

		BalanceSalesPO balanceSalesPO = balanceSalesDao.get(balanceSalesVO.getBsid());

		if (balanceSalesPO == null) {
			throw new FLException(350017, "结算销售不存在");
		}

		if (balanceSalesPO.getStatus() != BalanceSalesPO.STATUS_UNLOCK_INT) {
			throw new FLException(350018, "结算销售不可操作");
		}

		balanceSalesPO.setStatus(BalanceSalesPO.STATUS_INIT_INT);

		balanceSalesDao.update(balanceSalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteBalanceSales(BalanceSalesVO balanceSales) throws FLException {

		BalanceSalesPO balanceSalesPO = balanceSalesDao.get(balanceSales.getBsid());

		if (balanceSalesPO == null) {
			throw new FLException(350017, "结算销售不存在");
		}

		if (balanceSalesPO.getStatus() != BalanceSalesPO.STATUS_INIT_INT) {
			throw new FLException(350018, "结算销售不可操作");
		}

		if (balanceSalesBalanceDao.countBalanceSalesBalance(balanceSales.getBsid()) > 0) {
			throw new FLException(350021, "销售明细存在");
		}

		balanceSalesDao.delete(balanceSalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int amountBalanceSales(BalanceSalesVO balanceSalesVO) throws FLException {

		BalanceSalesPO balanceSalesPO = balanceSalesDao.get(balanceSalesVO.getBsid());

		if (balanceSalesPO == null) {
			throw new FLException(350017, "结算销售不存在");
		}

		Object[] amount = balanceSalesDao.amountBalanceSales(balanceSalesVO.getBsid());

		long income = (Long) amount[0] == null ? 0 : (Long) amount[0];
		long cost = (Long) amount[1] == null ? 0 : (Long) amount[1];
		long payment = (Long) amount[2] == null ? 0 : (Long) amount[2];

		balanceSalesPO.setIncome(income);
		balanceSalesPO.setCost(cost);
		balanceSalesPO.setPayment(payment);
		balanceSalesPO.setProfit(Arith.sub(income, payment));

		balanceSalesDao.update(balanceSalesPO);

		return 0;
	}

}
