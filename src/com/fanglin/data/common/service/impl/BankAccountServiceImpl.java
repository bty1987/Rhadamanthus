package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.BankAccountDao;
import com.fanglin.data.common.service.BankAccountService;
import com.fanglin.data.common.vo.BankAccountVO;
import com.fanglin.data.po.BankAccountPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("bankAccountService")
@Transactional(readOnly = true)
public class BankAccountServiceImpl implements BankAccountService {

	@Autowired
	private BankAccountDao bankAccountDao;

	@Override
	public void pageBankAccount(Paging paging, List<Filter> filters, int company) {

		filters.add(new Filter("company", String.valueOf(company), "eq"));

		List<BankAccountPO> bankAccountPOs = bankAccountDao.pageBankAccount(paging, filters);
		List<BankAccountVO> bankAccountVOs = new ArrayList<BankAccountVO>();

		for (BankAccountPO bankAccountPO : bankAccountPOs) {

			BankAccountVO bankAccountVO = new BankAccountVO();

			BeanUtil.copyProperties(bankAccountPO, bankAccountVO);

			bankAccountVOs.add(bankAccountVO);

		}

		paging.setData(bankAccountVOs);

	}

	@Override
	public BankAccountVO queryBankAccount(BankAccountVO bankAccount) throws FLException {

		BankAccountPO bankAccountPO = bankAccountDao.get(bankAccount.getBaid());

		if (bankAccountPO == null) {
			throw new FLException(130158, "银行账户不存在");
		}

		BankAccountVO bankAccountVO = new BankAccountVO();

		BeanUtil.copyProperties(bankAccountPO, bankAccountVO);

		return bankAccountVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addBankAccount(BankAccountVO bankAccountVO, int company) {

		BankAccountPO bankAccountPO = new BankAccountPO();

		BeanUtil.copyProperties(bankAccountVO, bankAccountPO);

		bankAccountPO.setCompany(company);

		bankAccountDao.save(bankAccountPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBankAccount(BankAccountVO bankAccount) throws FLException {

		BankAccountPO bankAccountPO = bankAccountDao.get(bankAccount.getBaid());

		if (bankAccountPO == null) {
			throw new FLException(130158, "银行账户不存在");
		}

		BeanUtil.copyProperties(bankAccount, bankAccountPO);

		bankAccountDao.update(bankAccountPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBankAccountForStatus(BankAccountVO bankAccount) throws FLException {

		BankAccountPO bankAccountPO = bankAccountDao.get(bankAccount.getBaid());

		if (bankAccountPO == null) {
			throw new FLException(130158, "银行账户不存在");
		}

		bankAccountPO.setStatus(bankAccount.getStatus());

		bankAccountDao.update(bankAccountPO);

	}
}
