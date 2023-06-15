package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.PresignPricePO;
import com.fanglin.utils.Paging;

public interface PresignPriceDao extends Dao<PresignPricePO> {

	public List<PresignPricePO> pagePresignPrice(Paging paging, List<Filter> filters, Long ppid, Short status);

	public List<PresignPricePO> queryPresignPrice(long ppid);

	public PresignPricePO queryPresignPricePrice(Long ppid, Integer quoteArea);

}
