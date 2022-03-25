package com.fanglin.customer.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.SurveyItemDao;
import com.fanglin.customer.po.SurveyItemPO;

@Repository("surveyItemDao")
public class SurveyItemDaoImpl extends DaoImpl<SurveyItemPO> implements SurveyItemDao{
	
	public SurveyItemDaoImpl(){
		super(SurveyItemPO.class);
	}

}
