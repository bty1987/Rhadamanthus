package com.fanglin.data.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.AoodsPO;
import com.fanglin.utils.Paging;

public interface AoodsDao extends Dao<AoodsPO> {

	public List<AoodsPO> pageAoods(Paging paging, List<Filter> filters, int company, String companyType) throws FLException;

	public List<AoodsPO> queryAoodsByAtid(long atid, int company);

	public List<AoodsPO> queryAoodsByName(String name, int limit, int company);

	public int countAoods(long gid, int bompany);

	public int countAoods(int company);

	public int copyAoods(int bompany, int company);

}
