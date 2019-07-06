package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.DutyPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface DutyDao extends Dao<DutyPO> {

	public List<DutyPO> pageDuty(Paging paging, List<Filter> filters);

	public DutyPO queryDutyByName(String name);

	public List<DutyPO> queryDuty();

	public List<DutyPO> queryDutyByDtid(Integer dtid);

}
