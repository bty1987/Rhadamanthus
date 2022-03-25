package com.fanglin.customer.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.SurveyOptionDao;
import com.fanglin.customer.po.SurveyOptionPO;

@Repository("surveyOptionDao")
public class SurveyOptionDaoImpl extends DaoImpl<SurveyOptionPO> implements SurveyOptionDao{
	
	public SurveyOptionDaoImpl(){
		super(SurveyOptionPO.class);
	}

}
