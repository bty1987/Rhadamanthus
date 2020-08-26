package com.fanglin.data.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.SoodsPO;
import com.fanglin.utils.Paging;

public interface SoodsDao extends Dao<SoodsPO> {

	public List<SoodsPO> pageSoods(Paging paging, List<Filter> filters, int company);
	
	public List<SoodsPO> pageSoodsByQiid(Paging paging, List<Filter> filters, long qiid);
	
	public List<SoodsPO> querySoodsByQiid(long qiid);
	
	public int countSoods(long gid, long qiid);
	
}
