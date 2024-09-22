package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceDao;
import com.fanglin.balance.dao.BalanceOalesDao;
import com.fanglin.balance.dao.BalanceOalesItemDao;
import com.fanglin.balance.po.BalanceOalesBO;
import com.fanglin.balance.po.BalanceOalesItemPO;
import com.fanglin.balance.po.BalanceOalesPO;
import com.fanglin.balance.po.BalancePO;
import com.fanglin.balance.service.BalanceOalesService;
import com.fanglin.balance.vo.BalanceOalesItemVO;
import com.fanglin.balance.vo.BalanceOalesVO;
import com.fanglin.balance.vo.BalanceVO;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.po.SelectionItemPO;
import com.fanglin.sales.dao.OalesDao;
import com.fanglin.sales.po.OalesPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("balanceOalesService")
@Transactional(readOnly = true)
public class BalanceOalesServiceImpl implements BalanceOalesService {

	@Autowired
	private BalanceOalesDao balanceOalesDao;

	@Autowired
	private OalesDao oalesDao;

	@Autowired
	private BalanceOalesItemDao balanceOalesItemDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private BalanceDao balanceDao;

	@Override
	public void pageBalanceOales(Paging paging, List<Filter> filters, int company) {

		List<BalanceOalesPO> balanceOalesPOs = balanceOalesDao.pageBalanceOales(paging, filters, company);
		List<BalanceOalesVO> balanceOalesVOs = new ArrayList<BalanceOalesVO>();

		BalanceOalesVO balanceOalesVO;

		for (BalanceOalesPO balanceOalesPO : balanceOalesPOs) {

			balanceOalesVO = new BalanceOalesVO(new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyPropertie(balanceOalesPO, balanceOalesVO, Arrays.asList("creater", "balancer"));
			BeanUtil.copyProperties(balanceOalesPO.getCreater(), balanceOalesVO.getCreater(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));
			BeanUtil.copyProperties(balanceOalesPO.getBalancer(), balanceOalesVO.getBalancer(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));

			balanceOalesVOs.add(balanceOalesVO);
		}

		paging.setData(balanceOalesVOs);
	}

	@Override
	public void pageBalanceOalesForBalance(Paging paging, List<Filter> filters, int company) {

		List<BalanceOalesBO> balanceOalesBOs = balanceOalesDao.pageBalanceOalesForBalance(paging, filters, company);
		List<BalanceOalesVO> balanceOalesVOs = new ArrayList<BalanceOalesVO>();

		BalanceOalesVO balanceOalesVO;

		for (BalanceOalesBO balanceOalesBO : balanceOalesBOs) {

			balanceOalesVO = new BalanceOalesVO(new BalanceVO(new UserBaseVO(), new UserBaseVO()), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyPropertie(balanceOalesBO, balanceOalesVO, Arrays.asList("balance", "creater", "balancer"));
			BeanUtil.copyProperties(balanceOalesBO.getCreater(), balanceOalesVO.getCreater(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));
			BeanUtil.copyProperties(balanceOalesBO.getBalancer(), balanceOalesVO.getBalancer(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));
			BeanUtil.copyPropertie(balanceOalesBO.getBalance(), balanceOalesVO.getBalance(), Arrays.asList("belonger", "creater"));
			BeanUtil.copyPropertie(balanceOalesBO.getBalance().getBelonger(), balanceOalesVO.getBalance().getBelonger(), Arrays.asList("duty", "dept", "role"));
			BeanUtil.copyPropertie(balanceOalesBO.getBalance().getCreater(), balanceOalesVO.getBalance().getCreater(), Arrays.asList("duty", "dept", "role"));

			balanceOalesVOs.add(balanceOalesVO);

		}

		paging.setData(balanceOalesVOs);
	}

	@Override
	public List<BalanceOalesVO> queryBalanceOales(BalanceOalesVO balanceOalesVO, int company) {

		List<BalanceOalesVO> balanceOalesVOs = new ArrayList<BalanceOalesVO>();
		List<BalanceOalesPO> balanceOalesPOs = balanceOalesDao.queryBalanceOales(balanceOalesVO.getName(), company);

		for (BalanceOalesPO balanceOalesPO : balanceOalesPOs) {

			balanceOalesVO = new BalanceOalesVO(new UserBaseVO());

			BeanUtil.copyPropertie(balanceOalesPO, balanceOalesVO, Arrays.asList("balance", "creater", "balancer"));

			balanceOalesVOs.add(balanceOalesVO);
		}

		return balanceOalesVOs;
	}

	@Override
	public BalanceOalesVO queryBalanceOalesByBoid(BalanceOalesVO balanceOalesVO) {

		BalanceOalesPO balanceOalesPO = balanceOalesDao.get(balanceOalesVO.getBoid());

		balanceOalesVO = new BalanceOalesVO(new UserBaseVO());

		BeanUtil.copyPropertie(balanceOalesPO, balanceOalesVO, Arrays.asList("balance", "creater", "balancer"));
		BeanUtil.copyPropertie(balanceOalesPO.getCreater(), balanceOalesVO.getCreater(), Arrays.asList("dept", "duty"));

		return balanceOalesVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createBalanceOales(BalanceOalesVO balanceOalesVO, String userId, int company) throws FLException {

		BalanceOalesPO balanceOalesPO = new BalanceOalesPO();

		BeanUtil.copyPropertie(balanceOalesVO, balanceOalesPO, Arrays.asList("balance", "creater", "balancer"));

		balanceOalesPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		balanceOalesPO.setGrade(balanceOalesVO.getGrade());
		balanceOalesPO.setName(balanceOalesVO.getName());

		balanceOalesPO.setCreater(userDao.queryUserByUserId(userId));
		balanceOalesPO.setCompany(company);

		balanceOalesDao.save(balanceOalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitBalanceOales(BalanceOalesVO balanceOalesVO, List<BalanceOalesItemVO> balanceOalesItemVOs, String userId, int company) throws FLException {

		BalanceOalesPO balanceOalesPO = balanceOalesDao.get(balanceOalesVO.getBoid());

		if (balanceOalesPO == null) {
			throw new FLException(350023, "结算外销不存在");
		}

		if (balanceOalesPO.getStatus() != BalanceOalesPO.STATUS_INIT_INT) {
			throw new FLException(350024, "结算外销不可操作");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		for (BalanceOalesItemVO balanceOalesItemVO : balanceOalesItemVOs) {

			OalesPO oalesPO = oalesDao.get(balanceOalesItemVO.getOales().getOid());

			if (oalesPO == null) continue;

			BalanceOalesItemPO balanceOalesItemPO = new BalanceOalesItemPO();

			balanceOalesItemPO.setBoid(balanceOalesVO.getBoid());
			balanceOalesItemPO.setOales(oalesPO);

			balanceOalesItemDao.save(balanceOalesItemPO);

			oalesPO.setAccounter(operater);
			oalesPO.setAccountTime(DateUtil.getDateToTimestamp(new Date()));
			oalesPO.setAccountStatus(SelectionItemPO.ACCOUNT_STATUS_ACCOUNT_INT);

			oalesDao.update(oalesPO);
		}

		balanceOalesItemDao.flush();

		long amount = balanceOalesDao.amountBalanceOales(balanceOalesVO.getBoid());

		balanceOalesPO.setProfit(amount);

		balanceOalesDao.update(balanceOalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unbindBalanceOales(BalanceOalesVO balanceOalesVO, List<BalanceOalesItemVO> balanceOalesItem, String userId, int company) throws FLException {

		BalanceOalesPO balanceOalesPO = balanceOalesDao.get(balanceOalesVO.getBoid());

		if (balanceOalesPO == null) {
			throw new FLException(350023, "结算外销不存在");
		}

		if (balanceOalesPO.getStatus() != BalanceOalesPO.STATUS_INIT_INT) {
			throw new FLException(350024, "结算外销不可操作");
		}

		for (BalanceOalesItemVO balanceOalesItemVO : balanceOalesItem) {

			BalanceOalesItemPO balanceOalesItemPO = balanceOalesItemDao.get(balanceOalesItemVO.getBoiid());

			if (balanceOalesItemPO == null) continue;

			balanceOalesItemDao.deleteById(balanceOalesItemVO.getBoiid());

			OalesPO oalesPO = balanceOalesItemPO.getOales();

			if (oalesPO == null) continue;

			oalesPO.setAccounter(null);
			oalesPO.setAccountTime(null);
			oalesPO.setAccountStatus(OalesPO.ACCOUNT_STATUS_INIT_INT);

			oalesDao.update(oalesPO);
		}

		balanceOalesItemDao.flush();

		long amount = balanceOalesDao.amountBalanceOales(balanceOalesVO.getBoid());

		balanceOalesPO.setProfit(amount);

		balanceOalesDao.update(balanceOalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int lockBalanceOales(BalanceOalesVO balanceOalesVO) throws FLException {

		BalanceOalesPO balanceOalesPO = balanceOalesDao.get(balanceOalesVO.getBoid());

		if (balanceOalesPO == null) {
			throw new FLException(350023, "结算外销不存在");
		}

		if (balanceOalesPO.getStatus() != BalanceOalesPO.STATUS_INIT_INT) {
			throw new FLException(350024, "结算外销不可操作");
		}

		balanceOalesPO.setStatus(BalanceOalesPO.STATUS_UNLOCK_INT);
		balanceOalesPO.setLockTime(DateUtil.getDateToTimestamp(new Date()));

		long amount = balanceOalesDao.amountBalanceOales(balanceOalesVO.getBoid());

		balanceOalesPO.setProfit(amount);

		balanceOalesDao.update(balanceOalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unlockBalanceOales(BalanceOalesVO balanceOalesVO) throws FLException {

		BalanceOalesPO balanceOalesPO = balanceOalesDao.get(balanceOalesVO.getBoid());

		if (balanceOalesPO == null) {
			throw new FLException(350023, "结算外销不存在");
		}

		if (balanceOalesPO.getStatus() != BalanceOalesPO.STATUS_UNLOCK_INT) {
			throw new FLException(350024, "结算外销不可操作");
		}

		balanceOalesPO.setStatus(BalanceOalesPO.STATUS_INIT_INT);

		balanceOalesDao.update(balanceOalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateBalanceOales(BalanceOalesVO balanceOales) throws FLException {

		BalanceOalesPO balanceOalesPO = balanceOalesDao.get(balanceOales.getBoid());

		if (balanceOalesPO == null) {
			throw new FLException(350023, "结算外销不存在");
		}

		if (balanceOalesPO.getStatus() != BalanceOalesPO.STATUS_INIT_INT) {
			throw new FLException(350024, "结算外销不可操作");
		}

		balanceOalesPO.setName(balanceOales.getName());

		balanceOalesDao.update(balanceOalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int balanceBalanceOales(BalanceOalesVO balanceOalesVO, String userId) throws FLException {

		BalanceOalesPO balanceOalesPO = balanceOalesDao.get(balanceOalesVO.getBoid());

		if (balanceOalesPO == null) {
			throw new FLException(350023, "结算外销不存在");
		}

		if (balanceOalesPO.getStatus() != BalanceOalesPO.STATUS_UNLOCK_INT) {
			throw new FLException(350024, "结算外销不可操作");
		}

		UserPO balancer = userDao.queryUserByUserId(userId);

		balanceOalesPO.setBalancer(balancer);
		balanceOalesPO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));
		balanceOalesPO.setStatus(BalanceOalesPO.STATUS_ENABLE_CHECK_INT);

		balanceOalesDao.update(balanceOalesPO);

		BalancePO balancePO = new BalancePO(new UserPO(), new UserPO());

		CompanyPO companyPO = companyDao.get(balanceOalesPO.getCompany());

		String currentDate = DateUtil.current("yyMMdd").toString();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_BALANCE_INT, currentDate, balanceOalesPO.getCompany());

		String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		balancePO.setNo(no);
		balancePO.setType(BalanceOalesPO.STATUS_INIT_INT);
		balancePO.setBelonger(balanceOalesPO.getCreater());
		balancePO.setCreater(balanceOalesPO.getCreater());
		balancePO.setCompany(balanceOalesPO.getCompany());
		balancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		balanceDao.save(balancePO);

		balanceOalesPO.setBid(balancePO.getBid());

		balanceOalesDao.update(balanceOalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteBalanceOales(BalanceOalesVO balanceOales) throws FLException {

		BalanceOalesPO balanceOalesPO = balanceOalesDao.get(balanceOales.getBoid());

		if (balanceOalesPO == null) {
			throw new FLException(350023, "结算外销不存在");
		}

		if (balanceOalesPO.getStatus() != BalanceOalesPO.STATUS_INIT_INT) {
			throw new FLException(350024, "结算外销不可操作");
		}

		if (balanceOalesItemDao.countBalanceOalesItem(balanceOales.getBoid()) > 0) {
			throw new FLException(350025, "结算外销明细存在");
		}

		balanceOalesDao.delete(balanceOalesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int amountBalanceOales(BalanceOalesVO balanceOalesVO) throws FLException {

		BalanceOalesPO balanceOalesPO = balanceOalesDao.get(balanceOalesVO.getBoid());

		if (balanceOalesPO == null) {
			throw new FLException(350023, "结算外销不存在");
		}

		long amount = balanceOalesDao.amountBalanceOales(balanceOalesVO.getBoid());

		balanceOalesPO.setProfit(amount);

		balanceOalesDao.update(balanceOalesPO);

		return 0;
	}

}
