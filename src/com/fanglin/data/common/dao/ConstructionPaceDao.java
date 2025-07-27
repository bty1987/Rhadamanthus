package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.ConstructionPacePO;
import com.fanglin.utils.Paging;

public interface ConstructionPaceDao extends Dao<ConstructionPacePO> {

	public List<ConstructionPacePO> pageConstructionPace(Paging paging, List<Filter> filters, int company);

	public ConstructionPacePO queryConstructionPace(int area, int company);

}
