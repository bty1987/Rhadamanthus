package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceCutpayDao;
import com.fanglin.balance.dao.BalanceDao;
import com.fanglin.balance.dao.BalanceSalesBalanceDao;
import com.fanglin.balance.dao.BalanceSalesDao;
import com.fanglin.balance.po.BalancePO;
import com.fanglin.balance.po.BalanceSalesBO;
import com.fanglin.balance.po.BalanceSalesBalancePO;
import com.fanglin.balance.po.BalanceSalesPO;
import com.fanglin.balance.service.BalanceSalesBalanceService;
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

import com.fanglin.log.context.ActionLogContext;

@Service("balanceSalesService")
@Transactional(readOnly = true)
public class BalanceSalesServiceImpl implements BalanceSalesService {

	/** 拆分门槛：明细不足该数量不可拆分 */
	private static final int SPLIT_MIN_ITEM_INT = 500;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private BalanceSalesDao balanceSalesDao;

	@Autowired
	private BalanceDao balanceDao;

	@Autowired
	private BalanceCutpayDao balanceCutpayDao;

	@Autowired
	private BalanceSalesBalanceDao balanceSalesBalanceDao;

	@Autowired
	private SalesBalanceDao salesBalanceDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private BalanceSalesBalanceService balanceSalesBalanceService;

