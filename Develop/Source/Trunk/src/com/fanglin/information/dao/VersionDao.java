package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.VersionPO;
import com.fanglin.utils.Paging;

public interface VersionDao extends Dao<VersionPO>{

	public List<VersionPO> pageVersion(Paging paging, List<Filter> filters);

	public List<VersionPO> queryVersion(List<Filter> filters);
	
	public VersionPO queryVersionByNo(String no);
	
}
