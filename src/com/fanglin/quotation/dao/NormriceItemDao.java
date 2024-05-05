package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.NormriceItemPO;

public interface NormriceItemDao extends Dao<NormriceItemPO> {

	public List<NormriceItemPO> queryNormriceItem(long qid);

	public int deleteNormriceItem(long qid, short type);

	public int deleteNormriceItem(long qid, long sid, short type);

}
