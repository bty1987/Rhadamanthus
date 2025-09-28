package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.NormriceItemPO;

public interface NormriceItemDao extends Dao<NormriceItemPO> {

	public List<NormriceItemPO> queryNormriceItem(long qid);

	public NormriceItemPO queryNormriceItemPO(long sid, long quoteId, short type);

	public int amountNormriceItem(long qid, long cnid);

	public int disabledNormriceItem(long qid, short type);

	public int deleteNormriceItem(long qid, short type);

	public int deleteNormriceItem(long qid, short type, short status);

	public int deleteNormriceItem(long qid, long sid, short type);

}
