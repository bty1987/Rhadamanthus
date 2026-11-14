package com.fanglin.sales.dao;
import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.po.SalesFunctionPO;
import com.fanglin.utils.Paging;
public interface SalesFunctionDao extends Dao<SalesFunctionPO>{

	public List<SalesFunctionPO> querySalesFunction(Short type);

	public List<SalesFunctionPO> querySalesFunctionByName(String name);

	public List<SalesFunctionPO> pageSalesFunction(Paging paging, List<Filter> filters);

	public long countSalesFunctionRightBySfid(long sfid);

}

