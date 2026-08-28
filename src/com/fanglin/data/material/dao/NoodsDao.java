package com.fanglin.data.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.NoodsPO;
import com.fanglin.utils.Paging;

public interface NoodsDao extends Dao<NoodsPO> {

	public List<NoodsPO> pageNoods(Paging paging, List<Filter> filters, int company);

	public List<NoodsPO> queryNoodsByName(String name, int limit, int company);

	public List<NoodsPO> queryNoodsForGroup(String name, int limit);

}
