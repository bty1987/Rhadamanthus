package com.fanglin.balance.service.impl;

import java.util.ArrayList;

import java.util.Date;

import java.util.Arrays;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.AccountDao;
import com.fanglin.balance.dao.BalanceDao;
import com.fanglin.balance.po.AccountPO;
import com.fanglin.balance.po.BalancePO;
import com.fanglin.balance.service.AccountService;
import com.fanglin.balance.vo.AccountVO;
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

@Service("accountService")
@Transactional(readOnly = true)
public class AccountServiceImpl implements AccountService {

	@Autowired
	private AccountDao accountDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private BalanceDao balanceDao;

	@Override
	public void pageAccount(Paging paging, List<Filter> filters, String userId) {

		List<AccountPO> accountPOs = accountDao.pageAccount(paging, filters);

		List<AccountVO> accountVOs = new ArrayList<AccountVO>();

		for (AccountPO accountesPO : accountPOs) {

			AccountVO accountVO = new AccountVO(new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(accountesPO, accountVO, Arrays.asList("creater", "belonger"));
			BeanUtil.copyProperties(accountesPO.getCreater(), accountVO.getCreater(), Arrays.asList("dept", "duty", "role"));
			BeanUtil.copyProperties(accountesPO.getBelonger(), accountVO.getBelonger(), Arrays.asList("dept", "duty", "role"));

			accountVOs.add(accountVO);
		}

		paging.setData(accountVOs);
	}

	@Override
	public List<AccountVO> queryAccount(AccountVO accountVO) {

		List<AccountPO> accountPOs = accountDao.queryAccount(accountVO.getBelonger().getUid());
		List<AccountVO> accountVOs = new ArrayList<AccountVO>();

		for (AccountPO accountPO : accountPOs) {

			accountVO = new AccountVO(new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(accountPO, accountVO, Arrays.asList("creater", "belonger"));
			BeanUtil.copyProperties(accountPO.getCreater(), accountVO.getCreater(), Arrays.asList("dept", "duty", "role"));
			BeanUtil.copyProperties(accountPO.getBelonger(), accountVO.getBelonger(), Arrays.asList("dept", "duty", "role"));

			accountVOs.add(accountVO);
		}

		return accountVOs;
	}
	
	@Override
	public List<AccountVO> queryAccountForTeller(int company) {
		List<AccountPO> accountPOs = accountDao.queryAccountForTeller(company);
		List<AccountVO> accountVOs = new ArrayList<AccountVO>();

		AccountVO accountVO;

		for (AccountPO accountPO : accountPOs) {

			accountVO = new AccountVO(new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(accountPO, accountVO, Arrays.asList("creater", "belonger"));
			BeanUtil.copyProperties(accountPO.getCreater(), accountVO.getCreater(), Arrays.asList("dept", "duty", "role"));
			BeanUtil.copyProperties(accountPO.getBelonger(), accountVO.getBelonger(), Arrays.asList("dept", "duty", "role"));

			accountVOs.add(accountVO);
		}

		return accountVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addAccount(AccountVO accountVO, String userId, int company) {

		UserPO create = userDao.queryUserByUserId(userId);
		UserPO belonger = userDao.queryUserByUserId(accountVO.getBelonger().getUserId());

		AccountPO accountPO = new AccountPO();

		accountPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		accountPO.setName(accountVO.getName());
		accountPO.setCompany(create.getCompany());
		accountPO.setCreater(create);
		accountPO.setBelonger(belonger);
		accountPO.setType(accountVO.getType());
		accountPO.setCompany(company);

		accountDao.save(accountPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateAccountForStatus(AccountVO accountVO) throws FLException {

		AccountPO accountPO = accountDao.get(accountVO.getAid());

		if (accountPO == null) {
			throw new FLException(350001, "帐户不存在");
		}

		accountPO.setStatus(accountVO.getStatus());

		accountDao.update(accountPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void withdrawAccount(AccountVO accountVO, String userId, int company)
			throws FLException {
		AccountPO accountPO = accountDao.get(accountVO.getAid());

		if (accountPO == null) {
			throw new FLException(350001, "帐户不存在");
		}
		
		if(accountPO.getSurplus() < accountVO.getMoney()){
		    throw new FLException(350003, "账户金额不足");
		}
		
		accountPO.setSurplus(Arith.sub(accountPO.getSurplus(), accountVO.getMoney()));
	
	    accountPO.setRealMoney(Arith.add(accountPO.getRealMoney(), accountVO.getMoney()));
	    
	    accountPO.setCompany(company);
	    
		accountDao.update(accountPO);
		
		BalancePO balancePO = new BalancePO();
		CompanyPO companyPO = companyDao.get(company);
		UserPO create = userDao.queryUserByUserId(userId);
		
		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_SO_INT, currentDate, company);
		String no =  companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		
		balancePO.setNo(no);
		balancePO.setAmount(accountVO.getMoney());
		balancePO.setSurplus(accountVO.getMoney());
		balancePO.setBelonger(accountPO.getBelonger());
		balancePO.setCreater(create);
		balancePO.setType(BalancePO.STATUS_VALUE_SHORT);
		balancePO.setCompany(company);
		balancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		balanceDao.save(balancePO);
	}
	

}
