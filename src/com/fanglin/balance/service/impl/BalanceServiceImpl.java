package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceAccountDao;
import com.fanglin.balance.dao.BalanceApportDao;
import com.fanglin.balance.dao.BalanceDao;
import com.fanglin.balance.dao.BalanceDetailDao;
import com.fanglin.balance.po.BalanceAccountPO;
import com.fanglin.balance.po.BalanceApportPO;
import com.fanglin.balance.po.BalanceDetailPO;
import com.fanglin.balance.po.BalancePO;
import com.fanglin.balance.service.BalanceService;
import com.fanglin.balance.vo.BalanceAccountVO;
import com.fanglin.balance.vo.BalanceVO;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("balanceService")
@Transactional(readOnly = true)
public class BalanceServiceImpl implements BalanceService {

	@Autowired
	private CountingService countingService;

	@Autowired
	private BalanceDao balanceDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private BalanceAccountDao accountDao;

	@Autowired
	private BalanceDetailDao balanceDetailDao;

	@Autowired
	private BalanceApportDao balanceApportDao;

	@Override
	public void pageBalance(Paging paging, List<Filter> filters, int company) throws FLException {

		List<BalancePO> balancePOs = balanceDao.pageBalance(paging, filters, company);
		List<BalanceVO> balanceVOs = new ArrayList<BalanceVO>();

		for (BalancePO balancePO : balancePOs) {
			balanceVOs.add(balancePO.ptv(new BalanceVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		paging.setData(balanceVOs);
	}

	@Override
	public List<BalanceVO> queryBalance(BalanceVO balanceVO, List<Filter> filters, int company) throws FLException {

		balanceVO.filter(filters);

		List<BalanceVO> balanceVOs = new ArrayList<BalanceVO>();

		if (filters.size() == 0) {
			return balanceVOs;
		}

		List<BalancePO> balancePOs = balanceDao.queryBalance(filters, company);

		for (BalancePO balancePO : balancePOs) {
			balanceVOs.add(balancePO.ptv(new BalanceVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		return balanceVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addBalance(BalanceVO balanceVO, String userId, int company) {

		CompanyPO companyPO = companyDao.get(company);

		BalancePO balancePO = new BalancePO(new UserPO(), new UserPO());

		String currentDate = DateUtil.current("yyMMdd").toString();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_BALANCE_INT, currentDate, company);

		String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		UserPO creater = userDao.queryUserByUserId(userId);
		UserPO belonger = userDao.queryUserByUserId(balanceVO.getBelonger().getUserId());

		balancePO.setNo(no);
		balancePO.setType(balanceVO.getType());
		balancePO.setBelonger(belonger);
		balancePO.setCreater(creater);
		balancePO.setCompany(company);
		balancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		balancePO.setAmount(balanceVO.getAmount());
		balancePO.setSurplus(balanceVO.getAmount());

		balanceDao.save(balancePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int balanceBalance(BalanceVO balanceVO, List<BalanceAccountVO> accounts, String userId) throws FLException {

		BalancePO balancePO = balanceDao.get(balanceVO.getBid());

		if (balancePO == null) {
			throw new FLException(350006, "结算单不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		for (BalanceAccountVO accountVO : accounts) {

			BalanceAccountPO accountPO = accountDao.get(accountVO.getBaid());

			if (accountPO == null || accountPO.getStatus() != BalanceAccountPO.STATUS_VALID_SHORT) {
				throw new FLException(350001, "帐户不存在");
			}

			if (accountPO.getType() == BalanceAccountPO.TYPE_UNVALID_SHORT) {
				// 出纳账户: 现金腿,不消耗结算单余额
				payCash(balancePO, accountPO, accountVO.getMoney(), creater);
			} else {
				// 结算账户: 台账腿,登记应付并消耗结算单余额
				if (balancePO.getType() == BalancePO.TYPE_WITHDRAW_INT) {
					throw new FLException(350009, "提款单不能结算入账");
				}

				if (balancePO.getBelonger().getUid() != accountPO.getBelonger().getUid()) {
					throw new FLException(350007, "结算归属不一致");
				}

				if (balancePO.getType() == BalancePO.TYPE_PAYOUT_INT && balancePO.getSurplus() < accountVO.getMoney()) {
					throw new FLException(350030, "帐户余额不足");
				}

				accountDao.updateBalanceAccountForRefer(accountPO.getBaid(), accountVO.getMoney());

				saveBalanceDetail(accountPO, balancePO, accountVO.getMoney(), creater);

				if (balanceDao.updateBalanceForSurplus(balancePO.getBid(), accountVO.getMoney()) == 0) {
					throw new FLException(350030, "帐户余额不足");
				}

				balancePO.setSurplus(Arith.sub(balancePO.getSurplus(), accountVO.getMoney()));
			}
		}

		if (balancePO.getSurplus() == 0) balancePO.setStatus(BalancePO.STATUS_FINISH_INT);

		balanceDao.update(balancePO);

		BalanceApportPO balanceApportPO = new BalanceApportPO(new UserPO());

		balanceApportPO.setBid(balancePO.getBid());
		balanceApportPO.setCreater(creater);
		balanceApportPO.setCreateTime((DateUtil.getDateToTimestamp(new Date())));
		balanceApportPO.setMoney(balancePO.getSurplus());
		balanceApportPO.setComment(balancePO.getType() == 0 ? "支出" : "收款");

		balanceApportDao.save(balanceApportPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int payBalance(BalanceVO balanceVO, List<BalanceAccountVO> accounts, String userId) throws FLException {

		BalancePO balancePO = balanceDao.get(balanceVO.getBid());

		if (balancePO == null) {
			throw new FLException(350006, "结算单不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		for (BalanceAccountVO accountVO : accounts) {

			BalanceAccountPO accountPO = accountDao.get(accountVO.getBaid());

			if (accountPO == null) {
				throw new FLException(350001, "帐户不存在");
			}

			payCash(balancePO, accountPO, accountVO.getMoney(), creater);
		}

		balancePO.setBalancer(creater);
		balancePO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));
		balancePO.setStatus(BalancePO.STATUS_FINISH_INT);

		balanceDao.update(balancePO);

		return 0;
	}

	// 出纳账户现金腿: 支出/提款单付出纳余额并同步归属结算账户实付额, 收款单记出纳入金
	private void payCash(BalancePO balancePO, BalanceAccountPO accountPO, long money, UserPO operater) throws FLException {

		if (accountPO.getType() != BalanceAccountPO.TYPE_UNVALID_SHORT) {
			throw new FLException(350008, "仅允许操作出纳类型账户");
		}

		if (accountPO.getStatus() != BalanceAccountPO.STATUS_VALID_SHORT) {
			throw new FLException(350001, "帐户不存在");
		}

		if (balancePO.getType() == BalancePO.TYPE_COLLECT_INT) {
			accountDao.updateBalanceAccountForRefer(accountPO.getBaid(), money);
		} else {
			if (accountDao.updateBalanceAccountForReal(accountPO.getBaid(), money) == 0) {
				throw new FLException(350030, "帐户余额不足");
			}

			if (balancePO.getType() == BalancePO.TYPE_PAYOUT_INT) {
				BalanceAccountPO belongerAccountPO = locateOrCreateAccount(balancePO, operater);

				accountDao.updateBalanceAccountForRealUncheck(belongerAccountPO.getBaid(), money);

				saveBalanceDetail(belongerAccountPO, balancePO, money, operater);
			}
		}

		saveBalanceDetail(accountPO, balancePO, money, operater);
	}

	// 定位归属人有效结算账户, 无则按结算单主体懒开户(厂商/人员打通)
	private BalanceAccountPO locateOrCreateAccount(BalancePO balancePO, UserPO creater) {

		List<BalanceAccountPO> accountPOs = accountDao.queryBalanceAccount(balancePO.getBelonger().getUid());

		if (accountPOs.size() > 0) return accountPOs.get(0);

		BalanceAccountPO accountPO = new BalanceAccountPO();

		accountPO.setName(String.format("%s结算账户", balancePO.getBelonger().getCurrentName()));
		accountPO.setBelonger(balancePO.getBelonger());
		accountPO.setCreater(creater);
		accountPO.setType(BalanceAccountPO.TYPE_VALID_SHORT);
		accountPO.setStatus(BalanceAccountPO.STATUS_VALID_SHORT);
		accountPO.setCompany(balancePO.getCompany());
		accountPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		accountDao.save(accountPO);

		return accountPO;
	}

	private void saveBalanceDetail(BalanceAccountPO accountPO, BalancePO balancePO, long money, UserPO operater) {

		BalanceDetailPO balanceDetailPO = new BalanceDetailPO(new BalanceAccountPO(), new UserPO());

		balanceDetailPO.setAccount(accountPO);
		balanceDetailPO.setBalance(balancePO);
		balanceDetailPO.setMoney(money);
		balanceDetailPO.setOperater(operater);
		balanceDetailPO.setOperateTime((DateUtil.getDateToTimestamp(new Date())));

		balanceDetailDao.save(balanceDetailPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int payedBalance(List<BalanceVO> balanceVOs, String userId) throws FLException {

		UserPO payeder = userDao.queryUserByUserId(userId);

		BalancePO balancePO;

		for (BalanceVO balanceVO : balanceVOs) {

			balancePO = balanceDao.get(balanceVO.getBid());

			if (balancePO == null) continue;

			balancePO.setIsPay(BalancePO.ISPAY_PAYED_INT);
			balancePO.setPayeder(payeder);
			balancePO.setPayedTime((DateUtil.getDateToTimestamp(new Date())));

			balanceDao.update(balancePO);
		}

		return 0;
	}
}
