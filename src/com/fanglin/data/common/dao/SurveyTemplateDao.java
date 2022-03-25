package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.SurveyTemplatePO;
import com.fanglin.utils.Paging;

public interface SurveyTemplateDao extends Dao<SurveyTemplatePO> {

	public List<SurveyTemplatePO> pageSurveyTemplate(Paging paging, List<Filter> filters, int company);

}
