package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.BankAccountPO;
import com.fanglin.utils.Paging;

public interface BankAccountDao extends Dao<BankAccountPO> {

	public List<BankAccountPO> pageBankAccount(Paging paging, List<Filter> filters);

}
