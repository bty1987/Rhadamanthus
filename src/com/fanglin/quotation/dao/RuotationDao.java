package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.RuotationPO;
import com.fanglin.utils.Paging;

public interface RuotationDao extends Dao<RuotationPO> {

	public List<RuotationPO> pageRuotation(Paging paging, List<Filter> filters, Integer company);

	public RuotationPO queryRuotationByQid(long qid);

	public RuotationPO queryRuotationByOrderId(String orderId, List<Short> status);

}
