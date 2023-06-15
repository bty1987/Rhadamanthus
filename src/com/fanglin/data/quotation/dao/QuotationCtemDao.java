package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationCtemPO;
import com.fanglin.utils.Paging;

public interface QuotationCtemDao extends Dao<QuotationCtemPO> {

	public List<QuotationCtemPO> pageQuotationCtem(Paging paging, List<Filter> filters);

	public List<QuotationCtemPO> queryQuotationCtem(Paging paging, String name);

}
