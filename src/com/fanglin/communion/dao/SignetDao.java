package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.SignetPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface SignetDao extends Dao<SignetPO> {
	
	public List<SignetPO> pageSignet(Paging paging, List<Filter> filters, int company);

	public List<SignetPO> querySignet(int company);

}
