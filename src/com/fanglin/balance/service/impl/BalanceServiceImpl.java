package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.AccountDao;
import com.fanglin.balance.dao.ApportDetailDao;
import com.fanglin.balance.dao.BalanceDao;
import com.fanglin.balance.dao.BalanceDetailDao;
import com.fanglin.balance.po.AccountPO;
import com.fanglin.balance.po.ApportDetailPO;
import com.fanglin.balance.po.BalanceDetailPO;
import com.fanglin.balance.po.BalancePO;
import com.fanglin.balance.service.BalanceService;
import com.fanglin.balance.vo.AccountVO;
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
import com.fanglin.utils.BeanUtil;
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
	private AccountDao accountDao;

	@Autowired
	private BalanceDetailDao balanceDetailDao;

	@Autowired
	private ApportDetailDao apportDetailDao;

	@Override
	public void pageBalance(Paging paging, List<Filter> filters, int company) {

		List<BalancePO> balancePOs = balanceDao.pageBalance(paging, filters, company);
		List<BalanceVO> balanceVOs = new ArrayList<BalanceVO>();

		BalanceVO balanceVO;

		for (BalancePO balancePO : balancePOs) {

			balanceVO = new BalanceVO(new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(balancePO, balanceVO, Arrays.asList("belonger", "creater"));
			BeanUtil.copyProperties(balancePO.getBelonger(), balanceVO.getBelonger(), Arrays.asList("duty", "dept", "role"));
			BeanUtil.copyProperties(balancePO.getCreater(), balanceVO.getCreater(), Arrays.asList("duty", "dept", "role"));

			balanceVOs.add(balanceVO);
		}

		paging.setData(balanceVOs);
	}

	@Override
	public List<BalanceVO> queryBalance(BalanceVO balanceVO, List<Filter> filters, int company) {

		balanceVO.filter(filters);

		List<BalanceVO> balanceVOs = new ArrayList<BalanceVO>();

		if (filters.size() == 0) {
			return balanceVOs;
		}

		List<BalancePO> balancePOs = balanceDao.queryBalance(filters, company);

		for (BalancePO balancePO : balancePOs) {

			balanceVO = new BalanceVO(new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(balancePO, balanceVO, Arrays.asList("belonger", "creater"));
			BeanUtil.copyProperties(balancePO.getBelonger(), balanceVO.getBelonger(), Arrays.asList("duty", "dept", "role"));
			BeanUtil.copyProperties(balancePO.getCreater(), balanceVO.getCreater(), Arrays.asList("duty", "dept", "role"));

			balanceVOs.add(balanceVO);
		}

		return balanceVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addBalance(BalanceVO balanceVO, String userId, int company) {

		CompanyPO companyPO = companyDao.get(company);

		BalancePO balancePO = new BalancePO(new UserPO(), new UserPO());

		String currentDate = DateUtil.current("yyMMdd").toString();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_SO_INT, currentDate, company);

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
	public int balanceBalance(BalanceVO balanceVO, List<AccountVO> accounts, String userId) throws FLException {

		BalancePO balancePO = balanceDao.get(balanceVO.getBid());

		if (balancePO == null) {
			throw new FLException(350006, "结算单不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		for (AccountVO accountVO : accounts) {

			AccountPO accountPO = accountDao.get(accountVO.getAid());

			if (accountPO == null) {
				throw new FLException(350001, "帐户不存在");
			}

			if (balancePO.getType() == 0 && accountPO.getSurplus() < accountVO.getMoney()) {
				throw new FLException(350003, "帐户余额不足");
			}

			if (balancePO.getBelonger().getUid() != accountPO.getBelonger().getUid()) {
				throw new FLException(350007, "结算归属不一致");
			}

			if (balancePO.getType() == 0) {
				accountPO.setRealMoney(Arith.add(accountPO.getRealMoney(), accountVO.getMoney()));
				accountPO.setSurplus(Arith.sub(accountPO.getReferMoney(), accountPO.getRealMoney()));
			} else {
				accountPO.setReferMoney(Arith.add(accountPO.getReferMoney(), accountVO.getMoney()));
				accountPO.setSurplus(Arith.sub(accountPO.getReferMoney(), accountPO.getRealMoney()));
			}

			accountDao.update(accountPO);

			balancePO.setSurplus(Arith.sub(balancePO.getSurplus(), accountVO.getMoney()));

			BalanceDetailPO balanceDetailPO = new BalanceDetailPO(new AccountPO(), new UserPO());

			balanceDetailPO.setAccount(accountPO);
			balanceDetailPO.setBalance(balancePO);
			balanceDetailPO.setMoney(accountVO.getMoney());
			balanceDetailPO.setOperater(creater);
			balanceDetailPO.setOperateTime((DateUtil.getDateToTimestamp(new Date())));

			balanceDetailDao.save(balanceDetailPO);
		}

		balanceDao.update(balancePO);

		ApportDetailPO apportDetailPO = new ApportDetailPO(new UserPO());

		apportDetailPO.setBid(balancePO.getBid());
		apportDetailPO.setCreater(creater);
		apportDetailPO.setCreateTime((DateUtil.getDateToTimestamp(new Date())));
		apportDetailPO.setMoney(balancePO.getSurplus());
		apportDetailPO.setComment(balancePO.getType() == 0 ? "支出" : "收款");

		apportDetailDao.save(apportDetailPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int payBalance(BalanceVO balanceVO, List<AccountVO> accounts, String userId) throws FLException {

		BalancePO balancePO = balanceDao.get(balanceVO.getBid());

		if (balancePO == null) {
			throw new FLException(350006, "结算单不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		for (AccountVO accountVO : accounts) {

			AccountPO accountPO = accountDao.get(accountVO.getAid());

			if (accountPO == null) {
				throw new FLException(350001, "帐户不存在");
			}

			accountDao.update(accountPO);

			balancePO.setSurplus(Arith.sub(balancePO.getSurplus(), accountVO.getMoney()));

			BalanceDetailPO balanceDetailPO = new BalanceDetailPO(new AccountPO(), new UserPO());

			balanceDetailPO.setAccount(accountPO);
			balanceDetailPO.setBalance(balancePO);
			balanceDetailPO.setMoney(accountVO.getMoney());
			balanceDetailPO.setOperater(creater);
			balanceDetailPO.setOperateTime((DateUtil.getDateToTimestamp(new Date())));

			balanceDetailDao.save(balanceDetailPO);
		}

		balanceDao.update(balancePO);

		return 0;
	}


}
