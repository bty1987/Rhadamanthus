package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.po.UserRequirePO;
import com.fanglin.utils.Paging;


public interface UserRequireDao extends Dao<UserRequirePO>{
	
	public List<UserRequirePO>pageUserRequire(Paging paging, List<Filter> filters);
	
}
