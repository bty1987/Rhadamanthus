package com.fanglin.data.common.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.SurveyTemplateItemPO;

public interface SurveyTemplateItemDao extends Dao<SurveyTemplateItemPO> {

	public int deleteSurveyTemplateItemByStid(Long Stid);
	
	public int deleteSurveyTemplateOptionByStid(Long Stid);
	
}
