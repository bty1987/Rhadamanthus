package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.AssistanceItemPO;
import com.fanglin.core.dao.Dao;

public interface AssistanceItemDao extends Dao<AssistanceItemPO> {

	public List<AssistanceItemPO> queryAssistanceItem(Long aid);

}
