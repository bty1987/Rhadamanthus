package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.CormricePO;
import com.fanglin.utils.Paging;

public interface CormriceDao extends Dao<CormricePO> {

	public List<CormricePO> pageCormrice(Paging paging, List<Filter> filters, Integer company);

	public List<CormricePO> queryCormriceByQcid(Long qcid);

}