	@Override
	public void pageBalanceSales(Paging paging, List<Filter> filters, int company) throws FLException {

		List<BalanceSalesBO> balanceSalesBOs = balanceSalesDao.pageBalanceSales(paging, filters, company);
		List<BalanceSalesVO> balanceSalesVOs = new ArrayList<BalanceSalesVO>();

		for (BalanceSalesBO balanceSalesBO : balanceSalesBOs) {
			balanceSalesVOs.add(balanceSalesBO.ptv(new BalanceSalesVO(new BrandVO(), new BalanceVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		paging.setData(balanceSalesVOs);
	}

	@Override
	public void pageBalanceSalesForBalance(Paging paging, List<Filter> filters, BalanceSalesVO balanceSalesVO, int company) throws FLException {

		List<BalanceSalesBO> balanceSalesBOs = balanceSalesDao.pageBalanceSalesForBalance(paging, filters, balanceSalesVO.getStatus(), company);
		List<BalanceSalesVO> balanceSalesVOs = new ArrayList<BalanceSalesVO>();

		for (BalanceSalesBO balanceSalesBO : balanceSalesBOs) {
			balanceSalesVOs.add(balanceSalesBO.ptv(new BalanceSalesVO(new BrandVO(), new BalanceVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		paging.setData(balanceSalesVOs);
	}

	@Override
	public void pageBalanceSalesForSupplier(Paging paging, List<Filter> filters, String userId, int company) throws FLException {

		List<BalanceSalesBO> balanceSalesBOs = balanceSalesDao.pageBalanceSalesForSupplier(paging, filters, userId, company);
		List<BalanceSalesVO> balanceSalesVOs = new ArrayList<BalanceSalesVO>();

		for (BalanceSalesBO balanceSalesBO : balanceSalesBOs) {
			balanceSalesVOs.add(balanceSalesBO.ptv(new BalanceSalesVO(new BrandVO(), new BalanceVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		paging.setData(balanceSalesVOs);
	}

	@Override
	public List<BalanceSalesVO> queryBalanceSales(BalanceSalesVO balanceSalesVO, int company) {

		List<BalanceSalesVO> balanceSalesVOs = new ArrayList<BalanceSalesVO>();
		List<BalanceSalesPO> balanceSalesPOs = balanceSalesDao.queryBalanceSales(balanceSalesVO.getName(), company);

		for (BalanceSalesPO balanceSalesPO : balanceSalesPOs) {
			balanceSalesVOs.add(balanceSalesPO.ptv(new BalanceSalesVO(new BrandVO(), new UserBaseVO())));
		}

		return balanceSalesVOs;
	}

	@Override
	public BalanceSalesVO queryBalanceSalesByBsid(BalanceSalesVO balanceSalesVO) {

		BalanceSalesPO balanceSalesPO = balanceSalesDao.get(balanceSalesVO.getBsid());

		if (balanceSalesPO != null) {
			return balanceSalesPO.ptv(new BalanceSalesVO(new BrandVO(new UserBaseVO()), new UserBaseVO()));
		}

		return balanceSalesVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createBalanceSales(BalanceSalesVO balanceSalesVO, String userId, int company) throws FLException {

		BrandPO brandPO = brandDao.queryBrandByBid(balanceSalesVO.getBrand().getBid());

		if (brandPO == null) {
			throw new FLException(130077, "品牌不存在");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		BalanceSalesPO balanceSalesPO = new BalanceSalesPO(brandPO);

		BeanUtil.copyPropertie(balanceSalesVO, balanceSalesPO, Arrays.asList("brand", "balance", "creater", "supplier", "balancer"));

		balanceSalesPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		balanceSalesPO.setCreater(userPO);

		balanceSalesPO.setGrade(balanceSalesVO.getGrade());
		balanceSalesPO.setName(balanceSalesVO.getName());
		balanceSalesPO.setCompany(company);

		if (balanceSalesVO.getSupplier() != null && balanceSalesVO.getSupplier().getUid() != null) {
			balanceSalesPO.setSupplier(new UserPO(balanceSalesVO.getSupplier().getUid()));
		} else {
			balanceSalesPO.setSupplier(new UserPO(brandPO.getSupplier().getUid()));
		}

		String currentDate = DateUtil.current("yyMMdd").toString();

		if (balanceSalesVO.getName() == null) {
			balanceSalesPO.setName(String.format("%s-%s-%s-%s", currentDate, brandPO.getName(), "A", (System.currentTimeMillis() % 1000)));
		}

		if (balanceSalesVO.getGrade() == null) {
			balanceSalesPO.setGrade("A");
		}

		BalancePO balancePO = new BalancePO(new UserPO(), new UserPO());

		CompanyPO companyPO = companyDao.get(company);

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_BALANCE_INT, currentDate, balanceSalesPO.getCompany());

		String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		balancePO.setNo(no);
		balancePO.setType(BalanceSalesPO.STATUS_INIT_INT);
		balancePO.setBelonger(balanceSalesPO.getSupplier());
		balancePO.setCreater(balanceSalesPO.getCreater());
		balancePO.setCompany(balanceSalesPO.getCompany());
		balancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		balancePO.setAmount(balanceSalesPO.getPayment());
		balancePO.setSurplus(balanceSalesPO.getPayment());

		balanceDao.save(balancePO);

		balanceSalesPO.setBid(balancePO.getBid());

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

		for (BalanceSalesBalanceVO balanceSalesBalanceVO : balanceSalesBalance) {

			balanceSalesBalanceService.submitBalanceSalesBalance(balanceSalesVO, balanceSalesBalanceVO, userId, company);
		}

		balanceSalesBalanceDao.flush();

		totalBalanceSales(balanceSalesPO);

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

		totalBalanceSales(balanceSalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateBalanceSales(BalanceSalesVO balanceSales) throws FLException {

		// P0-1a: 绑定业务上下文（结算销售含金额，必须审计）
		ActionLogContext.bind("balance", String.valueOf(balanceSales.getBsid()), "UPDATE");

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
	public int splitBalanceSales(BalanceSalesVO balanceSalesVO, String userId, int company) throws FLException {

		ActionLogContext.bind("balance", String.valueOf(balanceSalesVO.getBsid()), "SPLIT");

		BalanceSalesPO balanceSalesPO = balanceSalesDao.get(balanceSalesVO.getBsid());

		if (balanceSalesPO == null) {
			throw new FLException(350017, "结算销售不存在");
		}

		if (balanceSalesPO.getStatus() != BalanceSalesPO.STATUS_INIT_INT) {
			throw new FLException(350018, "结算销售不可操作");
		}

		List<BalanceSalesBalancePO> balanceSalesBalancePOs = balanceSalesBalanceDao.queryBalanceSalesBalance(balanceSalesPO.getBsid());

		if (balanceSalesBalancePOs.size() < SPLIT_MIN_ITEM_INT) {
			throw new FLException(350034, "结算销售明细不足500");
		}

		Collections.sort(balanceSalesBalancePOs, new Comparator<BalanceSalesBalancePO>() {
			@Override
			public int compare(BalanceSalesBalancePO o1, BalanceSalesBalancePO o2) {
				return Long.compare(o1.getBsbid(), o2.getBsbid());
			}
		});

		UserPO operater = userDao.queryUserByUserId(userId);

		int targetCompany = balanceSalesPO.getCompany();

		BalancePO newBalancePO = new BalancePO(new UserPO(), new UserPO());

		String currentDate = DateUtil.current("yyMMdd").toString();

		CompanyPO companyPO = companyDao.get(targetCompany);

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_BALANCE_INT, currentDate, targetCompany);

		newBalancePO.setNo(companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000"));
		newBalancePO.setType(BalanceSalesPO.STATUS_INIT_INT);
		newBalancePO.setBelonger(balanceSalesPO.getSupplier());
		newBalancePO.setCreater(operater);
		newBalancePO.setCompany(targetCompany);
		newBalancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		newBalancePO.setAmount(0);
		newBalancePO.setSurplus(0);

		balanceDao.save(newBalancePO);

		BalanceSalesPO newBalanceSalesPO = new BalanceSalesPO(balanceSalesPO.getBrand());

		newBalanceSalesPO.setName(String.format("%s-%s-%s-%s", currentDate, balanceSalesPO.getBrand().getName(), balanceSalesPO.getGrade(), (System.currentTimeMillis() % 1000)));
		newBalanceSalesPO.setGrade(balanceSalesPO.getGrade());
		newBalanceSalesPO.setSupplier(balanceSalesPO.getSupplier());
		newBalanceSalesPO.setAtttype(balanceSalesPO.getAtttype());
		newBalanceSalesPO.setStatus(BalanceSalesPO.STATUS_INIT_INT);
		newBalanceSalesPO.setCompany(targetCompany);
		newBalanceSalesPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		newBalanceSalesPO.setCreater(operater);
		newBalanceSalesPO.setBid(newBalancePO.getBid());

		balanceSalesDao.save(newBalanceSalesPO);

		int half = balanceSalesBalancePOs.size() / 2;

		for (int i = 0; i < half; i++) {

			BalanceSalesBalancePO balanceSalesBalancePO = balanceSalesBalancePOs.get(i);

			balanceSalesBalancePO.setBsid(newBalanceSalesPO.getBsid());

			balanceSalesBalanceDao.update(balanceSalesBalancePO);
		}

		balanceSalesBalanceDao.flush();

		totalBalanceSales(balanceSalesPO);
		totalBalanceSales(newBalanceSalesPO);

		newBalancePO.setAmount(newBalanceSalesPO.getPayment());
		newBalancePO.setSurplus(Arith.sub(newBalanceSalesPO.getPayment(), newBalancePO.getCutpay()));

		balanceDao.update(newBalancePO);

		BalancePO balancePO = balanceDao.get(balanceSalesPO.getBid());

		if (balancePO != null && balancePO.getBid() != 0) {

			balancePO.setAmount(balanceSalesPO.getPayment());
			balancePO.setSurplus(Arith.sub(balanceSalesPO.getPayment(), balancePO.getCutpay()));

			balanceDao.update(balancePO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int amountBalanceSales(BalanceSalesVO balanceSalesVO) throws FLException {

		BalanceSalesPO balanceSalesPO = balanceSalesDao.get(balanceSalesVO.getBsid());

		if (balanceSalesPO == null) {
			throw new FLException(350017, "结算销售不存在");
		}

		totalBalanceSales(balanceSalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int affirmBalanceSales(BalanceSalesVO balanceSalesVO) throws FLException {

		BalanceSalesPO balanceSalesPO = balanceSalesDao.get(balanceSalesVO.getBsid());

		if (balanceSalesPO == null) {
			throw new FLException(350017, "结算销售不存在");
		}

		if (balanceSalesPO.getStatus() != BalanceSalesPO.STATUS_UNLOCK_INT) {
			throw new FLException(350018, "结算销售不可操作");
		}

		balanceSalesPO.setStatus(BalanceSalesPO.STATUS_AFFIRM_INT);

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

		if (balanceSalesPO.getStatus() != BalanceSalesPO.STATUS_AFFIRM_INT) {
			throw new FLException(350018, "结算销售不可操作");
		}

		UserPO balancer = userDao.queryUserByUserId(userId);

		balanceSalesPO.setBalancer(balancer);
		balanceSalesPO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));
		balanceSalesPO.setStatus(BalanceSalesPO.STATUS_ENABLE_CHECK_INT);

		balanceSalesDao.update(balanceSalesPO);

		BalancePO balancePO = balanceDao.get(balanceSalesPO.getBid());

		if (balancePO != null && balancePO.getBid() != 0) {

			balancePO.setAmount(balanceSalesPO.getPayment());
			balancePO.setSurplus(Arith.sub(balanceSalesPO.getPayment(), balanceCutpayDao.amountBalanceCutpay(balanceSalesPO.getBid())));

			balanceDao.save(balancePO);

			return 0;
		}

		balancePO = new BalancePO(new UserPO(), new UserPO());

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

	@Transactional(rollbackFor = Exception.class)
	public int totalBalanceSales(BalanceSalesPO balanceSalesPO) {

		Object[] amount = balanceSalesDao.amountBalanceSales(balanceSalesPO.getBsid());

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
