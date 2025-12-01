package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceAccountDao;
import com.fanglin.balance.dao.BalanceDao;
import com.fanglin.balance.po.BalanceAccountPO;
import com.fanglin.balance.po.BalancePO;
import com.fanglin.balance.service.BalanceAccountService;
import com.fanglin.balance.vo.BalanceAccountVO;
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

@Service("balanceAccountService")
@Transactional(readOnly = true)
public class BalanceAccountServiceImpl implements BalanceAccountService {

	@Autowired
	private BalanceAccountDao balanceAccountDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private BalanceDao balanceDao;

	@Override
	public void pageBalanceAccount(Paging paging, List<Filter> filters, String userId) {

		List<BalanceAccountPO> balanceAccountPOs = balanceAccountDao.pageBalanceAccount(paging, filters);
		List<BalanceAccountVO> balanceAccountVOs = new ArrayList<BalanceAccountVO>();

		for (BalanceAccountPO balanceAccountPO : balanceAccountPOs) {
			balanceAccountVOs.add(balanceAccountPO.ptv(new BalanceAccountVO(new UserBaseVO(), new UserBaseVO())));
		}

		paging.setData(balanceAccountVOs);
	}

	@Override
	public List<BalanceAccountVO> queryBalanceAccount(BalanceAccountVO balanceAccountVO) {

		List<BalanceAccountPO> balanceAccountPOs = balanceAccountDao.queryBalanceAccount(balanceAccountVO.getBelonger().getUid());
		List<BalanceAccountVO> balanceAccountVOs = new ArrayList<BalanceAccountVO>();

		for (BalanceAccountPO balanceAccountPO : balanceAccountPOs) {
			balanceAccountVOs.add(balanceAccountPO.ptv(new BalanceAccountVO(new UserBaseVO(), new UserBaseVO())));
		}

		return balanceAccountVOs;
	}

	@Override
	public List<BalanceAccountVO> queryBalanceAccountForTeller(int company) {

		List<BalanceAccountPO> balanceAccountPOs = balanceAccountDao.queryBalanceAccountForTeller(company);
		List<BalanceAccountVO> balanceAccountVOs = new ArrayList<BalanceAccountVO>();

		for (BalanceAccountPO balanceAccountPO : balanceAccountPOs) {
			balanceAccountVOs.add(balanceAccountPO.ptv(new BalanceAccountVO(new UserBaseVO(), new UserBaseVO())));
		}

		return balanceAccountVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addBalanceAccount(BalanceAccountVO balanceAccountVO, String userId, int company) {

		UserPO creater = userDao.queryUserByUserId(userId);
		UserPO belonger = userDao.queryUserByUserId(balanceAccountVO.getBelonger().getUserId());

		BalanceAccountPO balanceAccountPO = new BalanceAccountPO();

		BeanUtil.copyProperties(balanceAccountVO, balanceAccountPO, "creater", "belonger");

		balanceAccountPO.setType(balanceAccountVO.getType());

		balanceAccountPO.setCreater(creater);
		balanceAccountPO.setBelonger(belonger);

		balanceAccountPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		balanceAccountPO.setCompany(company);

		balanceAccountDao.save(balanceAccountPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBalanceAccountForStatus(BalanceAccountVO balanceAccountVO) throws FLException {

		BalanceAccountPO balanceAccountPO = balanceAccountDao.get(balanceAccountVO.getBaid());

		if (balanceAccountPO == null) {
			throw new FLException(350001, "帐户不存在");
		}

		balanceAccountPO.setStatus(balanceAccountVO.getStatus());

		balanceAccountDao.update(balanceAccountPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void withdrawBalanceAccount(BalanceAccountVO balanceAccountVO, String userId, int company) throws FLException {

		BalanceAccountPO balanceAccountPO = balanceAccountDao.get(balanceAccountVO.getBaid());

		if (balanceAccountPO == null) {
			throw new FLException(350001, "帐户不存在");
		}

		if (balanceAccountPO.getSurplus() < balanceAccountVO.getMoney()) {
			throw new FLException(350003, "账户金额不足");
		}

		balanceAccountPO.setSurplus(Arith.sub(balanceAccountPO.getSurplus(), balanceAccountVO.getMoney()));
		balanceAccountPO.setRealMoney(Arith.add(balanceAccountPO.getRealMoney(), balanceAccountVO.getMoney()));
		balanceAccountPO.setCompany(company);

		balanceAccountDao.update(balanceAccountPO);

		BalancePO balancePO = new BalancePO();

		CompanyPO companyPO = companyDao.get(company);
		UserPO create = userDao.queryUserByUserId(userId);

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_BALANCE_INT, currentDate, company);
		String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		balancePO.setNo(no);
		balancePO.setAmount(balanceAccountVO.getMoney());
		balancePO.setSurplus(balanceAccountVO.getMoney());
		balancePO.setBelonger(balanceAccountPO.getBelonger());
		balancePO.setCreater(create);
		balancePO.setType(BalancePO.TYPE_WITHDRAW_INT);
		balancePO.setCompany(company);
		balancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		balanceDao.save(balancePO);
	}

}
