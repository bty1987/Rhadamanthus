package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.SurveyPO;
import com.fanglin.utils.Paging;

public interface SurveyDao extends Dao<SurveyPO> {

	public List<SurveyPO> pageSurvey(Paging paging, List<Filter> filters, int company);

	public List<SurveyPO> querySurveyByOrderId(String orderId);

}
