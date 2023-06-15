package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.QuotationFormatPO;

public interface QuotationFormatDao extends Dao<QuotationFormatPO> {

	public List<QuotationFormatPO> queryQuotationFormatByQcid(Long qcid);

}
