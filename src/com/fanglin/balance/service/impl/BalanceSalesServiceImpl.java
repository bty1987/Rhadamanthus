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
import com.fanglin.balance.service.BalanceSalesService;
import com.fanglin.balance.vo.BalanceSalesBalanceVO;
import com.fanglin.balance.vo.BalanceSalesVO;
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
	private UserDao userDao;

	@Autowired
	private BrandDao brandDao;

	@Override
	public void pageBalanceSales(Paging paging, List<Filter> filters, int company) {
		List<BalanceSalesPO> balanceSalesPOs = balanceSalesDao.pageBalanceSales(paging, filters, company);
		List<BalanceSalesVO> balanceSalesVOs = new ArrayList<BalanceSalesVO>();

		BalanceSalesVO balanceSalesVO;

		for (BalanceSalesPO balanceSalesPO : balanceSalesPOs) {
			balanceSalesVO = new BalanceSalesVO(new BrandVO(), new UserBaseVO(), new UserBaseVO());
			BeanUtil.copyPropertie(balanceSalesPO, balanceSalesVO, Arrays.asList("brand", "creater", "balancer"));
			BeanUtil.copyProperties(balanceSalesPO.getCreater(), balanceSalesVO.getCreater(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));
			BeanUtil.copyProperties(balanceSalesPO.getBalancer(), balanceSalesVO.getBalancer(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));
			BeanUtil.copyPropertie(balanceSalesPO.getBrand(), balanceSalesVO.getBrand(), Arrays.asList("category", "supplier"));

			balanceSalesVOs.add(balanceSalesVO);
		}

		paging.setData(balanceSalesVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createBalanceSales(BalanceSalesVO balanceSalesVO, String userId, int company) throws FLException {

		BrandPO brand = brandDao.queryBrandByBid(balanceSalesVO.getBrand().getBid());

		UserPO userPO = userDao.queryUserByUserId(userId);
		BalanceSalesPO balanceSalesPO = new BalanceSalesPO(brand);

		BeanUtil.copyPropertie(balanceSalesVO, balanceSalesPO, Arrays.asList("brand", "creater", "balancer"));

		balanceSalesPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		balanceSalesPO.setCreater(userPO);
		balanceSalesPO.setGrade(balanceSalesVO.getGrade());
		balanceSalesPO.setName(balanceSalesVO.getName());
		balanceSalesPO.setCompany(company);

		balanceSalesDao.save(balanceSalesPO);

		return 0;
	}

	@Override
	public List<BalanceSalesVO> queryBalanceSales(BalanceSalesVO balanceSalesVO, int company) {

		List<BalanceSalesVO> balanceSalesVOs = new ArrayList<BalanceSalesVO>();
		List<BalanceSalesPO> balanceSalesPOs = balanceSalesDao.queryBalanceSales(balanceSalesVO.getName(), company);

		for (BalanceSalesPO balanceSalesPO : balanceSalesPOs) {

			balanceSalesVO = new BalanceSalesVO(new BrandVO(), new UserBaseVO());

			BeanUtil.copyPropertie(balanceSalesPO, balanceSalesVO, Arrays.asList("brand", "creater", "balancer"));
			BeanUtil.copyPropertie(balanceSalesPO.getBrand(), balanceSalesVO.getBrand(), Arrays.asList("supplier"));

			balanceSalesVOs.add(balanceSalesVO);
		}

		return balanceSalesVOs;
	}

	@Override
	public BalanceSalesVO queryBalanceSalesByBsid(BalanceSalesVO balanceSalesVO) {

		BalanceSalesPO balanceSalesPO = balanceSalesDao.get(balanceSalesVO.getBsid());

		balanceSalesVO = new BalanceSalesVO(new BrandVO(), new UserBaseVO());

		BeanUtil.copyPropertie(balanceSalesPO, balanceSalesVO, Arrays.asList("brand", "creater", "balancer"));
		BeanUtil.copyPropertie(balanceSalesPO.getBrand(), balanceSalesVO.getBrand(), Arrays.asList("supplier"));
		BeanUtil.copyProperties(balanceSalesPO.getCreater(), balanceSalesVO.getCreater(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));

		return balanceSalesVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitBalanceSales(BalanceSalesVO balanceSalesVO, List<BalanceSalesBalanceVO> balanceSalesBalance, String userId, int company) throws FLException {

		BalanceSalesPO balanceSalesPO = balanceSalesDao.get(balanceSalesVO.getBsid());

		for (BalanceSalesBalanceVO balanceSalesBalanceVO : balanceSalesBalance) {

			SalesBalancePO salesBalancePO = salesBalanceDao.get(balanceSalesBalanceVO.getSalesBalance().getSbid());

			salesBalancePO.setCheckStatus(SalesBalancePO.CHECKSTATUS_CHECK_INT);
			salesBalancePO.setCheckTime(DateUtil.getDateToTimestamp(new Date()));

			BalanceSalesBalancePO balanceSalesBanlancePO = new BalanceSalesBalancePO();

			balanceSalesBanlancePO.setBsid(balanceSalesVO.getBsid());
			balanceSalesBanlancePO.setSalesBalance(salesBalancePO);

			balanceSalesBalanceDao.save(balanceSalesBanlancePO);
		}

		balanceSalesPO.setIncome(balanceSalesVO.getIncome());
		balanceSalesPO.setCost(balanceSalesVO.getCost());
		balanceSalesPO.setPayment(balanceSalesVO.getPayment());
		balanceSalesPO.setProfit(balanceSalesVO.getProfit());

		balanceSalesDao.update(balanceSalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unbindBalanceSales(BalanceSalesVO balanceSalesVO, List<BalanceSalesBalanceVO> balanceSalesBalance, String userId, int company) throws FLException {

		BalanceSalesPO balanceSalesPO = balanceSalesDao.get(balanceSalesVO.getBsid());

		for (BalanceSalesBalanceVO balanceSalesBalanceVO : balanceSalesBalance) {
			BalanceSalesBalancePO balanceSalesBalancePO = balanceSalesBalanceDao.get(balanceSalesBalanceVO.getBsbid());
			if (balanceSalesBalancePO == null) continue;

			SalesBalancePO salesBalancePO = balanceSalesBalancePO.getSalesBalance();

			salesBalancePO.setCheckStatus(SalesBalancePO.CHECKSTATUS_INIT_INT);

			salesBalanceDao.update(salesBalancePO);
			balanceSalesBalanceDao.deleteById(balanceSalesBalanceVO.getBsbid());
		}

		balanceSalesPO.setIncome(balanceSalesVO.getIncome());
		balanceSalesPO.setCost(balanceSalesVO.getCost());
		balanceSalesPO.setPayment(balanceSalesVO.getPayment());
		balanceSalesPO.setProfit(balanceSalesVO.getProfit());

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
		if (balanceSalesPO.getStatus() != 0) {
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

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_SO_INT, currentDate, balanceSalesPO.getCompany());

		String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		balancePO.setNo(no);
		balancePO.setType(BalanceSalesPO.STATUS_INIT_INT);
		balancePO.setBelonger(balanceSalesPO.getCreater());
		balancePO.setCreater(balanceSalesPO.getCreater());
		balancePO.setCompany(balanceSalesPO.getCompany());
		balancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		balancePO.setAmount(balanceSalesPO.getPayment());
		balancePO.setSurplus(balanceSalesPO.getPayment());

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

		return 0;
	}

}
