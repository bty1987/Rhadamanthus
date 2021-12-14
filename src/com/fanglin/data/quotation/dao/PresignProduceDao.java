package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.PresignProducePO;
import com.fanglin.utils.Paging;

public interface PresignProduceDao extends Dao<PresignProducePO> {

	public List<PresignProducePO> pagePresignProduce(Paging paging, List<Filter> filters, int company);

	public List<PresignProducePO> queryPresignProduce(int company);
	
}
