package com.fanglin.data.common.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.SurveyTemplateItemDao;
import com.fanglin.data.po.SurveyTemplateItemPO;

@Repository("surveyTemplateItemDao")
public class SurveyTemplateItemDaoImpl extends DaoImpl<SurveyTemplateItemPO> implements SurveyTemplateItemDao {

	public SurveyTemplateItemDaoImpl() {
		super(SurveyTemplateItemPO.class);
	}

	@Override
	public int deleteSurveyTemplateItemByStid(Long Stid) {
		
		String sql = "delete from data.surveytemplateitem where stid = :stid";
		session().createSQLQuery(sql).setLong("stid", Stid).executeUpdate();
		
		return 0;
	}
	
	@Override
	public int deleteSurveyTemplateOptionByStid(Long Stid) {
		
		String sql = "delete from data.surveytemplateoption where stid = :stid";
		session().createSQLQuery(sql).setLong("stid", Stid).executeUpdate();
		
		return 0;
	}
	
}
