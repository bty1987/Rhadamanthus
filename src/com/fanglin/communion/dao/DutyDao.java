package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.DutyPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface DutyDao extends Dao<DutyPO> {

	public List<DutyPO> pageDuty(Paging paging, List<Filter> filters);

	public List<DutyPO> pageDutyByName(Paging paging, String name, Integer type, Short status);

	public List<DutyPO> queryDuty();

	public List<DutyPO> queryDutyByDtid(Integer dtid);

	public DutyPO queryDutyByName(String name);

	public DutyPO queryDutyByCode(String code);

	public String queryMaxDutyCode();

}
