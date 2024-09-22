package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.BankAccountVO;
import com.fanglin.utils.Paging;

public interface BankAccountService {

	public void pageBankAccount(Paging paging, List<Filter> filters, int company);

	public BankAccountVO queryBankAccount(BankAccountVO bankAccount) throws FLException;

	public void addBankAccount(BankAccountVO bankAccount, int company) throws FLException;

	public void updateBankAccount(BankAccountVO bankAccount) throws FLException;

	public void updateBankAccountForStatus(BankAccountVO bankAccount) throws FLException;

}
