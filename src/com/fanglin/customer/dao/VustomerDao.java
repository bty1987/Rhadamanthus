package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.VustomerPO;
import com.fanglin.utils.Paging;

public interface VustomerDao extends Dao<VustomerPO> {

	public List<VustomerPO> pageVustomer(Paging paging, List<Filter> filters);

	public List<VustomerPO> pageVustomerByUnionId(Paging paging, List<Filter> filters, String unionId);

	public List<VustomerPO> queryVustomer();

	public List<VustomerPO> queryVustomerByUnionId(String unionId);

	public List<?> countVustomerByUnionId(String unionId);

}
