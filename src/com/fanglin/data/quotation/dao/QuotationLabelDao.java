package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationLabelPO;
import com.fanglin.utils.Paging;

public interface QuotationLabelDao extends Dao<QuotationLabelPO> {

	public List<QuotationLabelPO> pageQuotationLabel(Paging paging, List<Filter> filters);

}
