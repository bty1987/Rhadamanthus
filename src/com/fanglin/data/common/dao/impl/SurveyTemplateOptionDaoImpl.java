package com.fanglin.data.common.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.SurveyTemplateOptionDao;
import com.fanglin.data.po.SurveyTemplateOptionPO;

@Repository("surveyTemplateOptionDao")
public class SurveyTemplateOptionDaoImpl extends DaoImpl<SurveyTemplateOptionPO> implements SurveyTemplateOptionDao {

	public SurveyTemplateOptionDaoImpl() {
		super(SurveyTemplateOptionPO.class);
	}

}
