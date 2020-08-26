package com.fanglin.balance.dao;


import java.util.List;


import com.fanglin.balance.po.ComcostPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ComcostDao extends Dao<ComcostPO>{
   
	//分页
	public List<ComcostPO> pageComcost(Paging paging, List<Filter> filters);
	
    //查询
	public List<ComcostPO> queryComcost(long ident,short type);
}




