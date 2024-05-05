package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.AssistancePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface AssistanceDao extends Dao<AssistancePO> {

	public List<AssistancePO> pageAssistance(Paging paging, List<Filter> filters);

	public List<AssistancePO> queryAssistance();

	public AssistancePO queryAssistance(Long aid, String keyword);

}
