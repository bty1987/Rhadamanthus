package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.ContractPO;
import com.fanglin.utils.Paging;

public interface ContractDao extends Dao<ContractPO> {

	public List<ContractPO> pageContract(Paging paging, List<Filter> filters, int company);

	public List<ContractPO> queryContract(int company);

	public int countContract(String no);

}
