package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationPicturePO;

public interface QuotationPictureDao extends Dao<QuotationPicturePO> {

	public List<QuotationPicturePO> queryQuotationPicture(long qid, short type);

}
