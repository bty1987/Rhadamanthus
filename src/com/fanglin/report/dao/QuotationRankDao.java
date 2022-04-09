package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.AddReducePO;

public interface QuotationRankDao extends Dao<AddReducePO> {

	public List<?> rankAddReduce(int company);

}
